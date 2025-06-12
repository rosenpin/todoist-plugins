import { Context } from 'hono';
import { AppUser, createRedirectResponse, Logger } from '@shared/utils';

export interface AuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export class AuthHandler {
  private config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  /**
   * Generate Todoist OAuth authorization URL
   */
  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      scope: this.config.scopes.join(','),
      state: state || Math.random().toString(36).substring(7)
    });

    return `https://todoist.com/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<{ access_token: string; token_type: string }> {
    const response = await fetch('https://todoist.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        redirect_uri: this.config.redirectUri
      }).toString()
    });

    if (!response.ok) {
      const errorText = await response.text();
      Logger.error('Token exchange failed:', errorText);
      throw new Error(`Token exchange failed: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Handle authorization redirect from Todoist
   */
  async handleAuthCallback(c: Context): Promise<Response> {
    const code = c.req.query('code');
    const error = c.req.query('error');

    if (error) {
      Logger.error('OAuth error:', error);
      return new Response(`Authorization failed: ${error}`, { status: 400 });
    }

    if (!code) {
      Logger.error('No authorization code received');
      return new Response('No authorization code received', { status: 400 });
    }

    try {
      const tokenData = await this.exchangeCodeForToken(code);
      
      // Store token and redirect to success page
      // This will be handled by the specific app
      return createRedirectResponse('/settings');
    } catch (error) {
      Logger.error('Auth callback error:', error);
      return new Response('Authentication failed', { status: 500 });
    }
  }

  /**
   * Extract user ID from cookie
   */
  getUserIdFromCookie(c: Context): string | null {
    return c.req.cookie('user_id') || null;
  }

  /**
   * Extract access token from cookie
   */
  getTokenFromCookie(c: Context): string | null {
    return c.req.cookie('access_token') || null;
  }

  /**
   * Set authentication cookies
   */
  setAuthCookies(response: Response, userId: string, token: string): void {
    // Set httpOnly cookies for security
    response.headers.set('Set-Cookie', [
      `user_id=${userId}; HttpOnly; Path=/; SameSite=Strict; Max-Age=2592000`,
      `access_token=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=2592000`
    ].join(', '));
  }

  /**
   * Clear authentication cookies
   */
  clearAuthCookies(response: Response): void {
    response.headers.set('Set-Cookie', [
      'user_id=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0',
      'access_token=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0'
    ].join(', '));
  }
}

export default AuthHandler;