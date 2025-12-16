-- Initialize staging environment for E2E tests
-- Usage: npx wrangler d1 execute ankiren-db-staging --remote --file=e2e/init-staging.sql

-- Create admin user if not exists
INSERT OR IGNORE INTO User (id, email, name, createdAt, updatedAt)
VALUES ('staging_admin_user', 'anhv.ict91@gmail.com', 'Staging Admin', datetime('now'), datetime('now'));

-- Create admin role if not exists
INSERT OR IGNORE INTO Role (id, name, description, isSystem, createdAt, updatedAt)
VALUES ('role_admin', 'admin', 'Administrator role', 1, datetime('now'), datetime('now'));

-- Assign admin role to user if not exists
INSERT OR IGNORE INTO UserRole (userId, roleId)
VALUES ('staging_admin_user', 'role_admin');

-- Verify setup
SELECT u.id, u.email, r.name as role
FROM User u
LEFT JOIN UserRole ur ON u.id = ur.userId
LEFT JOIN Role r ON ur.roleId = r.id
WHERE u.id = 'staging_admin_user';
