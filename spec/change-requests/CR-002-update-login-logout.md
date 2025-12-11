---
title: "CR-002: Google-Only Authentication"
status: Draft
created: 2025-12-11
author: ""
affected_story: US-1.1, US-1.2, US-1.3, US-1.4
decision: Pending
decided_by: ""
decided_date: ""
---

# CR-002: Google-Only Authentication

## Affected User Stories

- [US-1.1: User Registration](../stories/epic-1-user-authentication/US-1-1.md)
- [US-1.2: User Login with Google](../stories/epic-1-user-authentication/US-1-2.md)
- [US-1.3: User Logout](../stories/epic-1-user-authentication/US-1-3.md)
- US-1.4: Login with Google (Deleted)

---

## Reason for Change

Simplify authentication by removing email/password login and registration, using Google OAuth as the only authentication method.

**Benefits:**
1. **Simplified UX**: Single "Continue with Google" button instead of forms
2. **No password management**: Users don't need to remember another password
3. **Auto-registration**: New users are automatically registered on first Google login
4. **Reduced security surface**: No password storage, no reset flows needed
5. **Faster onboarding**: One-click sign up/sign in

---

## Proposed Changes

### Change 1: US-1.1 - Registration (Google Auto-Registration Only)

#### Current (Before)
```markdown
## Acceptance Criteria
- [x] User can access registration page at `/register`
- [x] Form requires email (valid format) and password (min 6 characters)
- [x] Email must be unique (no duplicate accounts)
- [x] Password is hashed before storage (bcrypt)
- [x] User receives error message for invalid input
- [x] User receives error message for duplicate email
- [x] Successful registration redirects to login page
- [x] User can navigate to login page from registration
```

#### Proposed (After)
```markdown
## Acceptance Criteria

### Registration Page
- [x] User can access registration page at `/register`
- [x] User can navigate to login page from registration

### Google OAuth Auto-Registration
- [x] "Continue with Google" button is visible on registration page
- [x] Clicking the button redirects to Google OAuth consent screen
- [x] User can authorize Ankiren to access their Google profile
- [x] New users are automatically registered with their Google email
- [x] User's name and profile picture are imported from Google (if available)
- [x] Email must be unique (no duplicate accounts)
- [x] Successful Google registration redirects to dashboard (no login required)
- [x] Error message is shown if Google authentication fails
```

**Removed:**
- Email/password registration form
- Password hashing (bcrypt)
- Server-side email/password validation
- `/api/register` endpoint

---

### Change 2: US-1.2 - Login (Google Only)

#### Current (Before)
```markdown
## Acceptance Criteria
- [x] User can access login page at `/login`
- [x] Form requires email and password
- [x] Credentials are validated against database
- [x] Invalid credentials show error message
- [x] Successful login redirects to dashboard
- [x] JWT session is created and stored in cookie
- [x] User can navigate to registration page from login
```

#### Proposed (After)
```markdown
## Acceptance Criteria

### Login Page
- [x] User can access login page at `/login`
- [x] User can navigate to registration page from login

### Google OAuth Login
- [x] "Continue with Google" button is visible on login page
- [x] Clicking the button redirects to Google OAuth consent screen
- [x] User can authorize Ankiren to access their Google profile
- [x] After authorization, user is redirected back to the app
- [x] Session is created after successful Google authentication
- [x] JWT session is created and stored in cookie
- [x] User is redirected to dashboard after successful login
- [x] Error message is shown if Google authentication fails

### Post-Login UI State
- [ ] "Sign In" button in hero section is hidden when user is logged in
- [ ] "Start Learning Free" button in hero section is hidden when user is logged in
- [ ] Navigation bar shows: Dashboard link, user email, and "Sign Out" button when logged in
- [ ] Navigation bar hides any duplicate "Sign In" links when logged in

### Account Linking
- [x] Existing users (same email) are linked to their Google account
- [x] User's name and profile picture are updated from Google (if available)
```

**Removed:**
- Email/password login form
- Credentials validation against database
- Password comparison with bcrypt

---

### Change 3: US-1.3 - Logout (Google Session)

#### Current (Before)
```markdown
## Acceptance Criteria
- [x] Logout button is visible in navigation bar when logged in
- [x] Clicking logout clears the session
- [x] User is redirected to home page after logout
- [x] Protected pages become inaccessible after logout
```

#### Proposed (After)
```markdown
## Acceptance Criteria
- [x] Logout button is visible in navigation bar when logged in
- [x] Clicking logout clears the Google OAuth session
- [x] JWT cookie is cleared from browser
- [x] User is redirected to home page after logout
- [x] Protected pages become inaccessible after logout
- [x] User must re-authenticate with Google to access the app again
```

**Notes:**
- Logout only clears the Ankiren session, not the Google account session
- User may still be logged into Google in their browser
- Re-login will show Google account picker if multiple accounts are available

---

### Change 4: US-1.4 - Deleted

**US-1.4: Login with Google** has been **deleted**.
- Content merged into US-1.2 (login) and US-1.1 (auto-registration)
- File removed from `spec/stories/epic-1-user-authentication/`

---

## Impact Analysis

### Scope of Change

- [x] Acceptance Criteria changes
- [x] Technical Notes changes
- [x] RICE Score changes

### Implementation Impact

- [x] Requires code changes
- [x] Affects other User Stories (see below)
- [ ] Database migration needed (password field becomes optional)
- [x] API changes (remove `/api/register` endpoint)
- [x] UI/UX changes (remove email/password forms)

### Affected Stories

| Story | Impact |
|-------|--------|
| US-1.1: User Registration | Major - Remove email/password, Google auto-registration only |
| US-1.2: User Login | Major - Remove email/password, Google OAuth only |
| US-1.3: User Logout | Minor - Updated for Google OAuth session |
| US-1.4: Login with Google | **Deleted** - Merged into US-1.1 and US-1.2 |

### Files to Modify

| File | Change |
|------|--------|
| `src/app/login/page.tsx` | Remove email/password form, keep Google button |
| `src/app/register/page.tsx` | Remove email/password form, keep Google button |
| `src/app/api/register/route.ts` | Delete or disable |
| `src/lib/auth.ts` | Remove credentials provider, keep Google provider |
| `src/app/page.tsx` | Hide Sign In / Start Learning buttons when logged in |
| `src/components/Navbar.tsx` | Conditional rendering based on auth state |
| `prisma/schema.prisma` | Make password field optional |

---

## RICE Score Update

| Story | Before | After | Notes |
|-------|--------|-------|-------|
| US-1.1 | 300 | 600 | Simplified to Google only, reduced effort |
| US-1.2 | 600 | 600 | Simplified, same effort |
| US-1.3 | 800 | 800 | Minor changes only |
| US-1.4 | 320 | N/A | Deleted |

---

## Decision Notes

**Decisions:**
1. Remove email/password authentication entirely
2. Google OAuth is the only authentication method
3. Auto-registration on first Google login (no separate registration step needed)
4. US-1.4 has been **deleted** (content merged into US-1.2 and US-1.1)
5. EPIC.md story index has been **updated** with a note about the merge
6. Post-login UI state criteria added to fix button visibility bug

---

## Implementation

| Field | Value |
|-------|-------|
| Implemented by | - |
| Date | - |
| Related PR/Commit | - |
