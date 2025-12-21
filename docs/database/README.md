# Ankiren Database Schema

DBML documentation for all database tables. View at [dbdiagram.io](https://dbdiagram.io/).

## Schema Files

| File | Description |
|------|-------------|
| [core.dbml](core.dbml) | User, Deck, Card, Review |
| [authorization.dbml](authorization.dbml) | Role, Permission, UserRole, RolePermission |
| [pat.dbml](pat.dbml) | PersonalAccessToken |
| [courses.dbml](courses.dbml) | Course, Enrollment |
| [skills.dbml](skills.dbml) | Skill (hierarchical tree) |

## Migrations

Located in `/migrations/`:

| File | Description |
|------|-------------|
| 0001_init.sql | User, Deck, Card, Review |
| 0002_google_oauth.sql | Google OAuth fields |
| 0003_authorization.sql | RBAC tables |
| 0004_skills.sql | Skill tree |
| 0005_courses.sql | Course, Enrollment |
| 0006_pat.sql | Personal Access Tokens |

## Database

- **Engine:** SQLite (Cloudflare D1)
- **Region:** APAC
