# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- US-1.4: Login with Google user story
- Project management workflow documentation (Jira agile workflows)
- Change Request management system (`spec/change-requests/`)
- CR-001: Mark Google OAuth as Implemented

### Changed
- US-1.4 status updated from Planned to Done
- EPIC-1 technical implementation updated to include Google OAuth

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
