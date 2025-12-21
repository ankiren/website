import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getD1, db } from "@/lib/d1";
import { isAdmin } from "@/lib/authorization";

// GET /api/admin/courses - List all courses
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin permission
    if (!isAdmin(session.user.roles)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const d1 = getD1();

    let courses;
    if (search) {
      courses = await db.course.search(d1, search);
    } else {
      courses = await db.course.findAll(d1, status || undefined);
    }

    return NextResponse.json({ courses });
  } catch (error) {
    console.error("[GET /api/admin/courses] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/courses - Create a new course
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin permission
    if (!isAdmin(session.user.roles)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, description, imageUrl, status } = await request.json();

    // Validate name
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Course name is required" },
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

    // Validate status
    const validStatuses = ["draft", "published", "archived"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be draft, published, or archived" },
        { status: 400 }
      );
    }

    const d1 = getD1();

    // Create course
    const course = await db.course.create(d1, {
      name: trimmedName,
      description: description || undefined,
      imageUrl: imageUrl || undefined,
      status: status || "draft",
      createdBy: session.user.id,
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/courses] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
