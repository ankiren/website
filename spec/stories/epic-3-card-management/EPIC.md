# Epic 3: Card Management

**ID:** EPIC-3
**Status:** Done
**Description:** Enable users to create, edit, and delete flashcards within decks.

---

## Overview

Cards are the fundamental learning units. Each card has a "front" (question) and "back" (answer). Users interact with cards during study sessions, and the system tracks review history for each card.

---

## User Stories

| ID | Name | Status | Priority | File |
|----|------|--------|----------|------|
| US-3.1 | Create Card | Done | Critical | [US-3-1.md](US-3-1.md) |
| US-3.2 | Edit Card | Done | High | [US-3-2.md](US-3-2.md) |
| US-3.3 | Delete Card | Done | Medium | [US-3-3.md](US-3-3.md) |

---

## Technical Implementation

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/cards` | Create new card |
| GET | `/api/cards/[id]` | Get card details |
| PUT | `/api/cards/[id]` | Update card |
| DELETE | `/api/cards/[id]` | Delete card |

### Database Model
```sql
Card
├── id        TEXT (PK, CUID)
├── front     TEXT (question, required)
├── back      TEXT (answer, required)
├── deckId    TEXT (FK → Deck)
├── createdAt TEXT (ISO timestamp)
└── updatedAt TEXT (ISO timestamp)
```

### Files
- `src/app/api/cards/route.ts` - Create
- `src/app/api/cards/[id]/route.ts` - Get/Update/Delete
- `src/app/dashboard/decks/[id]/cards/new/page.tsx` - Create form
- `src/app/dashboard/cards/[id]/edit/page.tsx` - Edit form
- `src/components/FlashCard.tsx` - Card display component

---

## RICE Score Summary

| Story | Reach | Impact | Confidence | Effort | Score |
|-------|-------|--------|------------|--------|-------|
| US-3.1 | 100% | 3 | 100% | 0.5w | 600 |
| US-3.2 | 60% | 2 | 100% | 0.5w | 240 |
| US-3.3 | 40% | 1 | 100% | 0.25w | 160 |

**Average Score:** 333
