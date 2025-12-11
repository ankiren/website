# Ankiren

A modern flashcard learning application with SM-2 spaced repetition algorithm.

**Live:** [ankiren.com](https://ankiren.com)

## Features

- **Spaced Repetition**: SM-2 algorithm optimizes review intervals for long-term retention
- **Deck Management**: Organize flashcards into themed collections
- **Study Sessions**: Interactive flip cards with quality ratings (Again, Hard, Good, Easy)
- **Progress Tracking**: Track due cards, new cards, and review statistics
- **Multi-device**: Web-based, accessible from any browser

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Auth | NextAuth.js v5 (JWT) |
| Database | Cloudflare D1 (SQLite) |
| Deployment | Cloudflare Workers |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your NEXTAUTH_SECRET

# Initialize database
npm run db:migrate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run db:migrate   # Run database migrations
npm run db:generate  # Generate Prisma client
```

## Deployment

Deployed on Cloudflare Workers with three environments:

| Environment | URL |
|-------------|-----|
| Production | https://ankiren.com |
| Staging | https://staging.ankiren.com |
| UAT | https://uat.ankiren.com |

```bash
# Build for Cloudflare
npm run build:cloudflare

# Deploy
npx wrangler deploy              # Production
npx wrangler deploy --env staging    # Staging
npx wrangler deploy --env uat        # UAT
```

## Documentation

- [System Design](docs/system-design.md) - Architecture, API reference, deployment details
- [Product Specs](spec/) - PRDs, user stories, roadmap

## License

MIT
