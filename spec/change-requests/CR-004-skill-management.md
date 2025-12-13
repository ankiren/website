---
title: "CR-004: Skill Management Module"
status: Draft
created: 2025-12-13
author: "Product Team"
affected_story: None (New Feature)
decision: Pending
decided_by: ""
decided_date: ""
---

# CR-004: Skill Management Module

## Affected User Stories

**This is a new feature addition.** No existing user stories are affected.

### New Epic

- **Epic 6: Skill Management** - NEW

> Link: [Epic 6](../stories/epic-6-skill-management/EPIC.md)

---

## Reason for Change

**New Feature Request**: Add skill management module for tracking personal development.

Key motivations:
- Allow users to define, organize, and track skills they want to learn
- Track progress and proficiency levels for each skill
- Set learning goals and milestones
- Complement existing flashcard learning with skill tracking

---

## Proposed Changes

### Epic 6: Skill Management

```gherkin
Feature: Skill Management Module
  As a learner
  I want to track skills I'm developing
  So that I can monitor my progress and stay motivated

  Scenario: Add a new skill to track
    Given I am a logged-in user
    When I add a new skill "JavaScript"
    And I select category "Programming"
    And I set my target proficiency level to "Advanced"
    Then the skill is added to my skill list
    And my current proficiency defaults to "Beginner"

  Scenario: Update skill proficiency
    Given I have a skill "JavaScript" in my list
    When I log a learning activity
    And I update my proficiency to "Intermediate"
    Then my skill progress is updated
    And I can see my progress history

  Scenario: Organize skills by category
    Given I have multiple skills in my list
    When I view my skills dashboard
    Then I see skills grouped by category
    And I can filter by category
    And I can see progress summary per category

  Scenario: Set learning goals
    Given I have a skill "JavaScript" in my list
    When I set a goal "Complete 3 projects"
    And I set a target date
    Then the goal is attached to my skill
    And I receive reminders as the date approaches

  Scenario: Track learning activities
    Given I have a skill "JavaScript" in my list
    When I log a learning activity
    And I enter details (type, duration, notes)
    Then the activity is recorded
    And my total learning time is updated
```

---

## New Feature Scope

### Core Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Skill CRUD | Add, edit, delete skills | Critical |
| Categories | Organize skills by categories | Critical |
| Proficiency Levels | Track Beginner → Advanced progression | Critical |
| Learning Activities | Log learning sessions with time tracking | High |
| Goals & Milestones | Set and track learning goals | High |
| Progress Dashboard | Visualize skill progress over time | High |
| Category Management | Create custom categories | Medium |
| Activity History | View past learning activities | Medium |
| Progress Analytics | Charts and statistics | Low |

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

---

## Impact Analysis

### Scope of Change
- [ ] Acceptance Criteria changes (existing)
- [ ] Technical Notes changes (existing)
- [ ] RICE Score changes (existing)
- [x] New feature addition

### Implementation Impact
- [x] Requires new code
- [ ] Affects other User Stories
- [x] Database migration needed (new tables)
- [x] API changes (new endpoints)
- [x] UI/UX changes (new pages)

### Reusable Components

| Component | Notes |
|-----------|-------|
| Google OAuth | Authentication for skill pages |
| User table schema | Link skills to users |
| NextAuth.js setup | Session management |
| UI components | Design system primitives |
| Dashboard layout | Base layout for skill pages |

### New Components Required

| Component | Purpose |
|-----------|---------|
| Skill table | Store user skills |
| Category table | Organize skills |
| LearningActivity table | Track learning sessions |
| Goal table | Track skill goals |
| LevelHistory table | Track proficiency changes |
| SkillCard component | Display skill with progress |
| ActivityLogger component | Log learning activities |
| ProgressChart component | Visualize progress |
| Skills dashboard page | Main skill management UI |

---

## New Database Schema

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

---

## API Endpoints

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
| DELETE | `/api/goals/:id` | Delete goal |
| GET | `/api/dashboard/stats` | Dashboard statistics |

---

## RICE Score

| Factor | Value | Rationale |
|--------|-------|-----------|
| Reach | 50% | Broad appeal for personal development users |
| Impact | 2 | Significant - track and improve skills |
| Confidence | 80% | Straightforward implementation |
| Effort | 6w | New feature, moderate complexity |

**Score:** (50 × 2 × 0.8) / 6 = **13.3**

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| User adoption | Medium | Medium | Clear onboarding, preset categories |
| Feature creep | Medium | Medium | Strict MVP scope, phased rollout |
| Data migration | Low | Low | Clean migration, no legacy data |
| UX complexity | Medium | Low | Simple, intuitive interface |

---

## Recommended Approach

### Phase 1: Core Skill Management
- Skill CRUD operations
- Default categories (Programming, Design, Business, etc.)
- Basic proficiency level tracking
- Skills dashboard

### Phase 2: Activity Tracking
- Log learning activities
- Time tracking per skill
- Activity history view
- Total time statistics

### Phase 3: Goals & Analytics
- Goal creation and tracking
- Progress visualization (charts)
- Category-based analytics
- Achievement milestones

---

## Decision Notes

[Pending review and approval]

Key questions for decision:
1. Define default categories list
2. Determine proficiency level criteria
3. Decide on analytics/visualization scope
4. Integration with existing dashboard navigation

---

## Implementation

| Field | Value |
|-------|-------|
| Implemented by | [Pending] |
| Date | [Pending] |
| Related PR/Commit | [Pending] |
