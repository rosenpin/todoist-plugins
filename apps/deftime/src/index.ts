import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { AuthHandler } from '@shared/auth';
import { UserDatabase } from '@shared/db';
import { Logger, createResponse, createRedirectResponse, createJSONResponse, HTTP_CODES, TODOIST_SCOPES, isValidTimezone } from '@shared/utils';
import { TodoistClient } from '@shared/todoist-client';
import { DefTimeLogic } from './deftime-logic';
import { HTML_TEMPLATES, renderTemplate } from './templates';

interface Env {
  DB: D1Database;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  REDIRECT_URI: string;
  [key: string]: any;
}

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for webhook calls
app.use('/webhook', cors({
  origin: '*',
  allowHeaders: ['Content-Type'],
  allowMethods: ['POST']
}));

// Initialize auth handler
const getAuthHandler = (env: Env) => new AuthHandler({
  clientId: env.CLIENT_ID,
  clientSecret: env.CLIENT_SECRET,
  redirectUri: env.REDIRECT_URI,
  scopes: TODOIST_SCOPES
});

// Home page
app.get('/', async (c) => {
  try {
    const userId = c.req.cookie('user_id');
    if (userId) {
      return createRedirectResponse('/settings');
    }
    
    return createResponse(HTML_TEMPLATES.INDEX);
  } catch (error) {
    Logger.error('Error serving home page:', error);
    return createResponse('Server error', HTTP_CODES.INTERNAL_SERVER_ERROR);
  }
});

// Authorization endpoint
app.get('/authorize', async (c) => {
  try {
    const authHandler = getAuthHandler(c.env!);
    const authUrl = authHandler.getAuthorizationUrl();
    return createRedirectResponse(authUrl);
  } catch (error) {
    Logger.error('Error in authorization:', error);
    return createResponse('Authorization failed', HTTP_CODES.INTERNAL_SERVER_ERROR);
  }
});

// OAuth redirect handler
app.get('/redirect', async (c) => {
  try {
    const authHandler = getAuthHandler(c.env!);
    const db = new UserDatabase(c.env!.DB);
    
    const code = c.req.query('code');
    const error = c.req.query('error');

    if (error) {
      Logger.error('OAuth error:', error);
      return createResponse(`Authorization failed: ${error}`, HTTP_CODES.BAD_REQUEST);
    }

    if (!code) {
      Logger.error('No authorization code received');
      return createResponse('No authorization code received', HTTP_CODES.BAD_REQUEST);
    }

    // Exchange code for token
    const tokenData = await authHandler.exchangeCodeForToken(code);
    
    // Get user info from Todoist
    const todoist = new TodoistClient(tokenData.access_token);
    const user = await todoist.getUser();
    
    // Store user in database
    await db.addUser(user.id, tokenData.access_token, user.full_name);
    
    // Set cookies and redirect
    const response = createRedirectResponse('/settings');
    authHandler.setAuthCookies(response, user.id, tokenData.access_token);
    
    Logger.info(`User ${user.full_name} (${user.id}) authenticated successfully`);
    
    return response;
  } catch (error) {
    Logger.error('Error in redirect handler:', error);
    return createResponse('Authentication failed', HTTP_CODES.INTERNAL_SERVER_ERROR);
  }
});

// Settings page
app.get('/settings', async (c) => {
  try {
    const authHandler = getAuthHandler(c.env!);
    const db = new UserDatabase(c.env!.DB);
    
    const userId = authHandler.getUserIdFromCookie(c);
    if (!userId) {
      return createRedirectResponse('/');
    }

    const user = await db.getUserById(userId);
    if (!user) {
      const response = createRedirectResponse('/');
      authHandler.clearAuthCookies(response);
      return response;
    }

    const html = renderTemplate(HTML_TEMPLATES.SETTINGS, {
      USER_NAME: user.full_name,
      USER_TIMEZONE: user.timezone || 'Not set'
    });

    return createResponse(html);
  } catch (error) {
    Logger.error('Error serving settings page:', error);
    return createResponse('Server error', HTTP_CODES.INTERNAL_SERVER_ERROR);
  }
});

// Update timezone setting
app.post('/settings/timezone', async (c) => {
  try {
    const authHandler = getAuthHandler(c.env!);
    const db = new UserDatabase(c.env!.DB);
    
    const userId = authHandler.getUserIdFromCookie(c);
    if (!userId) {
      return createJSONResponse({ error: 'Unauthorized' }, HTTP_CODES.UNAUTHORIZED);
    }

    const user = await db.getUserById(userId);
    if (!user) {
      return createJSONResponse({ error: 'User not found' }, HTTP_CODES.NOT_FOUND);
    }

    const body = await c.req.json();
    const timezone = body.timezone;

    Logger.debug(`[TIMEZONE] Received timezone: ${timezone}`);
    Logger.debug(`[TIMEZONE] Timezone validation result: ${isValidTimezone(timezone)}`);

    if (!timezone || !isValidTimezone(timezone)) {
      Logger.error(`[TIMEZONE] Invalid timezone received: ${timezone}`);
      return createJSONResponse({ error: 'Invalid timezone' }, HTTP_CODES.BAD_REQUEST);
    }

    await db.updateUserTimezone(userId, timezone);
    Logger.info(`Updated timezone for user ${userId} to ${timezone}`);

    return createJSONResponse({ success: true, timezone });
  } catch (error) {
    Logger.error('Error updating timezone:', error);
    return createJSONResponse({ error: 'Failed to update timezone' }, HTTP_CODES.INTERNAL_SERVER_ERROR);
  }
});

// Logout
app.post('/logout', async (c) => {
  try {
    const authHandler = getAuthHandler(c.env!);
    const db = new UserDatabase(c.env!.DB);
    
    const userId = authHandler.getUserIdFromCookie(c);
    if (userId) {
      await db.removeUser(userId);
    }

    const response = createRedirectResponse('/');
    authHandler.clearAuthCookies(response);
    return response;
  } catch (error) {
    Logger.error('Error in logout:', error);
    return createResponse('Logout failed', HTTP_CODES.INTERNAL_SERVER_ERROR);
  }
});

// Webhook endpoint for Todoist
app.post('/webhook', async (c) => {
  try {
    const db = new UserDatabase(c.env!.DB);
    const payload = await c.req.json();
    
    const userId = payload.user_id;
    const eventData = payload.event_data;
    const taskId = eventData?.id;
    const checked = eventData?.checked;

    if (!userId || !taskId) {
      Logger.warn('Invalid webhook payload', payload);
      return createResponse('', HTTP_CODES.OK);
    }

    // Check if user exists
    const user = await db.getUserById(userId);
    if (!user) {
      Logger.warn('User not found for webhook', userId);
      return createResponse('', HTTP_CODES.OK);
    }

    // Process the task asynchronously
    const defTime = new DefTimeLogic(user.access_token, db);
    
    // Run in the background (Workers will handle this)
    c.executionCtx.waitUntil(
      defTime.setTimeForTask(taskId, checked).catch(error => 
        Logger.error('Error processing webhook task:', error, { userId, taskId })
      )
    );

    return createResponse('', HTTP_CODES.OK);
  } catch (error) {
    Logger.error('Error processing webhook:', error);
    return createResponse('', HTTP_CODES.OK); // Always return 200 for webhooks
  }
});

// Favicon
app.get('/favicon.ico', () => {
  return new Response('', { status: 404 });
});

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Initialize database
    const db = new UserDatabase(env.DB);
    await db.init();
    
    return app.fetch(request, env, ctx);
  }
};