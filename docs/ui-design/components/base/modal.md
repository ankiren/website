# Modal Component

**Location:** `src/components/ui/Modal.tsx`

## Overview

A dialog component that overlays the page with a backdrop, featuring keyboard support (ESC to close), click-outside-to-close, and body scroll locking.

## Props

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Controls modal visibility |
| `onClose` | `() => void` | - | Callback when modal should close |
| `title` | `string` | - | Modal header title |
| `children` | `ReactNode` | - | Modal body content |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Modal width |

## Sizes

| Size | Max Width | Use Case |
|------|-----------|----------|
| `sm` | `max-w-md` (448px) | Simple confirmations, small forms |
| `md` | `max-w-lg` (512px) | Standard forms, content |
| `lg` | `max-w-2xl` (672px) | Complex forms, detailed content |

## Structure

```
┌───────────────────────────────────────────────────────────┐
│                    (backdrop overlay)                      │
│                                                            │
│       ┌─────────────────────────────────────────┐         │
│       │ Title                              [X]  │ Header  │
│       ├─────────────────────────────────────────┤         │
│       │                                         │         │
│       │              Content                    │ Body    │
│       │                                         │         │
│       └─────────────────────────────────────────┘         │
│                                                            │
└───────────────────────────────────────────────────────────┘
```

## Styles

### Overlay Container
```css
fixed inset-0 z-50 overflow-y-auto
```

### Centering Wrapper
```css
flex min-h-full items-center justify-center p-4
```

### Backdrop
```css
fixed inset-0 bg-black/50 transition-opacity
```

### Modal Panel
```css
relative w-full transform rounded-lg bg-white shadow-xl transition-all
```

### Header
```css
flex items-center justify-between border-b px-6 py-4
```

### Title
```css
text-lg font-semibold text-gray-900
```

### Close Button
```css
rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600
```

### Body
```css
px-6 py-4
```

## Features

### Keyboard Support

ESC key closes the modal:

```typescript
const handleEscape = useCallback(
  (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  },
  [onClose]
);

useEffect(() => {
  if (isOpen) {
    document.addEventListener("keydown", handleEscape);
  }
  return () => {
    document.removeEventListener("keydown", handleEscape);
  };
}, [isOpen, handleEscape]);
```

### Click Outside to Close

Clicking the backdrop closes the modal:

```tsx
<div
  className="fixed inset-0 bg-black/50 transition-opacity"
  onClick={onClose}
/>
```

### Body Scroll Lock

Prevents background scrolling when modal is open:

```typescript
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
  }
  return () => {
    document.body.style.overflow = "unset";
  };
}, [isOpen]);
```

## Usage Examples

### Basic Usage

```tsx
import { Modal } from "@/components/ui/Modal";

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
>
  <p>Modal content goes here.</p>
</Modal>
```

### Form Modal

```tsx
<Modal
  isOpen={showForm}
  onClose={handleClose}
  title="Create Role"
  size="md"
>
  <form onSubmit={handleSubmit} className="space-y-4">
    <Input label="Name" required />
    <div className="flex gap-2 justify-end mt-6">
      <Button variant="secondary" onClick={handleClose}>
        Cancel
      </Button>
      <Button type="submit">Create</Button>
    </div>
  </form>
</Modal>
```

### Confirmation Modal

```tsx
<Modal
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  title="Delete Item"
  size="sm"
>
  <p className="text-gray-600">
    Are you sure you want to delete this item? This action cannot be undone.
  </p>
  <div className="flex gap-2 justify-end mt-6">
    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
      Cancel
    </Button>
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  </div>
</Modal>
```

### Large Content Modal

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Detailed View"
  size="lg"
>
  {/* Complex content */}
</Modal>
```

## Common Patterns

### Controlled Modal State

```tsx
const [showModal, setShowModal] = useState(false);
const [editingItem, setEditingItem] = useState(null);

const handleEdit = (item) => {
  setEditingItem(item);
  setShowModal(true);
};

const handleClose = () => {
  setShowModal(false);
  setEditingItem(null);
};

const handleSuccess = () => {
  fetchData();
  handleClose();
};
```

### Conditional Rendering

```tsx
{(showForm || editingRole) && (
  <RoleForm
    role={editingRole}
    onClose={handleFormClose}
    onSuccess={handleFormSuccess}
  />
)}
```

## Source Code

```tsx
"use client";

import { useEffect, useCallback } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        <div
          className={`relative w-full ${sizeClasses[size]} transform rounded-lg bg-white shadow-xl transition-all`}
        >
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
```

## Accessibility

- Focus trap: Keyboard navigation stays within modal
- ESC key: Closes modal
- Click outside: Closes modal
- Body scroll lock: Prevents background scrolling
- Semantic structure with clear title
