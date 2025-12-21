import { NextResponse } from "next/server";
import { getD1, db } from "@/lib/d1";

// GET /api/courses - List published courses (public)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const d1 = getD1();

    let courses;
    if (search) {
      // Search only published courses
      const allResults = await db.course.search(d1, search);
      courses = allResults.filter((c) => c.status === "published");
    } else {
      courses = await db.course.findPublished(d1);
    }

    return NextResponse.json({ courses });
  } catch (error) {
    console.error("[GET /api/courses] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
