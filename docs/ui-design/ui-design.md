# Ankiren - UI Design System

## 1. Overview

Ankiren's UI is built with **Next.js 15 App Router** and **Tailwind CSS 4**, following a utility-first CSS approach with a custom component library. The design emphasizes clean, modern aesthetics optimized for learning and studying.

### Design Principles

| Principle | Description |
|-----------|-------------|
| **Simplicity** | Minimal distractions to keep focus on learning |
| **Consistency** | Reusable components with predictable behavior |
| **Accessibility** | WCAG-compliant with keyboard navigation support |
| **Responsiveness** | Mobile-first design with adaptive layouts |

---

## 2. Color Palette

### 2.1 Brand Colors

| Color | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| Primary Blue | `#2563eb` | `blue-600` | Primary actions, links, active states |
| Primary Hover | `#1d4ed8` | `blue-700` | Button hover states |
| Primary Light | `#dbeafe` | `blue-100` | Badges, highlights |

### 2.2 Semantic Colors

| Purpose | Color | Tailwind Class | Usage |
|---------|-------|----------------|-------|
| Success | `#16a34a` | `green-600` | Completed states, "Easy" button |
| Success Light | `#dcfce7` | `green-100` | Success badges |
| Warning | `#ca8a04` | `yellow-600` | Due cards count |
| Warning Light | `#fef9c3` | `yellow-100` | System role badges |
| Danger | `#dc2626` | `red-600` | Errors, "Again" button, delete |
| Danger Light | `#fee2e2` | `red-100` | Error messages |

### 2.3 Neutral Colors

| Purpose | Color | Tailwind Class | Usage |
|---------|-------|----------------|-------|
| Text Primary | `#171717` | `gray-900` | Headings, body text |
| Text Secondary | `#4b5563` | `gray-600` | Subtitles, descriptions |
| Text Muted | `#9ca3af` | `gray-400` | Placeholders, hints |
| Border | `#d1d5db` | `gray-300` | Input borders, dividers |
| Background | `#f9fafb` | `gray-50` | Page background |
| Surface | `#ffffff` | `white` | Cards, modals |

### 2.4 CSS Variables

```css
/* globals.css */
:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}
```

---

## 3. Typography

### 3.1 Font Stack

| Font | Variable | Usage |
|------|----------|-------|
| Geist Sans | `--font-geist-sans` | Primary text, headings |
| Geist Mono | `--font-geist-mono` | Code, monospace content |
| System Fallback | Arial, Helvetica | Fallback font |

### 3.2 Type Scale

| Element | Classes | Example |
|---------|---------|---------|
| H1 (Page Title) | `text-3xl font-bold` or `text-5xl font-bold` | "Your Decks", Landing hero |
| H2 (Section) | `text-2xl font-bold` or `text-3xl font-bold` | "Session Complete!" |
| H3 (Card Title) | `text-xl font-semibold` or `text-lg font-semibold` | Deck name, feature cards |
| Body | `text-base` | Default paragraph text |
| Small | `text-sm` | Labels, descriptions, hints |
| Extra Small | `text-xs` | Badges, metadata |

### 3.3 Font Weights

| Weight | Class | Usage |
|--------|-------|-------|
| Normal | `font-normal` | Body text |
| Medium | `font-medium` | Labels, button text |
| Semibold | `font-semibold` | Card titles, subtitles |
| Bold | `font-bold` | Headings |

---

## 4. Component Library

Detailed documentation for each component is available in the [components/](./components/) folder.

### 4.1 Base UI Components (`src/components/ui/`)

| Component | File | Description |
|-----------|------|-------------|
| [Button](./components/base/button.md) | `Button.tsx` | Multi-variant button with sizes (primary, secondary, danger, ghost) |
| [Input](./components/base/input.md) | `Input.tsx` | Text input with label and error support |
| [Card](./components/base/card.md) | `Card.tsx` | Container with white background and shadow |
| [Badge](./components/base/badge.md) | `Badge.tsx` | Small status indicator with color variants |
| [Modal](./components/base/modal.md) | `Modal.tsx` | Dialog overlay with keyboard/click-outside support |
| [Tabs](./components/base/tabs.md) | `Tabs.tsx` | Horizontal tab navigation |

### 4.2 Feature Components

| Component | File | Description |
|-----------|------|-------------|
| [FlashCard](./components/features/flashcard.md) | `FlashCard.tsx` | 3D flip animation card for study sessions |
| [StudySession](./components/features/studysession.md) | `StudySession.tsx` | Study controller with SM-2 rating buttons |
| [DeckCard](./components/features/deckcard.md) | `DeckCard.tsx` | Deck preview card with stats and actions |
| [Navbar](./components/features/navbar.md) | `Navbar.tsx` | Top navigation with auth state handling |
| [SkillCard](./components/features/skillcard.md) | `SkillCard.tsx` | Skill with circular score progress display |
| [ScoreInput](./components/features/scoreinput.md) | `ScoreInput.tsx` | Modal form for recording skill scores |
| [ProgressChart](./components/features/progresschart.md) | `ProgressChart.tsx` | Line chart for score history visualization |
| [SkillTree](./components/features/skilltree.md) | `SkillTree.tsx` | Hierarchical tree for skill organization |

### Quick Reference

```
components/
├── base/
│   ├── button.md       # Variants: primary, secondary, danger, ghost
│   ├── input.md        # Label + error state support
│   ├── card.md         # White container with shadow
│   ├── badge.md        # Pill-shaped status indicators
│   ├── modal.md        # Dialog with ESC/click-outside close
│   └── tabs.md         # Horizontal tab navigation
└── features/
    ├── flashcard.md    # 3D flip animation
    ├── studysession.md # SM-2 rating flow
    ├── deckcard.md     # Deck preview with hover effects
    ├── navbar.md       # Auth-aware navigation
    ├── skillcard.md    # Circular score progress display
    ├── scoreinput.md   # Score recording modal
    ├── progresschart.md # Score history line chart
    └── skilltree.md    # Hierarchical skill tree
```

---

## 5. Layout Patterns

### 5.1 Root Layout (`src/app/layout.tsx`)

```
<html>
  <body class="antialiased bg-gray-50">
    <Providers>  <- SessionProvider wrapper
      {children}
    </Providers>
  </body>
</html>
```

### 5.2 Dashboard Layout (`src/app/dashboard/layout.tsx`)

**Protected layout with navigation**

```
┌─────────────────────────────────────────────────────────┐
│                        Navbar                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │                                                  │    │
│  │              max-w-7xl mx-auto                  │    │
│  │              px-4 sm:px-6 lg:px-8               │    │
│  │              py-8                                │    │
│  │                                                  │    │
│  │                  {children}                     │    │
│  │                                                  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Content Container Pattern

Standard max-width container used across pages:

```css
.container {
  max-width: 7xl (80rem / 1280px);
  margin: 0 auto;
  padding-x: 1rem (sm: 1.5rem, lg: 2rem);
}
```

---

## 6. Page Templates

Detailed documentation for each page template is available in the [pages/](./pages/) folder:

| Page | File | Description |
|------|------|-------------|
| [Landing](./pages/landing.md) | `src/app/page.tsx` | Public homepage with hero and feature grid |
| [Dashboard](./pages/dashboard.md) | `src/app/dashboard/page.tsx` | Deck grid with study statistics |
| [Auth](./pages/auth.md) | `src/app/login/page.tsx` | Login and registration pages |
| [Admin](./pages/admin.md) | `src/app/dashboard/admin/page.tsx` | User, role, and permission management |
| [Forms](./pages/forms.md) | `src/app/dashboard/decks/new/page.tsx` | Create/edit deck and card forms |
| [Study](./pages/study.md) | `src/app/dashboard/decks/[id]/study/page.tsx` | Flashcard study session with SM-2 rating |
| [Skills Dashboard](./pages/skills-dashboard.md) | `src/app/dashboard/skills/page.tsx` | User's tracked skills with scores |
| [Skill Detail](./pages/skill-detail.md) | `src/app/dashboard/skills/[id]/page.tsx` | Score history and progress charts |
| [Admin Skills](./pages/admin-skills.md) | `src/app/admin/skills/page.tsx` | Admin skill management with tree view |

### Quick Reference

```
pages/
├── landing.md          # Hero + feature grid layout
├── dashboard.md        # Deck grid with empty/loading states
├── auth.md             # Centered card with Google OAuth
├── admin.md            # Tabbed interface for RBAC management
├── forms.md            # Form patterns for create/edit
├── study.md            # FlashCard study session flow
├── skills-dashboard.md # Skill cards grid with filters
├── skill-detail.md     # Score history + progress chart
└── admin-skills.md     # Hierarchical skill tree management
```

---

## 7. Responsive Design

### 7.1 Breakpoints (Tailwind CSS)

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| Default | 0px | Mobile |
| `sm` | 640px | Tablet portrait |
| `md` | 768px | Tablet landscape |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |

### 7.2 Responsive Patterns

**Container Padding:**
```css
px-4       /* Mobile: 16px */
sm:px-6    /* Tablet: 24px */
lg:px-8    /* Desktop: 32px */
```

**Grid Columns:**
```css
grid-cols-1       /* Mobile: 1 column */
md:grid-cols-2    /* Tablet: 2 columns */
lg:grid-cols-3    /* Desktop: 3 columns */
```

**Navigation:**
- Mobile: Stack vertically or hide secondary items
- Desktop: Horizontal layout with all items visible

---

## 8. Animations & Transitions

### 8.1 Standard Transitions

| Element | Transition | Duration |
|---------|------------|----------|
| Buttons | `transition-colors` | Default (150ms) |
| Cards | `transition-shadow` | Default (150ms) |
| Icons | `transition-colors` | Default (150ms) |

### 8.2 FlashCard 3D Flip

```css
.flashcard {
  perspective: 1000px;
  transform-style: preserve-3d;
  transition: transform 500ms;
}

.flashcard.flipped {
  transform: rotateY(180deg);
}

.flashcard-face {
  backface-visibility: hidden;
}
```

### 8.3 Progress Bar

```css
.progress-bar {
  transition: width; /* Smooth width changes */
}
```

### 8.4 Modal

```css
.modal {
  transition: opacity, transform;
}
```

---

## 9. Icons

The app uses inline SVG icons for:

| Icon | Usage | Stroke Width |
|------|-------|--------------|
| Plus | Create/Add actions | 2 |
| Trash | Delete actions | 2 |
| Check | Success states | 2 |
| X (Close) | Modal close | 2 |
| Lock | System roles | 2 |
| Chart bars | Progress/stats | 2 |
| Folder/Box | Empty states | 2 |

**SVG Icon Pattern:**
```jsx
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="..." />
</svg>
```

---

## 10. States

### 10.1 Loading States

**Spinner/Text Pattern:**
```jsx
<div className="flex items-center justify-center h-64">
  <div className="text-gray-600">Loading...</div>
</div>
```

**Button Loading:**
```jsx
<Button disabled>
  {loading ? "Creating..." : "Create Deck"}
</Button>
```

### 10.2 Empty States

**Structure:**
```
┌─────────────────────────────────────────────────────────┐
│                       [Icon]                             │
│                                                          │
│                    Primary Message                       │
│                  Secondary message                       │
│                                                          │
│                   [Action Button]                        │
└─────────────────────────────────────────────────────────┘
```

**Styles:**
- Container: `text-center py-12 bg-white rounded-xl shadow-md`
- Icon: `w-16 h-16 text-gray-400 mx-auto mb-4`
- Title: `text-xl font-semibold text-gray-900 mb-2`
- Subtitle: `text-gray-600 mb-4`

### 10.3 Error States

**Inline Error:**
```jsx
<div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm">
  {error}
</div>
```

**Input Error:**
- Border: `border-red-500`
- Message: `text-sm text-red-500 mt-1`

---

## 11. Accessibility

### 11.1 Focus Management

- All interactive elements have visible focus rings
- Focus pattern: `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`
- Modal traps focus when open

### 11.2 Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move focus to next element |
| Enter | Activate buttons/links |
| Escape | Close modals |
| Click | Flip flashcard |

### 11.3 Screen Reader Support

- Semantic HTML elements (`<nav>`, `<main>`, `<button>`)
- ARIA labels on icon-only buttons: `aria-label="Delete deck"`
- Form labels properly associated with inputs

### 11.4 Color Contrast

All text combinations meet WCAG AA standards:
- Gray-900 on white: 14.1:1
- Gray-600 on white: 6.8:1
- White on blue-600: 4.7:1

---

## 12. Component Usage Examples

### Creating a New Page

```tsx
// src/app/dashboard/example/page.tsx
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function ExamplePage() {
  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Page Title</h1>
          <p className="text-gray-600 mt-1">Subtitle text</p>
        </div>
        <Button>Action</Button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          {/* Card content */}
        </Card>
      </div>
    </div>
  );
}
```

### Form Pattern

```tsx
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

export default function FormExample() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Form Title</h1>
      <Card>
        <form className="space-y-4">
          <Input id="field" label="Field Label" required />
          <div className="flex gap-4 pt-4">
            <Button type="submit">Submit</Button>
            <Button type="button" variant="secondary">Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
```

---

## 13. Future Considerations

### Planned Improvements
- [ ] Dark mode support (CSS variables already in place)
- [ ] Loading skeleton components
- [ ] Toast notification system
- [ ] Dropdown menu component
- [ ] Data table component for admin views
- [ ] Image/media support in flashcards

### Design System Evolution
- Consider migrating to a component library (e.g., Radix UI primitives)
- Add Storybook for component documentation
- Implement design tokens for theming
