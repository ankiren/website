import { NextResponse } from "next/server";
import { authWithPAT } from "@/lib/auth";
import { getD1, db } from "@/lib/d1";
import { isAdmin } from "@/lib/authorization";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/courses/[id] - Get course by ID
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await authWithPAT(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin permission
    if (!isAdmin(session.user.roles)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const courseId = parseInt(id, 10);
    if (isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    const d1 = getD1();
    const course = await db.course.findById(d1, courseId);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Get enrollment count
    const enrollmentCount = await db.course.getEnrollmentCount(d1, courseId);

    return NextResponse.json({ ...course, enrollmentCount });
  } catch (error) {
    console.error("[GET /api/admin/courses/[id]] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/courses/[id] - Update course
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await authWithPAT(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin permission
    if (!isAdmin(session.user.roles)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const courseId = parseInt(id, 10);
    if (isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    const d1 = getD1();
    const existing = await db.course.findById(d1, courseId);

    if (!existing) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const { name, description, imageUrl, status } = await request.json();

    // Validate name if provided
    if (name !== undefined) {
      if (typeof name !== "string") {
        return NextResponse.json(
          { error: "Course name must be a string" },
          { status: 400 }
        );
      }
      const trimmedName = name.trim();
      if (trimmedName.length < 2 || trimmedName.length > 200) {
        return NextResponse.json(
          { error: "Course name must be between 2 and 200 characters" },
          { status: 400 }
        );
      }
    }

    // Validate status if provided
    const validStatuses = ["draft", "published", "archived"];
    if (status !== undefined && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be draft, published, or archived" },
        { status: 400 }
      );
    }

    const course = await db.course.update(d1, courseId, {
      name: name?.trim(),
      description,
      imageUrl,
      status,
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("[PUT /api/admin/courses/[id]] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/courses/[id] - Delete course
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await authWithPAT(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin permission
    if (!isAdmin(session.user.roles)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const courseId = parseInt(id, 10);
    if (isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    const d1 = getD1();
    const existing = await db.course.findById(d1, courseId);

    if (!existing) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    await db.course.delete(d1, courseId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/courses/[id]] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
