# Epic 4: Study Session

**ID:** EPIC-4
**Status:** Done
**Description:** Enable users to study flashcards using the SM-2 spaced repetition algorithm.

---

## Overview

The study session is the core learning experience. Users review cards with a flip animation, rate their recall quality, and the SM-2 algorithm schedules the next review. This scientifically-proven method optimizes long-term retention.

---

## User Stories

| ID | Name | Status | Priority | File |
|----|------|--------|----------|------|
| US-4.1 | Start Study Session | Done | Critical | [US-4-1.md](US-4-1.md) |
| US-4.2 | Flip Card Animation | Done | High | [US-4-2.md](US-4-2.md) |
| US-4.3 | Rate Card Recall | Done | Critical | [US-4-3.md](US-4-3.md) |
| US-4.4 | Session Completion | Done | High | [US-4-4.md](US-4-4.md) |

---

## Technical Implementation

### SM-2 Algorithm
```
Quality Rating Scale:
  0 = Complete blackout (Again)
  2 = Incorrect, easy to recall (Hard)
  4 = Correct with hesitation (Good)
  5 = Perfect response (Easy)

Interval Calculation:
  if quality < 3: reset to 1 day
  if repetitions = 1: interval = 1 day
  if repetitions = 2: interval = 6 days
  else: interval = prev_interval × ease_factor

Ease Factor Update:
  EF' = EF + (0.1 - (5-q) × (0.08 + (5-q) × 0.02))
  EF' = max(1.3, EF')
```

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews` | Record review result |

### Database Model
```sql
Review
├── id             TEXT (PK, CUID)
├── easeFactor     REAL (default 2.5)
├── interval       INTEGER (days, default 0)
├── repetitions    INTEGER (count, default 0)
├── dueDate        TEXT (next review date)
├── lastReviewDate TEXT (timestamp)
├── cardId         TEXT (FK → Card)
├── userId         TEXT (FK → User)
└── UNIQUE(cardId, userId)
```

### Files
- `src/lib/sm2.ts` - SM-2 algorithm
- `src/app/api/reviews/route.ts` - Review recording
- `src/app/dashboard/decks/[id]/study/page.tsx` - Study page
- `src/components/StudySession.tsx` - Session controller
- `src/components/FlashCard.tsx` - 3D flip card

---

## RICE Score Summary

| Story | Reach | Impact | Confidence | Effort | Score |
|-------|-------|--------|------------|--------|-------|
| US-4.1 | 100% | 3 | 100% | 0.5w | 600 |
| US-4.2 | 100% | 2 | 100% | 0.5w | 400 |
| US-4.3 | 100% | 3 | 100% | 1w | 300 |
| US-4.4 | 100% | 2 | 100% | 0.25w | 800 |

**Average Score:** 525
