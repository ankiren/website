# Badge Component

**Location:** `src/components/ui/Badge.tsx`

## Overview

A small inline indicator component for displaying status, counts, labels, or tags. Uses pill-shaped styling with colored backgrounds.

## Props

```typescript
interface BadgeProps {
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  children: React.ReactNode;
  className?: string;
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "primary" \| "success" \| "warning" \| "danger"` | `"default"` | Color variant |
| `children` | `ReactNode` | - | Badge content |
| `className` | `string` | `""` | Additional CSS classes |

## Variants

| Variant | Background | Text Color | Usage |
|---------|------------|------------|-------|
| `default` | `bg-gray-100` | `text-gray-800` | Neutral info, counts |
| `primary` | `bg-blue-100` | `text-blue-800` | Permissions, features |
| `success` | `bg-green-100` | `text-green-800` | Success states |
| `warning` | `bg-yellow-100` | `text-yellow-800` | System roles, caution |
| `danger` | `bg-red-100` | `text-red-800` | Errors, alerts |

## Base Styles

```css
inline-flex
items-center
rounded-full
px-2.5
py-0.5
text-xs
font-medium
```

## Usage Examples

### Basic Usage

```tsx
import { Badge } from "@/components/ui/Badge";

<Badge>Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
```

### User Count

```tsx
<Badge variant="default">{role.userCount} users</Badge>
```

### Permission Tags

```tsx
<div className="flex flex-wrap gap-1">
  {permissions.map((perm) => (
    <Badge key={perm} variant="primary">
      {perm}
    </Badge>
  ))}
</div>
```

### System Role Indicator

```tsx
{role.isSystem && (
  <Badge variant="warning">
    <svg className="mr-1 h-3 w-3" ...>
      {/* Lock icon */}
    </svg>
    System
  </Badge>
)}
```

### Status Indicators

```tsx
// New cards
<span className="text-blue-600">{newCount} new</span>

// Due cards
<span className="text-orange-600">{dueCount} due</span>
```

### With Icon

```tsx
<Badge variant="warning">
  <svg
    className="mr-1 h-3 w-3"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
  System
</Badge>
```

## Common Patterns

### Role List Item

```tsx
<div className="flex items-center gap-2">
  <h3 className="font-medium text-gray-900">{role.name}</h3>
  {role.isSystem && <Badge variant="warning">System</Badge>}
  <Badge variant="default">{role.userCount} users</Badge>
</div>
```

### Permission List

```tsx
<div className="mt-2 flex flex-wrap gap-1">
  {role.permissions.map((perm) => (
    <Badge key={perm} variant="primary">
      {perm}
    </Badge>
  ))}
  {role.permissions.length === 0 && (
    <span className="text-sm text-gray-400">No permissions</span>
  )}
</div>
```

## Source Code

```tsx
interface BadgeProps {
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "default",
  children,
  className = "",
}: BadgeProps) {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
```

## Accessibility

- Uses semantic `<span>` element
- Text color contrasts meet WCAG AA standards
- Content is readable by screen readers
