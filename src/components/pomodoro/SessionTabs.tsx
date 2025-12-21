"use client";

import { SessionType, PomodoroDurations } from "@/hooks/usePomodoro";
import { Timer, Coffee, Sunset } from "lucide-react";

interface SessionTabsProps {
  activeSession: SessionType;
  onSessionChange: (session: SessionType) => void;
  durations: PomodoroDurations;
}

const sessionConfig: {
  type: SessionType;
  label: string;
  icon: typeof Timer;
}[] = [
  { type: "work", label: "Focus", icon: Timer },
  { type: "shortBreak", label: "Short Break", icon: Coffee },
  { type: "longBreak", label: "Long Break", icon: Sunset },
];

export default function SessionTabs({
  activeSession,
  onSessionChange,
  durations,
}: SessionTabsProps) {
  return (
    <div className="inline-flex p-1 sm:p-1.5 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-sm">
      {sessionConfig.map(({ type, label, icon: Icon }) => {
        const durationMinutes = Math.round(durations[type] / 60);
        return (
          <button
            key={type}
            onClick={() => onSessionChange(type)}
            className={`
              relative px-2.5 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3
              rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm
              transition-all duration-300
              flex items-center gap-1 sm:gap-2
              ${
                activeSession === type
                  ? "bg-white text-gray-900 shadow-lg"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }
            `}
          >
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden md:inline">{label}</span>
            <span className="text-[10px] sm:text-xs opacity-60">{durationMinutes}m</span>
          </button>
        );
      })}
    </div>
  );
}
