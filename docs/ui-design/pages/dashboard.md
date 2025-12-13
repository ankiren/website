# Dashboard Page

**Location:** `src/app/dashboard/page.tsx`

## Overview

The dashboard is the main hub for authenticated users, displaying all their decks in a responsive grid layout with study statistics and quick actions.

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ Your Decks                              [Create Deck]   │
│ 5 new and 3 due cards to review                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐           │
│  │ [Deck 1]  │  │ [Deck 2]  │  │ [Deck 3]  │           │
│  └───────────┘  └───────────┘  └───────────┘           │
│                                                          │
│  ┌───────────┐  ┌───────────┐                           │
│  │ [Deck 4]  │  │ [Deck 5]  │                           │
│  └───────────┘  └───────────┘                           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Components Used

- `DeckCard` - Individual deck preview cards
- `Button` - Create deck action

## Sections

### Page Header

| Element | Styles |
|---------|--------|
| Container | `flex justify-between items-center mb-8` |
| Title | `text-3xl font-bold text-gray-900` |
| Subtitle | `text-gray-600 mt-1` |
| New count | `text-blue-600` |
| Due count | `text-orange-600` |

### Deck Grid

| Element | Styles |
|---------|--------|
| Container | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` |

## States

### Loading State

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│                      Loading...                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

```jsx
<div className="flex items-center justify-center h-64">
  <div className="text-gray-600">Loading...</div>
</div>
```

### Empty State

```
┌─────────────────────────────────────────────────────────┐
│                      [Empty icon]                        │
│                                                          │
│                     No decks yet                         │
│          Create your first deck to start learning        │
│                                                          │
│               [Create Your First Deck]                   │
└─────────────────────────────────────────────────────────┘
```

| Element | Styles |
|---------|--------|
| Container | `text-center py-12 bg-white rounded-xl shadow-md` |
| Icon | `w-16 h-16 text-gray-400 mx-auto mb-4` |
| Title | `text-xl font-semibold text-gray-900 mb-2` |
| Description | `text-gray-600 mb-4` |

## Data Flow

```typescript
interface Deck {
  id: string;
  name: string;
  description: string | null;
  cardCount: number;
  dueCount: number;
  newCount: number;
}
```

**Fetch Pattern:**
```typescript
const fetchDecks = async () => {
  const response = await fetch("/api/decks");
  const data = await response.json();
  setDecks(Array.isArray(data) ? data : []);
};
```

## Actions

### Delete Deck

1. Confirmation dialog: `confirm("Are you sure you want to delete this deck?")`
2. API call: `DELETE /api/decks/${id}`
3. Update local state: Filter out deleted deck

## Responsive Behavior

| Breakpoint | Grid Columns |
|------------|--------------|
| Mobile | 1 column |
| `md` (768px+) | 2 columns |
| `lg` (1024px+) | 3 columns |

## Code Example

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import DeckCard from "@/components/DeckCard";

export default function DashboardPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch decks on mount
  useEffect(() => {
    fetchDecks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this deck?")) return;
    await fetch(`/api/decks/${id}`, { method: "DELETE" });
    setDecks(decks.filter((deck) => deck.id !== id));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Decks</h1>
          <p className="text-gray-600 mt-1">...</p>
        </div>
        <Link href="/dashboard/decks/new">
          <Button>Create Deck</Button>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <DeckCard key={deck.id} {...deck} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
```
