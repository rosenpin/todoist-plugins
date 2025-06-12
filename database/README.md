# Database Setup

This directory contains the database schema and migration scripts for the Todoist services.

## Cloudflare D1 Setup

Each app requires its own D1 database. Create them using the Cloudflare dashboard or Wrangler CLI:

```bash
# Create databases for each app
wrangler d1 create deftime-users
wrangler d1 create done-users  
wrangler d1 create durations-users
```

## Apply Schema

Apply the schema to each database:

```bash
# Apply to all databases
wrangler d1 execute deftime-users --file=./database/schema.sql
wrangler d1 execute done-users --file=./database/schema.sql
wrangler d1 execute durations-users --file=./database/schema.sql
```

## Database Schema

The schema is intentionally minimal:

- **users table**: Stores OAuth tokens and basic user information
- **No task data**: We don't store task content or sensitive information
- **Real-time processing**: All task operations use the Todoist API directly

## Privacy & Security

- OAuth tokens are stored securely in D1
- No task content or personal data is stored
- Users can delete their data by logging out
- All data processing happens in real-time via Todoist API

## Environment Variables

Update each app's `wrangler.toml` with the database IDs:

```toml
[[d1_databases]]
binding = "DB"
database_name = "app-users"
database_id = "your-database-id-here"
```