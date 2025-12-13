# Input Component

**Location:** `src/components/ui/Input.tsx`

## Overview

A styled text input component with optional label and error message display, built with forwardRef for form library compatibility.

## Props

```typescript
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label text displayed above input |
| `error` | `string` | - | Error message displayed below input |
| `id` | `string` | - | Input ID (links label to input) |
| `className` | `string` | `""` | Additional CSS classes |

## Structure

```
┌─────────────────────────────────────┐
│ Label (optional)                    │  <- label prop
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Input field                     │ │  <- input element
│ └─────────────────────────────────┘ │
│ Error message (optional)            │  <- error prop
└─────────────────────────────────────┘
```

## Styles

### Container
```css
w-full
```

### Label
```css
block
text-sm
font-medium
text-gray-700
mb-1
```

### Input Field

**Base:**
```css
w-full
px-3
py-2
border
rounded-lg
focus:outline-none
focus:ring-2
focus:ring-blue-500
focus:border-transparent
```

**Normal State:**
```css
border-gray-300
```

**Error State:**
```css
border-red-500
```

### Error Message
```css
mt-1
text-sm
text-red-500
```

## Usage Examples

### Basic Usage

```tsx
import Input from "@/components/ui/Input";

<Input
  id="email"
  type="email"
  placeholder="Enter your email"
/>
```

### With Label

```tsx
<Input
  id="name"
  label="Deck Name"
  placeholder="e.g., Japanese Vocabulary"
/>
```

### With Error

```tsx
<Input
  id="email"
  label="Email"
  error="Please enter a valid email address"
/>
```

### Required Field

```tsx
<Input
  id="name"
  label="Deck Name"
  required
  placeholder="e.g., Japanese Vocabulary"
/>
```

### Controlled Input

```tsx
const [value, setValue] = useState("");

<Input
  id="name"
  label="Name"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### Password Input

```tsx
<Input
  id="password"
  type="password"
  label="Password"
/>
```

## States

### Normal State
- Border: `border-gray-300`
- Background: White (default)

### Focus State
- Ring: `ring-2 ring-blue-500`
- Border: Transparent (hidden by ring)

### Error State
- Border: `border-red-500`
- Error message appears below input

### Disabled State
- Inherited from native input behavior

## Accessibility

- Label is properly associated with input via `htmlFor` and `id`
- Uses semantic `<label>` and `<input>` elements
- Error messages are visible and associated with input
- Supports all native input attributes

## Source Code

```tsx
"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? "border-red-500" : "border-gray-300"
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
```

## Related Patterns

### Textarea (Custom)

For multi-line input, use a custom textarea with similar styling:

```tsx
<div>
  <label
    htmlFor="description"
    className="block text-sm font-medium text-gray-700 mb-1"
  >
    Description
  </label>
  <textarea
    id="description"
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    rows={3}
    placeholder="Enter description..."
  />
</div>
```
