# Change Request Index

This file tracks all Change Requests (CRs) for User Story modifications.

---

## Active Change Requests

| CR ID | Title | Affected Story | Status | Created |
|-------|-------|----------------|--------|---------|
| [CR-003](CR-003-skill-management.md) | Skill Management & Authorization | None (New Feature) | Draft | 2025-12-13 |
| [CR-002](CR-002-update-login-logout.md) | Google-Only Authentication | [US-1.1](../stories/epic-1-user-authentication/US-1-1.md), [US-1.2](../stories/epic-1-user-authentication/US-1-2.md), [US-1.3](../stories/epic-1-user-authentication/US-1-3.md) | Draft | 2025-12-11 |

---

## Completed Change Requests

| CR ID | Title | Affected Story | Decision | Completed |
|-------|-------|----------------|----------|-----------|
| [CR-001](CR-001-auth-with-google.md) | Mark Google OAuth as Implemented | [US-1.4](../stories/epic-1-user-authentication/US-1-4.md) | Approved | 2025-12-11 |

---

## How to Create a Change Request

1. Copy `CR-TEMPLATE.md` to a new file: `CR-NNN-short-name.md`
2. Fill in all required sections
3. Add entry to the "Active Change Requests" table above
4. Set status to "Draft" or "Under Review"
5. After decision, move to "Completed" table

---

## Naming Convention

- **File**: `CR-NNN-short-name.md` (e.g., `CR-001-add-email-verification.md`)
- **NNN**: Sequential 3-digit number starting from 001

---

## Status Definitions

| Status | Description |
|--------|-------------|
| Draft | CR is being written, not ready for review |
| Under Review | CR is ready for review and approval |
| Approved | CR approved, waiting for implementation |
| Rejected | CR rejected, will not be implemented |
| Implemented | CR approved and changes applied to User Story |
