-- Migration: 0003_authorization.sql
-- Description: Add authorization tables for RBAC (Role-Based Access Control)

-- Role table
CREATE TABLE Role (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    isSystem INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Permission table
CREATE TABLE Permission (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    resource TEXT NOT NULL,
    action TEXT NOT NULL,
    isSystem INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

-- UserRole junction table
CREATE TABLE UserRole (
    userId TEXT NOT NULL,
    roleId TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (userId, roleId),
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (roleId) REFERENCES Role(id) ON DELETE CASCADE
);

-- RolePermission junction table
CREATE TABLE RolePermission (
    roleId TEXT NOT NULL,
    permissionId TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (roleId, permissionId),
    FOREIGN KEY (roleId) REFERENCES Role(id) ON DELETE CASCADE,
    FOREIGN KEY (permissionId) REFERENCES Permission(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_userrole_userId ON UserRole(userId);
CREATE INDEX idx_userrole_roleId ON UserRole(roleId);
CREATE INDEX idx_rolepermission_roleId ON RolePermission(roleId);
CREATE INDEX idx_rolepermission_permissionId ON RolePermission(permissionId);
CREATE INDEX idx_permission_resource ON Permission(resource);
CREATE INDEX idx_permission_action ON Permission(action);

-- Default Roles (isSystem=1 means cannot be deleted)
INSERT INTO Role (id, name, description, isSystem) VALUES
    ('role_admin', 'admin', 'System administrator with full access', 1),
    ('role_user', 'user', 'Regular user with own data access', 1);

-- Default Permissions (isSystem=1 means cannot be deleted)
INSERT INTO Permission (id, name, description, resource, action, isSystem) VALUES
    ('perm_users_manage', 'users:manage', 'Create, edit, delete users', 'users', 'manage', 1),
    ('perm_roles_manage', 'roles:manage', 'Create, edit, delete roles', 'roles', 'manage', 1),
    ('perm_roles_assign', 'roles:assign', 'Assign roles to users', 'roles', 'assign', 1),
    ('perm_permissions_manage', 'permissions:manage', 'Create, edit, delete permissions', 'permissions', 'manage', 1);

-- Assign all permissions to admin role
INSERT INTO RolePermission (roleId, permissionId) VALUES
    ('role_admin', 'perm_users_manage'),
    ('role_admin', 'perm_roles_manage'),
    ('role_admin', 'perm_roles_assign'),
    ('role_admin', 'perm_permissions_manage');
