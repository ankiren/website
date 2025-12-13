# FlashCard Component

**Location:** `src/components/FlashCard.tsx`

## Overview

A 3D flip card component used in study sessions. Features a click-to-flip animation using CSS 3D transforms, displaying different content on front and back faces.

## Props

```typescript
interface FlashCardProps {
  front: string;
  back: string;
  flipped: boolean;
  onFlip: () => void;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `front` | `string` | Content displayed on the front face |
| `back` | `string` | Content displayed on the back face |
| `flipped` | `boolean` | Current flip state |
| `onFlip` | `() => void` | Callback when card is clicked |

## Structure

### Front (Unflipped)

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│                                                          │
│                    [Front Content]                       │
│                                                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
                "Click to reveal answer"
```

### Back (Flipped)

```
┌─────────────────────────────────────────────────────────┐
│               (light blue background)                    │
│                                                          │
│                    [Back Content]                        │
│                                                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Styles

### Container
```css
relative
w-full
max-w-2xl
h-80
cursor-pointer
```

### Card Wrapper
```css
relative
w-full
h-full
transition-transform
duration-500
```

Inline styles:
```css
transform-style: preserve-3d;
transform: rotateY(0deg);  /* or rotateY(180deg) when flipped */
```

### Card Face (Both)
```css
absolute
w-full
h-full
rounded-2xl
shadow-lg
flex
items-center
justify-center
p-8
```

Inline styles:
```css
backface-visibility: hidden;
```

### Front Face
```css
bg-white
```

### Back Face
```css
bg-blue-50
```

Inline styles:
```css
transform: rotateY(180deg);
```

### Content Text
```css
text-2xl
text-gray-900
text-center
```

### Hint Text
```css
text-center
text-gray-500
mt-4
text-sm
```

## 3D Flip Animation

The flip animation uses CSS 3D transforms:

1. **Perspective**: Applied to container (`perspective-1000`)
2. **Transform Style**: `preserve-3d` enables 3D space
3. **Backface Visibility**: `hidden` prevents showing reverse side
4. **Rotation**: `rotateY(180deg)` flips the card
5. **Transition**: `duration-500` (500ms) for smooth animation

```css
/* Container */
.card-container {
  perspective: 1000px;
}

/* Wrapper */
.card-wrapper {
  transform-style: preserve-3d;
  transition: transform 500ms;
}

.card-wrapper.flipped {
  transform: rotateY(180deg);
}

/* Faces */
.card-face {
  backface-visibility: hidden;
}

.card-back {
  transform: rotateY(180deg);
}
```

## Usage Examples

### Basic Usage

```tsx
import FlashCard from "@/components/FlashCard";

const [flipped, setFlipped] = useState(false);

<FlashCard
  front="What is the capital of France?"
  back="Paris"
  flipped={flipped}
  onFlip={() => setFlipped(!flipped)}
/>
```

### In Study Session

```tsx
<FlashCard
  front={currentCard.front}
  back={currentCard.back}
  flipped={flipped}
  onFlip={() => setFlipped(!flipped)}
/>
```

### Reset on Card Change

```tsx
// Reset flip state when moving to next card
if (currentIndex + 1 < dueCards.length) {
  setCurrentIndex((prev) => prev + 1);
  setFlipped(false);  // Reset to show front
}
```

## States

### Unflipped State
- Shows front content
- Displays hint text "Click to reveal answer"
- White background

### Flipped State
- Shows back content
- No hint text
- Light blue background (`bg-blue-50`)

## Interactions

### Click to Flip
Entire card is clickable:

```tsx
<div onClick={onFlip}>
  {/* Card content */}
</div>
```

### Keyboard Support
Currently click-only. Consider adding:
- Space/Enter to flip
- Arrow keys for navigation (in StudySession)

## Source Code

```tsx
"use client";

import { useState } from "react";

interface FlashCardProps {
  front: string;
  back: string;
  flipped: boolean;
  onFlip: () => void;
}

export default function FlashCard({ front, back, flipped, onFlip }: FlashCardProps) {
  return (
    <div
      className="relative w-full max-w-2xl h-80 cursor-pointer perspective-1000"
      onClick={onFlip}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front of card */}
        <div
          className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-lg flex items-center justify-center p-8"
          style={{ backfaceVisibility: "hidden" }}
        >
          <p className="text-2xl text-gray-900 text-center">{front}</p>
        </div>

        {/* Back of card */}
        <div
          className="absolute w-full h-full backface-hidden bg-blue-50 rounded-2xl shadow-lg flex items-center justify-center p-8"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <p className="text-2xl text-gray-900 text-center">{back}</p>
        </div>
      </div>

      {!flipped && (
        <p className="text-center text-gray-500 mt-4 text-sm">
          Click to reveal answer
        </p>
      )}
    </div>
  );
}
```

## Related Components

- **StudySession** - Parent component that manages card state and navigation
- **Button** - Rating buttons shown after flip
