# Button Component

**Location:** `src/components/ui/Button.tsx`

## Overview

A versatile button component with multiple variants and sizes, built with forwardRef for proper ref forwarding.

## Props

```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "danger" \| "ghost"` | `"primary"` | Visual style variant |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Button size |
| `className` | `string` | `""` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disabled state |
| `children` | `ReactNode` | - | Button content |

## Variants

| Variant | Background | Text | Hover | Focus Ring | Usage |
|---------|------------|------|-------|------------|-------|
| `primary` | `bg-blue-600` | `text-white` | `hover:bg-blue-700` | `focus:ring-blue-500` | Primary actions (Create, Submit) |
| `secondary` | `bg-gray-200` | `text-gray-900` | `hover:bg-gray-300` | `focus:ring-gray-500` | Secondary actions (Cancel, View) |
| `danger` | `bg-red-600` | `text-white` | `hover:bg-red-700` | `focus:ring-red-500` | Destructive actions (Delete) |
| `ghost` | `bg-transparent` | `text-gray-700` | `hover:bg-gray-100` | `focus:ring-gray-500` | Navigation, subtle actions |

## Sizes

| Size | Padding | Font Size | Example Usage |
|------|---------|-----------|---------------|
| `sm` | `px-3 py-1.5` | `text-sm` | Table actions, inline buttons |
| `md` | `px-4 py-2` | `text-base` | Default buttons |
| `lg` | `px-6 py-3` | `text-lg` | Hero CTAs, prominent actions |

## Base Styles

```css
font-medium
rounded-lg
transition-colors
focus:outline-none
focus:ring-2
focus:ring-offset-2
disabled:opacity-50
disabled:cursor-not-allowed
```

## Usage Examples

### Basic Usage

```tsx
import Button from "@/components/ui/Button";

// Primary button (default)
<Button>Create Deck</Button>

// With variant
<Button variant="secondary">Cancel</Button>
<Button variant="danger">Delete</Button>
<Button variant="ghost">View</Button>

// With size
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### With Loading State

```tsx
<Button disabled={loading}>
  {loading ? "Creating..." : "Create Deck"}
</Button>
```

### Form Submit

```tsx
<Button type="submit" disabled={loading}>
  Submit
</Button>
```

### With Custom Classes

```tsx
<Button className="w-full">
  Full Width Button
</Button>

<Button className="min-w-24">
  Minimum Width
</Button>

// Custom color override (Easy button in StudySession)
<Button
  variant="ghost"
  className="bg-green-100 hover:bg-green-200 text-green-700"
>
  Easy
</Button>
```

### Navigation Link

```tsx
import Link from "next/link";

<Link href="/dashboard">
  <Button>Go to Dashboard</Button>
</Link>
```

## States

### Normal State
Default appearance based on variant.

### Hover State
Background color darkens slightly.

### Focus State
Blue ring appears around button (`ring-2 ring-offset-2`).

### Disabled State
- Opacity reduced to 50%
- Cursor changes to `not-allowed`
- Click events are prevented

## Accessibility

- Uses native `<button>` element
- Supports `disabled` attribute
- Focus visible with ring indicator
- Forwards ref for external focus management

## Source Code

```tsx
"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
```
