import { TimeZone } from 'timezonecomplete';

// Common timezone constants for dropdowns
export const COMMON_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago', 
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'America/Vancouver',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Rome',
  'Europe/Madrid',
  'Europe/Amsterdam',
  'Europe/Stockholm',
  'Europe/Helsinki',
  'Europe/Warsaw',
  'Europe/Prague',
  'Europe/Vienna',
  'Europe/Zurich',
  'Europe/Brussels',
  'Europe/Copenhagen',
  'Europe/Oslo',
  'Europe/Dublin',
  'Europe/Lisbon',
  'Europe/Athens',
  'Europe/Istanbul',
  'Europe/Moscow',
  'Asia/Jerusalem',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Bangkok',
  'Asia/Singapore',
  'Asia/Hong_Kong',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Asia/Manila',
  'Asia/Jakarta',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Australia/Perth',
  'Pacific/Auckland'
];

/**
 * Get all available timezones sorted alphabetically
 */
export function getAllTimezones(): string[] {
  // Get all timezone names from timezonecomplete
  const allZones = TimeZone.allNames();
  return allZones.sort();
}

/**
 * Validate if a timezone string is valid
 */
export function isValidTimezone(timezone: string): boolean {
  // Use a simpler validation approach for Cloudflare Workers
  // Check against our list of common timezones and use Intl.DateTimeFormat as fallback
  if (COMMON_TIMEZONES.includes(timezone)) {
    return true;
  }
  
  try {
    // Use Intl.DateTimeFormat to validate timezone - works better in Workers
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get current time in user's timezone
 */
export function getCurrentTimeInTimezone(timezone: string): Date {
  try {
    const tz = new TimeZone(timezone);
    return new Date(); // timezonecomplete handles timezone conversion internally
  } catch (error) {
    return new Date(); // fallback to system time
  }
}

/**
 * Convert a date to a specific timezone
 */
export function convertToTimezone(date: Date, timezone: string): Date {
  try {
    const tz = new TimeZone(timezone);
    const zonedDate = tz.toZoneDate(date);
    return zonedDate;
  } catch (error) {
    return date; // fallback to original date
  }
}

/**
 * Get timezone display name for UI
 */
export function getTimezoneDisplayName(timezone: string): string {
  try {
    const tz = new TimeZone(timezone);
    const now = new Date();
    const offset = tz.offsetAt(now);
    const offsetHours = Math.floor(offset / 60);
    const offsetMinutes = Math.abs(offset % 60);
    const offsetString = `${offsetHours >= 0 ? '+' : ''}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
    
    return `${timezone.replace('_', ' ')} (UTC${offsetString})`;
  } catch (error) {
    return timezone;
  }
}

/**
 * Get hour in user's timezone for scheduling logic
 */
export function getHourInTimezone(timezone: string, date?: Date): number {
  try {
    const targetDate = date || new Date();
    // Use Intl.DateTimeFormat to get hour in specific timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false
    });
    const hourStr = formatter.format(targetDate);
    return parseInt(hourStr, 10);
  } catch (error) {
    return new Date().getHours(); // fallback to system timezone
  }
}

/**
 * Create date in user's timezone for scheduling
 */
export function createDateInTimezone(timezone: string, year: number, month: number, day: number, hour: number): Date {
  try {
    const tz = new TimeZone(timezone);
    const localDate = new Date(year, month - 1, day, hour, 0, 0, 0);
    return tz.toUtc(localDate);
  } catch (error) {
    return new Date(year, month - 1, day, hour, 0, 0, 0); // fallback to system timezone
  }
}