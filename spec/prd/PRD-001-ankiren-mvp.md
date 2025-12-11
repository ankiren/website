# PRD-001: Ankiren MVP - Flashcard Learning Application

**Version:** 0.1.0
**Status:** Done
**Last Updated:** 2025-12-11

---

## 1. Problem Statement

Students and lifelong learners struggle to retain information effectively. Traditional study methods like re-reading or cramming are inefficient and lead to poor long-term retention. Users need a scientifically-proven method to memorize information with minimal time investment.

**Pain Points:**
- Forgetting learned material quickly
- Inefficient study time allocation
- No clear guidance on when to review
- Lack of progress tracking

---

## 2. Proposed Solution

**Ankiren** is a web-based flashcard application implementing the **SM-2 (SuperMemo 2) spaced repetition algorithm**. The system automatically schedules reviews at optimal intervals, maximizing retention while minimizing study time.

### Core Value Proposition
- **Efficient Learning**: Review cards only when you're about to forget them
- **Simple Interface**: Focus on learning, not managing
- **Accessible**: Web-based, works on any device
- **Free**: Deployed on Cloudflare free tier

---

## 3. User Stories Summary

| Epic | Name | Status |
|------|------|--------|
| EPIC-1 | User Authentication | Done |
| EPIC-2 | Deck Management | Done |
| EPIC-3 | Card Management | Done |
| EPIC-4 | Study Session | Done |

See `/spec/stories/` for detailed user stories.

---

## 4. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| User Registration | 100 users | D1 User count |
| Daily Active Users | 20% of registered | Login frequency |
| Cards Created | 10+ per user | D1 Card count |
| Study Session Completion | 80% | Reviews submitted vs. cards due |
| User Retention (7-day) | 40% | Return users |

---

## 5. Technical Architecture

### Tech Stack
| Layer | Technology |
|-------|------------|
| Framework | Next.js 15.5.7 (App Router) |
| Language | TypeScript 5 |
| UI | React 18.3.1, Tailwind CSS 4 |
| Authentication | NextAuth.js 5.0.0-beta.30 (JWT) |
| Database | Cloudflare D1 (SQLite) |
| Deployment | Cloudflare Workers, OpenNext |

### Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # REST API endpoints
│   │   ├── auth/          # NextAuth handler
│   │   ├── cards/         # Card CRUD
│   │   ├── decks/         # Deck CRUD
│   │   ├── register/      # User registration
│   │   └── reviews/       # SM-2 review recording
│   ├── dashboard/         # Protected pages
│   ├── login/             # Login page
│   └── register/          # Registration page
├── components/            # React components
│   ├── ui/               # Base UI (Button, Input, Card)
│   ├── Navbar.tsx
│   ├── FlashCard.tsx     # 3D flip animation
│   ├── DeckCard.tsx
│   ├── StudySession.tsx
│   └── Providers.tsx
├── lib/                   # Utilities
│   ├── auth.ts           # NextAuth config
│   ├── d1.ts             # D1 database wrapper
│   └── sm2.ts            # SM-2 algorithm
└── types/                 # TypeScript definitions
```

### Database Models
```
User (1) ──→ (N) Deck (1) ──→ (N) Card (1) ──→ (N) Review
User (1) ──────────────────────────────────→ (N) Review
```

---

## 6. Out of Scope (MVP)

The following features are **NOT** included in MVP:

- **Import/Export**: Anki .apkg file support
- **Shared Decks**: Public deck marketplace
- **Rich Media**: Images, audio in cards
- **Mobile App**: Native iOS/Android apps
- **Offline Mode**: PWA with sync
- **AI Features**: Auto-generated cards
- **Social Features**: Following, sharing
- **Analytics Dashboard**: Detailed learning stats
- **Multiple Languages**: i18n support

---

## 7. Environments

| Environment | URL | Purpose |
|-------------|-----|---------|
| Production | https://ankiren.com | Live users |
| Staging | https://staging.ankiren.com | Pre-release testing |
| UAT | https://uat.ankiren.com | User acceptance testing |

---

## 8. Timeline

| Milestone | Status |
|-----------|--------|
| Project Setup | Done |
| User Authentication | Done |
| Deck Management | Done |
| Card Management | Done |
| Study Session with SM-2 | Done |
| Cloudflare Deployment | Done |
| Multi-environment Setup | Done |
| **MVP Release** | **Done** |
