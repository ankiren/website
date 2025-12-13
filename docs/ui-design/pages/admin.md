# Admin Page

**Location:** `src/app/dashboard/admin/page.tsx`

## Overview

The admin page provides a tabbed interface for managing users, roles, and permissions. Access is restricted to users with the "admin" role.

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ Admin                                                    │
│ Manage users, roles, and permissions                    │
├─────────────────────────────────────────────────────────┤
│  Users   |   Roles   |   Permissions                    │
│ ─────────┴───────────┴───────────────────────────────   │
├─────────────────────────────────────────────────────────┤
│                                        [Create Role]    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Role Name          [System] [3 users]    [Edit] │    │
│  │ Description...                           [Delete]│   │
│  │ [perm1] [perm2] [perm3]                          │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Another Role...                                  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Components Used

- `Tabs` - Tab navigation
- `Card` - Content containers
- `Button` - Actions
- `Badge` - Status indicators
- `Modal` - Forms (via RoleForm, PermissionForm)
- `UserList`, `RoleList`, `PermissionList` - Tab content components

## Page Header

| Element | Styles |
|---------|--------|
| Container | `mb-6` |
| Title | `text-2xl font-bold text-gray-900` |
| Subtitle | `text-gray-600` |

## Tab Navigation

```typescript
const tabs = [
  { id: "users", label: "Users" },
  { id: "roles", label: "Roles" },
  { id: "permissions", label: "Permissions" },
];
```

## Tab Content Components

### Users Tab (`UserList`)

Displays all users with their roles and allows role assignment.

**List Item Structure:**
```
┌─────────────────────────────────────────────────────────┐
│ [Avatar] user@email.com           [role1] [role2]  [+] │
└─────────────────────────────────────────────────────────┘
```

### Roles Tab (`RoleList`)

Displays all roles with permissions and user counts.

**List Item Structure:**
```
┌─────────────────────────────────────────────────────────┐
│ Role Name          [System] [3 users]    [Edit] [Delete]│
│ Description text...                                      │
│ [permission1] [permission2] [permission3]               │
└─────────────────────────────────────────────────────────┘
```

**Badges Used:**
| Badge | Variant | Purpose |
|-------|---------|---------|
| System | `warning` | Indicates system-protected role |
| User count | `default` | Shows number of users with role |
| Permissions | `primary` | Lists assigned permissions |

### Permissions Tab (`PermissionList`)

Displays all permissions with descriptions.

**List Item Structure:**
```
┌─────────────────────────────────────────────────────────┐
│ permission.name                         [Edit] [Delete] │
│ Permission description...                                │
└─────────────────────────────────────────────────────────┘
```

## States

### Loading State

```jsx
<Card className="p-8 text-center">
  <div className="text-gray-500">Loading roles...</div>
</Card>
```

### Error State

```jsx
<Card className="p-8 text-center">
  <div className="text-red-500">{error}</div>
  <Button onClick={fetchRoles} className="mt-4">
    Retry
  </Button>
</Card>
```

## Actions

### Create Role/Permission

Opens a modal form for creating new items.

### Edit Role/Permission

Opens a modal form pre-filled with existing data.

### Delete Role/Permission

1. System roles cannot be deleted
2. Roles with users cannot be deleted
3. Confirmation dialog before deletion

**Delete Button States:**
```jsx
<Button
  variant="danger"
  size="sm"
  disabled={deleting === role.id || role.userCount > 0}
  onClick={() => handleDelete(role.id)}
>
  {deleting === role.id ? "Deleting..." : "Delete"}
</Button>
```

## Access Control

The admin page is protected at the navigation level:

```jsx
// Navbar.tsx
{session.user?.roles?.includes("admin") && (
  <Link href="/dashboard/admin">
    <Button variant="ghost">Admin</Button>
  </Link>
)}
```

## Code Example

```tsx
"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { UserList } from "@/components/admin/UserList";
import { RoleList } from "@/components/admin/RoleList";
import { PermissionList } from "@/components/admin/PermissionList";

const tabs = [
  { id: "users", label: "Users" },
  { id: "roles", label: "Roles" },
  { id: "permissions", label: "Permissions" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
        <p className="text-gray-600">Manage users, roles, and permissions</p>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Content */}
      <div className="mt-6">
        {activeTab === "users" && <UserList />}
        {activeTab === "roles" && <RoleList />}
        {activeTab === "permissions" && <PermissionList />}
      </div>
    </div>
  );
}
```

## Admin Component Files

| Component | Location |
|-----------|----------|
| UserList | `src/components/admin/UserList.tsx` |
| RoleList | `src/components/admin/RoleList.tsx` |
| RoleForm | `src/components/admin/RoleForm.tsx` |
| PermissionList | `src/components/admin/PermissionList.tsx` |
| PermissionForm | `src/components/admin/PermissionForm.tsx` |
| UserRoleManager | `src/components/admin/UserRoleManager.tsx` |
