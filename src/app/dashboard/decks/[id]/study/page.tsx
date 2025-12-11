import { auth } from "@/lib/auth";
import { getD1Async, db } from "@/lib/d1";
import { redirect } from "next/navigation";
import Link from "next/link";
import StudySession from "@/components/StudySession";

export default async function StudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    redirect("/login");
  }

  const d1 = await getD1Async();
  const deck = await db.deck.findByIdAndUserId(d1, id, session.user.id);

  if (!deck) {
    redirect("/dashboard");
  }

  const cards = await db.card.findByDeckId(d1, id);

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Cards</h2>
        <p className="text-gray-600 mb-6">
          This deck has no cards. Add some cards before studying.
        </p>
        <Link
          href={`/dashboard/decks/${id}/cards/new`}
          className="text-blue-600 hover:underline"
        >
          Add Cards
        </Link>
      </div>
    );
  }

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
        reviews: review
          ? [
              {
                ...review,
                dueDate: review.dueDate,
              },
            ]
          : [],
      };
    })
  );

  return (
    <div>
      <Link
        href={`/dashboard/decks/${id}`}
        className="text-blue-600 hover:underline text-sm mb-6 inline-block"
      >
        &larr; Back to {deck.name}
      </Link>

      <StudySession
        deckId={deck.id}
        deckName={deck.name}
        cards={cardsWithReviews}
      />
    </div>
  );
}
