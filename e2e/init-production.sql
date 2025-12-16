-- Initialize production environment for E2E tests
-- Usage: npx wrangler d1 execute ankiren-db --remote --file=e2e/init-production.sql
-- NOTE: Production admin user should already exist from first login

-- Create admin role if not exists
INSERT OR IGNORE INTO Role (id, name, description, isSystem, createdAt, updatedAt)
VALUES ('role_admin', 'admin', 'Administrator role', 1, datetime('now'), datetime('now'));

-- Verify admin user has admin role (assumes anhv.ict91@gmail.com is admin)
-- The first user to register automatically gets admin role

-- Verify setup
SELECT u.id, u.email, r.name as role
FROM User u
LEFT JOIN UserRole ur ON u.id = ur.userId
LEFT JOIN Role r ON ur.roleId = r.id
WHERE u.email = 'anhv.ict91@gmail.com';
