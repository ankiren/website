# Study Page

**Location:** `src/app/dashboard/decks/[id]/study/page.tsx`

## Overview

The study page is where users review flashcards using the SM-2 spaced repetition algorithm. It displays one card at a time with a 3D flip animation and rating buttons.

## Layout Structure

### Active Study Session

```
┌─────────────────────────────────────────────────────────┐
│ ← Back to Deck Name                                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Deck Name                                   3 / 10     │
│  [==================>                            ]       │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│            ┌───────────────────────────────┐            │
│            │                               │            │
│            │                               │            │
│            │         [Card Front]          │            │
│            │                               │            │
│            │                               │            │
│            └───────────────────────────────┘            │
│                                                          │
│              "Click to reveal answer"                    │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│    [Again]    [Hard]    [Good]    [Easy]                │
│     (red)     (gray)    (blue)    (green)               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Session Complete

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│                    ┌─────────┐                          │
│                    │   ✓     │                          │
│                    └─────────┘                          │
│                                                          │
│               Session Complete!                          │
│                                                          │
│      You reviewed 10 cards. 8 correct,                  │
│           2 need more practice.                          │
│                                                          │
│         [Back to Deck]    [Dashboard]                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Components Used

- `StudySession` - Main study session controller
- `FlashCard` - 3D flip card
- `Button` - Rating and navigation buttons

## Sections

### Back Link

```jsx
<Link
  href={`/dashboard/decks/${id}`}
  className="text-blue-600 hover:underline text-sm mb-6 inline-block"
>
  &larr; Back to {deck.name}
</Link>
```

### Progress Header

| Element | Styles |
|---------|--------|
| Container | `w-full max-w-2xl mb-6` |
| Info row | `flex justify-between items-center text-sm text-gray-600 mb-2` |
| Progress bar container | `w-full bg-gray-200 rounded-full h-2` |
| Progress bar fill | `bg-blue-600 h-2 rounded-full transition-all` |

### FlashCard

| Element | Styles |
|---------|--------|
| Container | `w-full max-w-2xl h-80` |
| Card front | `bg-white rounded-2xl shadow-lg` |
| Card back | `bg-blue-50 rounded-2xl shadow-lg` |
| Content | `text-2xl text-gray-900 text-center` |

### Rating Buttons

| Button | Variant | Color Override | SM-2 Quality |
|--------|---------|----------------|--------------|
| Again | `danger` | - | 0 |
| Hard | `secondary` | - | 2 |
| Good | `primary` | - | 4 |
| Easy | `ghost` | `bg-green-100 hover:bg-green-200 text-green-700` | 5 |

```jsx
<div className="mt-8 flex gap-4">
  <Button variant="danger" className="min-w-24">Again</Button>
  <Button variant="secondary" className="min-w-24">Hard</Button>
  <Button variant="primary" className="min-w-24">Good</Button>
  <Button
    variant="ghost"
    className="min-w-24 bg-green-100 hover:bg-green-200 text-green-700"
  >
    Easy
  </Button>
</div>
```

### Completion State

| Element | Styles |
|---------|--------|
| Container | `text-center py-12` |
| Success icon container | `w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6` |
| Success icon | `w-10 h-10 text-green-600` |
| Title | `text-3xl font-bold text-gray-900 mb-2` |
| Stats | `text-gray-600 mb-6` |
| Buttons | `flex gap-4 justify-center` |

## States

### Loading State

```jsx
<div className="flex items-center justify-center h-64">
  <div className="text-gray-600">Loading...</div>
</div>
```

### No Cards Due

```
┌─────────────────────────────────────────────────────────┐
│                    ┌─────────┐                          │
│                    │   ✓     │                          │
│                    └─────────┘                          │
│                                                          │
│                  No Cards Due!                           │
│                                                          │
│    Great job! All cards in this deck have been          │
│    reviewed. Come back later for more practice.         │
│                                                          │
│         [Back to Deck]    [Dashboard]                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Empty Deck

```jsx
<div className="text-center py-12">
  <h2 className="text-2xl font-bold text-gray-900 mb-4">No Cards</h2>
  <p className="text-gray-600 mb-6">
    This deck has no cards. Add some cards before studying.
  </p>
  <Link
    href={`/dashboard/decks/${id}/cards/new`}
    className="text-blue-600 hover:underline"
  >
    Add Cards
  </Link>
</div>
```

## Data Flow

### Card Interface

```typescript
interface Card {
  id: string;
  front: string;
  back: string;
  reviews: Review[];
}

interface Review {
  dueDate: string;
}
```

### Session Stats

```typescript
const [stats, setStats] = useState({
  reviewed: 0,
  again: 0,
  good: 0
});
```

### Due Card Filtering

```typescript
// Filter cards that are due (new cards or past due date)
const now = new Date();
const due = cards.filter((card) => {
  const review = card.reviews[0];
  return !review || new Date(review.dueDate) <= now;
});
```

## Review Submission

```typescript
const handleRate = async (rating: "again" | "hard" | "good" | "easy") => {
  await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cardId: currentCard.id,
      quality: qualityMap[rating],
    }),
  });

  // Update stats and move to next card
};
```

## Server-Side Data Loading

```typescript
// Study page loads data server-side
const session = await auth();
const deck = await db.deck.findByIdAndUserId(d1, id, session.user.id);
const cards = await db.card.findByDeckId(d1, id);

// Get reviews for each card
const cardsWithReviews = await Promise.all(
  cards.map(async (card) => {
    const review = await db.review.findByCardAndUser(d1, card.id, session.user.id);
    return { ...card, reviews: review ? [review] : [] };
  })
);
```

## Code Example

```tsx
// Server Component (page.tsx)
import { auth } from "@/lib/auth";
import { getD1Async, db } from "@/lib/d1";
import { redirect } from "next/navigation";
import Link from "next/link";
import StudySession from "@/components/StudySession";

export default async function StudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    redirect("/login");
  }

  const d1 = await getD1Async();
  const deck = await db.deck.findByIdAndUserId(d1, id, session.user.id);

  if (!deck) {
    redirect("/dashboard");
  }

  const cards = await db.card.findByDeckId(d1, id);

  // ... get reviews

  return (
    <div>
      <Link
        href={`/dashboard/decks/${id}`}
        className="text-blue-600 hover:underline text-sm mb-6 inline-block"
      >
        &larr; Back to {deck.name}
      </Link>

      <StudySession
        deckId={deck.id}
        deckName={deck.name}
        cards={cardsWithReviews}
      />
    </div>
  );
}
```
