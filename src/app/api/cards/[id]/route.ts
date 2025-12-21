import { NextResponse } from "next/server";
import { authWithPAT } from "@/lib/auth";
import { getD1, db } from "@/lib/d1";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await authWithPAT(request);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const d1 = getD1();
    const cardWithDeck = await db.card.findByIdWithDeck(d1, id, session.user.id);

    if (!cardWithDeck) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const review = await db.review.findByCardAndUser(d1, id, session.user.id);

    return NextResponse.json({
      ...cardWithDeck,
      reviews: review ? [review] : [],
    });
  } catch (error) {
    console.error("Get card error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await authWithPAT(request);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { front, back } = await request.json();

    const d1 = getD1();

    // Verify card belongs to user's deck
    const existingCard = await db.card.findByIdWithDeck(d1, id, session.user.id);

    if (!existingCard) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const card = await db.card.update(d1, id, { front, back });

    return NextResponse.json(card);
  } catch (error) {
    console.error("Update card error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await authWithPAT(request);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const d1 = getD1();

    // Verify card belongs to user's deck
    const existingCard = await db.card.findByIdWithDeck(d1, id, session.user.id);

    if (!existingCard) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    await db.card.delete(d1, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete card error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
