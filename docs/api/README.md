# Ankiren API Documentation

OpenAPI v3 specifications for all Ankiren APIs.

## Specifications

| File | Description |
|------|-------------|
| [flashcard-api.yaml](flashcard-api.yaml) | Decks, Cards, Reviews |
| [auth-api.yaml](auth-api.yaml) | Authentication & PAT |
| [authorization-api.yaml](authorization-api.yaml) | Roles, Permissions, Users |
| [course-api.yaml](course-api.yaml) | Courses & Enrollments |
| [skill-api.yaml](skill-api.yaml) | Skills Management |

## Base URLs

| Environment | URL |
|-------------|-----|
| Production | https://ankiren.com |
| Staging | https://staging.ankiren.com |
| UAT | https://uat.ankiren.com |

## Authentication

| Method | Header | Use Case |
|--------|--------|----------|
| Session | Cookie: `next-auth.session-token` | Browser |
| PAT | `Authorization: Bearer ank_xxx` | API/CLI |
