# Epic 5: Authorization

**ID:** EPIC-5
**Status:** Planned
**Description:** Enable role-based access control (RBAC) for multi-user scenarios with granular permissions.

---

## Overview

Authorization module provides role-based access control to manage user permissions across the application. Admins can manage users, create custom roles, and control access to different features.

### Goals
- Role-based access control (RBAC) for multi-user scenarios
- Admin can manage users and system settings
- Granular permissions for different features

### Scope
- **In Scope:** Role management, user management, permission management, access control
- **Out of Scope:** Team management, audit logging, multi-tenant architecture, SSO integration, external identity providers

---

## User Stories

| ID | Name | Status | Priority | File |
|----|------|--------|----------|------|
| US-5.1 | Role Management | Planned | Critical | [US-5-1.md](US-5-1.md) |
| US-5.2 | User Role Assignment | Planned | Critical | [US-5-2.md](US-5-2.md) |
| US-5.3 | Permission Management | Planned | Critical | [US-5-3.md](US-5-3.md) |
| US-5.4 | Access Control | Planned | Critical | [US-5-4.md](US-5-4.md) |
| US-5.5 | User Management | Planned | High | [US-5-5.md](US-5-5.md) |

---

## Technical Implementation

- **Provider**: Custom RBAC middleware
- **Session**: Extend NextAuth.js session with roles/permissions
- **Storage**: D1 database tables

### Database Schema

```sql
CREATE TABLE Role (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  isSystem BOOLEAN DEFAULT FALSE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Permission (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  module TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE RolePermission (
  id TEXT PRIMARY KEY,
  roleId TEXT REFERENCES Role(id) ON DELETE CASCADE,
  permissionId TEXT REFERENCES Permission(id) ON DELETE CASCADE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(roleId, permissionId)
);

CREATE TABLE UserRole (
  id TEXT PRIMARY KEY,
  userId TEXT REFERENCES User(id) ON DELETE CASCADE,
  roleId TEXT REFERENCES Role(id) ON DELETE CASCADE,
  assignedBy TEXT REFERENCES User(id),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(userId, roleId)
);

```

### API Endpoints

| Method | Endpoint | Description | Required Permission |
|--------|----------|-------------|---------------------|
| GET | `/api/roles` | List all roles | `manage_roles` |
| POST | `/api/roles` | Create new role | `manage_roles` |
| PUT | `/api/roles/:id` | Update role | `manage_roles` |
| DELETE | `/api/roles/:id` | Delete role | `manage_roles` |
| GET | `/api/roles/:id/permissions` | Get role permissions | `manage_roles` |
| PUT | `/api/roles/:id/permissions` | Update role permissions | `manage_roles` |
| GET | `/api/permissions` | List all permissions | `manage_roles` |
| POST | `/api/permissions` | Create new permission | `manage_roles` |
| PUT | `/api/permissions/:id` | Update permission | `manage_roles` |
| DELETE | `/api/permissions/:id` | Delete permission | `manage_roles` |
| GET | `/api/users` | List all users | `manage_users` |
| PUT | `/api/users/:id` | Update user | `manage_users` |
| DELETE | `/api/users/:id` | Delete user | `manage_users` |
| POST | `/api/users/:id/roles` | Assign role to user | `assign_roles` |
| DELETE | `/api/users/:id/roles/:roleId` | Remove role from user | `assign_roles` |
| GET | `/api/me/permissions` | Get current user permissions | (authenticated) |

### Default Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| Admin | System administrator | All permissions |
| User | Regular user | Own skills, activities, goals |

### Default Permissions

| Permission | Description |
|------------|-------------|
| `manage_users` | Create, edit, delete users |
| `manage_roles` | Create, edit, delete roles |
| `assign_roles` | Assign roles to users |

### Files (Proposed)

- `src/lib/rbac.ts` - RBAC middleware and helpers
- `src/app/api/roles/route.ts` - Role management endpoints
- `src/app/api/users/route.ts` - User management endpoints
- `src/app/dashboard/admin/page.tsx` - Admin settings page
- `src/components/RoleManager.tsx` - Role management UI
- `src/components/UserManager.tsx` - User management UI

---

## RICE Score Summary

| Story | Reach | Impact | Confidence | Effort | Score |
|-------|-------|--------|------------|--------|-------|
| US-5.1 | 30% | 3 | 80% | 1w | 72.0 |
| US-5.2 | 30% | 3 | 80% | 0.5w | 144.0 |
| US-5.3 | 30% | 3 | 80% | 1w | 72.0 |
| US-5.4 | 30% | 3 | 80% | 1w | 72.0 |
| US-5.5 | 30% | 2 | 80% | 0.5w | 96.0 |

**Epic Score:** (30 × 3 × 0.8) / 4 = **18.0**

---

## Related Documents

- [CR-003: Authorization Module](../../change-requests/CR-003-authorization.md)
