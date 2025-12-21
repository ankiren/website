import { NextResponse } from "next/server";
import { authWithPAT } from "@/lib/auth";
import { getD1, db } from "@/lib/d1";

export async function GET(request: Request) {
  try {
    const session = await authWithPAT(request);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const d1 = getD1();
    const decks = await db.deck.findByUserId(d1, session.user.id);

    // Get cards and reviews for each deck to calculate stats
    const now = new Date();
    const decksWithStats = await Promise.all(
      decks.map(async (deck) => {
        const cards = await db.card.findByDeckId(d1, deck.id);
        const reviews = await db.review.findByUserAndDeck(
          d1,
          session.user!.id!,
          deck.id
        );

        const reviewMap = new Map(reviews.map((r) => [r.cardId, r]));

        let dueCount = 0;
        let newCount = 0;

        cards.forEach((card) => {
          const review = reviewMap.get(card.id);
          if (!review) {
            newCount++;
          } else if (new Date(review.dueDate) <= now) {
            dueCount++;
          }
        });

        return {
          id: deck.id,
          name: deck.name,
          description: deck.description,
          cardCount: cards.length,
          dueCount,
          newCount,
          createdAt: deck.createdAt,
          updatedAt: deck.updatedAt,
        };
      })
    );

    return NextResponse.json(decksWithStats);
  } catch (error) {
    console.error("Get decks error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await authWithPAT(request);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Deck name is required" },
        { status: 400 }
      );
    }

    const d1 = getD1();
    const deck = await db.deck.create(d1, {
      name,
      description,
      userId: session.user.id,
    });

    return NextResponse.json(deck);
  } catch (error) {
    console.error("Create deck error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
