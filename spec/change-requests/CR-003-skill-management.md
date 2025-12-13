---
title: "CR-003: Skill Management & Authorization Module"
status: Draft
created: 2025-12-13
author: "Product Team"
affected_story: None (New Feature)
decision: Pending
decided_by: ""
decided_date: ""
---

# CR-003: Skill Management & Authorization Module

## Affected User Stories

**This is a new feature addition.** No existing user stories are affected.

### New Epics

- **Epic 5: Authorization (Phân quyền)** - NEW
- **Epic 6: Skill Management** - NEW

---

## Reason for Change

**New Feature Request**: Add skill management and authorization modules.

Key motivations:

**Skill Management:**
- Allow users to define, organize, and track skills they want to learn
- Track progress and proficiency levels for each skill
- Set learning goals and milestones
- Complement existing flashcard learning with skill tracking

**Authorization (Phân quyền):**
- Role-based access control (RBAC) for multi-user scenarios
- Admin can manage users and system settings
- Support for team/organization skill tracking
- Granular permissions for different features

---

## Proposed Changes

### New Feature

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

```gherkin
Feature: Authorization Module (Phân quyền)
  As a system administrator
  I want to manage user roles and permissions
  So that I can control access to different features

  Scenario: Assign role to user
    Given I am logged in as an Admin
    When I navigate to User Management
    And I select a user
    And I assign the role "Manager"
    Then the user has Manager permissions
    And the user can access Manager features

  Scenario: Create custom role
    Given I am logged in as an Admin
    When I create a new role "Team Lead"
    And I assign permissions: view_team_skills, manage_team_goals
    Then the role "Team Lead" is created
    And it can be assigned to users

  Scenario: Access control based on role
    Given I am logged in as a "User" role
    When I try to access Admin settings
    Then I see "Access Denied" message
    And I am redirected to my dashboard

  Scenario: View team members' skills (Manager)
    Given I am logged in as a Manager
    And I have team members assigned
    When I view the Team Dashboard
    Then I can see all team members' skills
    And I can see their progress
    But I cannot edit their skills

  Scenario: Manage organization settings (Admin)
    Given I am logged in as an Admin
    When I access Organization Settings
    Then I can manage default categories
    And I can set proficiency level criteria
    And I can configure system-wide settings
```

---

## New Feature Scope

### Core Features - Skill Management

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

### Core Features - Authorization (Phân quyền)

| Feature | Description | Priority |
|---------|-------------|----------|
| Role Management | Create, edit, delete roles | Critical |
| User Role Assignment | Assign roles to users | Critical |
| Permission Management | Define granular permissions | Critical |
| Access Control | Restrict feature access by role | Critical |
| User Management | Admin can manage all users | High |
| Team Management | Organize users into teams | High |
| Team Dashboard | View team members' progress | Medium |
| Audit Log | Track permission changes | Medium |
| Organization Settings | System-wide configurations | Low |

### Proficiency Levels

| Level | Description |
|-------|-------------|
| Beginner | Just started learning |
| Elementary | Basic understanding |
| Intermediate | Can apply with guidance |
| Advanced | Can apply independently |
| Expert | Can teach others |

### Default Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| Admin | System administrator | All permissions |
| Manager | Team/department manager | View team, manage team goals, reports |
| User | Regular user | Own skills, activities, goals |
| Viewer | Read-only access | View only, no modifications |

### Permissions

| Permission | Description |
|------------|-------------|
| `manage_users` | Create, edit, delete users |
| `manage_roles` | Create, edit, delete roles |
| `assign_roles` | Assign roles to users |
| `manage_teams` | Create and manage teams |
| `view_team_skills` | View team members' skills |
| `manage_team_goals` | Set goals for team members |
| `manage_own_skills` | CRUD own skills |
| `manage_own_goals` | CRUD own goals |
| `log_activities` | Log learning activities |
| `view_reports` | Access analytics and reports |
| `manage_categories` | Create system-wide categories |
| `manage_settings` | Configure organization settings |

### New Epics

| Epic | Description | User Stories |
|------|-------------|--------------|
| Epic 5: Authorization | Roles, permissions, teams, access control | 5-7 stories |
| Epic 6: Skill Management | Skills, categories, activities, goals, progress | 6-8 stories |

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
| Google OAuth (US-1.4) | Authentication for new pages |
| User table schema | Link skills to users |
| NextAuth.js setup | Session management |
| UI components (Button, Input, Card) | Design system primitives |
| Cloudflare D1 infrastructure | Database layer |
| Dashboard layout | Base layout for skill pages |

### New Components Required

| Component | Purpose |
|-----------|---------|
| **Skill Management** | |
| Skill table | Store user skills |
| Category table | Organize skills |
| LearningActivity table | Track learning sessions |
| Goal table | Track skill goals |
| SkillCard component | Display skill with progress |
| ActivityLogger component | Log learning activities |
| Skills dashboard page | Main skill management UI |
| **Authorization** | |
| Role table | Define user roles |
| Permission table | Define permissions |
| RolePermission table | Map permissions to roles |
| UserRole table | Assign roles to users |
| Team table | Organize users into teams |
| TeamMember table | Map users to teams |
| AuditLog table | Track permission changes |
| RoleManager component | Manage roles UI |
| UserManager component | Manage users UI |
| TeamDashboard page | View team progress |
| Admin settings page | System configuration |

---

## New Database Schema (Proposed)

### Skill Management Tables

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
  currentLevel TEXT DEFAULT 'beginner', -- beginner, elementary, intermediate, advanced, expert
  targetLevel TEXT DEFAULT 'advanced',
  totalMinutes INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE LearningActivity (
  id TEXT PRIMARY KEY,
  skillId TEXT REFERENCES Skill(id),
  userId TEXT REFERENCES User(id),
  activityType TEXT NOT NULL, -- course, practice, project, reading, video, other
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

### Authorization Tables (Phân quyền)

```sql
CREATE TABLE Role (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  isSystem BOOLEAN DEFAULT FALSE, -- system roles cannot be deleted
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Permission (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE, -- e.g., 'manage_users', 'view_team_skills'
  name TEXT NOT NULL,
  description TEXT,
  module TEXT NOT NULL, -- 'user', 'skill', 'team', 'system'
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE RolePermission (
  id TEXT PRIMARY KEY,
  roleId TEXT REFERENCES Role(id) ON DELETE CASCADE,
  permissionId TEXT REFERENCES Permission(id) ON DELETE CASCADE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(roleId, permissionId)
);

CREATE TABLE UserRole (
  id TEXT PRIMARY KEY,
  userId TEXT REFERENCES User(id) ON DELETE CASCADE,
  roleId TEXT REFERENCES Role(id) ON DELETE CASCADE,
  assignedBy TEXT REFERENCES User(id),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(userId, roleId)
);

CREATE TABLE Team (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  managerId TEXT REFERENCES User(id),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE TeamMember (
  id TEXT PRIMARY KEY,
  teamId TEXT REFERENCES Team(id) ON DELETE CASCADE,
  userId TEXT REFERENCES User(id) ON DELETE CASCADE,
  joinedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(teamId, userId)
);

CREATE TABLE AuditLog (
  id TEXT PRIMARY KEY,
  userId TEXT REFERENCES User(id),
  action TEXT NOT NULL, -- 'role_assigned', 'permission_changed', 'user_created', etc.
  targetType TEXT, -- 'user', 'role', 'team'
  targetId TEXT,
  details TEXT, -- JSON with additional details
  ipAddress TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints (Proposed)

### Skill Management APIs

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

### Authorization APIs (Phân quyền)

| Method | Endpoint | Description | Required Permission |
|--------|----------|-------------|---------------------|
| GET | `/api/roles` | List all roles | `manage_roles` |
| POST | `/api/roles` | Create new role | `manage_roles` |
| PUT | `/api/roles/:id` | Update role | `manage_roles` |
| DELETE | `/api/roles/:id` | Delete role | `manage_roles` |
| GET | `/api/roles/:id/permissions` | Get role permissions | `manage_roles` |
| PUT | `/api/roles/:id/permissions` | Update role permissions | `manage_roles` |
| GET | `/api/permissions` | List all permissions | `manage_roles` |
| GET | `/api/users` | List all users | `manage_users` |
| GET | `/api/users/:id` | Get user details | `manage_users` |
| PUT | `/api/users/:id` | Update user | `manage_users` |
| DELETE | `/api/users/:id` | Delete user | `manage_users` |
| GET | `/api/users/:id/roles` | Get user roles | `manage_users` |
| POST | `/api/users/:id/roles` | Assign role to user | `assign_roles` |
| DELETE | `/api/users/:id/roles/:roleId` | Remove role from user | `assign_roles` |
| GET | `/api/teams` | List all teams | `manage_teams` |
| POST | `/api/teams` | Create team | `manage_teams` |
| PUT | `/api/teams/:id` | Update team | `manage_teams` |
| DELETE | `/api/teams/:id` | Delete team | `manage_teams` |
| GET | `/api/teams/:id/members` | List team members | `view_team_skills` |
| POST | `/api/teams/:id/members` | Add team member | `manage_teams` |
| DELETE | `/api/teams/:id/members/:userId` | Remove team member | `manage_teams` |
| GET | `/api/teams/:id/skills` | View team skills | `view_team_skills` |
| GET | `/api/audit-logs` | List audit logs | `manage_settings` |
| GET | `/api/me/permissions` | Get current user permissions | (authenticated) |

---

## RICE Score

### Epic 5: Authorization (Phân quyền)

| Factor | Value | Rationale |
|--------|-------|-----------|
| Reach | 30% | Required for team/enterprise users |
| Impact | 3 | Critical for multi-user scenarios |
| Confidence | 80% | Standard RBAC patterns |
| Effort | 5w | Moderate complexity |

**Score:** (30 × 3 × 0.8) / 5 = **14.4**

### Epic 6: Skill Management

| Factor | Value | Rationale |
|--------|-------|-----------|
| Reach | 50% | Broad appeal for personal development users |
| Impact | 2 | Significant - track and improve skills |
| Confidence | 80% | Straightforward implementation |
| Effort | 6w | New feature, moderate complexity |

**Score:** (50 × 2 × 0.8) / 6 = **13.3**

### Combined

**Total Effort:** 11 weeks

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| User adoption | Medium | Medium | Clear onboarding, preset categories |
| Feature creep | Medium | Medium | Strict MVP scope, phased rollout |
| Data migration | Low | Low | Clean migration, no legacy data |
| UX complexity | Medium | Low | Simple, intuitive interface |
| Permission complexity | Medium | Medium | Use standard RBAC, clear documentation |
| Security vulnerabilities | High | Low | Follow OWASP guidelines, code review |
| Role management overhead | Medium | Low | Default roles, simple UI |

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

### Phase 4: Basic Authorization
- Default roles (Admin, User)
- Role assignment to users
- Permission-based access control
- User management (Admin)

### Phase 5: Team Management
- Team creation and management
- Team member assignment
- Team dashboard (view team skills)
- Manager role permissions

### Phase 6: Advanced Authorization
- Custom role creation
- Granular permission management
- Audit logging
- Organization settings

---

## Decision Notes

[Pending review and approval]

Key questions for decision:

**Skill Management:**
1. Define default categories list
2. Determine proficiency level criteria
3. Decide on analytics/visualization scope
4. Integration with existing dashboard navigation

**Authorization (Phân quyền):**
5. Confirm default roles and permissions
6. Single-tenant or multi-tenant architecture?
7. First user auto-assigned Admin role?
8. Audit log retention policy
9. Team hierarchy (nested teams or flat?)

---

## Implementation

| Field | Value |
|-------|-------|
| Implemented by | [Pending] |
| Date | [Pending] |
| Related PR/Commit | [Pending] |
