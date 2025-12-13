# Auth Pages

**Locations:**
- `src/app/login/page.tsx`
- `src/app/register/page.tsx`

## Overview

The authentication pages provide a clean, centered card layout for user sign-in and registration. Currently supports Google OAuth as the primary authentication method.

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│            ┌───────────────────────────┐                │
│            │         Ankiren           │                │
│            │        Welcome back       │                │
│            │   Sign in to your account │                │
│            ├───────────────────────────┤                │
│            │ [Error message if any]    │                │
│            ├───────────────────────────┤                │
│            │                           │                │
│            │  [G] Continue with Google │                │
│            │                           │                │
│            ├───────────────────────────┤                │
│            │ Don't have an account?    │                │
│            │       Sign up             │                │
│            └───────────────────────────┘                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Components Used

- `Card` - Container for the auth form

## Page Styles

| Element | Styles |
|---------|--------|
| Container | `min-h-screen flex items-center justify-center px-4` |
| Card | `w-full max-w-md` |

## Sections

### Header Section

| Element | Styles |
|---------|--------|
| Container | `text-center mb-8` |
| Logo | `text-3xl font-bold text-blue-600` |
| Title | `text-2xl font-semibold text-gray-900 mt-4` |
| Subtitle | `text-gray-600 mt-2` |

### Error Message

| Element | Styles |
|---------|--------|
| Container | `bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm mb-4` |

### Google Sign-In Button

| Element | Styles |
|---------|--------|
| Button | `w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors` |
| Disabled | `disabled:opacity-50 disabled:cursor-not-allowed` |
| Google Icon | `w-5 h-5` (inline SVG with brand colors) |

### Footer Link

| Element | Styles |
|---------|--------|
| Container | `text-center text-gray-600 mt-6` |
| Link | `text-blue-600 hover:underline` |

## Google Icon SVG

```jsx
<svg className="w-5 h-5" viewBox="0 0 24 24">
  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92..." />
  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77..." />
  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s..." />
  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15..." />
</svg>
```

## Page Variants

### Login Page

**Title:** "Welcome back"
**Subtitle:** "Sign in to your account"
**Footer:** "Don't have an account? Sign up"

### Register Page

**Title:** "Create an account"
**Subtitle:** "Get started with Ankiren"
**Footer:** "Already have an account? Sign in"

## States

### Loading State

Button text changes during sign-in:
- Default: "Continue with Google"
- Loading: "Signing in..."

### Error State

Displays error message above the sign-in button:
```jsx
{error && (
  <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm mb-4">
    {error}
  </div>
)}
```

## Authentication Flow

```typescript
const handleGoogleSignIn = async () => {
  setError("");
  setGoogleLoading(true);
  try {
    await signIn("google", { callbackUrl: "/dashboard" });
  } catch {
    setError("An error occurred with Google sign in. Please try again.");
    setGoogleLoading(false);
  }
};
```

## Code Example

```tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Card from "@/components/ui/Card";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setError("An error occurred with Google sign in. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-blue-600">
            Ankiren
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 mt-4">
            Welcome back
          </h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {/* Google Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Google Icon */}
          {googleLoading ? "Signing in..." : "Continue with Google"}
        </button>

        {/* Footer */}
        <p className="text-center text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}
```
