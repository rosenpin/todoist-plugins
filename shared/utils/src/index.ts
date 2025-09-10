export interface AppUser {
  user_id: string;
  user_name: string;
  token: string;
  mode?: string;
}

export class Logger {
  static debug(message: string, ...args: any[]): void {
    console.log(`[DEBUG] ${message}`, ...args);
  }

  static info(message: string, ...args: any[]): void {
    console.log(`[INFO] ${message}`, ...args);
  }

  static warn(message: string, ...args: any[]): void {
    console.warn(`[WARN] ${message}`, ...args);
  }

  static error(message: string, error?: Error | any, ...args: any[]): void {
    console.error(`[ERROR] ${message}`, error, ...args);
  }
}

export function logError(error: Error | any): void {
  Logger.error('Application error:', error);
}

export class TimeUtils {
  /**
   * Get a random time between 8-11 AM in the specified timezone
   */
  static getRandomMorningTime(timezone: string): Date {
    const now = new Date();
    const randomHour = 8 + Math.floor(Math.random() * 3); // 8, 9, or 10
    const randomMinute = Math.floor(Math.random() * 60);
    
    // Create date in user's timezone
    const date = new Date();
    date.setHours(randomHour, randomMinute, 0, 0);
    
    return date;
  }

  /**
   * Format time according to timezone
   */
  static formatTimeInTimezone(date: Date, timezone: string): string {
    return date.toLocaleString('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  /**
   * Parse datetime string with timezone info
   */
  static parseDateTime(dateTimeString: string, timezone?: string): Date {
    if (timezone) {
      // Handle timezone-aware parsing
      return new Date(dateTimeString);
    }
    return new Date(dateTimeString);
  }
}

export const HTTP_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

export const COOKIE_NAMES = {
  USER_ID: 'user_id',
  ACCESS_TOKEN: 'access_token'
} as const;

export const TODOIST_SCOPES: string[] = [
  'data:read',
  'data:read_write'
];

export function createResponse(body: string, status: number = HTTP_CODES.OK, headers: Record<string, string> = {}): Response {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      ...headers
    }
  });
}

export function createJSONResponse(data: any, status: number = HTTP_CODES.OK): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export function createRedirectResponse(url: string): Response {
  return new Response(null, {
    status: 302,
    headers: {
      'Location': url
    }
  });
}

// Export timezone utilities
export * from './timezone';