# Card Component

**Location:** `src/components/ui/Card.tsx`

## Overview

A simple container component with white background, rounded corners, and shadow. Used as a wrapper for content sections throughout the app.

## Props

```typescript
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Card content |
| `className` | `string` | `""` | Additional CSS classes |

## Styles

```css
bg-white
rounded-xl
shadow-md
p-6
```

| Property | Value | Description |
|----------|-------|-------------|
| Background | `bg-white` | White background |
| Border Radius | `rounded-xl` | 12px rounded corners |
| Shadow | `shadow-md` | Medium box shadow |
| Padding | `p-6` | 24px padding on all sides |

## Usage Examples

### Basic Usage

```tsx
import Card from "@/components/ui/Card";

<Card>
  <h2>Card Title</h2>
  <p>Card content goes here.</p>
</Card>
```

### Form Container

```tsx
<Card>
  <form className="space-y-4">
    <Input label="Name" />
    <Button type="submit">Submit</Button>
  </form>
</Card>
```

### Auth Page Container

```tsx
<Card className="w-full max-w-md">
  <div className="text-center mb-8">
    <h1>Welcome</h1>
  </div>
  {/* Auth content */}
</Card>
```

### Custom Padding

```tsx
<Card className="p-4">
  {/* Less padding */}
</Card>

<Card className="p-8">
  {/* More padding */}
</Card>
```

### List Item Card

```tsx
<Card className="p-4">
  <div className="flex items-start justify-between">
    <div>{/* Content */}</div>
    <div>{/* Actions */}</div>
  </div>
</Card>
```

### Loading State Card

```tsx
<Card className="p-8 text-center">
  <div className="text-gray-500">Loading...</div>
</Card>
```

### Error State Card

```tsx
<Card className="p-8 text-center">
  <div className="text-red-500">{error}</div>
  <Button onClick={retry} className="mt-4">
    Retry
  </Button>
</Card>
```

## Common Patterns

### Card with Header

```tsx
<Card>
  <h3 className="text-xl font-semibold text-gray-900 mb-4">
    Section Title
  </h3>
  <div>
    {/* Content */}
  </div>
</Card>
```

### Card Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</div>
```

### Card with Actions

```tsx
<Card>
  <div className="flex justify-between items-center mb-4">
    <h3>Title</h3>
    <Button size="sm">Action</Button>
  </div>
  <div>{/* Content */}</div>
</Card>
```

## Source Code

```tsx
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({ className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
```

## Related Components

- **DeckCard** - Specialized card for deck display with hover effects
- **FlashCard** - 3D flip card for study sessions
