# Ankiren Product Specifications

This folder contains all product documentation for the Ankiren flashcard application.

---

## Folder Structure

```
spec/
├── README.md                 # This file
├── prd/                      # Product Requirements Documents
│   └── PRD-001-ankiren-mvp.md
├── stories/                  # User Stories by Epic
│   ├── epic-1-user-authentication/
│   │   ├── EPIC.md
│   │   ├── US-1-1.md        # User Registration
│   │   ├── US-1-2.md        # User Login
│   │   └── US-1-3.md        # User Logout
│   ├── epic-2-deck-management/
│   │   ├── EPIC.md
│   │   ├── US-2-1.md        # Create Deck
│   │   ├── US-2-2.md        # View Deck List
│   │   ├── US-2-3.md        # View Deck Details
│   │   ├── US-2-4.md        # Edit Deck
│   │   └── US-2-5.md        # Delete Deck
│   ├── epic-3-card-management/
│   │   ├── EPIC.md
│   │   ├── US-3-1.md        # Create Card
│   │   ├── US-3-2.md        # Edit Card
│   │   └── US-3-3.md        # Delete Card
│   └── epic-4-study-session/
│       ├── EPIC.md
│       ├── US-4-1.md        # Start Study Session
│       ├── US-4-2.md        # Flip Card Animation
│       ├── US-4-3.md        # Rate Card Recall
│       └── US-4-4.md        # Session Completion
├── change-requests/          # Change Requests for User Stories
│   ├── INDEX.md             # CR tracking table
│   └── CR-TEMPLATE.md       # Template for new CRs
├── roadmap/                  # Roadmap & Planning
│   └── ROADMAP.md
└── research/                 # User Research & Analysis
    └── (empty)
```

---

## Quick Links

### PRDs
- [PRD-001: Ankiren MVP](prd/PRD-001-ankiren-mvp.md)

### Epics
| Epic | Name | Stories | Status |
|------|------|---------|--------|
| [EPIC-1](stories/epic-1-user-authentication/EPIC.md) | User Authentication | 3 | Done |
| [EPIC-2](stories/epic-2-deck-management/EPIC.md) | Deck Management | 5 | Done |
| [EPIC-3](stories/epic-3-card-management/EPIC.md) | Card Management | 3 | Done |
| [EPIC-4](stories/epic-4-study-session/EPIC.md) | Study Session | 4 | Done |

### Roadmap
- [Product Roadmap](roadmap/ROADMAP.md)

### Change Requests
- [CR Index](change-requests/INDEX.md)
- [CR Template](change-requests/CR-TEMPLATE.md)

---

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| PRD | `PRD-NNN-name.md` | `PRD-001-ankiren-mvp.md` |
| Epic folder | `epic-N-name/` | `epic-1-user-authentication/` |
| Epic overview | `EPIC.md` | `EPIC.md` |
| User story | `US-N-X.md` | `US-1-1.md` |
| Change Request | `CR-NNN-name.md` | `CR-001-add-email-verification.md` |

---

## Document Templates

See [product-aio skill instructions](../.claude/skills/product-aio/instructions.md) for templates:
- EPIC.md template
- User Story (US-N-X.md) template
- PRD structure
- RICE scoring framework
