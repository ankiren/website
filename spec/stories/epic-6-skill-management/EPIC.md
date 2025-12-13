# Epic 6: Skill Management

**ID:** EPIC-6
**Status:** Planned
**Description:** Enable users to track skills they are developing with progress monitoring and learning activity logging.

---

## Overview

Skill Management module allows users to define, organize, and track skills they want to learn. Users can track progress and proficiency levels, set learning goals and milestones, and log learning activities. This complements the existing flashcard learning system with comprehensive skill tracking.

### Goals
- Allow users to define, organize, and track skills they want to learn
- Track progress and proficiency levels for each skill
- Set learning goals and milestones
- Complement existing flashcard learning with skill tracking

### Scope
- **In Scope:** Skill CRUD, categories, proficiency levels, learning activities, goals, progress dashboard
- **Out of Scope:** AI-powered skill recommendations, integration with external learning platforms, certifications

---

## User Stories

| ID | Name | Status | Priority | File |
|----|------|--------|----------|------|
| US-6.1 | Skill CRUD | Planned | Critical | [US-6-1.md](US-6-1.md) |
| US-6.2 | Skill Categories | Planned | Critical | [US-6-2.md](US-6-2.md) |
| US-6.3 | Proficiency Levels | Planned | Critical | [US-6-3.md](US-6-3.md) |
| US-6.4 | Learning Activities | Planned | High | [US-6-4.md](US-6-4.md) |
| US-6.5 | Goals & Milestones | Planned | High | [US-6-5.md](US-6-5.md) |
| US-6.6 | Progress Dashboard | Planned | High | [US-6-6.md](US-6-6.md) |
| US-6.7 | Category Management | Planned | Medium | [US-6-7.md](US-6-7.md) |
| US-6.8 | Progress Analytics | Planned | Low | [US-6-8.md](US-6-8.md) |

---

## Technical Implementation

- **Framework**: Next.js App Router
- **Database**: Cloudflare D1 (SQLite)
- **UI**: React components with existing design system

### Database Schema

```sql
CREATE TABLE Category (
  id TEXT PRIMARY KEY,
  userId TEXT REFERENCES User(id),
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  icon TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(userId, name)
);

CREATE TABLE Skill (
  id TEXT PRIMARY KEY,
  userId TEXT REFERENCES User(id),
  categoryId TEXT REFERENCES Category(id),
  name TEXT NOT NULL,
  description TEXT,
  currentLevel TEXT DEFAULT 'beginner',
  targetLevel TEXT DEFAULT 'advanced',
  totalMinutes INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE LearningActivity (
  id TEXT PRIMARY KEY,
  skillId TEXT REFERENCES Skill(id),
  userId TEXT REFERENCES User(id),
  activityType TEXT NOT NULL,
  title TEXT,
  notes TEXT,
  durationMinutes INTEGER NOT NULL,
  activityDate DATE DEFAULT CURRENT_DATE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Goal (
  id TEXT PRIMARY KEY,
  skillId TEXT REFERENCES Skill(id),
  userId TEXT REFERENCES User(id),
  title TEXT NOT NULL,
  description TEXT,
  targetDate DATE,
  isCompleted BOOLEAN DEFAULT FALSE,
  completedAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE LevelHistory (
  id TEXT PRIMARY KEY,
  skillId TEXT REFERENCES Skill(id),
  fromLevel TEXT,
  toLevel TEXT NOT NULL,
  changedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/skills` | List user's skills |
| POST | `/api/skills` | Create new skill |
| PUT | `/api/skills/:id` | Update skill |
| DELETE | `/api/skills/:id` | Delete skill |
| GET | `/api/categories` | List user's categories |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |
| GET | `/api/skills/:id/activities` | List skill activities |
| POST | `/api/activities` | Log learning activity |
| GET | `/api/skills/:id/goals` | List skill goals |
| POST | `/api/goals` | Create goal |
| PUT | `/api/goals/:id` | Update goal |
| GET | `/api/dashboard/stats` | Dashboard statistics |

### Proficiency Levels

| Level | Description |
|-------|-------------|
| Beginner | Just started learning |
| Elementary | Basic understanding |
| Intermediate | Can apply with guidance |
| Advanced | Can apply independently |
| Expert | Can teach others |

### Activity Types

| Type | Description |
|------|-------------|
| course | Online course or tutorial |
| practice | Hands-on practice |
| project | Real project work |
| reading | Books, articles, documentation |
| video | Video content |
| other | Other learning activity |

### Files (Proposed)

- `src/app/api/skills/route.ts` - Skill CRUD endpoints
- `src/app/api/categories/route.ts` - Category endpoints
- `src/app/api/activities/route.ts` - Activity logging endpoints
- `src/app/api/goals/route.ts` - Goal endpoints
- `src/app/dashboard/skills/page.tsx` - Skills dashboard
- `src/components/SkillCard.tsx` - Skill display component
- `src/components/ActivityLogger.tsx` - Activity logging form
- `src/components/ProgressChart.tsx` - Progress visualization

---

## RICE Score Summary

| Story | Reach | Impact | Confidence | Effort | Score |
|-------|-------|--------|------------|--------|-------|
| US-6.1 | 50% | 3 | 80% | 1w | 120.0 |
| US-6.2 | 50% | 2 | 80% | 0.5w | 160.0 |
| US-6.3 | 50% | 2 | 80% | 0.5w | 160.0 |
| US-6.4 | 50% | 2 | 80% | 1w | 80.0 |
| US-6.5 | 40% | 2 | 80% | 1w | 64.0 |
| US-6.6 | 50% | 2 | 80% | 1w | 80.0 |
| US-6.7 | 30% | 1 | 80% | 0.5w | 48.0 |
| US-6.8 | 30% | 1 | 80% | 0.5w | 48.0 |

**Epic Score:** (50 × 2 × 0.8) / 6 = **13.3**

---

## Related Documents

- [CR-004: Skill Management Module](../../change-requests/CR-004-skill-management.md)
