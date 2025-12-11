# Ankiren - System Design Document

## 1. Tổng quan hệ thống

Ankiren là một ứng dụng web học flashcard sử dụng thuật toán Spaced Repetition SM-2, được triển khai trên Cloudflare Workers với kiến trúc serverless/edge.

```
┌─────────────────────────────────────────────────────────────────────┐
│                           INTERNET                                   │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Cloudflare Edge Network                          │
│                                                                      │
│  Production URLs:                                                    │
│  - https://ankiren.com (custom domain)                              │
│  - https://www.ankiren.com                                          │
│  - https://api.ankiren.com                                          │
│  - https://ankiren.anhv-ict91.workers.dev (backup)                  │
│                                                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │  Static Assets  │  │    Workers      │  │  Cloudflare D1  │     │
│  │    (CDN)        │  │   (Next.js)     │  │   (Database)    │     │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
```

## 2. Tech Stack

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| Next.js | 15.5.7 | React framework với App Router |
| React | 18.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first CSS |

### Backend
| Công nghệ | Mục đích |
|-----------|----------|
| Next.js API Routes | REST API endpoints |
| NextAuth.js v5 | Authentication (JWT) |
| Cloudflare Workers | Edge compute runtime |
| Cloudflare D1 | SQLite database |

### Infrastructure
| Dịch vụ Cloudflare | Mục đích |
|-------------------|----------|
| Workers | Server-side rendering, API, Edge Functions |
| D1 | SQLite database (APAC region) |
| CDN | Global content delivery via Assets binding |
| DNS | Domain management (ankiren.com) |

### DevOps
| Công cụ | Mục đích |
|---------|----------|
| Wrangler 4.x | Cloudflare CLI |
| OpenNext 1.14.x | Next.js → Cloudflare Workers adapter |

## 3. Kiến trúc chi tiết

### 3.1 Request Flow

```
User Request (ankiren.com)
     │
     ▼
┌─────────────────┐
│   Cloudflare    │──── Static Asset? ──── Yes ──→ ASSETS binding (CDN)
│   Edge Network  │
└────────┬────────┘
         │ No (Dynamic request)
         ▼
┌─────────────────┐
│     Worker      │
│  (worker.js)    │
│                 │
│  - Middleware   │
│  - Route logic  │
│  - SSR/SSG      │
│  - API handler  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Cloudflare D1  │
│                 │
│  SQLite-based   │
│  database       │
│  (ankiren-db)   │
└─────────────────┘
```

### 3.2 Database Schema (Cloudflare D1 - SQLite)

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

┌─────────────────────────────────────────────────────────────────────┐
│                           Deck Table                                 │
├─────────────────┬─────────────────┬─────────────────────────────────┤
│ id              │ TEXT (PK)       │ CUID identifier                 │
│ name            │ TEXT            │ Deck name                       │
│ description     │ TEXT            │ Optional description            │
│ userId          │ TEXT (FK)       │ Owner reference                 │
│ createdAt       │ TEXT            │ ISO timestamp                   │
│ updatedAt       │ TEXT            │ ISO timestamp                   │
└─────────────────┴─────────────────┴─────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                           Card Table                                 │
├─────────────────┬─────────────────┬─────────────────────────────────┤
│ id              │ TEXT (PK)       │ CUID identifier                 │
│ front           │ TEXT            │ Question/front content          │
│ back            │ TEXT            │ Answer/back content             │
│ deckId          │ TEXT (FK)       │ Parent deck reference           │
│ createdAt       │ TEXT            │ ISO timestamp                   │
│ updatedAt       │ TEXT            │ ISO timestamp                   │
└─────────────────┴─────────────────┴─────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          Review Table                                │
├─────────────────┬─────────────────┬─────────────────────────────────┤
│ id              │ TEXT (PK)       │ CUID identifier                 │
│ easeFactor      │ REAL            │ SM-2 ease factor (default 2.5)  │
│ interval        │ INTEGER         │ Days until next review          │
│ repetitions     │ INTEGER         │ Successful review count         │
│ dueDate         │ TEXT            │ Next review date                │
│ lastReviewDate  │ TEXT            │ Last reviewed timestamp         │
│ cardId          │ TEXT (FK)       │ Card reference                  │
│ userId          │ TEXT (FK)       │ User reference                  │
│                 │ UNIQUE(cardId, userId)                             │
└─────────────────┴─────────────────┴─────────────────────────────────┘
```

### 3.3 Database Indexes

```sql
CREATE INDEX idx_user_googleId ON User(googleId);
CREATE INDEX idx_deck_userId ON Deck(userId);
CREATE INDEX idx_card_deckId ON Card(deckId);
CREATE INDEX idx_review_cardId ON Review(cardId);
CREATE INDEX idx_review_userId ON Review(userId);
CREATE INDEX idx_review_dueDate ON Review(dueDate);
```

## 4. Application Architecture

### 4.1 Directory Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth group (login, register)
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/           # Protected routes
│   │   ├── layout.tsx       # Auth check wrapper
│   │   ├── page.tsx         # Deck list
│   │   ├── decks/
│   │   │   ├── new/
│   │   │   └── [id]/
│   │   │       ├── page.tsx     # Card list
│   │   │       ├── cards/new/
│   │   │       └── study/       # Study session
│   │   └── cards/[id]/edit/
│   ├── api/                 # API Routes
│   │   ├── auth/[...nextauth]/
│   │   ├── register/
│   │   ├── decks/
│   │   ├── cards/
│   │   └── reviews/
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # Reusable UI (Button, Input, Card)
│   ├── Navbar.tsx
│   ├── DeckCard.tsx
│   ├── FlashCard.tsx
│   ├── StudySession.tsx
│   └── Providers.tsx        # SessionProvider wrapper
├── lib/
│   ├── auth.ts              # NextAuth configuration
│   ├── d1.ts                # D1 database operations
│   └── sm2.ts               # SM-2 algorithm
└── types/
    └── next-auth.d.ts       # Type augmentation
```

### 4.2 Authentication Flow

> **Detailed documentation:** See [auth.md](./auth.md) for comprehensive authentication design.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      Authentication Providers                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────┐     ┌─────────────────────────┐           │
│  │   Credentials Provider  │     │   Google OAuth Provider │           │
│  │   (Email/Password)      │     │   (accounts.google.com) │           │
│  └───────────┬─────────────┘     └───────────┬─────────────┘           │
│              │                               │                          │
│              └───────────────┬───────────────┘                          │
│                              ▼                                          │
│                     ┌─────────────────┐                                 │
│                     │   NextAuth.js   │                                 │
│                     │   (JWT Session) │                                 │
│                     └─────────────────┘                                 │
│                              │                                          │
│              ┌───────────────┼───────────────┐                          │
│              ▼               ▼               ▼                          │
│     ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                 │
│     │ Find by      │ │ Find by      │ │ Create New   │                 │
│     │ Email        │ │ googleId     │ │ User         │                 │
│     └──────────────┘ └──────────────┘ └──────────────┘                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Authentication Details:**
- Providers: Credentials (email/password) + Google OAuth
- Session Strategy: JWT (stateless)
- Password: bcrypt hashed (10 rounds)
- Token Storage: HTTP-only secure cookie
- Account Linking: Email-based (Google users linked to existing accounts)

### 4.3 SM-2 Algorithm

```typescript
// Spaced Repetition Algorithm
Quality Rating:
  0 = Complete blackout
  1 = Incorrect, remembered on reveal
  2 = Incorrect, easy to recall
  3 = Correct with difficulty
  4 = Correct with hesitation
  5 = Perfect response

Button Mapping:
  Again → quality 0 (reset)
  Hard  → quality 2
  Good  → quality 4
  Easy  → quality 5

Interval Calculation:
  if quality < 3: reset to day 1
  if first review: interval = 1 day
  if second review: interval = 6 days
  else: interval = previous_interval × ease_factor

Ease Factor Update:
  EF' = EF + (0.1 - (5-q) × (0.08 + (5-q) × 0.02))
  EF' = max(1.3, EF')
```

## 5. API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/register | Create new user |
| POST | /api/auth/callback/credentials | Email/password login |
| GET | /api/auth/callback/google | Google OAuth callback |
| POST | /api/auth/signout | Logout |

### Decks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/decks | List user's decks |
| POST | /api/decks | Create deck |
| GET | /api/decks/[id] | Get deck with cards |
| PUT | /api/decks/[id] | Update deck |
| DELETE | /api/decks/[id] | Delete deck |

### Cards
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/cards | Create card |
| GET | /api/cards/[id] | Get card |
| PUT | /api/cards/[id] | Update card |
| DELETE | /api/cards/[id] | Delete card |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/reviews | Submit review |

## 6. Security

### 6.1 Authentication & Authorization
- JWT-based sessions (stateless)
- Password hashing with bcrypt (10 rounds)
- Protected routes via middleware
- User-scoped data access (all queries filter by userId)

### 6.2 API Security
- CSRF protection via NextAuth
- Input validation on all endpoints
- User ownership verification for all mutations

### 6.3 Infrastructure Security
- HTTPS enforced via Cloudflare
- D1 database access via bindings (no exposed credentials)
- Secrets stored securely via Cloudflare Workers secrets
- No secrets in code (environment variables)

### 6.4 SSL/TLS Configuration
```
┌─────────────────────────────────────────────────────────────────────┐
│                    Cloudflare SSL Configuration                      │
├─────────────────────────────────────────────────────────────────────┤
│  Certificate Type:     Universal SSL (Free)                          │
│  Certificate Authority: Google Trust Services                        │
│  Coverage:             ankiren.com, *.ankiren.com (wildcard)        │
│  Validation Method:    TXT (DNS-based, ACME challenge)              │
│  SSL Mode:             Full (strict)                                 │
│  Min TLS Version:      TLS 1.2                                       │
│  Auto HTTPS Rewrites:  Enabled                                       │
└─────────────────────────────────────────────────────────────────────┘
```

**SSL Certificate Details:**
| Domain | Certificate | Status |
|--------|-------------|--------|
| ankiren.com | Universal SSL | Active |
| *.ankiren.com | Wildcard SSL | Active |

**DNS Records for SSL Validation:**
- TXT record: `_acme-challenge.ankiren.com` (for wildcard cert validation)

## 7. Performance

### 7.1 Edge Architecture Benefits
```
┌─────────────────────────────────────────────────────────┐
│                 Cloudflare Edge Network                  │
├─────────────────────────────────────────────────────────┤
│  - 300+ data centers globally                           │
│  - D1 database in APAC region                           │
│  - Low latency for Asian users                          │
│  - Automatic SSL/TLS                                    │
│  - DDoS protection included                             │
│  - Near-zero cold starts (Workers)                      │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Caching Strategy
```
┌─────────────────────────────────────────────────────────┐
│                    Cloudflare Cache                      │
├─────────────────────────────────────────────────────────┤
│  Static Assets (/_next/static/*):  Long-term cache      │
│  Images (/images/*):               Long-term cache      │
│  API Routes (/api/*):              No cache             │
│  Dynamic Pages:                    No cache (SSR)       │
│  Static Pages (/, /login):         Edge cached          │
└─────────────────────────────────────────────────────────┘
```

### 7.3 Database Performance
- D1 uses SQLite (proven, battle-tested)
- Indexed queries for common access patterns
- Located in APAC region for low latency

### 7.4 Cold Start Mitigation
- Cloudflare Workers have near-zero cold starts
- Edge runtime is always warm
- Much faster than Lambda cold starts

## 8. Cost Analysis

### Monthly Estimates (Low Traffic)
| Service | Usage | Estimated Cost |
|---------|-------|----------------|
| Cloudflare Workers | <100K requests/day | $0 (free tier) |
| Cloudflare D1 | <5GB, <5M reads | $0 (free tier) |
| Custom Domain | ankiren.com | $0 (DNS only) |
| **Total** | | **$0/month** |

### Cloudflare Free Tier Limits
| Service | Free Limit |
|---------|------------|
| Workers | 100K requests/day |
| D1 | 5GB storage, 5M reads/day, 100K writes/day |
| DNS | Unlimited |

### Scaling Costs (Paid Plan)
| Traffic | Workers | D1 | Total |
|---------|---------|-----|-------|
| 10K users | ~$5 | ~$5 | ~$10/mo |
| 100K users | ~$20 | ~$25 | ~$45/mo |
| 1M users | ~$200 | ~$250 | ~$450/mo |

**Note:** Cloudflare is significantly cheaper than AWS for this use case.

## 9. Deployment

### 9.1 Configuration Files

**wrangler.toml**
```toml
name = "ankiren"
main = ".open-next/worker.js"
compatibility_date = "2025-03-25"
compatibility_flags = ["nodejs_compat"]
workers_dev = true

# Custom domain routes
routes = [
  { pattern = "ankiren.com/*", zone_name = "ankiren.com" },
  { pattern = "www.ankiren.com/*", zone_name = "ankiren.com" },
  { pattern = "api.ankiren.com/*", zone_name = "ankiren.com" }
]

[assets]
directory = ".open-next/assets"
binding = "ASSETS"

[vars]
NEXTAUTH_URL = "https://ankiren.com"

[[d1_databases]]
binding = "DB"
database_name = "ankiren-db"
database_id = "8fc09382-3dd5-4cd4-9d66-5d94c7461b5d"
```

**open-next.config.ts**
```typescript
import type { OpenNextConfig } from "@opennextjs/cloudflare";

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
  edgeExternals: ["node:crypto"],
  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
    },
  },
};

export default config;
```

### 9.2 Deployment Commands
```bash
# Build for Cloudflare Workers
npm run build:cloudflare

# Deploy to production (Workers)
npx wrangler deploy

# Set secrets
npx wrangler secret put NEXTAUTH_SECRET

# Local development
npx wrangler dev

# View live logs
npx wrangler tail
```

### 9.3 D1 Database Management
```bash
# Create database
npx wrangler d1 create ankiren-db

# Run migrations
npx wrangler d1 execute ankiren-db --remote --file=./migrations/0001_init.sql

# Query database
npx wrangler d1 execute ankiren-db --remote --command="SELECT * FROM User LIMIT 10"
```

### 9.4 DNS Configuration
Domain `ankiren.com` managed via Cloudflare DNS with nameservers:
- `eloise.ns.cloudflare.com`
- `olof.ns.cloudflare.com`

**DNS Records:**
| Type | Name | Content | Proxy |
|------|------|---------|-------|
| CNAME | @ | ankiren.anhv-ict91.workers.dev | Proxied |
| CNAME | www | ankiren.anhv-ict91.workers.dev | Proxied |
| CNAME | api | ankiren.anhv-ict91.workers.dev | Proxied |
| CNAME | staging | ankiren-staging.anhv-ict91.workers.dev | Proxied |
| CNAME | uat | ankiren-uat.anhv-ict91.workers.dev | Proxied |
| TXT | _acme-challenge | (SSL validation) | DNS only |

Workers routes automatically handle:
- `ankiren.com/*` → Production Worker
- `www.ankiren.com/*` → Production Worker
- `api.ankiren.com/*` → Production Worker
- `staging.ankiren.com/*` → Staging Worker
- `uat.ankiren.com/*` → UAT Worker

## 10. Monitoring & Logging

### Cloudflare Analytics
- Real-time request analytics
- Error tracking
- Performance metrics
- Geographic distribution

### Logging
- Worker logs via Wrangler
- `npx wrangler tail` for live logs
- Error tracking in dashboard

### Recommended Alerts
- Error rate > 1%
- Response time > 5s
- D1 query errors

## 11. Comparison: AWS vs Cloudflare

| Aspect | AWS (Previous) | Cloudflare Workers (Current) |
|--------|----------------|------------------------------|
| **Cost** | ~$3-7/month | $0 (free tier) |
| **Cold Start** | 500ms-2s | Near-zero |
| **Global Edge** | CloudFront | Native (300+ PoPs) |
| **Database** | DynamoDB | D1 (SQLite) |
| **Complexity** | High (SST, IAM) | Low (Wrangler) |
| **Deploy Time** | ~5-10 min | ~15 sec |
| **Vendor Lock-in** | High | Medium |
| **Custom Domain** | Route53 + CloudFront | Native routing |

## 12. Environments

### 12.1 Environment Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Multi-Environment Architecture                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │   PRODUCTION    │  │     STAGING     │  │       UAT       │     │
│  │                 │  │                 │  │                 │     │
│  │ ankiren.com     │  │ staging.        │  │ uat.            │     │
│  │                 │  │ ankiren.com     │  │ ankiren.com     │     │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤     │
│  │ Worker:         │  │ Worker:         │  │ Worker:         │     │
│  │ ankiren         │  │ ankiren-staging │  │ ankiren-uat     │     │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤     │
│  │ D1:             │  │ D1:             │  │ D1:             │     │
│  │ ankiren-db      │  │ ankiren-db-     │  │ ankiren-db-uat  │     │
│  │                 │  │ staging         │  │                 │     │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘     │
│                                                                      │
│  SSL: Universal SSL (wildcard *.ankiren.com) - Active               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

| Environment | Purpose | Database | URL | SSL Status |
|-------------|---------|----------|-----|------------|
| **Production** | Live users | ankiren-db | https://ankiren.com | Active |
| **Staging** | Pre-production testing | ankiren-db-staging | https://staging.ankiren.com | Active |
| **UAT** | User acceptance testing | ankiren-db-uat | https://uat.ankiren.com | Active |

### 12.2 Production URLs

| URL | Purpose | Status |
|-----|---------|--------|
| https://ankiren.com | Primary domain | Active |
| https://www.ankiren.com | WWW redirect | Active |
| https://api.ankiren.com | API endpoint | Active |
| https://ankiren.anhv-ict91.workers.dev | Backup/Dev URL | Active |

### 12.3 Staging URLs

| URL | Purpose | Status |
|-----|---------|--------|
| https://staging.ankiren.com | Staging domain | Active |
| https://ankiren-staging.anhv-ict91.workers.dev | Staging backup URL | Active |

### 12.4 UAT URLs

| URL | Purpose | Status |
|-----|---------|--------|
| https://uat.ankiren.com | UAT domain | Active |
| https://ankiren-uat.anhv-ict91.workers.dev | UAT backup URL | Active |

### 12.5 Deployment Commands

```bash
# Build for Cloudflare Workers (required before deploy)
npm run build:cloudflare

# Deploy to Production
npx wrangler deploy

# Deploy to Staging
npx wrangler deploy --env staging

# Deploy to UAT
npx wrangler deploy --env uat

# Set secrets for each environment
npx wrangler secret put NEXTAUTH_SECRET                    # Production
npx wrangler secret put NEXTAUTH_SECRET --env staging      # Staging
npx wrangler secret put NEXTAUTH_SECRET --env uat          # UAT

# Run D1 migrations for each environment
npx wrangler d1 execute ankiren-db --remote --file=./migrations/0001_init.sql
npx wrangler d1 execute ankiren-db-staging --remote --file=./migrations/0001_init.sql
npx wrangler d1 execute ankiren-db-uat --remote --file=./migrations/0001_init.sql
```

### 12.6 Database IDs

| Environment | Database Name | Database ID |
|-------------|---------------|-------------|
| Production | ankiren-db | 8fc09382-3dd5-4cd4-9d66-5d94c7461b5d |
| Staging | ankiren-db-staging | 87fb2151-adec-4912-8d60-ec9b9e2fc2a1 |
| UAT | ankiren-db-uat | 55e69a81-d84d-4258-a159-ae737cc705e2 |

### 12.7 Environment Variables

| Variable | Production | Staging | UAT |
|----------|------------|---------|-----|
| NEXTAUTH_URL | https://ankiren.com | https://staging.ankiren.com | https://uat.ankiren.com |
| ENVIRONMENT | production | staging | uat |
| AUTH_TRUST_HOST | true | true | true |
| NEXTAUTH_SECRET | (secret) | (secret) | (secret) |
| GOOGLE_CLIENT_ID | (secret) | (secret) | (secret) |
| GOOGLE_CLIENT_SECRET | (secret) | (secret) | (secret) |

## 13. Future Improvements

### Short-term
- [ ] Add rate limiting
- [ ] Implement proper error boundaries
- [ ] Add loading skeletons
- [ ] Image/media support for cards

### Medium-term
- [ ] Import/Export (Anki .apkg format)
- [ ] Shared decks marketplace
- [ ] Mobile app (React Native)
- [ ] Offline support (PWA)

### Long-term
- [ ] AI-generated cards
- [ ] Speech recognition for language learning
- [ ] Multi-region D1 replication
- [ ] Real-time sync across devices
