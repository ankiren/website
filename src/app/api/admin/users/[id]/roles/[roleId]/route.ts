import { NextResponse } from "next/server";
import { authWithPAT } from "@/lib/auth";
import { getD1, db } from "@/lib/d1";
import { isAdmin, hasAnyPermission } from "@/lib/authorization";

// DELETE /api/admin/users/[id]/roles/[roleId] - Remove role from user
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; roleId: string }> }
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

    const { id, roleId } = await params;
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

    // Check if user has this role
    const hasRole = await db.userRole.exists(d1, id, roleId);
    if (!hasRole) {
      return NextResponse.json(
        { error: "User does not have this role" },
        { status: 404 }
      );
    }

    // If removing admin role, check we're not removing the last admin
    if (role.name === "admin") {
      const adminCount = await db.userRole.countAdmins(d1);
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot remove last admin role" },
          { status: 400 }
        );
      }
    }

    // Remove role
    await db.userRole.remove(d1, id, roleId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/users/[id]/roles/[roleId]] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
