# Authorization Module - Technical Design

## Overview

This document describes the technical design for CR-003: Authorization Module. The module implements Role-Based Access Control (RBAC) with flat permissions, integrating with the existing NextAuth.js authentication system.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      Authorization Architecture                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────┐                                                     │
│  │   User Request  │                                                     │
│  └────────┬────────┘                                                     │
│           │                                                              │
│           ▼                                                              │
│  ┌─────────────────┐     ┌──────────────────┐                           │
│  │   NextAuth.js   │────▶│  JWT Token with  │                           │
│  │   (Session)     │     │  User ID + Roles │                           │
│  └────────┬────────┘     └──────────────────┘                           │
│           │                                                              │
│           ▼                                                              │
│  ┌─────────────────┐     ┌──────────────────┐                           │
│  │   Middleware    │────▶│  Permission      │                           │
│  │   (Auth Check)  │     │  Verification    │                           │
│  └────────┬────────┘     └──────────────────┘                           │
│           │                                                              │
│           ▼                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                        API Routes                                │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │    │
│  │  │  /api/admin │  │ /api/roles  │  │  /api/users (admin)     │  │    │
│  │  │  /settings  │  │             │  │                         │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│           │                                                              │
│           ▼                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                       Cloudflare D1                              │    │
│  │  ┌──────────┐  ┌────────────┐  ┌────────────────┐  ┌──────────┐ │    │
│  │  │   Role   │  │ Permission │  │ RolePermission │  │ UserRole │ │    │
│  │  └──────────┘  └────────────┘  └────────────────┘  └──────────┘ │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Database Schema

> **DBML Schema:** [`docs/database/authorization.dbml`](../database/authorization.dbml)

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      User       │       │    UserRole     │       │      Role       │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────│ userId (FK)     │       │ id (PK)         │
│ email           │       │ roleId (FK)     │──────►│ name            │
│ name            │       │ createdAt       │       │ description     │
│ ...             │       └─────────────────┘       │ isSystem        │
└─────────────────┘                                 │ createdAt       │
                                                    │ updatedAt       │
                                                    └────────┬────────┘
                                                             │
                          ┌─────────────────┐                │
                          │ RolePermission  │                │
                          ├─────────────────┤                │
                          │ roleId (FK)     │◄───────────────┘
                          │ permissionId(FK)│───────┐
                          │ createdAt       │       │
                          └─────────────────┘       │
                                                    │
                          ┌─────────────────┐       │
                          │   Permission    │       │
                          ├─────────────────┤       │
                          │ id (PK)         │◄──────┘
                          │ name            │
                          │ description     │
                          │ resource        │
                          │ action          │
                          │ isSystem        │
                          │ createdAt       │
                          │ updatedAt       │
                          └─────────────────┘
```

### Tables

| Table | Description |
|-------|-------------|
| `Role` | Defines user roles (admin, user) |
| `Permission` | Defines granular permissions (users:manage, roles:assign) |
| `UserRole` | Junction: assigns roles to users (M:N) |
| `RolePermission` | Junction: assigns permissions to roles (M:N) |

### Default Data

| Roles | Permissions |
|-------|-------------|
| `admin` - System administrator (all permissions) | `users:manage` - Create, edit, delete users |
| `user` - Regular user (own data access) | `roles:manage` - Create, edit, delete roles |
| | `roles:assign` - Assign roles to users |
| | `permissions:manage` - Create, edit, delete permissions |

### Permission Naming Convention

Permissions follow the pattern: `{resource}:{action}`

| Resource | Actions |
|----------|---------|
| users | manage, read |
| roles | manage, assign |
| permissions | manage |

## API Design

> **OpenAPI Specification:** [`docs/api/authorization-api.yaml`](../api/authorization-api.yaml)

## Session Integration

### JWT Token Extension

Update NextAuth callbacks to include roles in the JWT token:

```typescript
// src/lib/auth.ts
callbacks: {
  async jwt({ token, user, trigger }) {
    if (user) {
      token.id = user.id;
    }

    // Refresh roles on session update or initial sign-in
    if (trigger === "signIn" || trigger === "update") {
      const d1 = getD1();
      const roles = await db.userRole.findByUserId(d1, token.id as string);
      const permissions = await db.permission.findByRoles(d1, roles.map(r => r.roleId));
      token.roles = roles.map(r => r.name);
      token.permissions = permissions.map(p => p.name);
    }

    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string;
      session.user.roles = token.roles as string[];
      session.user.permissions = token.permissions as string[];
    }
    return session;
  },
}
```

### Type Augmentation

```typescript
// src/types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: string[];
      permissions: string[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roles: string[];
    permissions: string[];
  }
}
```

## Authorization Helper

### Permission Checking Utility

```typescript
// src/lib/authorization.ts
import { auth } from "@/lib/auth";

export async function checkPermission(permission: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user) return false;

  // Admin role has all permissions
  if (session.user.roles.includes("admin")) return true;

  // Check specific permission
  return session.user.permissions.includes(permission);
}

export async function requirePermission(permission: string): Promise<void> {
  const hasPermission = await checkPermission(permission);
  if (!hasPermission) {
    throw new Error("Forbidden");
  }
}

export function hasPermission(
  permissions: string[],
  required: string
): boolean {
  return permissions.includes(required);
}

export function hasAnyPermission(
  permissions: string[],
  required: string[]
): boolean {
  return required.some(p => permissions.includes(p));
}

export function hasAllPermissions(
  permissions: string[],
  required: string[]
): boolean {
  return required.every(p => permissions.includes(p));
}
```

### API Route Helper

```typescript
// src/lib/api-auth.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

type HandlerWithAuth = (
  request: NextRequest,
  context: { params: Promise<Record<string, string>> },
  session: NonNullable<Awaited<ReturnType<typeof auth>>>
) => Promise<NextResponse>;

export function withAuth(handler: HandlerWithAuth) {
  return async (
    request: NextRequest,
    context: { params: Promise<Record<string, string>> }
  ) => {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(request, context, session);
  };
}

export function withPermission(permission: string, handler: HandlerWithAuth) {
  return withAuth(async (request, context, session) => {
    const hasPermission =
      session.user.roles.includes("admin") ||
      session.user.permissions.includes(permission);

    if (!hasPermission) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return handler(request, context, session);
  });
}
```

## First User Admin Assignment

When the first user registers via Google OAuth, automatically assign them the admin role:

```typescript
// In signIn callback (src/lib/auth.ts)
if (account?.provider === "google") {
  // ... existing user creation logic ...

  // Check if this is the first user
  const userCount = await db.user.count(d1);
  if (userCount === 1) {
    // Assign admin role to first user
    const adminRole = await db.role.findByName(d1, "admin");
    if (adminRole) {
      await db.userRole.assign(d1, existingUser.id, adminRole.id);
    }
  } else {
    // Assign default user role
    const userRole = await db.role.findByName(d1, "user");
    if (userRole) {
      await db.userRole.assign(d1, existingUser.id, userRole.id);
    }
  }
}
```

## UI Components

### Directory Structure

```
src/
├── app/
│   └── dashboard/
│       └── admin/
│           ├── layout.tsx          # Admin layout with permission check
│           ├── page.tsx            # Admin dashboard
│           ├── users/
│           │   ├── page.tsx        # User list
│           │   └── [id]/
│           │       └── page.tsx    # User detail/edit
│           ├── roles/
│           │   ├── page.tsx        # Role list
│           │   ├── new/
│           │   │   └── page.tsx    # Create role
│           │   └── [id]/
│           │       └── page.tsx    # Role detail/edit
│           └── permissions/
│               └── page.tsx        # Permission list
└── components/
    └── admin/
        ├── UserTable.tsx           # User list with role badges
        ├── RoleForm.tsx            # Create/edit role form
        ├── PermissionPicker.tsx    # Multi-select permissions
        ├── RoleAssignmentModal.tsx # Assign role to user modal
        └── AdminNav.tsx            # Admin navigation sidebar
```

### Admin Layout with Permission Check

```typescript
// src/app/dashboard/admin/layout.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Check if user has any admin permission
  const hasAdminAccess =
    session.user.roles.includes("admin") ||
    session.user.permissions.some(p =>
      ["users:manage", "roles:manage", "roles:assign", "permissions:manage"].includes(p)
    );

  if (!hasAdminAccess) {
    redirect("/dashboard");
  }

  return (
    <div className="flex">
      <AdminNav permissions={session.user.permissions} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
```

## Security Considerations

### Last Admin Protection

Prevent removing the last admin user or their admin role:

```typescript
// Before removing admin role or deleting admin user
const adminCount = await db.userRole.countAdmins(d1);
if (adminCount <= 1) {
  return NextResponse.json(
    { error: "Cannot remove last admin" },
    { status: 400 }
  );
}
```

### System Role/Permission Protection

System roles and permissions cannot be deleted:

```typescript
// Check isSystem flag before delete
const role = await db.role.findById(d1, id);
if (role?.isSystem) {
  return NextResponse.json(
    { error: "Cannot delete system role" },
    { status: 400 }
  );
}
```

### Self-Deletion Prevention

Users cannot delete themselves:

```typescript
if (userId === session.user.id) {
  return NextResponse.json(
    { error: "Cannot delete yourself" },
    { status: 400 }
  );
}
```

### Permission Caching

Permissions are cached in the JWT token. Force session refresh when roles change:

```typescript
// After role assignment/removal, client should trigger session refresh
import { useSession } from "next-auth/react";

const { update } = useSession();
await update(); // Triggers JWT callback with trigger="update"
```

## Testing

### E2E Test Coverage

```typescript
// e2e/admin.spec.ts
describe("Admin Authorization", () => {
  test("admin can access admin pages", async () => {
    // Login as admin user
    // Navigate to /dashboard/admin
    // Verify access granted
  });

  test("regular user cannot access admin pages", async () => {
    // Login as regular user
    // Navigate to /dashboard/admin
    // Verify redirect to /dashboard
  });

  test("admin can assign roles", async () => {
    // Login as admin
    // Navigate to user management
    // Assign role to user
    // Verify role assignment
  });

  test("cannot remove last admin role", async () => {
    // Login as admin
    // Try to remove own admin role
    // Verify error message
  });
});
```

## File References

| File | Purpose |
|------|---------|
| `src/lib/auth.ts` | NextAuth configuration with role/permission loading |
| `src/lib/d1.ts` | D1 database operations for authorization |
| `src/lib/authorization.ts` | Permission checking utilities |
| `src/lib/api-auth.ts` | API route authentication/authorization helpers |
| `src/types/next-auth.d.ts` | Type augmentation for roles/permissions |
| `src/app/api/admin/roles/route.ts` | Role CRUD endpoints |
| `src/app/api/admin/permissions/route.ts` | Permission CRUD endpoints |
| `src/app/api/admin/users/route.ts` | User management endpoints |
| `src/app/api/me/permissions/route.ts` | Current user permissions endpoint |
| `src/app/dashboard/admin/layout.tsx` | Admin layout with permission check |
| `migrations/0003_authorization.sql` | Authorization schema migration |
| `e2e/admin.spec.ts` | E2E tests for admin functionality |

## Implementation Phases

### Phase 1: Database & Core
- Create migration file with tables and default data
- Add D1 database operations for Role, Permission, UserRole, RolePermission
- Update NextAuth callbacks to load roles/permissions into JWT
- Create authorization helper utilities

### Phase 2: API Endpoints
- Implement /api/admin/roles CRUD endpoints
- Implement /api/admin/permissions CRUD endpoints
- Implement /api/admin/users endpoints
- Implement /api/me/permissions endpoint
- Add first-user admin assignment logic

### Phase 3: UI Components
- Create admin layout with permission check
- Build user management page with role assignment
- Build role management page with permission picker
- Build permission management page

### Phase 4: Testing & Security
- Write E2E tests for admin functionality
- Implement last-admin protection
- Implement system role/permission protection
- Security review and testing
