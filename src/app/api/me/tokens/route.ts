import { NextResponse } from "next/server";
import { authWithPAT } from "@/lib/auth";
import { getD1, db, generatePAT } from "@/lib/d1";

// GET /api/me/tokens - List user's tokens
export async function GET(request: Request) {
  const session = await authWithPAT(request);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const d1 = getD1();
    const tokens = await db.pat.findByUserId(d1, session.user.id);

    return NextResponse.json({ tokens });
  } catch (error) {
    console.error("[GET /api/me/tokens] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tokens" },
      { status: 500 }
    );
  }
}

// POST /api/me/tokens - Create a new token
export async function POST(request: Request) {
  const session = await authWithPAT(request);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, expiresAt } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Token name is required" },
        { status: 400 }
      );
    }

    if (name.trim().length > 100) {
      return NextResponse.json(
        { error: "Token name must be 100 characters or less" },
        { status: 400 }
      );
    }

    // Validate expiresAt if provided
    let expiresAtDate: string | null = null;
    if (expiresAt) {
      const date = new Date(expiresAt);
      if (isNaN(date.getTime())) {
        return NextResponse.json(
          { error: "Invalid expiration date" },
          { status: 400 }
        );
      }
      if (date <= new Date()) {
        return NextResponse.json(
          { error: "Expiration date must be in the future" },
          { status: 400 }
        );
      }
      expiresAtDate = date.toISOString();
    }

    const d1 = getD1();

    // Generate token and hash
    const { token, hash } = await generatePAT();

    // Store token info (hash only, never the plain token)
    const tokenInfo = await db.pat.create(d1, {
      userId: session.user.id,
      name: name.trim(),
      tokenHash: hash,
      expiresAt: expiresAtDate,
    });

    // Return the plain token ONLY on creation
    // This is the only time the user will see the full token
    return NextResponse.json(
      {
        token, // Plain token - shown only once
        ...tokenInfo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/me/tokens] error:", error);
    return NextResponse.json(
      { error: "Failed to create token" },
      { status: 500 }
    );
  }
}
