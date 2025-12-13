import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getD1, db } from "@/lib/d1";
import { isAdmin, hasAnyPermission } from "@/lib/authorization";

// GET /api/admin/roles/[id] - Get role details
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
      hasAnyPermission(session.user.permissions, ["roles:manage", "roles:assign"]);
    if (!canAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const d1 = getD1();

    const role = await db.role.findById(d1, id);
    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    const permissions = await db.rolePermission.findByRoleId(d1, id);
    const users = await db.userRole.findUsersByRoleId(d1, id);

    return NextResponse.json({
      ...role,
      isSystem: Boolean(role.isSystem),
      permissions: permissions.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
      })),
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
      })),
    });
  } catch (error) {
    console.error("[GET /api/admin/roles/[id]] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/roles/[id] - Update role
export async function PUT(
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
      hasAnyPermission(session.user.permissions, ["roles:manage"]);
    if (!canAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const { description, permissions } = await request.json();

    const d1 = getD1();

    const role = await db.role.findById(d1, id);
    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Update description
    if (description !== undefined) {
      await db.role.update(d1, id, { description });
    }

    // Sync permissions if provided
    if (Array.isArray(permissions)) {
      // Validate all permission IDs exist
      const validPermissionIds: string[] = [];
      for (const permissionId of permissions) {
        const permission = await db.permission.findById(d1, permissionId);
        if (permission) {
          validPermissionIds.push(permissionId);
        }
      }
      await db.rolePermission.sync(d1, id, validPermissionIds);
    }

    const updatedRole = await db.role.findById(d1, id);
    return NextResponse.json({
      ...updatedRole,
      isSystem: Boolean(updatedRole?.isSystem),
    });
  } catch (error) {
    console.error("[PUT /api/admin/roles/[id]] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/roles/[id] - Delete role
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
      hasAnyPermission(session.user.permissions, ["roles:manage"]);
    if (!canAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const d1 = getD1();

    const role = await db.role.findById(d1, id);
    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Cannot delete system roles
    if (role.isSystem) {
      return NextResponse.json(
        { error: "Cannot delete system role" },
        { status: 400 }
      );
    }

    // Cannot delete role with assigned users
    const userCount = await db.role.countUsers(d1, id);
    if (userCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete role with assigned users" },
        { status: 400 }
      );
    }

    await db.role.delete(d1, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/roles/[id]] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
