"use client";

import { useState, useRef, useEffect } from "react";
import { usePomodoro, SessionType, PomodoroDurations } from "@/hooks/usePomodoro";
import CircularProgress from "./CircularProgress";
import SessionTabs from "./SessionTabs";
import TimerControls from "./TimerControls";
import { CheckCircle2, Volume2, VolumeX, Settings, X, Maximize2, Minimize2 } from "lucide-react";

// Music tracks for each session type
const sessionMusic: Record<SessionType, string> = {
  work: "/sounds/freepik-feel-the-beat.mp3",
  shortBreak: "/sounds/freepik-a-special-morning.mp3",
  longBreak: "/sounds/freepik-rise-and-shine.mp3",
};

// Background gradients for each session type (inspired by Figma community design)
const backgroundGradients: Record<SessionType, string> = {
  work: "from-red-400 via-rose-400 to-pink-300",
  shortBreak: "from-teal-500 via-teal-400 to-emerald-400",
  longBreak: "from-violet-400 via-purple-400 to-indigo-400",
};

const sessionLabels: Record<SessionType, string> = {
  work: "Focus Time",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

export default function PomodoroTimer() {
  const {
    sessionType,
    progress,
    isRunning,
    completedSessions,
    durations,
    toggle,
    reset,
    skip,
    setSessionType,
    setDurations,
    formattedTime,
  } = usePomodoro();

  const [isMusicEnabled, setIsMusicEnabled] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tempDurations, setTempDurations] = useState<PomodoroDurations>(durations);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sync temp durations when durations change
  useEffect(() => {
    setTempDurations(durations);
  }, [durations]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isInFullscreen = document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement;
      setIsFullscreen(!!isInFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Handle music playback based on timer state and music toggle
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    const audio = audioRef.current;

    if (isMusicEnabled && isRunning) {
      // Change track if session type changed
      if (audio.src !== window.location.origin + sessionMusic[sessionType]) {
        audio.src = sessionMusic[sessionType];
      }
      audio.play().catch(() => {
        // Autoplay may be blocked, user needs to interact first
      });
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
    };
  }, [isMusicEnabled, isRunning, sessionType]);

  const toggleMusic = () => {
    setIsMusicEnabled(!isMusicEnabled);
  };

  // Custom toggle that auto-enables music when starting
  const handleToggleTimer = () => {
    if (!isRunning) {
      // Starting the timer - auto enable music
      setIsMusicEnabled(true);
    }
    toggle();
  };

  const toggleFullscreen = async () => {
    const element = containerRef.current;
    if (!element) return;

    // Check if currently in fullscreen
    const isInFullscreen = document.fullscreenElement ||
      (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement;

    if (!isInFullscreen) {
      try {
        // Try standard API first, then webkit
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if ((element as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
          await (element as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
        }
      } catch (err) {
        console.error("Fullscreen error:", err);
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as unknown as { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
          await (document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
        }
      } catch (err) {
        console.error("Exit fullscreen error:", err);
      }
    }
  };

  const handleSaveSettings = () => {
    setDurations(tempDurations);
    setIsSettingsOpen(false);
  };

  const handleCancelSettings = () => {
    setTempDurations(durations);
    setIsSettingsOpen(false);
  };

  const updateTempDuration = (type: keyof PomodoroDurations, minutes: number) => {
    setTempDurations((prev) => ({
      ...prev,
      [type]: Math.max(1, Math.min(60, minutes)) * 60, // Convert to seconds, 1-60 min range
    }));
  };

  return (
    <div
      ref={containerRef}
      className={`
        h-full w-full
        px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10
        bg-gradient-to-br ${backgroundGradients[sessionType]}
        transition-all duration-700 ease-in-out
        flex flex-col items-center
        safe-area-inset
      `}
      style={{ paddingTop: 'max(env(safe-area-inset-top), 1.5rem)', paddingBottom: 'max(env(safe-area-inset-bottom), 1.5rem)' }}
    >
      {/* Fullscreen Toggle - top right */}
      <button
        onClick={toggleFullscreen}
        className="fixed top-4 right-4 p-2.5 bg-black/20 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/30 rounded-full transition-all z-50"
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
      </button>
      {/* Session Tabs - top */}
      <div className="w-full flex justify-center pt-8 sm:pt-4">
        <SessionTabs
          activeSession={sessionType}
          onSessionChange={setSessionType}
          durations={durations}
        />
      </div>

      {/* Timer Display - Responsive sizes */}
      <div className="flex flex-col items-center flex-1 justify-center">
        {/* Mobile: 220px, sm: 280px, md: 340px, lg: 400px, xl: 450px */}
        <div className="block sm:hidden">
          <CircularProgress progress={progress} sessionType={sessionType} size={220} strokeWidth={10}>
            <div className="text-center">
              <div className="text-5xl font-bold text-white font-mono tracking-tight drop-shadow-lg">
                {formattedTime}
              </div>
              <div className="text-white/70 text-xs mt-1 font-medium uppercase tracking-wider">
                {sessionLabels[sessionType]}
              </div>
            </div>
          </CircularProgress>
        </div>
        <div className="hidden sm:block md:hidden">
          <CircularProgress progress={progress} sessionType={sessionType} size={280} strokeWidth={12}>
            <div className="text-center">
              <div className="text-6xl font-bold text-white font-mono tracking-tight drop-shadow-lg">
                {formattedTime}
              </div>
              <div className="text-white/70 text-sm mt-1 font-medium uppercase tracking-wider">
                {sessionLabels[sessionType]}
              </div>
            </div>
          </CircularProgress>
        </div>
        <div className="hidden md:block lg:hidden">
          <CircularProgress progress={progress} sessionType={sessionType} size={340} strokeWidth={14}>
            <div className="text-center">
              <div className="text-7xl font-bold text-white font-mono tracking-tight drop-shadow-lg">
                {formattedTime}
              </div>
              <div className="text-white/70 text-sm mt-2 font-medium uppercase tracking-wider">
                {sessionLabels[sessionType]}
              </div>
            </div>
          </CircularProgress>
        </div>
        <div className="hidden lg:block xl:hidden">
          <CircularProgress progress={progress} sessionType={sessionType} size={400} strokeWidth={16}>
            <div className="text-center">
              <div className="text-8xl font-bold text-white font-mono tracking-tight drop-shadow-lg">
                {formattedTime}
              </div>
              <div className="text-white/70 text-base mt-2 font-medium uppercase tracking-wider">
                {sessionLabels[sessionType]}
              </div>
            </div>
          </CircularProgress>
        </div>
        <div className="hidden xl:block">
          <CircularProgress progress={progress} sessionType={sessionType} size={450} strokeWidth={18}>
            <div className="text-center">
              <div className="text-9xl font-bold text-white font-mono tracking-tight drop-shadow-lg">
                {formattedTime}
              </div>
              <div className="text-white/70 text-lg mt-2 font-medium uppercase tracking-wider">
                {sessionLabels[sessionType]}
              </div>
            </div>
          </CircularProgress>
        </div>
      </div>

      {/* Controls - bottom section */}
      <div className="w-full max-w-md space-y-4 sm:space-y-6 pb-4">
        <TimerControls
          isRunning={isRunning}
          onToggle={handleToggleTimer}
          onReset={reset}
          onSkip={skip}
        />

        {/* Music Toggle & Session Counter */}
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          {/* Music Toggle */}
          <button
            onClick={toggleMusic}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
              transition-all duration-200 active:scale-95
              ${isMusicEnabled
                ? "bg-white/25 text-white"
                : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
              }
            `}
            title={isMusicEnabled ? "Turn off music" : "Turn on music"}
          >
            {isMusicEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            <span>{isMusicEnabled ? "On" : "Off"}</span>
          </button>

          {/* Session Counter */}
          {completedSessions > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/80">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">
                {completedSessions}
              </span>
            </div>
          )}

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                       bg-white/10 text-white/70 hover:bg-white/15 hover:text-white
                       transition-all duration-200 active:scale-95"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Timer Settings</h2>
              <button
                onClick={handleCancelSettings}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Focus Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Focus Duration
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="60"
                    value={Math.round(tempDurations.work / 60)}
                    onChange={(e) => updateTempDuration("work", parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                  <span className="w-16 text-center text-sm font-medium text-gray-900 bg-gray-100 rounded-lg py-1.5">
                    {Math.round(tempDurations.work / 60)} min
                  </span>
                </div>
              </div>

              {/* Short Break Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Break
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={Math.round(tempDurations.shortBreak / 60)}
                    onChange={(e) => updateTempDuration("shortBreak", parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <span className="w-16 text-center text-sm font-medium text-gray-900 bg-gray-100 rounded-lg py-1.5">
                    {Math.round(tempDurations.shortBreak / 60)} min
                  </span>
                </div>
              </div>

              {/* Long Break Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Long Break
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="60"
                    value={Math.round(tempDurations.longBreak / 60)}
                    onChange={(e) => updateTempDuration("longBreak", parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <span className="w-16 text-center text-sm font-medium text-gray-900 bg-gray-100 rounded-lg py-1.5">
                    {Math.round(tempDurations.longBreak / 60)} min
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-4 border-t bg-gray-50">
              <button
                onClick={handleCancelSettings}
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
