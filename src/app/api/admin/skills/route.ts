import { NextResponse } from "next/server";
import { authWithPAT } from "@/lib/auth";
import { getD1, db } from "@/lib/d1";
import { isAdmin } from "@/lib/authorization";

// GET /api/admin/skills - List all skills as tree
export async function GET(request: Request) {
  try {
    const session = await authWithPAT(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin permission
    if (!isAdmin(session.user.roles)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const flat = searchParams.get("flat") === "true";

    const d1 = getD1();

    let skills;
    if (search) {
      skills = await db.skill.search(d1, search);
    } else {
      skills = await db.skill.findAll(d1);
    }

    // Return flat list if requested, otherwise build tree
    if (flat) {
      return NextResponse.json({ skills });
    }

    const tree = await db.skill.buildTree(d1, skills);
    return NextResponse.json({ skills: tree });
  } catch (error) {
    console.error("[GET /api/admin/skills] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/skills - Create a new skill
export async function POST(request: Request) {
  try {
    const session = await authWithPAT(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin permission
    if (!isAdmin(session.user.roles)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, description, icon, color, parentId } = await request.json();

    // Validate name
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Skill name is required" },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return NextResponse.json(
        { error: "Skill name must be between 2 and 100 characters" },
        { status: 400 }
      );
    }

    // Validate description length
    if (description && description.length > 500) {
      return NextResponse.json(
        { error: "Description must be at most 500 characters" },
        { status: 400 }
      );
    }

    // Validate color range
    if (color !== undefined && (color < 0 || color > 9)) {
      return NextResponse.json(
        { error: "Color must be between 0 and 9" },
        { status: 400 }
      );
    }

    const d1 = getD1();

    // Validate parent exists if provided
    if (parentId !== null && parentId !== undefined) {
      const parent = await db.skill.findById(d1, parentId);
      if (!parent) {
        return NextResponse.json(
          { error: "Parent skill not found" },
          { status: 400 }
        );
      }
    }

    // Create skill
    const skill = await db.skill.create(d1, {
      name: trimmedName,
      description: description || undefined,
      icon: icon || "FileText",
      color: color ?? 0,
      parentId: parentId ?? null,
      createdBy: session.user.id,
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/skills] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
