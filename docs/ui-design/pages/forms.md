# Form Pages

**Locations:**
- `src/app/dashboard/decks/new/page.tsx` - Create deck
- `src/app/dashboard/decks/[id]/cards/new/page.tsx` - Add card
- `src/app/dashboard/cards/[id]/edit/page.tsx` - Edit card

## Overview

Form pages follow a consistent centered layout pattern with a Card container for the form content. They handle validation, loading states, and error display.

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ Create New Deck                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│    ┌─────────────────────────────────────────────┐      │
│    │                                              │      │
│    │  ┌─────────────────────────────────────┐   │      │
│    │  │ [Error message if any]              │   │      │
│    │  └─────────────────────────────────────┘   │      │
│    │                                              │      │
│    │  Deck Name                                  │      │
│    │  ┌─────────────────────────────────────┐   │      │
│    │  │ e.g., Japanese Vocabulary           │   │      │
│    │  └─────────────────────────────────────┘   │      │
│    │                                              │      │
│    │  Description (optional)                     │      │
│    │  ┌─────────────────────────────────────┐   │      │
│    │  │ What is this deck about?            │   │      │
│    │  │                                      │   │      │
│    │  └─────────────────────────────────────┘   │      │
│    │                                              │      │
│    │  [Create Deck]  [Cancel]                   │      │
│    │                                              │      │
│    └─────────────────────────────────────────────┘      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Components Used

- `Card` - Form container
- `Input` - Text input fields
- `Button` - Submit and cancel actions

## Layout Styles

| Element | Styles |
|---------|--------|
| Container | `max-w-2xl mx-auto` |
| Title | `text-3xl font-bold text-gray-900 mb-8` |
| Form | `space-y-4` |
| Button group | `flex gap-4 pt-4` |

## Form Elements

### Text Input (Input Component)

```jsx
<Input
  id="name"
  label="Deck Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  required
  placeholder="e.g., Japanese Vocabulary"
/>
```

### Textarea (Custom)

```jsx
<div>
  <label
    htmlFor="description"
    className="block text-sm font-medium text-gray-700 mb-1"
  >
    Description (optional)
  </label>
  <textarea
    id="description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    rows={3}
    placeholder="What is this deck about?"
  />
</div>
```

### Error Message

```jsx
{error && (
  <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm">
    {error}
  </div>
)}
```

### Action Buttons

```jsx
<div className="flex gap-4 pt-4">
  <Button type="submit" disabled={loading}>
    {loading ? "Creating..." : "Create Deck"}
  </Button>
  <Button
    type="button"
    variant="secondary"
    onClick={() => router.back()}
  >
    Cancel
  </Button>
</div>
```

## Form State Management

```typescript
const [name, setName] = useState("");
const [description, setDescription] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
```

## Submit Handler Pattern

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const response = await fetch("/api/decks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Failed to create deck");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  } catch {
    setError("An error occurred. Please try again.");
  } finally {
    setLoading(false);
  }
};
```

## Form Variants

### Create Deck Form

| Field | Type | Required | Placeholder |
|-------|------|----------|-------------|
| Name | Input | Yes | "e.g., Japanese Vocabulary" |
| Description | Textarea | No | "What is this deck about?" |

### Create Card Form

| Field | Type | Required | Placeholder |
|-------|------|----------|-------------|
| Front | Textarea | Yes | "Question or front of card" |
| Back | Textarea | Yes | "Answer or back of card" |

### Edit Card Form

Same as Create Card Form, but pre-filled with existing data.

## Validation

### Client-side

- Required fields enforced via `required` attribute
- Button disabled during submission

### Server-side

- API returns error messages for validation failures
- Errors displayed in the form error message area

## Navigation

### Success

```typescript
router.push("/dashboard");
router.refresh();
```

### Cancel

```typescript
router.back();
```

## Code Example

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

export default function NewDeckPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to create deck");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Deck</h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            id="name"
            label="Deck Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g., Japanese Vocabulary"
          />

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="What is this deck about?"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Deck"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
```
