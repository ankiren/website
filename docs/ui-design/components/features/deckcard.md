# DeckCard Component

**Location:** `src/components/DeckCard.tsx`

## Overview

A card component for displaying deck information on the dashboard. Shows deck name, description, card statistics, and action buttons for studying and viewing.

## Props

```typescript
interface DeckCardProps {
  id: string;
  name: string;
  description?: string | null;
  cardCount: number;
  dueCount: number;
  newCount: number;
  onDelete: (id: string) => void;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Deck identifier |
| `name` | `string` | Deck name |
| `description` | `string \| null` | Optional deck description |
| `cardCount` | `number` | Total number of cards |
| `dueCount` | `number` | Cards due for review |
| `newCount` | `number` | New cards not yet studied |
| `onDelete` | `(id: string) => void` | Delete callback |

## Structure

```
┌─────────────────────────────────────────────────────────┐
│ Deck Name                                          [🗑] │
│ Description text (optional)                             │
├─────────────────────────────────────────────────────────┤
│ 10 cards    5 new    3 due                              │
├─────────────────────────────────────────────────────────┤
│ [        Study        ]    [View]                       │
└─────────────────────────────────────────────────────────┘
```

## Styles

### Container
```css
bg-white
rounded-xl
shadow-md
p-6
hover:shadow-lg
transition-shadow
```

### Header Section
```css
flex justify-between items-start mb-4
```

### Title
```css
text-xl font-semibold text-gray-900
```

### Description
```css
text-gray-600 mt-1 text-sm
```

### Delete Button
```css
text-gray-400
hover:text-red-500
transition-colors
```

### Stats Section
```css
flex gap-4 text-sm text-gray-600 mb-4
```

### New Count
```css
text-blue-600
```

### Due Count
```css
text-orange-600
```

### Actions Section
```css
flex gap-2
```

## Sections

### Header

```tsx
<div className="flex justify-between items-start mb-4">
  <div>
    <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
    {description && (
      <p className="text-gray-600 mt-1 text-sm">{description}</p>
    )}
  </div>
  <button
    onClick={() => onDelete(id)}
    className="text-gray-400 hover:text-red-500 transition-colors"
    aria-label="Delete deck"
  >
    {/* Trash icon */}
  </button>
</div>
```

### Statistics

```tsx
<div className="flex gap-4 text-sm text-gray-600 mb-4">
  <span>{cardCount} cards</span>
  {newCount > 0 && (
    <span className="text-blue-600">{newCount} new</span>
  )}
  {dueCount > 0 && (
    <span className="text-orange-600">{dueCount} due</span>
  )}
</div>
```

### Action Buttons

```tsx
<div className="flex gap-2">
  <Link href={`/dashboard/decks/${id}/study`} className="flex-1">
    <Button className="w-full" disabled={cardCount === 0}>
      Study
    </Button>
  </Link>
  <Link href={`/dashboard/decks/${id}`}>
    <Button variant="secondary">View</Button>
  </Link>
</div>
```

## Usage Examples

### Basic Usage

```tsx
import DeckCard from "@/components/DeckCard";

<DeckCard
  id="deck-123"
  name="Japanese Vocabulary"
  description="Common words and phrases"
  cardCount={50}
  dueCount={5}
  newCount={10}
  onDelete={handleDelete}
/>
```

### In Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {decks.map((deck) => (
    <DeckCard
      key={deck.id}
      {...deck}
      onDelete={handleDelete}
    />
  ))}
</div>
```

### With Delete Handler

```tsx
const handleDelete = async (id: string) => {
  if (!confirm("Are you sure you want to delete this deck?")) {
    return;
  }

  try {
    await fetch(`/api/decks/${id}`, { method: "DELETE" });
    setDecks(decks.filter((deck) => deck.id !== id));
  } catch (error) {
    console.error("Failed to delete deck:", error);
  }
};
```

## States

### No Cards
- Study button is disabled when `cardCount === 0`

### No Due/New Cards
- New and due counts are hidden when 0

### Hover
- Shadow increases on hover (`shadow-md` → `shadow-lg`)

## Icons

### Trash Icon (Delete)

```tsx
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
  />
</svg>
```

## Source Code

```tsx
"use client";

import Link from "next/link";
import Button from "./ui/Button";

interface DeckCardProps {
  id: string;
  name: string;
  description?: string | null;
  cardCount: number;
  dueCount: number;
  newCount: number;
  onDelete: (id: string) => void;
}

export default function DeckCard({
  id,
  name,
  description,
  cardCount,
  dueCount,
  newCount,
  onDelete,
}: DeckCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
          {description && (
            <p className="text-gray-600 mt-1 text-sm">{description}</p>
          )}
        </div>
        <button
          onClick={() => onDelete(id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Delete deck"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="flex gap-4 text-sm text-gray-600 mb-4">
        <span>{cardCount} cards</span>
        {newCount > 0 && (
          <span className="text-blue-600">{newCount} new</span>
        )}
        {dueCount > 0 && (
          <span className="text-orange-600">{dueCount} due</span>
        )}
      </div>

      <div className="flex gap-2">
        <Link href={`/dashboard/decks/${id}/study`} className="flex-1">
          <Button className="w-full" disabled={cardCount === 0}>
            Study
          </Button>
        </Link>
        <Link href={`/dashboard/decks/${id}`}>
          <Button variant="secondary">View</Button>
        </Link>
      </div>
    </div>
  );
}
```

## Accessibility

- Delete button has `aria-label="Delete deck"`
- Uses semantic heading for deck name
- Buttons are properly labeled
