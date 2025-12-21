import { NextResponse } from "next/server";
import { authWithPAT } from "@/lib/auth";
import { getD1, db } from "@/lib/d1";
import { isAdmin, hasAnyPermission } from "@/lib/authorization";

// GET /api/admin/permissions - List all permissions
export async function GET(request: Request) {
  try {
    const session = await authWithPAT(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const canAccess =
      isAdmin(session.user.roles) ||
      hasAnyPermission(session.user.permissions, [
        "permissions:manage",
        "roles:manage",
      ]);
    if (!canAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const d1 = getD1();
    const permissions = await db.permission.findAll(d1);

    return NextResponse.json({
      permissions: permissions.map((p) => ({
        ...p,
        isSystem: Boolean(p.isSystem),
      })),
    });
  } catch (error) {
    console.error("[GET /api/admin/permissions] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/permissions - Create a new permission
export async function POST(request: Request) {
  try {
    const session = await authWithPAT(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const canAccess =
      isAdmin(session.user.roles) ||
      hasAnyPermission(session.user.permissions, ["permissions:manage"]);
    if (!canAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, description, resource, action } = await request.json();

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!resource || typeof resource !== "string" || resource.trim() === "") {
      return NextResponse.json(
        { error: "Resource is required" },
        { status: 400 }
      );
    }

    if (!action || typeof action !== "string" || action.trim() === "") {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      );
    }

    const d1 = getD1();

    // Check if permission name already exists
    const existing = await db.permission.findByName(d1, name.trim());
    if (existing) {
      return NextResponse.json(
        { error: "Permission name already exists" },
        { status: 400 }
      );
    }

    const permission = await db.permission.create(d1, {
      name: name.trim(),
      description: description || undefined,
      resource: resource.trim(),
      action: action.trim(),
    });

    return NextResponse.json(
      { ...permission, isSystem: Boolean(permission.isSystem) },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/admin/permissions] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
