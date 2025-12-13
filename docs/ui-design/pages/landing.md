# Landing Page

**Location:** `src/app/page.tsx`

## Overview

The landing page is the public-facing homepage that introduces Ankiren to new users. It features a hero section with a call-to-action and a feature grid showcasing the app's main benefits.

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                        Navbar                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│           Master Anything with                           │
│           Spaced Repetition (blue)                      │
│                                                          │
│   Description text about the app...                      │
│                                                          │
│         [Start Learning Free]  [Sign In]                │
│              (authenticated: [Go to Dashboard])          │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  [icon]  │  │  [icon]  │  │  [icon]  │              │
│  │          │  │          │  │          │              │
│  │ Create   │  │  Smart   │  │  Track   │              │
│  │  Decks   │  │ Reviews  │  │ Progress │              │
│  │          │  │          │  │          │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Components Used

- `Navbar` - Top navigation
- `Button` - CTA buttons (primary and secondary variants)

## Sections

### Hero Section

| Element | Styles |
|---------|--------|
| Container | `flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center` |
| Heading | `text-5xl font-bold text-gray-900` |
| Accent text | `text-blue-600` |
| Description | `text-xl text-gray-600 mb-8 max-w-2xl` |
| CTA buttons | `flex gap-4` |

### Feature Grid

| Element | Styles |
|---------|--------|
| Container | `mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left` |
| Feature card | `bg-white p-6 rounded-xl shadow-md` |
| Icon container | `w-12 h-12 rounded-lg flex items-center justify-center mb-4` |
| Icon | `w-6 h-6` |
| Title | `text-lg font-semibold text-gray-900 mb-2` |
| Description | `text-gray-600` |

### Feature Cards

| Feature | Icon Color | Background |
|---------|------------|------------|
| Create Decks | `text-blue-600` | `bg-blue-100` |
| Smart Reviews | `text-green-600` | `bg-green-100` |
| Track Progress | `text-purple-600` | `bg-purple-100` |

## Conditional Rendering

The CTA section changes based on authentication state:

**Unauthenticated:**
```jsx
<Link href="/register">
  <Button size="lg">Start Learning Free</Button>
</Link>
<Link href="/login">
  <Button variant="secondary" size="lg">Sign In</Button>
</Link>
```

**Authenticated:**
```jsx
<Link href="/dashboard">
  <Button size="lg">Go to Dashboard</Button>
</Link>
```

## Responsive Behavior

| Breakpoint | Feature Grid |
|------------|--------------|
| Mobile | 1 column |
| `md` (768px+) | 3 columns |

## Code Example

```tsx
"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Button from "@/components/ui/Button";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center">
          {/* Hero content */}
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Master Anything with
            <span className="text-blue-600"> Spaced Repetition</span>
          </h1>
          {/* ... */}
        </div>
      </main>
    </div>
  );
}
```
