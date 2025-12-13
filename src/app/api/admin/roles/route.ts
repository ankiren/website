import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getD1, db } from "@/lib/d1";
import { isAdmin, hasAnyPermission } from "@/lib/authorization";

// GET /api/admin/roles - List all roles
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check permission
    const canAccess =
      isAdmin(session.user.roles) ||
      hasAnyPermission(session.user.permissions, ["roles:manage", "roles:assign"]);
    if (!canAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const d1 = getD1();
    const roles = await db.role.findAll(d1);

    // Enrich with user count and permissions
    const enrichedRoles = await Promise.all(
      roles.map(async (role) => {
        const userCount = await db.role.countUsers(d1, role.id);
        const permissions = await db.rolePermission.findByRoleId(d1, role.id);
        return {
          ...role,
          isSystem: Boolean(role.isSystem),
          userCount,
          permissions: permissions.map((p) => p.name),
        };
      })
    );

    return NextResponse.json({ roles: enrichedRoles });
  } catch (error) {
    console.error("[GET /api/admin/roles] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/roles - Create a new role
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check permission
    const canAccess =
      isAdmin(session.user.roles) ||
      hasAnyPermission(session.user.permissions, ["roles:manage"]);
    if (!canAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, description, permissions } = await request.json();

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const d1 = getD1();

    // Check if role name already exists
    const existing = await db.role.findByName(d1, name.trim());
    if (existing) {
      return NextResponse.json(
        { error: "Role name already exists" },
        { status: 400 }
      );
    }

    // Create role
    const role = await db.role.create(d1, {
      name: name.trim(),
      description: description || undefined,
    });

    // Assign permissions if provided
    if (Array.isArray(permissions) && permissions.length > 0) {
      for (const permissionId of permissions) {
        const permission = await db.permission.findById(d1, permissionId);
        if (permission) {
          await db.rolePermission.assign(d1, role.id, permissionId);
        }
      }
    }

    return NextResponse.json(
      { ...role, isSystem: Boolean(role.isSystem) },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/admin/roles] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
