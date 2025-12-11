# Authentication System Design

## Overview

Ankiren uses NextAuth.js v5 for authentication, supporting both email/password credentials and Google OAuth, deployed on Cloudflare Workers with JWT-based sessions.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      Authentication Flow                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────┐     ┌──────────────────┐     ┌────────────────────┐   │
│  │   Client    │────▶│   NextAuth.js    │────▶│   Cloudflare D1    │   │
│  │  (Browser)  │     │   (API Route)    │     │    (User Table)    │   │
│  └─────────────┘     └──────────────────┘     └────────────────────┘   │
│         │                    │                                          │
│         │                    ▼                                          │
│         │           ┌──────────────────┐                               │
│         │           │    Google OAuth  │                               │
│         │           │   (accounts.google.com)                          │
│         │           └──────────────────┘                               │
│         │                    │                                          │
│         ▼                    ▼                                          │
│  ┌─────────────────────────────────────┐                               │
│  │          JWT Token (Cookie)          │                               │
│  │    - Stateless session management    │                               │
│  │    - HTTP-only, secure cookie        │                               │
│  └─────────────────────────────────────┘                               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Authentication Providers

### 1. Credentials Provider (Email/Password)

```
┌─────────┐     ┌─────────────┐     ┌─────────────┐     ┌──────────┐
│  User   │────▶│   Login     │────▶│  NextAuth   │────▶│ D1 Query │
│         │     │   Page      │     │  Authorize  │     │  Lookup  │
└─────────┘     └─────────────┘     └─────────────┘     └──────────┘
                                          │
                                          ▼
                                   ┌─────────────┐
                                   │   bcrypt    │
                                   │   Compare   │
                                   └─────────────┘
                                          │
                                          ▼
                                   ┌─────────────┐
                                   │  JWT Token  │
                                   │  (Session)  │
                                   └─────────────┘
```

**Flow:**
1. User submits email/password on `/login`
2. NextAuth calls the `authorize` callback
3. User lookup in D1 by email
4. bcrypt compares password hash
5. On success, JWT token issued as HTTP-only cookie

### 2. Google OAuth Provider

```
┌─────────┐     ┌─────────────┐     ┌───────────────────┐
│  User   │────▶│   Login     │────▶│  Google OAuth     │
│         │     │   Page      │     │  Consent Screen   │
└─────────┘     └─────────────┘     └───────────────────┘
                                            │
                                            ▼
                                    ┌───────────────────┐
                                    │  NextAuth signIn  │
                                    │    Callback       │
                                    └───────────────────┘
                                            │
                        ┌───────────────────┼───────────────────┐
                        ▼                   ▼                   ▼
               ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
               │ Find by        │  │ Find by Email  │  │ Create New     │
               │ googleId       │  │ (Link Account) │  │ User           │
               └────────────────┘  └────────────────┘  └────────────────┘
                        │                   │                   │
                        └───────────────────┴───────────────────┘
                                            │
                                            ▼
                                    ┌───────────────────┐
                                    │    JWT Token      │
                                    │    (Session)      │
                                    └───────────────────┘
```

**Flow:**
1. User clicks "Continue with Google" on `/login` or `/register`
2. Redirect to Google OAuth consent screen
3. Google redirects back with authorization code
4. NextAuth `signIn` callback handles user creation/linking:
   - **Existing user (by googleId)**: Login directly
   - **Existing user (by email)**: Link Google account, update profile
   - **New user**: Create account with Google profile data
5. JWT token issued

### Account Linking Logic

```typescript
// In signIn callback (src/lib/auth.ts)
if (account?.provider === "google") {
  // 1. Check if user exists by googleId
  let existingUser = await db.user.findByGoogleId(d1, googleId);

  if (!existingUser && user.email) {
    // 2. Check if user exists by email (account linking)
    existingUser = await db.user.findByEmail(d1, user.email);

    if (existingUser) {
      // 3. Link existing account with Google
      await db.user.updateGoogleId(d1, existingUser.id, {
        googleId,
        image: user.image,
        name: existingUser.name ? undefined : user.name,
      });
    } else {
      // 4. Create new user with Google account
      existingUser = await db.user.create(d1, {
        email: user.email,
        name: user.name,
        image: user.image,
        googleId,
      });
    }
  }
}
```

## Database Schema

### User Table

```sql
┌─────────────────────────────────────────────────────────────────────┐
│                           User Table                                 │
├─────────────────┬─────────────────┬─────────────────────────────────┤
│     Column      │      Type       │           Description           │
├─────────────────┼─────────────────┼─────────────────────────────────┤
│ id              │ TEXT (PK)       │ CUID identifier                 │
│ email           │ TEXT (UNIQUE)   │ User email                      │
│ password        │ TEXT (NULLABLE) │ bcrypt hashed (null for OAuth)  │
│ name            │ TEXT            │ Display name                    │
│ image           │ TEXT            │ Profile picture URL (OAuth)     │
│ googleId        │ TEXT (UNIQUE)   │ Google OAuth provider ID        │
│ createdAt       │ TEXT            │ ISO timestamp                   │
│ updatedAt       │ TEXT            │ ISO timestamp                   │
└─────────────────┴─────────────────┴─────────────────────────────────┘
```

### Indexes

```sql
CREATE UNIQUE INDEX idx_user_email ON User(email);
CREATE INDEX idx_user_googleId ON User(googleId);
```

### Migration (0002_google_oauth.sql)

```sql
-- Add Google OAuth fields to User table
ALTER TABLE User ADD COLUMN image TEXT;
ALTER TABLE User ADD COLUMN googleId TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_user_googleId ON User(googleId);
```

## Session Management

### JWT Strategy

| Aspect | Configuration |
|--------|---------------|
| Strategy | JWT (stateless) |
| Token Storage | HTTP-only cookie |
| Token Lifetime | 30 days (default) |
| Session Data | `{ id, email, name, image }` |

### JWT Callbacks

```typescript
callbacks: {
  async jwt({ token, user, account }) {
    if (user) {
      token.id = user.id;
    }
    if (account?.provider === "google" && user) {
      token.id = user.id;
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string;
    }
    return session;
  },
}
```

## Security

### Password Security
- **Hashing**: bcrypt with 10 salt rounds
- **Storage**: Hashed passwords in D1, never plaintext
- **OAuth users**: `password` field is NULL

### OAuth Security
- **State parameter**: CSRF protection via NextAuth
- **PKCE**: Enabled by default in NextAuth v5
- **Scope**: `openid email profile`

### Cookie Security
- **HTTP-only**: Prevents XSS access to tokens
- **Secure**: HTTPS only in production
- **SameSite**: Lax (prevents CSRF)

### Protected Routes
- Dashboard routes require authentication
- Middleware redirects unauthenticated users to `/login`
- API routes validate session before processing

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXTAUTH_SECRET` | JWT signing secret | Yes |
| `NEXTAUTH_URL` | Canonical app URL | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `AUTH_TRUST_HOST` | Trust host header | Yes (Cloudflare) |

### Google Cloud Console Setup

1. Create project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google+ API
3. Configure OAuth consent screen
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://ankiren.com/api/auth/callback/google`
   - `https://staging.ankiren.com/api/auth/callback/google`
   - `https://uat.ankiren.com/api/auth/callback/google`

### Wrangler Secrets

```bash
# Set secrets for each environment
npx wrangler secret put NEXTAUTH_SECRET
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET

npx wrangler secret put NEXTAUTH_SECRET --env staging
npx wrangler secret put GOOGLE_CLIENT_ID --env staging
npx wrangler secret put GOOGLE_CLIENT_SECRET --env staging

npx wrangler secret put NEXTAUTH_SECRET --env uat
npx wrangler secret put GOOGLE_CLIENT_ID --env uat
npx wrangler secret put GOOGLE_CLIENT_SECRET --env uat
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/auth/[...nextauth]` | NextAuth handler |
| POST | `/api/auth/callback/credentials` | Email/password login |
| GET | `/api/auth/callback/google` | Google OAuth callback |
| POST | `/api/auth/signout` | Logout |
| POST | `/api/register` | Create new user (credentials) |

## UI Components

### Login Page (`/login`)
- Email/password form
- "Continue with Google" button
- Link to registration page
- Error display for invalid credentials

### Register Page (`/register`)
- Name, email, password form
- Password minimum length validation (8 chars)
- "Continue with Google" button
- Link to login page

### Auth Flow States
- Loading state during authentication
- Error state for failed attempts
- Redirect to dashboard on success

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Invalid credentials | Show error, remain on login page |
| Google OAuth error | Redirect to login with error param |
| D1 unavailable | Graceful degradation with console warning |
| Duplicate email | Link accounts (Google) or show error (credentials) |

## Testing

### E2E Tests (Playwright)

```bash
# Run auth tests
npx playwright test e2e/auth.spec.ts

# Test against specific environment
BASE_URL=https://uat.ankiren.com npm run test:e2e
BASE_URL=https://ankiren.com npm run test:e2e
```

### Test Coverage
- Login page rendering
- Google OAuth button presence
- OAuth flow initiation
- Invalid credentials handling
- Registration flow
- Protected route redirects

## File References

| File | Purpose |
|------|---------|
| `src/lib/auth.ts` | NextAuth configuration |
| `src/lib/d1.ts` | Database operations including user CRUD |
| `src/app/login/page.tsx` | Login UI |
| `src/app/register/page.tsx` | Registration UI |
| `src/app/api/auth/[...nextauth]/route.ts` | NextAuth API route |
| `src/app/api/register/route.ts` | Registration API |
| `migrations/0002_google_oauth.sql` | OAuth schema migration |
| `e2e/auth.spec.ts` | E2E authentication tests |
