import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getD1, db } from "@/lib/d1";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const d1 = getD1();
    const deck = await db.deck.findByIdAndUserId(d1, id, session.user.id);

    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    // Get cards for the deck
    const cards = await db.card.findByDeckId(d1, id);

    // Get reviews for each card
    const cardsWithReviews = await Promise.all(
      cards.map(async (card) => {
        const review = await db.review.findByCardAndUser(
          d1,
          card.id,
          session.user!.id!
        );
        return {
          ...card,
          reviews: review ? [review] : [],
        };
      })
    );

    return NextResponse.json({
      ...deck,
      cards: cardsWithReviews,
    });
  } catch (error) {
    console.error("Get deck error:", error);
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
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description } = await request.json();

    const d1 = getD1();
    const existingDeck = await db.deck.findByIdAndUserId(
      d1,
      id,
      session.user.id
    );

    if (!existingDeck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    await db.deck.update(d1, id, { name, description });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update deck error:", error);
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
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const d1 = getD1();
    const existingDeck = await db.deck.findByIdAndUserId(
      d1,
      id,
      session.user.id
    );

    if (!existingDeck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    await db.deck.delete(d1, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete deck error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
