---
title: "CR-004: Skill Management (Admin)"
status: Approved
created: 2025-12-13
author: "Product Team"
affected_story: US-6.1
decision: Approved
decided_by: "Product Team"
decided_date: "2025-12-15"
github_issue: https://github.com/ankiren/website/issues/21
---

# CR-004: Skill Management (Admin)

## Affected User Stories

**Target User Story:** [US-6.1: Skill Management (Admin)](../stories/epic-6-skill-management/US-6-1.md)

This CR implements the admin skill management functionality only. User-facing skill tracking features will be addressed in separate CRs.

---

## Reason for Change

**New Feature Request**: Add admin functionality to create and manage hierarchical skills.

Key motivations:
- Foundation for the entire Skill Management module
- Allow admins to create and manage hierarchical skills
- Provide skill catalog that users can later track
- Enable rich skill customization (icons, colors, descriptions)

---

## Proposed Changes

### US-6.1: Skill Management (Admin)

Implements 7 acceptance criteria for admin skill management.

> See [US-6.1](../stories/epic-6-skill-management/US-6-1.md) for detailed Gherkin scenarios.

| AC | Title | Description |
|----|-------|-------------|
| AC-6.1.1 | View Skills List | Tree and Grid view toggle |
| AC-6.1.2 | View Skill Detail | Detail page with hero, stats, sub-skills, breadcrumb |
| AC-6.1.3 | Create New Skill | Name, description, icon, color, parent selection |
| AC-6.1.4 | Edit Skill | Update all properties including parent |
| AC-6.1.5 | Delete Skill | Cascade delete with warning |
| AC-6.1.6 | Skill Hierarchy | Parent-child relationships, tree structure |
| AC-6.1.7 | Search Skills | Filter by name |

---

## Out of Scope

The following features are **NOT** included in this CR:

- User skill tracking (US-6.3)
- Score recording and history (US-6.3, US-6.4)
- User skills dashboard (US-6.5)
- Progress visualization/charts (US-6.6)
- Skill analytics (US-6.7)
- Bulk import (US-6.8)
- User-facing skill catalog browsing (US-6.2)
- Any user-facing features

> These will be addressed in separate CRs after US-6.1 is implemented.

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
- [x] Database migration needed (Skills table)
- [x] API changes (admin skill endpoints)
- [x] UI/UX changes (admin pages)

### Reusable Components

| Component | Notes |
|-----------|-------|
| Google OAuth | Authentication |
| User table | Admin role check |
| NextAuth.js | Session management |
| UI components | Button, Input, Modal, Badge |
| Admin layout | Base layout |
| RBAC system | Permission checking |

### New Components Required

| Component | Purpose |
|-----------|---------|
| Skills table | Store skill definitions (hierarchical) |
| SkillIcon component | Dynamic Lucide icon renderer |
| SkillTree component | Tree view display |
| SkillCard component | Grid view card |
| Icon Picker | Icon selection with search/categories |
| Color Picker | Color selection swatches |
| Admin skills page | `/admin/skills` - list view |
| Skill detail page | `/admin/skills/[id]` - detail view |

---

## Technical Notes

See [US-6.1 Technical Notes](../stories/epic-6-skill-management/US-6-1.md#technical-notes) for:
- Skill schema definition
- Database schema (Skills table)
- API endpoints
- Color palette and icon system details

---

## RICE Score

| Factor | Value | Rationale |
|--------|-------|-----------|
| Reach | 50% | Foundation for all skill tracking |
| Impact | 3 (Massive) | Required for entire skill module |
| Confidence | 90% | Demo approved and validated |
| Effort | 1 week | Admin pages + API + database |

**Score:** (50 × 3 × 0.9) / 1 = **135**

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Complex hierarchy | Medium | Low | Tested cascade delete, tree rendering |
| Icon library size | Low | Low | Pagination, lazy loading |
| Admin-only access | Low | Low | RBAC middleware checks |

---

## Demo Validation

Demo has been created and approved:
- `/demo/skills/us-6-1` - Skills list page (Tree/Grid)
- `/demo/skills/us-6-1/[id]` - Skill detail page

All acceptance criteria validated through interactive demo.

---

## Decision Notes

**Approved** - 2025-12-15

Decision:
- Proceed with US-6.1 implementation only
- Focus on admin skill management foundation
- User-facing features will be separate CRs
- Demo approved as reference implementation

---

## Implementation

| Field | Value |
|-------|-------|
| Implemented by | [Pending] |
| Date | [Pending] |
| Related PR/Commit | [Pending] |
