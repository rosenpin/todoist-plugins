-- Create users table for storing Todoist OAuth tokens and user information
CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    access_token TEXT NOT NULL,
    full_name TEXT NOT NULL,
    mode TEXT DEFAULT 'undefined',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index on access_token for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_access_token ON users(access_token);

-- Create index on created_at for admin queries
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);