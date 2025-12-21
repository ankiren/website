import { NextResponse } from "next/server";
import { authWithPAT } from "@/lib/auth";
import { getD1, db } from "@/lib/d1";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/courses/[id]/enroll - Join a course
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const session = await authWithPAT(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const courseId = parseInt(id, 10);
    if (isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    const d1 = getD1();

    // Check if course exists and is published
    const course = await db.course.findById(d1, courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    if (course.status !== "published") {
      return NextResponse.json(
        { error: "Course is not available for enrollment" },
        { status: 400 }
      );
    }

    // Check if already enrolled
    const existingEnrollment = await db.enrollment.findByUserAndCourse(
      d1,
      session.user.id,
      courseId
    );
    if (existingEnrollment) {
      if (existingEnrollment.status === "active") {
        return NextResponse.json(
          { error: "Already enrolled in this course" },
          { status: 400 }
        );
      }
      // Re-activate if previously dropped
      const enrollment = await db.enrollment.updateStatus(
        d1,
        session.user.id,
        courseId,
        "active"
      );
      return NextResponse.json(enrollment);
    }

    // Create enrollment
    const enrollment = await db.enrollment.create(d1, {
      userId: session.user.id,
      courseId,
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    console.error("[POST /api/courses/[id]/enroll] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[id]/enroll - Leave a course
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await authWithPAT(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const courseId = parseInt(id, 10);
    if (isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    const d1 = getD1();

    // Check if enrolled
    const enrollment = await db.enrollment.findByUserAndCourse(
      d1,
      session.user.id,
      courseId
    );
    if (!enrollment || enrollment.status !== "active") {
      return NextResponse.json(
        { error: "Not enrolled in this course" },
        { status: 400 }
      );
    }

    // Update status to dropped (soft delete)
    await db.enrollment.updateStatus(d1, session.user.id, courseId, "dropped");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/courses/[id]/enroll] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
