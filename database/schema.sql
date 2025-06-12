-- Todoist Services Database Schema
-- This file contains the complete database schema for all Todoist apps

-- Users table for storing OAuth tokens and user information
-- Used by all apps: deftime, done, durations
CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,           -- Todoist user ID
    access_token TEXT NOT NULL,         -- OAuth access token
    full_name TEXT NOT NULL,            -- User's full name from Todoist
    mode TEXT DEFAULT 'undefined',      -- App-specific mode (e.g., 'labels' for durations)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_access_token ON users(access_token);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Note: We intentionally do not store task data or sensitive information
-- All task processing is done in real-time using the Todoist API