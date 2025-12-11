# Epic 2: Deck Management

**ID:** EPIC-2
**Status:** Done
**Description:** Enable users to organize flashcards into themed collections (decks).

---

## Overview

Decks are the primary organizational unit for flashcards. Users create decks to group related cards (e.g., "Japanese Vocabulary", "Biology Chapter 5"). Each user can have multiple decks with full CRUD operations.

---

## User Stories

| ID | Name | Status | Priority | File |
|----|------|--------|----------|------|
| US-2.1 | Create Deck | Done | Critical | [US-2-1.md](US-2-1.md) |
| US-2.2 | View Deck List | Done | Critical | [US-2-2.md](US-2-2.md) |
| US-2.3 | View Deck Details | Done | High | [US-2-3.md](US-2-3.md) |
| US-2.4 | Edit Deck | Done | Medium | [US-2-4.md](US-2-4.md) |
| US-2.5 | Delete Deck | Done | Medium | [US-2-5.md](US-2-5.md) |

---

## Technical Implementation

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/decks` | List user's decks with stats |
| POST | `/api/decks` | Create new deck |
| GET | `/api/decks/[id]` | Get deck with cards |
| PUT | `/api/decks/[id]` | Update deck |
| DELETE | `/api/decks/[id]` | Delete deck and cards |

### Database Model
```sql
Deck
├── id          TEXT (PK, CUID)
├── name        TEXT (required)
├── description TEXT (optional)
├── userId      TEXT (FK → User)
├── createdAt   TEXT (ISO timestamp)
└── updatedAt   TEXT (ISO timestamp)
```

### Files
- `src/app/api/decks/route.ts` - List/Create
- `src/app/api/decks/[id]/route.ts` - Get/Update/Delete
- `src/app/dashboard/page.tsx` - Deck list view
- `src/app/dashboard/decks/new/page.tsx` - Create form
- `src/app/dashboard/decks/[id]/page.tsx` - Deck details
- `src/components/DeckCard.tsx` - Deck preview component

---

## RICE Score Summary

| Story | Reach | Impact | Confidence | Effort | Score |
|-------|-------|--------|------------|--------|-------|
| US-2.1 | 100% | 3 | 100% | 0.5w | 600 |
| US-2.2 | 100% | 3 | 100% | 0.5w | 600 |
| US-2.3 | 100% | 2 | 100% | 0.5w | 400 |
| US-2.4 | 50% | 1 | 100% | 0.25w | 200 |
| US-2.5 | 30% | 1 | 100% | 0.25w | 120 |

**Average Score:** 384
