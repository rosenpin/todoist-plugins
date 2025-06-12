import { AppUser } from '@shared/utils';

export interface DatabaseUser {
  user_id: string;
  access_token: string;
  full_name: string;
  mode?: string;
}

// Use Cloudflare's D1Database type
export type { D1Database } from '@cloudflare/workers-types';

export class UserDatabase {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  /**
   * Initialize database tables
   */
  async init(): Promise<void> {
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        access_token TEXT NOT NULL,
        full_name TEXT NOT NULL,
        mode TEXT DEFAULT 'undefined',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  /**
   * Add or update a user
   */
  async addUser(userId: string, token: string, fullName: string, mode: string = 'undefined'): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO users (user_id, access_token, full_name, mode, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    
    await stmt.bind(userId, token, fullName, mode).run();
  }

  /**
   * Get user by user ID
   */
  async getUserById(userId: string): Promise<DatabaseUser | null> {
    const stmt = this.db.prepare('SELECT * FROM users WHERE user_id = ?');
    const result = await stmt.bind(userId).first<DatabaseUser>();
    return result || null;
  }

  /**
   * Get user by access token
   */
  async getUserByToken(token: string): Promise<DatabaseUser | null> {
    const stmt = this.db.prepare('SELECT * FROM users WHERE access_token = ?');
    const result = await stmt.bind(token).first<DatabaseUser>();
    return result || null;
  }

  /**
   * Update user mode
   */
  async updateUserMode(userId: string, mode: string): Promise<void> {
    const stmt = this.db.prepare(`
      UPDATE users SET mode = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = ?
    `);
    await stmt.bind(mode, userId).run();
  }

  /**
   * Remove user by user ID
   */
  async removeUser(userId: string): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM users WHERE user_id = ?');
    await stmt.bind(userId).run();
  }

  /**
   * Remove user by token
   */
  async removeUserByToken(token: string): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM users WHERE access_token = ?');
    await stmt.bind(token).run();
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<DatabaseUser[]> {
    const stmt = this.db.prepare('SELECT * FROM users ORDER BY created_at DESC');
    const result = await stmt.all<DatabaseUser>();
    return result.results || [];
  }

  /**
   * Convert database user to app user format
   */
  toAppUser(dbUser: DatabaseUser): AppUser {
    return {
      user_id: dbUser.user_id,
      user_name: dbUser.full_name,
      token: dbUser.access_token,
      mode: dbUser.mode
    };
  }
}

export default UserDatabase;