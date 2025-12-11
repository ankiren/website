import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getD1, db } from "@/lib/d1";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { front, back, deckId } = await request.json();

    if (!front || !back || !deckId) {
      return NextResponse.json(
        { error: "Front, back, and deckId are required" },
        { status: 400 }
      );
    }

    const d1 = getD1();

    // Verify deck belongs to user
    const deck = await db.deck.findByIdAndUserId(d1, deckId, session.user.id);

    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    const card = await db.card.create(d1, {
      front,
      back,
      deckId,
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error("Create card error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
