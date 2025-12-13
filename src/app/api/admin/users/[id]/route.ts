import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getD1, db } from "@/lib/d1";
import { isAdmin, hasAnyPermission } from "@/lib/authorization";

// GET /api/admin/users/[id] - Get user details with roles and permissions
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const canAccess =
      isAdmin(session.user.roles) ||
      hasAnyPermission(session.user.permissions, ["users:manage"]);
    if (!canAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const d1 = getD1();

    const user = await db.user.findById(d1, id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's roles
    const roles = await db.userRole.findByUserId(d1, id);
    const roleIds = roles.map((r) => r.id);

    // Get permissions from all roles
    const permissions = await db.permission.findByRoleIds(d1, roleIds);
    const permissionNames = [...new Set(permissions.map((p) => p.name))];

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: roles.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
      })),
      permissions: permissionNames,
    });
  } catch (error) {
    console.error("[GET /api/admin/users/[id]] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const canAccess =
      isAdmin(session.user.roles) ||
      hasAnyPermission(session.user.permissions, ["users:manage"]);
    if (!canAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Cannot delete yourself
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot delete yourself" },
        { status: 400 }
      );
    }

    const d1 = getD1();

    const user = await db.user.findById(d1, id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is admin
    const userRoles = await db.userRole.findByUserId(d1, id);
    const isUserAdmin = userRoles.some((r) => r.name === "admin");

    // If deleting an admin, check we're not deleting the last admin
    if (isUserAdmin) {
      const adminCount = await db.userRole.countAdmins(d1);
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot delete last admin user" },
          { status: 400 }
        );
      }
    }

    await db.user.delete(d1, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/users/[id]] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
