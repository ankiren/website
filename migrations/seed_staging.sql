-- Seed staging database for E2E tests
-- This creates the minimum required data for tests to run
-- NOTE: Run migrations 0001_init.sql, 0002_google_oauth.sql, 0003_authorization.sql first

-- Insert test admin user (password is nullable for Google OAuth users)
INSERT OR IGNORE INTO User (id, email, name, image, googleId, createdAt, updatedAt) VALUES
  ('staging_admin_user', 'anhv.ict91@gmail.com', 'Test Admin', NULL, 'test_google_id', datetime('now'), datetime('now'));

-- Assign admin role to test user
INSERT OR IGNORE INTO UserRole (userId, roleId, createdAt) VALUES
  ('staging_admin_user', 'role_admin', datetime('now'));
