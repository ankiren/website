import { NextResponse } from "next/server";

// CR-002: Email/password registration is disabled - Google OAuth only
export async function POST() {
  return NextResponse.json(
    { error: "Registration endpoint is disabled. Please use Google OAuth to sign up." },
    { status: 404 }
  );
}
