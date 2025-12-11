"use client";

import { useState } from "react";

interface FlashCardProps {
  front: string;
  back: string;
  flipped: boolean;
  onFlip: () => void;
}

export default function FlashCard({ front, back, flipped, onFlip }: FlashCardProps) {
  return (
    <div
      className="relative w-full max-w-2xl h-80 cursor-pointer perspective-1000"
      onClick={onFlip}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front of card */}
        <div
          className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-lg flex items-center justify-center p-8"
          style={{ backfaceVisibility: "hidden" }}
        >
          <p className="text-2xl text-gray-900 text-center">{front}</p>
        </div>

        {/* Back of card */}
        <div
          className="absolute w-full h-full backface-hidden bg-blue-50 rounded-2xl shadow-lg flex items-center justify-center p-8"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <p className="text-2xl text-gray-900 text-center">{back}</p>
        </div>
      </div>

      {!flipped && (
        <p className="text-center text-gray-500 mt-4 text-sm">
          Click to reveal answer
        </p>
      )}
    </div>
  );
}
