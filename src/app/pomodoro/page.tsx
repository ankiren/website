"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import PomodoroTimer from "@/components/pomodoro/PomodoroTimer";

export default function PomodoroPage() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* Home button - floating */}
      <Link
        href="/"
        className="fixed top-4 left-4 p-2.5 bg-black/20 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/30 rounded-full transition-all z-50"
        title="Back to Home"
      >
        <Home size={20} />
      </Link>

      {/* Full screen timer */}
      <PomodoroTimer />
    </div>
  );
}
