"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FlashCard from "./FlashCard";
import Button from "./ui/Button";
import { qualityMap } from "@/lib/sm2";

interface Review {
  dueDate: string;
}

interface Card {
  id: string;
  front: string;
  back: string;
  reviews: Review[];
}

interface StudySessionProps {
  deckId: string;
  deckName: string;
  cards: Card[];
}

export default function StudySession({ deckId, deckName, cards }: StudySessionProps) {
  const router = useRouter();
  const [dueCards, setDueCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [stats, setStats] = useState({ reviewed: 0, again: 0, good: 0 });

  useEffect(() => {
    // Filter cards that are due (new cards or past due date)
    const now = new Date();
    const due = cards.filter((card) => {
      const review = card.reviews[0];
      return !review || new Date(review.dueDate) <= now;
    });
    setDueCards(due);

    if (due.length === 0) {
      setCompleted(true);
    }
  }, [cards]);

  const currentCard = dueCards[currentIndex];

  const handleRate = async (rating: keyof typeof qualityMap) => {
    if (!currentCard || loading) return;

    setLoading(true);

    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: currentCard.id,
          quality: qualityMap[rating],
        }),
      });

      // Update stats
      setStats((prev) => ({
        reviewed: prev.reviewed + 1,
        again: rating === "again" ? prev.again + 1 : prev.again,
        good: rating === "good" || rating === "easy" ? prev.good + 1 : prev.good,
      }));

      // Move to next card
      if (currentIndex + 1 < dueCards.length) {
        setCurrentIndex((prev) => prev + 1);
        setFlipped(false);
      } else {
        setCompleted(true);
      }
    } catch (error) {
      console.error("Failed to save review:", error);
    } finally {
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {stats.reviewed === 0 ? "No Cards Due!" : "Session Complete!"}
        </h2>
        {stats.reviewed > 0 && (
          <p className="text-gray-600 mb-6">
            You reviewed {stats.reviewed} cards. {stats.good} correct, {stats.again}{" "}
            need more practice.
          </p>
        )}
        {stats.reviewed === 0 && (
          <p className="text-gray-600 mb-6">
            Great job! All cards in this deck have been reviewed. Come back later
            for more practice.
          </p>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push(`/dashboard/decks/${deckId}`)}>
            Back to Deck
          </Button>
          <Button variant="secondary" onClick={() => router.push("/dashboard")}>
            Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl mb-6">
        <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
          <span>{deckName}</span>
          <span>
            {currentIndex + 1} / {dueCards.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / dueCards.length) * 100}%` }}
          />
        </div>
      </div>

      <FlashCard
        front={currentCard.front}
        back={currentCard.back}
        flipped={flipped}
        onFlip={() => setFlipped(!flipped)}
      />

      {flipped && (
        <div className="mt-8 flex gap-4">
          <Button
            variant="danger"
            onClick={() => handleRate("again")}
            disabled={loading}
            className="min-w-24"
          >
            Again
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleRate("hard")}
            disabled={loading}
            className="min-w-24"
          >
            Hard
          </Button>
          <Button
            variant="primary"
            onClick={() => handleRate("good")}
            disabled={loading}
            className="min-w-24"
          >
            Good
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleRate("easy")}
            disabled={loading}
            className="min-w-24 bg-green-100 hover:bg-green-200 text-green-700"
          >
            Easy
          </Button>
        </div>
      )}
    </div>
  );
}
