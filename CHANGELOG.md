# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- CR-003: Skill Management & Authorization Module change request
- CR-002: Google-Only Authentication change request
- Post-login UI state acceptance criteria for button visibility
- `.wrangler` directory to gitignore
- AC-1.2.6: Hero section conditional rendering (hide auth buttons when logged in)

### Changed
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
