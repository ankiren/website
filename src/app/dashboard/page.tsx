"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import DeckCard from "@/components/DeckCard";

interface Deck {
  id: string;
  name: string;
  description: string | null;
  cardCount: number;
  dueCount: number;
  newCount: number;
}

export default function DashboardPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDecks = async () => {
    try {
      const response = await fetch("/api/decks");
      const data = await response.json();
      // Ensure data is an array before setting
      setDecks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch decks:", error);
      setDecks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this deck?")) {
      return;
    }

    try {
      await fetch(`/api/decks/${id}`, { method: "DELETE" });
      setDecks(decks.filter((deck) => deck.id !== id));
    } catch (error) {
      console.error("Failed to delete deck:", error);
    }
  };

  const totalDue = decks.reduce((sum, deck) => sum + deck.dueCount, 0);
  const totalNew = decks.reduce((sum, deck) => sum + deck.newCount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Decks</h1>
          <p className="text-gray-600 mt-1">
            {totalDue + totalNew > 0 ? (
              <>
                {totalNew > 0 && <span className="text-blue-600">{totalNew} new</span>}
                {totalNew > 0 && totalDue > 0 && " and "}
                {totalDue > 0 && <span className="text-orange-600">{totalDue} due</span>}
                {" cards to review"}
              </>
            ) : (
              "No cards to review today"
            )}
          </p>
        </div>
        <Link href="/dashboard/decks/new">
          <Button>Create Deck</Button>
        </Link>
      </div>

      {decks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No decks yet
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first deck to start learning
          </p>
          <Link href="/dashboard/decks/new">
            <Button>Create Your First Deck</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <DeckCard
              key={deck.id}
              {...deck}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
