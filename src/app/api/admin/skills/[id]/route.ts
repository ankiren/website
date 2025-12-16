import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getD1, db } from "@/lib/d1";
import { isAdmin } from "@/lib/authorization";

// GET /api/admin/skills/[id] - Get skill details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin permission
    if (!isAdmin(session.user.roles)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const skillId = parseInt(id, 10);

    if (isNaN(skillId)) {
      return NextResponse.json({ error: "Invalid skill ID" }, { status: 400 });
    }

    const d1 = getD1();
    const skill = await db.skill.findById(d1, skillId);

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    // Get additional data
    const [children, ancestors, directChildCount, totalDescendants] =
      await Promise.all([
        db.skill.findByParentId(d1, skillId),
        db.skill.getAncestors(d1, skillId),
        db.skill.countChildren(d1, skillId),
        db.skill.countAllDescendants(d1, skillId),
      ]);

    const depth = ancestors.length + 1;

    return NextResponse.json({
      ...skill,
      children,
      ancestors,
      stats: {
        directChildCount,
        totalDescendants,
        depth,
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/skills/[id]] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/skills/[id] - Update skill
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin permission
    if (!isAdmin(session.user.roles)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const skillId = parseInt(id, 10);

    if (isNaN(skillId)) {
      return NextResponse.json({ error: "Invalid skill ID" }, { status: 400 });
    }

    const { name, description, icon, color, parentId } = await request.json();

    const d1 = getD1();

    // Check skill exists
    const skill = await db.skill.findById(d1, skillId);
    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    // Validate name if provided
    if (name !== undefined) {
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
    }

    // Validate description length
    if (description !== undefined && description !== null && description.length > 500) {
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

    // Validate parent if provided
    if (parentId !== undefined) {
      // Can't set self as parent
      if (parentId === skillId) {
        return NextResponse.json(
          { error: "Cannot set skill as its own parent" },
          { status: 400 }
        );
      }

      // Check parent exists if not null
      if (parentId !== null) {
        const parent = await db.skill.findById(d1, parentId);
        if (!parent) {
          return NextResponse.json(
            { error: "Parent skill not found" },
            { status: 400 }
          );
        }

        // Check for circular reference - can't set a descendant as parent
        const isDescendant = await db.skill.isDescendantOf(d1, parentId, skillId);
        if (isDescendant) {
          return NextResponse.json(
            { error: "Cannot set skill as its own parent or descendant" },
            { status: 400 }
          );
        }
      }
    }

    // Build update data
    const updateData: {
      name?: string;
      description?: string | null;
      icon?: string;
      color?: number;
      parentId?: number | null;
    } = {};

    if (name !== undefined) {
      updateData.name = name.trim();
    }
    if (description !== undefined) {
      updateData.description = description || null;
    }
    if (icon !== undefined) {
      updateData.icon = icon;
    }
    if (color !== undefined) {
      updateData.color = color;
    }
    if (parentId !== undefined) {
      updateData.parentId = parentId;
    }

    const updatedSkill = await db.skill.update(d1, skillId, updateData);
    return NextResponse.json(updatedSkill);
  } catch (error) {
    console.error("[PUT /api/admin/skills/[id]] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/skills/[id] - Delete skill (cascade)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin permission
    if (!isAdmin(session.user.roles)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const skillId = parseInt(id, 10);

    if (isNaN(skillId)) {
      return NextResponse.json({ error: "Invalid skill ID" }, { status: 400 });
    }

    const d1 = getD1();

    const skill = await db.skill.findById(d1, skillId);
    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    // Get descendant count for info
    const descendantCount = await db.skill.countAllDescendants(d1, skillId);

    // Delete skill (CASCADE will delete children)
    await db.skill.delete(d1, skillId);

    return NextResponse.json({
      success: true,
      deleted: {
        skill: skill.name,
        childrenCount: descendantCount,
      },
    });
  } catch (error) {
    console.error("[DELETE /api/admin/skills/[id]] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
