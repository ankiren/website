# Navbar Component

**Location:** `src/components/Navbar.tsx`

## Overview

The top navigation bar component that displays the logo, navigation links, and authentication state. Shows different content based on whether the user is logged in.

## Structure

### Authenticated State

```
┌─────────────────────────────────────────────────────────────┐
│ [Ankiren]       Dashboard  Admin  user@email.com  [Sign out]│
│  (logo)                      ^                               │
│                        (admin only)                          │
└─────────────────────────────────────────────────────────────┘
```

### Unauthenticated State

```
┌─────────────────────────────────────────────────────────────┐
│ [Ankiren]                              [Sign in] [Get Started]│
│  (logo)                                                       │
└─────────────────────────────────────────────────────────────┘
```

## Styles

### Container
```css
bg-white
shadow-sm
border-b
```

### Inner Wrapper
```css
max-w-7xl
mx-auto
px-4
sm:px-6
lg:px-8
```

### Content Row
```css
flex
justify-between
h-16
items-center
```

### Logo
```css
text-2xl
font-bold
text-blue-600
```

### Right Section
```css
flex
items-center
gap-4
```

### User Email
```css
text-gray-600
```

## Conditional Rendering

### Admin Link

Only shown if user has admin role:

```tsx
{session.user?.roles?.includes("admin") && (
  <Link href="/dashboard/admin">
    <Button variant="ghost">Admin</Button>
  </Link>
)}
```

### Authentication State

```tsx
{session ? (
  <>
    <Link href="/dashboard">
      <Button variant="ghost">Dashboard</Button>
    </Link>
    {/* Admin link if applicable */}
    <span className="text-gray-600">{session.user?.email}</span>
    <Button variant="secondary" onClick={() => signOut({ callbackUrl: "/" })}>
      Sign out
    </Button>
  </>
) : (
  <>
    <Link href="/login">
      <Button variant="ghost">Sign in</Button>
    </Link>
    <Link href="/register">
      <Button variant="primary">Get Started</Button>
    </Link>
  </>
)}
```

## Usage Examples

### In Layout

```tsx
// src/app/page.tsx (Landing page)
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>{/* Content */}</main>
    </div>
  );
}
```

### In Dashboard Layout

```tsx
// src/app/dashboard/layout.tsx
import Navbar from "@/components/Navbar";

export default async function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
```

## Sign Out Behavior

```typescript
signOut({ callbackUrl: "/" })
```

- Clears session
- Redirects to home page

## Navigation Links

| Link | Path | Condition | Variant |
|------|------|-----------|---------|
| Logo (Ankiren) | `/` | Always | Text link |
| Dashboard | `/dashboard` | Authenticated | Ghost button |
| Admin | `/dashboard/admin` | Admin role | Ghost button |
| Sign in | `/login` | Unauthenticated | Ghost button |
| Get Started | `/register` | Unauthenticated | Primary button |
| Sign out | - (action) | Authenticated | Secondary button |

## Responsive Behavior

The navbar uses responsive padding:
- Mobile: `px-4`
- Tablet: `sm:px-6`
- Desktop: `lg:px-8`

## Source Code

```tsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Button from "./ui/Button";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">Ankiren</span>
          </Link>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                {session.user?.roles?.includes("admin") && (
                  <Link href="/dashboard/admin">
                    <Button variant="ghost">Admin</Button>
                  </Link>
                )}
                <span className="text-gray-600">{session.user?.email}</span>
                <Button
                  variant="secondary"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
```

## Dependencies

- `next-auth/react` - For `useSession` and `signOut`
- `next/link` - For navigation
- `Button` component - For styled buttons

## Related Components

- `Button` - Used for all navigation actions
- `Providers` - Wraps app with SessionProvider for auth context
