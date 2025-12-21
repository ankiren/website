import { NextResponse } from "next/server";
import { authWithPAT } from "@/lib/auth";
import { getD1, db } from "@/lib/d1";
import { isAdmin, hasAnyPermission } from "@/lib/authorization";

// POST /api/admin/users/[id]/roles - Assign role to user
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await authWithPAT(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const canAccess =
      isAdmin(session.user.roles) ||
      hasAnyPermission(session.user.permissions, ["roles:assign"]);
    if (!canAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const { roleId } = await request.json();

    if (!roleId || typeof roleId !== "string") {
      return NextResponse.json(
        { error: "Role ID is required" },
        { status: 400 }
      );
    }

    const d1 = getD1();

    // Check user exists
    const user = await db.user.findById(d1, id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check role exists
    const role = await db.role.findById(d1, roleId);
    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Check if user already has this role
    const hasRole = await db.userRole.exists(d1, id, roleId);
    if (hasRole) {
      return NextResponse.json(
        { error: "User already has this role" },
        { status: 400 }
      );
    }

    // Assign role
    await db.userRole.assign(d1, id, roleId);

    // Return updated roles
    const roles = await db.userRole.findByUserId(d1, id);
    return NextResponse.json({
      success: true,
      roles: roles.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
      })),
    });
  } catch (error) {
    console.error("[POST /api/admin/users/[id]/roles] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
