# Epic 1: User Authentication

**ID:** EPIC-1
**Status:** Done
**Description:** Enable users to create accounts and securely access their flashcard data.

---

## Overview

Users need to register and login to save their decks, cards, and review progress. Authentication ensures data privacy and enables personalized learning experience.

---

## User Stories

| ID | Name | Status | Priority | File |
|----|------|--------|----------|------|
| US-1.1 | User Registration | Done | Critical | [US-1-1.md](US-1-1.md) |
| US-1.2 | User Login | Done | Critical | [US-1-2.md](US-1-2.md) |
| US-1.3 | User Logout | Done | High | [US-1-3.md](US-1-3.md) |

---

## Technical Implementation

- **Provider**: NextAuth.js v5 (Credentials)
- **Session**: JWT-based (stateless)
- **Password**: bcrypt hashing (10 rounds)
- **Storage**: HTTP-only cookies

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Create new user |
| POST | `/api/auth/callback/credentials` | Login |
| POST | `/api/auth/signout` | Logout |

### Files
- `src/lib/auth.ts` - NextAuth configuration
- `src/app/api/auth/[...nextauth]/route.ts` - Auth handler
- `src/app/api/register/route.ts` - Registration endpoint
- `src/app/login/page.tsx` - Login page
- `src/app/register/page.tsx` - Registration page

---

## RICE Score Summary

| Story | Reach | Impact | Confidence | Effort | Score |
|-------|-------|--------|------------|--------|-------|
| US-1.1 | 100% | 3 | 100% | 1w | 300 |
| US-1.2 | 100% | 3 | 100% | 0.5w | 600 |
| US-1.3 | 100% | 2 | 100% | 0.25w | 800 |

**Average Score:** 567
