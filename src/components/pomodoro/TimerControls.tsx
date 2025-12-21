"use client";

import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";

interface TimerControlsProps {
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
  onSkip?: () => void;
}

export default function TimerControls({
  isRunning,
  onToggle,
  onReset,
  onSkip,
}: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-6 sm:gap-8">
      {/* Reset button */}
      <button
        onClick={onReset}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/15 backdrop-blur-sm
                   flex items-center justify-center
                   text-white/90 hover:text-white hover:bg-white/25
                   transition-all duration-200 active:scale-90"
        title="Reset"
      >
        <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Play/Pause button - larger and prominent */}
      <button
        onClick={onToggle}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white shadow-2xl
                   flex items-center justify-center
                   text-gray-900 hover:scale-105
                   transition-all duration-200 active:scale-90"
        title={isRunning ? "Pause" : "Start"}
      >
        {isRunning ? (
          <Pause className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" />
        ) : (
          <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1" fill="currentColor" />
        )}
      </button>

      {/* Skip button */}
      <button
        onClick={onSkip}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/15 backdrop-blur-sm
                   flex items-center justify-center
                   text-white/90 hover:text-white hover:bg-white/25
                   transition-all duration-200 active:scale-90"
        title="Skip"
      >
        <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
}
