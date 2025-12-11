"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface Review {
  id: string;
  dueDate: string;
  interval: number;
}

interface CardData {
  id: string;
  front: string;
  back: string;
  createdAt: string;
  reviews: Review[];
}

interface Deck {
  id: string;
  name: string;
  description: string | null;
  cards: CardData[];
}

export default function DeckPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const response = await fetch(`/api/decks/${id}`);
        if (!response.ok) {
          router.push("/dashboard");
          return;
        }
        const data = await response.json();
        setDeck(data);
      } catch (error) {
        console.error("Failed to fetch deck:", error);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDeck();
  }, [id, router]);

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm("Are you sure you want to delete this card?")) {
      return;
    }

    try {
      await fetch(`/api/cards/${cardId}`, { method: "DELETE" });
      setDeck((prev) =>
        prev
          ? { ...prev, cards: prev.cards.filter((c) => c.id !== cardId) }
          : null
      );
    } catch (error) {
      console.error("Failed to delete card:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!deck) {
    return null;
  }

  const now = new Date();
  const dueCards = deck.cards.filter((card) => {
    const review = card.reviews[0];
    return !review || new Date(review.dueDate) <= now;
  });

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <Link
            href="/dashboard"
            className="text-blue-600 hover:underline text-sm mb-2 inline-block"
          >
            &larr; Back to Decks
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{deck.name}</h1>
          {deck.description && (
            <p className="text-gray-600 mt-1">{deck.description}</p>
          )}
          <p className="text-gray-500 mt-2">
            {deck.cards.length} cards &bull; {dueCards.length} due
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/decks/${id}/study`}>
            <Button disabled={deck.cards.length === 0}>Study Now</Button>
          </Link>
          <Link href={`/dashboard/decks/${id}/cards/new`}>
            <Button variant="secondary">Add Card</Button>
          </Link>
        </div>
      </div>

      {deck.cards.length === 0 ? (
        <Card className="text-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No cards yet
          </h3>
          <p className="text-gray-600 mb-4">
            Add some flashcards to start studying
          </p>
          <Link href={`/dashboard/decks/${id}/cards/new`}>
            <Button>Add Your First Card</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {deck.cards.map((card) => {
            const review = card.reviews[0];
            const isDue = !review || new Date(review.dueDate) <= now;

            return (
              <Card key={card.id} className="flex justify-between items-start">
                <div className="flex-1 mr-4">
                  <p className="font-medium text-gray-900 mb-1">{card.front}</p>
                  <p className="text-gray-600 text-sm">{card.back}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    {isDue ? (
                      <span className="text-orange-600">Due now</span>
                    ) : (
                      <span>
                        Next review:{" "}
                        {new Date(review.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/cards/${card.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCard(card.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
