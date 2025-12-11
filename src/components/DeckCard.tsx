"use client";

import Link from "next/link";
import Button from "./ui/Button";

interface DeckCardProps {
  id: string;
  name: string;
  description?: string | null;
  cardCount: number;
  dueCount: number;
  newCount: number;
  onDelete: (id: string) => void;
}

export default function DeckCard({
  id,
  name,
  description,
  cardCount,
  dueCount,
  newCount,
  onDelete,
}: DeckCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
          {description && (
            <p className="text-gray-600 mt-1 text-sm">{description}</p>
          )}
        </div>
        <button
          onClick={() => onDelete(id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Delete deck"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="flex gap-4 text-sm text-gray-600 mb-4">
        <span>{cardCount} cards</span>
        {newCount > 0 && (
          <span className="text-blue-600">{newCount} new</span>
        )}
        {dueCount > 0 && (
          <span className="text-orange-600">{dueCount} due</span>
        )}
      </div>

      <div className="flex gap-2">
        <Link href={`/dashboard/decks/${id}/study`} className="flex-1">
          <Button
            className="w-full"
            disabled={cardCount === 0}
          >
            Study
          </Button>
        </Link>
        <Link href={`/dashboard/decks/${id}`}>
          <Button variant="secondary">View</Button>
        </Link>
      </div>
    </div>
  );
}
