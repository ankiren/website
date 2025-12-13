import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { encode } from "@auth/core/jwt";
import { getD1, db } from "@/lib/d1";

// Test-only authentication endpoint
// This endpoint is available in development and UAT environments
// It allows E2E tests to authenticate without going through Google OAuth

function isTestAuthAllowed(): boolean {
  // Allow in development mode
  if (process.env.NODE_ENV !== "production") {
    return true;
  }
  // Allow in UAT and Staging environments (for E2E tests)
  const environment = process.env.ENVIRONMENT;
  if (environment === "uat" || environment === "staging") {
    return true;
  }
  return false;
}

export async function POST(request: NextRequest) {
  if (!isTestAuthAllowed()) {
    return NextResponse.json(
      { error: "Test auth not available in this environment" },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user in database
    const d1 = getD1();
    const user = await db.user.findByEmail(d1, email);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get user's roles
    const roles = await db.userRole.findByUserId(d1, user.id);
    const roleNames = roles.map((r) => r.name);

    // Get user's permissions (from all roles)
    const allPermissions: string[] = [];
    for (const role of roles) {
      const permissions = await db.rolePermission.findByRoleId(d1, role.id);
      allPermissions.push(...permissions.map((p) => p.name));
    }
    const permissionNames = [...new Set(allPermissions)]; // deduplicate

    // Get AUTH_SECRET
    const secret = process.env.AUTH_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "AUTH_SECRET not configured" },
        { status: 500 }
      );
    }

    // Determine cookie name based on secure context
    // The salt for JWT encoding must match the cookie name
    const isSecure = process.env.NODE_ENV === "production";
    const cookieName = isSecure
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";

    // Create JWT token using Auth.js encode function
    // The token structure must match what the jwt callback expects
    const token = await encode({
      token: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.image,
        roles: roleNames,
        permissions: permissionNames,
        // Standard JWT claims
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
      },
      secret,
      salt: cookieName, // Salt must match the cookie name for Auth.js to decode
    });

    // Set the session cookie
    const cookieStore = await cookies();

    cookieStore.set(cookieName, token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: roleNames,
        permissions: permissionNames,
      },
    });
  } catch (error) {
    console.error("Test auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

// Logout endpoint for test cleanup
export async function DELETE() {
  if (!isTestAuthAllowed()) {
    return NextResponse.json(
      { error: "Test auth not available in this environment" },
      { status: 404 }
    );
  }

  const cookieStore = await cookies();
  const isSecure = process.env.NODE_ENV === "production";
  const cookieName = isSecure
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  cookieStore.delete(cookieName);

  return NextResponse.json({ success: true });
}
