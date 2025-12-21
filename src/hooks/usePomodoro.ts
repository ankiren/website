"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type SessionType = "work" | "shortBreak" | "longBreak";

export interface PomodoroDurations {
  work: number;
  shortBreak: number;
  longBreak: number;
}

interface UsePomodoro {
  sessionType: SessionType;
  timeRemaining: number;
  isRunning: boolean;
  progress: number;
  completedSessions: number;
  durations: PomodoroDurations;
  start: () => void;
  pause: () => void;
  reset: () => void;
  toggle: () => void;
  skip: () => void;
  setSessionType: (type: SessionType) => void;
  setDurations: (durations: PomodoroDurations) => void;
  formattedTime: string;
}

const DEFAULT_DURATIONS: PomodoroDurations = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const STORAGE_KEY = "pomodoro-durations";

function loadDurations(): PomodoroDurations {
  if (typeof window === "undefined") return DEFAULT_DURATIONS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Ignore errors
  }
  return DEFAULT_DURATIONS;
}

function saveDurations(durations: PomodoroDurations): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(durations));
  } catch {
    // Ignore errors
  }
}

export function usePomodoro(): UsePomodoro {
  const [durations, setDurationsState] = useState<PomodoroDurations>(DEFAULT_DURATIONS);
  const [sessionType, setSessionTypeState] = useState<SessionType>("work");
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_DURATIONS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load durations from localStorage on mount
  useEffect(() => {
    const saved = loadDurations();
    setDurationsState(saved);
    setTimeRemaining(saved.work);
  }, []);

  // Initialize audio on client
  useEffect(() => {
    audioRef.current = new Audio("/sounds/notification.mp3");
  }, []);

  // Timer effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isRunning && timeRemaining > 0) {
      intervalId = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isRunning) {
      setIsRunning(false);
      audioRef.current?.play().catch(() => {
        // Handle autoplay restrictions silently
      });
      if (sessionType === "work") {
        setCompletedSessions((prev) => prev + 1);
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, timeRemaining, sessionType]);

  // Calculate progress (1 = full, 0 = empty)
  const totalDuration = durations[sessionType];
  const progress = timeRemaining / totalDuration;

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Actions
  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const toggle = useCallback(() => setIsRunning((prev) => !prev), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeRemaining(durations[sessionType]);
  }, [sessionType, durations]);

  const setSessionType = useCallback((type: SessionType) => {
    setSessionTypeState(type);
    setTimeRemaining(durations[type]);
    setIsRunning(false);
  }, [durations]);

  const setDurations = useCallback((newDurations: PomodoroDurations) => {
    setDurationsState(newDurations);
    saveDurations(newDurations);
    // Reset current timer to new duration
    setTimeRemaining(newDurations[sessionType]);
    setIsRunning(false);
  }, [sessionType]);

  // Skip to next session
  const skip = useCallback(() => {
    setIsRunning(false);
    if (sessionType === "work") {
      // After work, go to short break (or long break every 4 sessions)
      const nextType = (completedSessions + 1) % 4 === 0 ? "longBreak" : "shortBreak";
      setSessionTypeState(nextType);
      setTimeRemaining(durations[nextType]);
    } else {
      // After break, go back to work
      setSessionTypeState("work");
      setTimeRemaining(durations.work);
    }
  }, [sessionType, completedSessions, durations]);

  return {
    sessionType,
    timeRemaining,
    isRunning,
    progress,
    completedSessions,
    durations,
    start,
    pause,
    reset,
    toggle,
    skip,
    setSessionType,
    setDurations,
    formattedTime: formatTime(timeRemaining),
  };
}
