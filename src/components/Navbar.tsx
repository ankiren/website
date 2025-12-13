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
