# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

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
