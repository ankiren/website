# StudySession Component

**Location:** `src/components/StudySession.tsx`

## Overview

The main study session controller that manages card progression, flip state, SM-2 rating submission, and session statistics. Displays cards one at a time with progress tracking.

## Props

```typescript
interface StudySessionProps {
  deckId: string;
  deckName: string;
  cards: Card[];
}

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

| Prop | Type | Description |
|------|------|-------------|
| `deckId` | `string` | ID of the deck being studied |
| `deckName` | `string` | Name of the deck (displayed in header) |
| `cards` | `Card[]` | Array of cards with their review history |

## Structure

### Active Study Session

```
┌─────────────────────────────────────────────────────────┐
│ Deck Name                                    3 / 10     │
│ [==================>                              ]     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│            ┌───────────────────────────────┐            │
│            │                               │            │
│            │         [FlashCard]           │            │
│            │                               │            │
│            └───────────────────────────────┘            │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│    [Again]    [Hard]    [Good]    [Easy]                │
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

## State Management

```typescript
const [dueCards, setDueCards] = useState<Card[]>([]);
const [currentIndex, setCurrentIndex] = useState(0);
const [flipped, setFlipped] = useState(false);
const [loading, setLoading] = useState(false);
const [completed, setCompleted] = useState(false);
const [stats, setStats] = useState({
  reviewed: 0,
  again: 0,
  good: 0
});
```

## Due Card Filtering

Cards are filtered on mount to show only due cards:

```typescript
useEffect(() => {
  const now = new Date();
  const due = cards.filter((card) => {
    const review = card.reviews[0];
    return !review || new Date(review.dueDate) <= now;
  });
  setDueCards(due);

  if (due.length === 0) {
    setCompleted(true);
  }
}, [cards]);
```

## Rating Buttons

| Button | Variant | Color Override | SM-2 Quality |
|--------|---------|----------------|--------------|
| Again | `danger` | - | 0 (reset) |
| Hard | `secondary` | - | 2 |
| Good | `primary` | - | 4 |
| Easy | `ghost` | `bg-green-100 hover:bg-green-200 text-green-700` | 5 |

```tsx
<div className="mt-8 flex gap-4">
  <Button variant="danger" onClick={() => handleRate("again")} className="min-w-24">
    Again
  </Button>
  <Button variant="secondary" onClick={() => handleRate("hard")} className="min-w-24">
    Hard
  </Button>
  <Button variant="primary" onClick={() => handleRate("good")} className="min-w-24">
    Good
  </Button>
  <Button
    variant="ghost"
    onClick={() => handleRate("easy")}
    className="min-w-24 bg-green-100 hover:bg-green-200 text-green-700"
  >
    Easy
  </Button>
</div>
```

## Review Submission

```typescript
const handleRate = async (rating: keyof typeof qualityMap) => {
  if (!currentCard || loading) return;

  setLoading(true);

  try {
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardId: currentCard.id,
        quality: qualityMap[rating],
      }),
    });

    // Update stats
    setStats((prev) => ({
      reviewed: prev.reviewed + 1,
      again: rating === "again" ? prev.again + 1 : prev.again,
      good: rating === "good" || rating === "easy" ? prev.good + 1 : prev.good,
    }));

    // Move to next card or complete
    if (currentIndex + 1 < dueCards.length) {
      setCurrentIndex((prev) => prev + 1);
      setFlipped(false);
    } else {
      setCompleted(true);
    }
  } catch (error) {
    console.error("Failed to save review:", error);
  } finally {
    setLoading(false);
  }
};
```

## Sections

### Progress Header

```tsx
<div className="w-full max-w-2xl mb-6">
  <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
    <span>{deckName}</span>
    <span>{currentIndex + 1} / {dueCards.length}</span>
  </div>
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className="bg-blue-600 h-2 rounded-full transition-all"
      style={{ width: `${((currentIndex + 1) / dueCards.length) * 100}%` }}
    />
  </div>
</div>
```

### Completion State

```tsx
if (completed) {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-600" ...>
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        {stats.reviewed === 0 ? "No Cards Due!" : "Session Complete!"}
      </h2>
      {stats.reviewed > 0 && (
        <p className="text-gray-600 mb-6">
          You reviewed {stats.reviewed} cards. {stats.good} correct,
          {stats.again} need more practice.
        </p>
      )}
      <div className="flex gap-4 justify-center">
        <Button onClick={() => router.push(`/dashboard/decks/${deckId}`)}>
          Back to Deck
        </Button>
        <Button variant="secondary" onClick={() => router.push("/dashboard")}>
          Dashboard
        </Button>
      </div>
    </div>
  );
}
```

### Loading State

```tsx
if (!currentCard) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-600">Loading...</div>
    </div>
  );
}
```

## Flow

1. **Filter due cards** on component mount
2. **Display first card** (front side)
3. **User clicks** to flip and see answer
4. **Rating buttons appear** after flip
5. **User rates** the card (Again/Hard/Good/Easy)
6. **Submit review** to API
7. **Move to next card** or show completion

```
┌─────────┐   click    ┌─────────┐   rate    ┌─────────┐
│  Front  │ ────────→  │  Back   │ ────────→ │  Next   │
│         │            │+ Buttons│           │  Card   │
└─────────┘            └─────────┘           └─────────┘
                                                  │
                                                  ↓
                                            ┌─────────┐
                                            │Complete │
                                            └─────────┘
```

## Components Used

- `FlashCard` - The 3D flip card
- `Button` - Rating and navigation buttons

## Related Files

- `src/lib/sm2.ts` - SM-2 algorithm and quality mapping
- `src/app/api/reviews/route.ts` - Review submission API
