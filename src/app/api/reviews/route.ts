import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getD1, db } from "@/lib/d1";
import { sm2, Quality } from "@/lib/sm2";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cardId, quality } = await request.json();

    if (!cardId || quality === undefined) {
      return NextResponse.json(
        { error: "cardId and quality are required" },
        { status: 400 }
      );
    }

    const d1 = getD1();

    // Verify card belongs to user's deck
    const card = await db.card.findByIdWithDeck(d1, cardId, session.user.id);

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Get existing review or create default values
    const existingReview = await db.review.findByCardAndUser(
      d1,
      cardId,
      session.user.id
    );

    const currentEaseFactor = existingReview?.easeFactor ?? 2.5;
    const currentInterval = existingReview?.interval ?? 0;
    const currentRepetitions = existingReview?.repetitions ?? 0;

    // Calculate new values using SM-2
    const result = sm2(
      quality as Quality,
      currentRepetitions,
      currentEaseFactor,
      currentInterval
    );

    // Upsert review
    const review = await db.review.upsert(d1, {
      cardId,
      userId: session.user.id,
      easeFactor: result.easeFactor,
      interval: result.interval,
      repetitions: result.repetitions,
      dueDate: result.dueDate,
      lastReviewDate: new Date(),
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Review error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
