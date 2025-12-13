# Tabs Component

**Location:** `src/components/ui/Tabs.tsx`

## Overview

A horizontal tab navigation component for switching between content sections. Features an underline-style active indicator.

## Props

```typescript
interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `tabs` | `Tab[]` | Array of tab definitions |
| `activeTab` | `string` | Currently active tab ID |
| `onChange` | `(id: string) => void` | Callback when tab is clicked |

### Tab Interface

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier for the tab |
| `label` | `string` | Display text for the tab |

## Structure

```
┌─────────────────────────────────────────────────────────┐
│  Tab 1   |   Tab 2   |   Tab 3                         │
│ ─────────┴───────────┴───────────────────────────────   │
│   ^                                                      │
│   Active indicator (blue underline)                     │
└─────────────────────────────────────────────────────────┘
```

## Styles

### Container
```css
border-b border-gray-200
```

### Navigation
```css
-mb-px flex space-x-8
```

### Tab Button

**Base:**
```css
whitespace-nowrap
border-b-2
px-1
py-4
text-sm
font-medium
transition-colors
```

**Active State:**
```css
border-blue-500
text-blue-600
```

**Inactive State:**
```css
border-transparent
text-gray-500
hover:border-gray-300
hover:text-gray-700
```

## Usage Examples

### Basic Usage

```tsx
import { Tabs } from "@/components/ui/Tabs";

const tabs = [
  { id: "users", label: "Users" },
  { id: "roles", label: "Roles" },
  { id: "permissions", label: "Permissions" },
];

const [activeTab, setActiveTab] = useState("users");

<Tabs
  tabs={tabs}
  activeTab={activeTab}
  onChange={setActiveTab}
/>
```

### With Content Switching

```tsx
const tabs = [
  { id: "users", label: "Users" },
  { id: "roles", label: "Roles" },
  { id: "permissions", label: "Permissions" },
];

const [activeTab, setActiveTab] = useState("users");

<div>
  <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

  <div className="mt-6">
    {activeTab === "users" && <UserList />}
    {activeTab === "roles" && <RoleList />}
    {activeTab === "permissions" && <PermissionList />}
  </div>
</div>
```

### Two Tabs

```tsx
const tabs = [
  { id: "active", label: "Active" },
  { id: "archived", label: "Archived" },
];

<Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
```

## Common Patterns

### Admin Page Layout

```tsx
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");

  const tabs = [
    { id: "users", label: "Users" },
    { id: "roles", label: "Roles" },
    { id: "permissions", label: "Permissions" },
  ];

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

### Tab Count Badge

For tabs with counts, include the count in the label:

```tsx
const tabs = [
  { id: "active", label: `Active (${activeCount})` },
  { id: "archived", label: `Archived (${archivedCount})` },
];
```

## Source Code

```tsx
"use client";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
```

## Accessibility

- Uses native `<button>` elements for keyboard navigation
- Visual indicator shows active state
- Hover states provide feedback
- Tab spacing allows easy click targets
