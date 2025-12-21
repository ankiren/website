"use client";

import { SessionType } from "@/hooks/usePomodoro";

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  sessionType: SessionType;
  children?: React.ReactNode;
}

// Gradient colors for each session type
const sessionGradients: Record<SessionType, { start: string; end: string }> = {
  work: { start: "#ff6b6b", end: "#ee5a24" },
  shortBreak: { start: "#26de81", end: "#20bf6b" },
  longBreak: { start: "#4facfe", end: "#00f2fe" },
};

export default function CircularProgress({
  progress,
  size = 300,
  strokeWidth = 12,
  sessionType,
  children,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const gradientId = `gradient-${sessionType}`;
  const gradient = sessionGradients[sessionType];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-30 transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, ${gradient.start}, ${gradient.end})`,
          transform: "scale(0.85)",
        }}
      />

      <svg width={size} height={size} className="transform -rotate-90 relative z-10">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradient.start} />
            <stop offset="100%" stopColor={gradient.end} />
          </linearGradient>
          {/* Shadow filter */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor={gradient.start} floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle with gradient */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          filter="url(#shadow)"
          className="transition-all duration-300 ease-out"
        />
      </svg>

      {/* Centered content */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        {children}
      </div>
    </div>
  );
}
