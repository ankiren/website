-- Add Google OAuth fields to User table
-- Note: SQLite doesn't support ALTER COLUMN, so we need to handle nullable password differently

-- Add image field for profile picture from Google
ALTER TABLE User ADD COLUMN image TEXT;

-- Add googleId field for Google OAuth
ALTER TABLE User ADD COLUMN googleId TEXT UNIQUE;

-- Create index for googleId lookups
CREATE INDEX IF NOT EXISTS idx_user_googleId ON User(googleId);
