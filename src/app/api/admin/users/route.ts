import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getD1, db } from "@/lib/d1";
import { isAdmin, hasAnyPermission } from "@/lib/authorization";

// GET /api/admin/users - List users with roles (paginated)
export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
    );
    const search = searchParams.get("search") || undefined;
    const offset = (page - 1) * limit;

    const d1 = getD1();
    const { users, total } = await db.user.findAll(d1, { limit, offset, search });

    // Enrich users with roles
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const roles = await db.userRole.findByUserId(d1, user.id);
        return {
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
        };
      })
    );

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      users: enrichedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/users] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
