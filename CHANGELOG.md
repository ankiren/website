# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Epic 8: Course Management feature
  - Admin course management UI (`/dashboard/admin/courses`)
  - Course CRUD API endpoints (`/api/admin/courses`)
  - Student courses listing (`/dashboard/courses`)
  - Course enrollment/unenrollment API (`/api/courses/[id]/enroll`)
  - User enrollments API (`/api/me/enrollments`)
  - Course and Enrollment database tables (migration 0005)
  - E2E tests for courses (33 tests)
- Courses link in navbar for authenticated users
- Course quick link in admin dashboard
- Epic 9: Personal Access Tokens (PAT) feature
  - Token management UI (`/dashboard/tokens`)
  - PAT CRUD API endpoints (`/api/me/tokens`)
  - Bearer token authentication via `authWithPAT()`
  - SHA-256 hashed token storage
  - E2E tests for PAT (16 tests)
- API documentation (OpenAPI v3 specs in `docs/api/`)
- Database documentation (DBML schemas in `docs/database/`)

### Changed
- All API routes now support PAT authentication via Bearer token

## 0.4.0 - 2025-12-21

### Added
- Epic 7: Pomodoro Timer feature implementation
  - Full-screen Pomodoro timer with circular progress indicator
  - Session types: Focus (25min), Short Break (5min), Long Break (15min)
  - Background music with auto-play on timer start
  - Custom duration settings with localStorage persistence
  - Fullscreen mode with webkit support (Safari/iOS compatible)
  - Responsive design with soft pastel gradient backgrounds
  - Session counter and skip functionality
- Epic 7 product specs: EPIC.md and 4 user stories (US-7.1 to US-7.4)
- US-6.2 demo implementation with My Skills Dashboard
  - Custom skill creation with name, icon, color picker
  - Edit/Delete skill functionality
  - Search, filter, and sort skills
  - Multiple persona demos (Buffett, Bill Gates, Steve Jobs, Mozart, etc.)
  - RadarChart component for skill visualization
- US-6.1 user story with 7 acceptance criteria (Gherkin format)
- US-6.1 demo implementation (`src/app/demo/skills/us-6-1/`)
- Skill detail page demo (`src/app/demo/skills/us-6-1/[id]/`)
- UI design docs for admin skills page and skill detail page
- UI design docs for SkillTree component
- US-6.1 Skill Management implementation:
  - Skills API endpoints (`/api/admin/skills`, `/api/admin/skills/[id]`)
  - Admin skills pages (`/dashboard/admin/skills`, `/dashboard/admin/skills/[id]`)
  - SkillTree and SkillCard components with Tree/Grid views
  - CreateEditSkillModal, DeleteSkillModal, IconPicker components
  - Skills database operations in d1.ts (CRUD, tree queries, search)
  - Skills migration (0004_skills.sql)
- E2E tests for skills management (37 tests covering all acceptance criteria)
- E2E init scripts for staging, UAT, and production environments
- npm scripts for E2E testing on all environments

### Changed
- CR-004: Refined to focus only on US-6.1 (admin skill management)
- US-6.1: Updated spec to match approved demo (added icon, color, description fields)
- US-6.1: Added AC-6.1.2 View Skill Detail, reordered acceptance criteria
- Admin skills UI design: Added Tree/Grid views, icon picker, color picker details
- Global teardown: Filter test skills by pattern instead of deleting all

### Fixed
- Authorization null safety: Handle undefined roles/permissions in isAdmin/hasPermission

## 0.3.0 - 2025-12-13

### Added
- UI Design System documentation (`docs/ui-design/`):
  - Main design system doc with colors, typography, layout patterns
  - Base component docs (Button, Input, Card, Badge, Modal, Tabs)
  - Feature component docs (FlashCard, StudySession, DeckCard, Navbar)
  - Page template docs (Landing, Dashboard, Auth, Admin, Forms, Study)
- Authorization module implementation (CR-003):
  - RBAC with roles (admin, user) and permissions system
  - Admin API endpoints: `/api/admin/users`, `/api/admin/roles`, `/api/admin/permissions`
  - User permissions API: `/api/me/permissions`
  - Admin dashboard UI with user/role management
  - Authorization middleware and helper functions
  - D1 database operations for roles and permissions
  - E2E tests for authorization (auth and unauth scenarios)
  - OpenAPI spec for authorization APIs
  - Database schema (DBML) documentation
- Epic 5: Authorization - RBAC, roles, permissions
- Epic 6: Skill Management - skill tracking, categories, activities, goals
- CR-004: Skill Management Module change request
- CR-003: Authorization Module change request
- CR-002: Google-Only Authentication change request
- Post-login UI state acceptance criteria for button visibility
- `.wrangler` directory to gitignore
- AC-1.2.6: Hero section conditional rendering (hide auth buttons when logged in)

### Changed
- CR-003: Simplified to focus on "what" changes (removed DB schema, API endpoints)
- US-5.1 to US-5.5: Added AC summary table before detailed Gherkin scenarios
- US-1.1: Updated to Google-only registration (removed email/password)
- US-1.2: Updated to Google-only login with post-login UI state criteria
- US-1.3: Updated for Google OAuth session logout
- EPIC-1: Status changed to In Progress, merged US-1.4 into US-1.2

### Removed
- Obsolete `docs/workflows/project_management.md` file
- US-1.4: Merged into US-1.2 and US-1.1 (Google OAuth now unified)

## 0.2.1 - 2025-12-11

### Added
- GitHub issues for all 15 user stories (linked to epics)
- GitHub labels for priority and epic tracking

### Changed
- User story files now use YAML frontmatter format
- All user stories include `github_issue` field linking to GitHub issues

## 0.2.0 - 2025-12-11

### Added
- Product specification folder structure (`spec/`)
- PRD-001: Ankiren MVP product requirements document
- User stories for 4 epics (15 stories total)
- Product roadmap documentation
- RICE scoring for all user stories

## 0.1.0 - 2025-12-11

### Added
- Initial Ankiren flashcard application with SM-2 spaced repetition algorithm
- User authentication with NextAuth.js (JWT sessions, credentials provider)
- Deck management (create, edit, delete, list decks)
- Card management (create, edit, delete cards within decks)
- Study session with SM-2 algorithm and flip card animation
- Dashboard with deck overview and cards due count
- Cloudflare Workers deployment with OpenNext adapter
- Cloudflare D1 database integration (SQLite)
- Multi-environment setup (Production, Staging, UAT)
- Universal SSL with wildcard certificate (*.ankiren.com)
- System design documentation
