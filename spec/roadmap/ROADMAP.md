# Ankiren Product Roadmap

**Version:** 0.1.0
**Last Updated:** 2025-12-11

---

## Current Status: MVP Released

The Minimum Viable Product is complete with core flashcard functionality using SM-2 spaced repetition.

---

## Release History

### v0.1.0 - MVP (Current)
**Status:** Released

| Feature | Epic | Status |
|---------|------|--------|
| User Registration & Login | EPIC-1 | Done |
| Deck CRUD | EPIC-2 | Done |
| Card CRUD | EPIC-3 | Done |
| Study Session with SM-2 | EPIC-4 | Done |
| Cloudflare Deployment | - | Done |
| Multi-environment Setup | - | Done |

---

## Future Roadmap

### v0.2.0 - Enhanced UX
**Status:** Planned

| Feature | Priority | RICE Score |
|---------|----------|------------|
| Loading skeletons | High | - |
| Error boundaries | High | - |
| Responsive improvements | Medium | - |
| Dark mode | Medium | - |
| Keyboard shortcuts | Low | - |

### v0.3.0 - Rich Content
**Status:** Planned

| Feature | Priority | RICE Score |
|---------|----------|------------|
| Image support in cards | High | - |
| Markdown formatting | High | - |
| Audio support | Medium | - |
| LaTeX/Math support | Low | - |

### v0.4.0 - Import/Export
**Status:** Planned

| Feature | Priority | RICE Score |
|---------|----------|------------|
| Export deck to JSON | High | - |
| Import deck from JSON | High | - |
| Anki .apkg import | Medium | - |
| CSV import/export | Medium | - |

### v0.5.0 - Analytics
**Status:** Planned

| Feature | Priority | RICE Score |
|---------|----------|------------|
| Study streak tracking | High | - |
| Daily/weekly stats | High | - |
| Card difficulty analysis | Medium | - |
| Progress charts | Medium | - |

### v1.0.0 - Social & Sharing
**Status:** Planned

| Feature | Priority | RICE Score |
|---------|----------|------------|
| Public deck sharing | High | - |
| Deck marketplace | High | - |
| User profiles | Medium | - |
| Deck ratings/reviews | Medium | - |

---

## Backlog (Unscheduled)

| Feature | Category | Notes |
|---------|----------|-------|
| Mobile app (React Native) | Platform | Major effort |
| Offline mode (PWA) | Platform | Service worker |
| AI-generated cards | AI | OpenAI integration |
| Speech recognition | AI | Language learning |
| Spaced repetition variants | Algorithm | FSRS, etc. |
| Multi-device sync | Infrastructure | Real-time |
| i18n support | Localization | Vietnamese first |
| Rate limiting | Security | DDoS protection |
| Email verification | Security | Account security |
| Password reset | Security | Self-service |

---

## Prioritization Framework

All features are scored using RICE:

- **Reach**: % of users affected (0-100%)
- **Impact**: Improvement level (3=massive, 2=high, 1=medium, 0.5=low)
- **Confidence**: Certainty (100%, 80%, 50%)
- **Effort**: Person-weeks to implement

**Score** = (Reach × Impact × Confidence) / Effort

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-12-11 | MVP scope limited to core SRS | Ship fast, iterate |
| 2025-12-11 | Cloudflare over AWS | Cost, simplicity |
| 2025-12-11 | JWT over database sessions | Stateless, edge-compatible |
| 2025-12-11 | SQLite/D1 over PostgreSQL | Cloudflare native |
