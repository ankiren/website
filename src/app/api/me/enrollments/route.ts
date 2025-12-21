import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getD1, db, Course, Enrollment } from "@/lib/d1";

interface EnrollmentWithCourse extends Enrollment {
  course?: Course;
}

// GET /api/me/enrollments - Get current user's enrollments
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const d1 = getD1();

    // Get user's enrollments
    const enrollments = await db.enrollment.findByUserId(d1, session.user.id);

    // Get course details for each enrollment
    const enrollmentsWithCourses: EnrollmentWithCourse[] = await Promise.all(
      enrollments.map(async (enrollment) => {
        const course = await db.course.findById(d1, enrollment.courseId);
        return {
          ...enrollment,
          course: course || undefined,
        };
      })
    );

    return NextResponse.json({ enrollments: enrollmentsWithCourses });
  } catch (error) {
    console.error("[GET /api/me/enrollments] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
