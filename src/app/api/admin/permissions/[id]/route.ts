import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getD1, db } from "@/lib/d1";
import { isAdmin, hasAnyPermission } from "@/lib/authorization";

// GET /api/admin/permissions/[id] - Get permission details
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
      hasAnyPermission(session.user.permissions, [
        "permissions:manage",
        "roles:manage",
      ]);
    if (!canAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const d1 = getD1();

    const permission = await db.permission.findById(d1, id);
    if (!permission) {
      return NextResponse.json(
        { error: "Permission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...permission,
      isSystem: Boolean(permission.isSystem),
    });
  } catch (error) {
    console.error("[GET /api/admin/permissions/[id]] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/permissions/[id] - Delete permission
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
      hasAnyPermission(session.user.permissions, ["permissions:manage"]);
    if (!canAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const d1 = getD1();

    const permission = await db.permission.findById(d1, id);
    if (!permission) {
      return NextResponse.json(
        { error: "Permission not found" },
        { status: 404 }
      );
    }

    // Cannot delete system permissions
    if (permission.isSystem) {
      return NextResponse.json(
        { error: "Cannot delete system permission" },
        { status: 400 }
      );
    }

    await db.permission.delete(d1, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/permissions/[id]] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
