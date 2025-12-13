import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// GET /api/me/permissions - Get current user's roles and permissions
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      roles: session.user.roles,
      permissions: session.user.permissions,
    });
  } catch (error) {
    console.error("[GET /api/me/permissions] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
