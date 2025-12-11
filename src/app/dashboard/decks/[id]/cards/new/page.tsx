"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function NewCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: deckId } = use(params);
  const router = useRouter();
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ front, back, deckId }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to create card");
        return;
      }

      // Clear form and allow adding more cards
      setFront("");
      setBack("");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href={`/dashboard/decks/${deckId}`}
        className="text-blue-600 hover:underline text-sm mb-4 inline-block"
      >
        &larr; Back to Deck
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Card</h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="front"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Front (Question)
            </label>
            <textarea
              id="front"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              required
              placeholder="Enter the question or term"
            />
          </div>

          <div>
            <label
              htmlFor="back"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Back (Answer)
            </label>
            <textarea
              id="back"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              required
              placeholder="Enter the answer or definition"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Card"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push(`/dashboard/decks/${deckId}`)}
            >
              Done
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
