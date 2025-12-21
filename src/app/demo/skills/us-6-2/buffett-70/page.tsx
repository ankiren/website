"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Plus, Search, Sparkles, ChevronDown, Check, Edit2, Trash2, MoreHorizontal, GraduationCap, Briefcase, FolderKanban, Award, TrendingUp, Crown, Star, Zap, Calendar, MapPin, Link2, Users, MessageCircle, ExternalLink, CheckCircle2, ArrowUpRight, Flame, Target, Trophy, Gem, BadgeCheck, Play, Heart, MessageSquare, Share2, Bookmark, Music2, Eye, Volume2, ChevronLeft, ChevronRight, Camera, Send, Pause, SkipBack, SkipForward, Repeat, Shuffle, ThumbsUp, Smile, Image, Mic, Phone, Video, MoreVertical, Clock, Bell, Lock, Globe2, Headphones, Radio, Disc3, ListMusic, PlayCircle, Info, X, Volume1, Maximize2, MinusCircle, PlusCircle, CheckCheck, Circle, Podcast, Tv, Film, Clapperboard } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { DemoHeader, SkillIcon, getScoreLevel, RadarChart } from "../../_shared";
import { getBuffettSkills, getBuffettLifeAspects, getBuffettCourses, getBuffettRoles, getBuffettProjects, getBuffettCertificates, UserCustomSkill, Course, Role, Project, Certificate } from "../../_buffettSkills";

const PERSON_AGE = 70;
const PERSON_NAME = "Warren Buffett";
const PERSON_HEADLINE = "Chairman & CEO at Berkshire Hathaway";
const PERSON_LOCATION = "Omaha, Nebraska";

const SKILL_COLORS = [
  { name: "Violet", gradient: "from-violet-500 to-purple-600", bg: "bg-violet-500", light: "bg-violet-100", text: "text-violet-600" },
  { name: "Blue", gradient: "from-blue-500 to-cyan-500", bg: "bg-blue-500", light: "bg-blue-100", text: "text-blue-600" },
  { name: "Emerald", gradient: "from-emerald-500 to-teal-500", bg: "bg-emerald-500", light: "bg-emerald-100", text: "text-emerald-600" },
  { name: "Orange", gradient: "from-orange-500 to-amber-500", bg: "bg-orange-500", light: "bg-orange-100", text: "text-orange-600" },
  { name: "Pink", gradient: "from-pink-500 to-rose-500", bg: "bg-pink-500", light: "bg-pink-100", text: "text-pink-600" },
  { name: "Indigo", gradient: "from-indigo-500 to-blue-600", bg: "bg-indigo-500", light: "bg-indigo-100", text: "text-indigo-600" },
  { name: "Cyan", gradient: "from-cyan-500 to-blue-500", bg: "bg-cyan-500", light: "bg-cyan-100", text: "text-cyan-600" },
  { name: "Rose", gradient: "from-rose-500 to-pink-600", bg: "bg-rose-500", light: "bg-rose-100", text: "text-rose-600" },
  { name: "Amber", gradient: "from-amber-500 to-yellow-500", bg: "bg-amber-500", light: "bg-amber-100", text: "text-amber-600" },
  { name: "Teal", gradient: "from-teal-500 to-emerald-500", bg: "bg-teal-500", light: "bg-teal-100", text: "text-teal-600" },
];

const POPULAR_ICONS = ["BookOpen", "Code", "Calculator", "Brain", "Target", "Trophy", "Star", "Lightbulb", "Heart", "Globe", "Rocket", "Briefcase", "GraduationCap", "PenTool", "Mic", "Video"];

const initialUserSkills = getBuffettSkills(PERSON_AGE);
const lifeAspects = getBuffettLifeAspects(PERSON_AGE);
const courses = getBuffettCourses(PERSON_AGE);
const roles = getBuffettRoles(PERSON_AGE);
const projects = getBuffettProjects(PERSON_AGE);
const certificates = getBuffettCertificates(PERSON_AGE);

// TikTok-style video highlights
interface VideoHighlight {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  sound: string;
  tags: string[];
  gradient: string;
  icon: string;
}

const videoHighlights: VideoHighlight[] = [
  {
    id: 1,
    title: "The Power of Compound Interest",
    description: "How I turned $114 into $100 billion using one simple principle",
    thumbnail: "compound",
    duration: "0:45",
    views: 12500000,
    likes: 890000,
    comments: 45000,
    shares: 120000,
    sound: "Original Sound - Warren Buffett",
    tags: ["investing", "compound", "wealth"],
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    icon: "TrendingUp"
  },
  {
    id: 2,
    title: "Rule #1: Never Lose Money",
    description: "The most important investing advice I can give you",
    thumbnail: "rule1",
    duration: "0:32",
    views: 8900000,
    likes: 720000,
    comments: 38000,
    shares: 95000,
    sound: "Original Sound - Warren Buffett",
    tags: ["rules", "investing", "wisdom"],
    gradient: "from-amber-500 via-orange-500 to-red-500",
    icon: "Shield"
  },
  {
    id: 3,
    title: "Be Fearful When Others Are Greedy",
    description: "How contrarian thinking made me billions",
    thumbnail: "fearful",
    duration: "0:58",
    views: 15200000,
    likes: 1100000,
    comments: 62000,
    shares: 180000,
    sound: "Trending Audio",
    tags: ["psychology", "market", "timing"],
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    icon: "Brain"
  },
  {
    id: 4,
    title: "Value Investing 101",
    description: "Find great companies at fair prices, not fair companies at great prices",
    thumbnail: "value",
    duration: "1:12",
    views: 6800000,
    likes: 520000,
    comments: 28000,
    shares: 72000,
    sound: "Original Sound - Warren Buffett",
    tags: ["value", "stocks", "fundamentals"],
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    icon: "Search"
  },
  {
    id: 5,
    title: "My Morning Reading Routine",
    description: "I spend 5-6 hours a day reading. Here's why...",
    thumbnail: "reading",
    duration: "0:48",
    views: 9400000,
    likes: 680000,
    comments: 41000,
    shares: 88000,
    sound: "Lo-fi Study Beats",
    tags: ["reading", "learning", "habits"],
    gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
    icon: "BookOpen"
  },
  {
    id: 6,
    title: "Why I Live in the Same House",
    description: "Bought it for $31,500 in 1958. Still here.",
    thumbnail: "house",
    duration: "0:38",
    views: 18700000,
    likes: 1400000,
    comments: 89000,
    shares: 220000,
    sound: "Viral Sound",
    tags: ["lifestyle", "frugal", "mindset"],
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    icon: "Home"
  }
];

// Instagram Stories data
interface Story {
  id: number;
  name: string;
  avatar: string;
  hasNew: boolean;
  isLive?: boolean;
  gradient: string;
}

const instagramStories: Story[] = [
  { id: 1, name: "Your Story", avatar: "👴", hasNew: false, gradient: "from-gray-300 to-gray-400" },
  { id: 2, name: "Charlie M.", avatar: "👨‍🦳", hasNew: true, gradient: "from-yellow-400 via-red-500 to-purple-600" },
  { id: 3, name: "Bill Gates", avatar: "🧑‍💼", hasNew: true, gradient: "from-yellow-400 via-red-500 to-purple-600" },
  { id: 4, name: "Tim Cook", avatar: "👨‍💻", hasNew: true, isLive: true, gradient: "from-pink-500 to-rose-500" },
  { id: 5, name: "Elon Musk", avatar: "🚀", hasNew: true, gradient: "from-yellow-400 via-red-500 to-purple-600" },
  { id: 6, name: "Jeff Bezos", avatar: "📦", hasNew: false, gradient: "from-gray-300 to-gray-400" },
  { id: 7, name: "Mark Z.", avatar: "👤", hasNew: true, gradient: "from-yellow-400 via-red-500 to-purple-600" },
];

// Spotify playlist data
interface SpotifyTrack {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  isPlaying?: boolean;
  gradient: string;
}

const spotifyPlaylist: SpotifyTrack[] = [
  { id: 1, title: "The Intelligent Investor", artist: "Benjamin Graham", album: "Audiobook", duration: "4:32:15", isPlaying: true, gradient: "from-green-500 to-emerald-600" },
  { id: 2, title: "Money (That's What I Want)", artist: "Barrett Strong", album: "Classic", duration: "2:45", gradient: "from-purple-500 to-pink-500" },
  { id: 3, title: "Billionaire", artist: "Travie McCoy", album: "Hits", duration: "3:28", gradient: "from-amber-500 to-orange-500" },
  { id: 4, title: "Money, Money, Money", artist: "ABBA", album: "Arrival", duration: "3:07", gradient: "from-blue-500 to-cyan-500" },
];

// Netflix content data
interface NetflixContent {
  id: number;
  title: string;
  type: string;
  match: number;
  year: number;
  rating: string;
  gradient: string;
  icon: string;
  isNew?: boolean;
  topTen?: number;
}

const netflixContent: NetflixContent[] = [
  { id: 1, title: "Becoming Warren Buffett", type: "Documentary", match: 98, year: 2017, rating: "TV-PG", gradient: "from-red-600 to-red-800", icon: "Film", topTen: 1 },
  { id: 2, title: "The Big Short", type: "Movie", match: 95, year: 2015, rating: "R", gradient: "from-amber-600 to-orange-700", icon: "Clapperboard", isNew: true },
  { id: 3, title: "Inside Bill's Brain", type: "Documentary", match: 92, year: 2019, rating: "TV-14", gradient: "from-blue-600 to-indigo-700", icon: "Brain" },
  { id: 4, title: "Money Heist", type: "Series", match: 88, year: 2021, rating: "TV-MA", gradient: "from-red-700 to-rose-800", icon: "Tv" },
  { id: 5, title: "The Wolf of Wall Street", type: "Movie", match: 85, year: 2013, rating: "R", gradient: "from-emerald-600 to-teal-700", icon: "TrendingUp" },
];

// WhatsApp messages data
interface WhatsAppMessage {
  id: number;
  sender: string;
  avatar: string;
  message: string;
  time: string;
  unread: number;
  isOnline?: boolean;
  isTyping?: boolean;
}

const whatsappMessages: WhatsAppMessage[] = [
  { id: 1, sender: "Charlie Munger", avatar: "👨‍🦳", message: "The meeting went well. See you at the annual...", time: "2:34 PM", unread: 2, isOnline: true },
  { id: 2, sender: "Berkshire Board", avatar: "🏢", message: "Q4 earnings report is ready for review", time: "1:15 PM", unread: 5 },
  { id: 3, sender: "Bill Gates", avatar: "🧑‍💼", message: "Bridge game this weekend?", time: "11:42 AM", unread: 0, isOnline: true, isTyping: true },
  { id: 4, sender: "Family Group", avatar: "👨‍👩‍👧‍👦", message: "Howard: Dad, great speech yesterday!", time: "Yesterday", unread: 0 },
];

// Snapchat streaks data
interface SnapStreak {
  id: number;
  name: string;
  avatar: string;
  streak: number;
  emoji: string;
  lastSnap: string;
}

const snapStreaks: SnapStreak[] = [
  { id: 1, name: "Charlie M.", avatar: "👨‍🦳", streak: 2547, emoji: "🔥", lastSnap: "2m ago" },
  { id: 2, name: "Bill Gates", avatar: "🧑‍💼", streak: 1823, emoji: "💯", lastSnap: "15m ago" },
  { id: 3, name: "See's Candies", avatar: "🍬", streak: 892, emoji: "⚡", lastSnap: "1h ago" },
];

// Telegram channels data
interface TelegramChannel {
  id: number;
  name: string;
  avatar: string;
  subscribers: number;
  lastMessage: string;
  time: string;
  verified?: boolean;
}

const telegramChannels: TelegramChannel[] = [
  { id: 1, name: "Buffett's Letters", avatar: "📝", subscribers: 2500000, lastMessage: "2024 Annual Letter now available", time: "10:30 AM", verified: true },
  { id: 2, name: "Value Investing", avatar: "📈", subscribers: 890000, lastMessage: "Today's market analysis...", time: "9:15 AM", verified: true },
  { id: 3, name: "Berkshire News", avatar: "🏛️", subscribers: 1200000, lastMessage: "Stock buyback announced", time: "Yesterday" },
];

// CapCut templates data
interface CapCutTemplate {
  id: number;
  name: string;
  uses: number;
  duration: string;
  gradient: string;
  category: string;
}

const capCutTemplates: CapCutTemplate[] = [
  { id: 1, name: "Wealth Wisdom", uses: 125000, duration: "15s", gradient: "from-violet-500 to-purple-600", category: "Finance" },
  { id: 2, name: "Investment Tips", uses: 89000, duration: "30s", gradient: "from-amber-500 to-orange-500", category: "Education" },
  { id: 3, name: "Success Story", uses: 234000, duration: "60s", gradient: "from-emerald-500 to-teal-500", category: "Motivation" },
];

// ============ ADDICTIVE FEATURES DATA ============

// Daily Rewards (Variable Rewards + Streaks)
interface DailyReward {
  day: number;
  reward: string;
  xp: number;
  claimed: boolean;
  isToday: boolean;
  special?: boolean;
}

const dailyRewards: DailyReward[] = [
  { day: 1, reward: "🪙", xp: 50, claimed: true, isToday: false },
  { day: 2, reward: "💎", xp: 75, claimed: true, isToday: false },
  { day: 3, reward: "⭐", xp: 100, claimed: true, isToday: false },
  { day: 4, reward: "🎁", xp: 150, claimed: false, isToday: true },
  { day: 5, reward: "👑", xp: 200, claimed: false, isToday: false },
  { day: 6, reward: "🔥", xp: 250, claimed: false, isToday: false },
  { day: 7, reward: "🏆", xp: 500, claimed: false, isToday: false, special: true },
];

// Leaderboard (Social Competition)
interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  change: 'up' | 'down' | 'same';
  isYou?: boolean;
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "Charlie Munger", avatar: "👨‍🦳", xp: 125400, level: 99, change: 'same' },
  { rank: 2, name: "Warren Buffett", avatar: "👴", xp: 118200, level: 97, change: 'up', isYou: true },
  { rank: 3, name: "Bill Gates", avatar: "🧑‍💼", xp: 112800, level: 95, change: 'down' },
  { rank: 4, name: "Ray Dalio", avatar: "👨‍💼", xp: 98500, level: 89, change: 'up' },
  { rank: 5, name: "Peter Lynch", avatar: "🧔", xp: 87200, level: 82, change: 'same' },
];

// Achievements (Progress System)
interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  xp: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const achievements: Achievement[] = [
  { id: 1, name: "First Steps", description: "Complete your first skill", icon: "🚀", progress: 1, total: 1, xp: 100, unlocked: true, rarity: 'common' },
  { id: 2, name: "Master Investor", description: "Reach level 95 in Value Investing", icon: "📈", progress: 97, total: 95, xp: 500, unlocked: true, rarity: 'legendary' },
  { id: 3, name: "30-Day Streak", description: "Practice 30 days in a row", icon: "🔥", progress: 2547, total: 30, xp: 300, unlocked: true, rarity: 'rare' },
  { id: 4, name: "Social Butterfly", description: "Connect with 100 learners", icon: "🦋", progress: 73, total: 100, xp: 200, unlocked: false, rarity: 'rare' },
  { id: 5, name: "Night Owl", description: "Practice at midnight", icon: "🦉", progress: 0, total: 1, xp: 50, unlocked: false, rarity: 'common' },
  { id: 6, name: "Perfect Week", description: "Complete all daily goals for 7 days", icon: "💯", progress: 5, total: 7, xp: 400, unlocked: false, rarity: 'epic' },
];

// Limited Time Events (FOMO)
interface LimitedEvent {
  id: number;
  name: string;
  description: string;
  icon: string;
  endTime: number; // hours remaining
  reward: string;
  participants: number;
  gradient: string;
}

const limitedEvents: LimitedEvent[] = [
  { id: 1, name: "Double XP Weekend", description: "Earn 2x XP on all activities", icon: "⚡", endTime: 14, reward: "2x XP", participants: 12453, gradient: "from-yellow-400 to-orange-500" },
  { id: 2, name: "Investment Challenge", description: "Complete 5 value investing lessons", icon: "🏆", endTime: 47, reward: "Exclusive Badge", participants: 8291, gradient: "from-purple-500 to-pink-500" },
  { id: 3, name: "Legendary Skin", description: "Unlock the Golden Investor profile frame", icon: "👑", endTime: 2, reward: "Profile Frame", participants: 3847, gradient: "from-amber-400 to-yellow-300" },
];

// Notifications (Push Notifications simulation)
interface AppNotification {
  id: number;
  type: 'like' | 'comment' | 'follow' | 'achievement' | 'reminder' | 'challenge';
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
}

const notifications: AppNotification[] = [
  { id: 1, type: 'like', message: "Charlie Munger liked your progress", time: "2m", read: false, avatar: "👨‍🦳" },
  { id: 2, type: 'achievement', message: "You unlocked: Master Investor! 🏆", time: "5m", read: false },
  { id: 3, type: 'follow', message: "Bill Gates started following you", time: "1h", read: false, avatar: "🧑‍💼" },
  { id: 4, type: 'challenge', message: "Ray Dalio challenged you to a duel!", time: "2h", read: true, avatar: "👨‍💼" },
  { id: 5, type: 'reminder', message: "Don't lose your 2,547 day streak! 🔥", time: "3h", read: true },
];

// For You Recommendations (Personalized Algorithm)
interface Recommendation {
  id: number;
  type: 'skill' | 'course' | 'challenge' | 'person';
  name: string;
  reason: string;
  match: number;
  icon: string;
  gradient: string;
}

const recommendations: Recommendation[] = [
  { id: 1, type: 'skill', name: "Risk Management", reason: "Based on your Value Investing mastery", match: 98, icon: "🛡️", gradient: "from-blue-500 to-cyan-500" },
  { id: 2, type: 'course', name: "Advanced Portfolio Theory", reason: "Popular with similar investors", match: 95, icon: "📊", gradient: "from-purple-500 to-pink-500" },
  { id: 3, type: 'person', name: "Howard Marks", reason: "You both mastered Value Investing", match: 92, icon: "👤", gradient: "from-emerald-500 to-teal-500" },
  { id: 4, type: 'challenge', name: "Market Analysis Sprint", reason: "Trending this week", match: 89, icon: "⚡", gradient: "from-amber-500 to-orange-500" },
];

// Animated number hook
function useAnimatedNumber(target: number, duration: number = 2000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(target * eased));
      if (progress === 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

// Glowing stat card
function GlowingStat({ icon: Icon, value, label, suffix = "", color, delay = 0 }: { icon: React.ElementType; value: number; label: string; suffix?: string; color: string; delay?: number }) {
  const animatedValue = useAnimatedNumber(value);
  return (
    <div className="group relative animate-fadeIn" style={{ animationDelay: `${delay}ms` }}>
      <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-500`} />
      <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 hover:border-white/40 hover:bg-white/20 transition-all duration-500 hover:-translate-y-1">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-3xl font-black text-white tracking-tight">{animatedValue.toLocaleString()}{suffix}</p>
            <p className="text-white/60 text-sm font-medium">{label}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Premium skill card with 3D effect
function SkillCard3D({ skill, onEdit, onDelete, index }: { skill: UserCustomSkill; onEdit: (s: UserCustomSkill) => void; onDelete: (id: number) => void; index: number }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const color = SKILL_COLORS[skill.color] || SKILL_COLORS[0];
  const level = getScoreLevel(skill.currentScore);
  const progress = (skill.currentScore / skill.targetScore) * 100;
  const isMaster = skill.currentScore >= 95;
  const isExpert = skill.currentScore >= 85 && skill.currentScore < 95;

  return (
    <div
      className="group relative animate-fadeIn perspective-1000"
      style={{ animationDelay: `${index * 80}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isMaster && (
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${color.gradient} rounded-3xl blur opacity-40 group-hover:opacity-70 transition-all duration-500 animate-pulse-slow`} />
      )}
      <div
        className={`relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl border-2 transition-all duration-500 ${
          isMaster ? 'border-amber-400/50' : isExpert ? 'border-blue-400/30' : 'border-gray-100'
        }`}
        style={{
          transform: isHovered ? 'translateY(-8px) rotateX(2deg)' : 'translateY(0) rotateX(0deg)',
        }}
      >
        {/* Top gradient bar */}
        <div className={`h-1.5 bg-gradient-to-r ${color.gradient}`} />

        {/* Header */}
        <div className="p-5 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${color.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <SkillIcon name={skill.icon} className="w-7 h-7 text-white" />
                {isMaster && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                    <Crown className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{skill.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  {isMaster && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 rounded-full text-xs font-semibold">
                      <Gem className="w-3 h-3" /> Master
                    </span>
                  )}
                  {isExpert && !isMaster && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      <BadgeCheck className="w-3 h-3" /> Expert
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-gray-100 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-2xl border py-1 min-w-[140px] z-20">
                  <button onClick={() => { onEdit(skill); setShowMenu(false); }} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => { onDelete(skill.id); setShowMenu(false); }} className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-3 line-clamp-2">{skill.description}</p>
        </div>

        {/* Score section */}
        <div className="px-5 pb-5">
          <div className="flex items-end justify-between mb-3">
            <div>
              <span className="text-4xl font-black bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">{skill.currentScore}</span>
              <span className="text-gray-400 text-lg ml-1">/ {skill.targetScore}</span>
            </div>
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              level.variant === 'primary' ? 'bg-purple-100 text-purple-700' :
              level.variant === 'success' ? 'bg-emerald-100 text-emerald-700' :
              level.variant === 'warning' ? 'bg-amber-100 text-amber-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {level.level}
            </span>
          </div>

          {/* Progress bar */}
          <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${color.gradient} rounded-full transition-all duration-1000`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
            {isMaster && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            )}
          </div>

          {/* Practice info */}
          <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              {skill.totalPractices.toLocaleString()} practices
            </span>
            <span>Since {skill.createdAt.split('-')[0]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Experience timeline card
function ExperienceCard({ role, isLast }: { role: Role; isLast: boolean }) {
  return (
    <div className="relative pl-10 group">
      {!isLast && <div className="absolute left-[18px] top-14 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-transparent" />}
      <div className="absolute left-0 top-1 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
        <SkillIcon name={role.icon} className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl hover:border-gray-200 transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-bold text-gray-900 text-lg">{role.title}</h4>
            <p className="text-gray-600 font-medium">{role.organization}</p>
            <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {role.period}
            </p>
          </div>
          {role.current && (
            <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
              <Zap className="w-3 h-3" /> Current
            </span>
          )}
        </div>
        {role.description && (
          <p className="text-gray-500 mt-3 text-sm leading-relaxed">{role.description}</p>
        )}
      </div>
    </div>
  );
}

// Project card with hover effect
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const gradients = [
    "from-violet-500 via-purple-500 to-fuchsia-500",
    "from-blue-500 via-cyan-500 to-teal-500",
    "from-emerald-500 via-green-500 to-lime-500",
    "from-amber-500 via-orange-500 to-red-500",
    "from-pink-500 via-rose-500 to-red-500",
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <div className="group relative animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500`} />
      <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-gray-200 transition-all duration-500 hover:-translate-y-2">
        <div className={`h-36 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,rgba(255,255,255,0.3),transparent_50%)]" />
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute bottom-4 left-4">
            <div className="w-14 h-14 rounded-xl bg-white shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <SkillIcon name={project.icon} className="w-7 h-7 text-gray-700" />
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md ${
              project.status === 'completed' ? 'bg-white/90 text-emerald-600' :
              project.status === 'in_progress' ? 'bg-white/90 text-blue-600' :
              'bg-white/90 text-gray-600'
            }`}>
              {project.status === 'completed' ? '✓ Completed' : project.status === 'in_progress' ? '● Active' : '○ Planned'}
            </span>
          </div>
        </div>
        <div className="p-5">
          <h4 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">{project.name}</h4>
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{project.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4" /> {project.year}
            </span>
            <button className="flex items-center gap-1 text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all hover:gap-2">
              View Details <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Certificate card with gold accent
function CertificateCard({ certificate, index }: { certificate: Certificate; index: number }) {
  return (
    <div className="group relative animate-fadeIn" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-amber-200 transition-all duration-300 hover:-translate-y-1">
        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400" />
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <SkillIcon name={certificate.icon} className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow ring-2 ring-white">
                <Trophy className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900">{certificate.name}</h4>
              <p className="text-gray-500 text-sm">{certificate.issuer}</p>
              <p className="text-amber-600 text-xs font-semibold mt-2">{certificate.year}</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
              <ExternalLink className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          {certificate.description && (
            <p className="text-gray-500 text-sm mt-4 pt-4 border-t border-gray-100">{certificate.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to format large numbers
function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

// TikTok-style video card
function TikTokCard({ video, index }: { video: VideoHighlight; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div
      className="group relative flex-shrink-0 w-[200px] animate-fadeIn"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Container - 9:16 aspect ratio */}
      <div className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-xl cursor-pointer">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${video.gradient}`} />

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.2),transparent_50%)]" />
        </div>

        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
            <SkillIcon name={video.icon} className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Play Button Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md text-white text-xs font-medium">
          {video.duration}
        </div>

        {/* Views Badge */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md text-white text-xs font-medium flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {formatNumber(video.views)}
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          {/* Sound */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center animate-spin" style={{ animationDuration: '3s' }}>
              <Music2 className="w-2.5 h-2.5 text-white" />
            </div>
            <p className="text-white/80 text-[10px] truncate flex-1">{video.sound}</p>
          </div>

          {/* Title */}
          <h4 className="text-white font-bold text-sm leading-tight line-clamp-2 mb-1">
            {video.title}
          </h4>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {video.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="text-[10px] text-white/70">#{tag}</span>
            ))}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="absolute right-2 bottom-24 flex flex-col items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
            className="flex flex-col items-center group/btn"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isLiked ? 'bg-red-500' : 'bg-black/30 backdrop-blur-sm hover:bg-black/50'}`}>
              <Heart className={`w-5 h-5 ${isLiked ? 'text-white fill-white' : 'text-white'}`} />
            </div>
            <span className="text-white text-[10px] font-medium mt-0.5">{formatNumber(video.likes + (isLiked ? 1 : 0))}</span>
          </button>

          <button className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-all">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-[10px] font-medium mt-0.5">{formatNumber(video.comments)}</span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }}
            className="flex flex-col items-center"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isSaved ? 'bg-amber-500' : 'bg-black/30 backdrop-blur-sm hover:bg-black/50'}`}>
              <Bookmark className={`w-5 h-5 ${isSaved ? 'text-white fill-white' : 'text-white'}`} />
            </div>
            <span className="text-white text-[10px] font-medium mt-0.5">Save</span>
          </button>

          <button className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-all">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-[10px] font-medium mt-0.5">{formatNumber(video.shares)}</span>
          </button>
        </div>
      </div>

      {/* Description below card */}
      <p className="mt-2 text-xs text-gray-500 line-clamp-2 px-1">{video.description}</p>
    </div>
  );
}

// TikTok Section with horizontal scroll
function TikTokSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 440;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', checkScroll);
      return () => ref.removeEventListener('scroll', checkScroll);
    }
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 flex items-center justify-center">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              Skill Highlights
              <span className="px-2 py-0.5 bg-gradient-to-r from-pink-500 to-orange-500 text-[10px] font-bold rounded-full">NEW</span>
            </h3>
            <p className="text-gray-400 text-sm">Short videos • Wisdom clips</p>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              canScrollLeft ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              canScrollRight ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable videos */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide relative"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videoHighlights.map((video, i) => (
          <TikTokCard key={video.id} video={video} index={i} />
        ))}
      </div>

      {/* View all button */}
      <div className="flex justify-center mt-4">
        <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-full flex items-center gap-2 transition-all border border-white/10">
          View All Videos
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Instagram Stories Section
function InstagramStoriesSection() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center">
          <Camera className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-gray-900">Stories</span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {instagramStories.map((story, i) => (
          <div key={story.id} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group">
            <div className={`relative p-[3px] rounded-full bg-gradient-to-br ${story.hasNew ? story.gradient : 'from-gray-200 to-gray-300'}`}>
              <div className="w-16 h-16 rounded-full bg-white p-[2px]">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  {story.avatar}
                </div>
              </div>
              {story.isLive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gradient-to-r from-pink-500 to-red-500 rounded text-[10px] font-bold text-white border-2 border-white">
                  LIVE
                </div>
              )}
              {story.id === 1 && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Plus className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <span className="text-xs text-gray-600 truncate w-16 text-center">{story.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Spotify Player Section
function SpotifyPlayerSection() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(35);
  const currentTrack = spotifyPlaylist[0];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-5 relative overflow-hidden">
      {/* Background glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentTrack.gradient} opacity-20 blur-3xl`} />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4 relative">
        <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center">
          <Disc3 className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-white">Now Playing</span>
        <span className="ml-auto text-green-400 text-xs font-medium flex items-center gap-1">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          LISTENING
        </span>
      </div>

      {/* Current Track */}
      <div className="flex gap-4 relative mb-4">
        <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${currentTrack.gradient} flex items-center justify-center shadow-lg ${isPlaying ? 'animate-pulse' : ''}`}>
          <Headphones className="w-10 h-10 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-white text-lg line-clamp-1">{currentTrack.title}</h4>
          <p className="text-gray-400 text-sm">{currentTrack.artist}</p>
          <p className="text-gray-500 text-xs mt-1">{currentTrack.album}</p>
        </div>
        <button className="self-start p-2 hover:bg-white/10 rounded-full transition-all">
          <Heart className="w-5 h-5 text-green-400" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 relative">
        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>1:35:42</span>
          <span>{currentTrack.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 relative">
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <Shuffle className="w-5 h-5" />
        </button>
        <button className="p-2 text-white hover:scale-110 transition-transform">
          <SkipBack className="w-6 h-6" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
        >
          {isPlaying ? <Pause className="w-6 h-6 text-black" /> : <Play className="w-6 h-6 text-black ml-1" />}
        </button>
        <button className="p-2 text-white hover:scale-110 transition-transform">
          <SkipForward className="w-6 h-6" />
        </button>
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <Repeat className="w-5 h-5" />
        </button>
      </div>

      {/* Queue */}
      <div className="mt-4 pt-4 border-t border-gray-700/50 relative">
        <p className="text-gray-400 text-xs font-medium mb-2">UP NEXT</p>
        {spotifyPlaylist.slice(1, 3).map((track) => (
          <div key={track.id} className="flex items-center gap-3 py-2 hover:bg-white/5 rounded-lg px-2 cursor-pointer">
            <div className={`w-10 h-10 rounded bg-gradient-to-br ${track.gradient} flex items-center justify-center`}>
              <Music2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate">{track.title}</p>
              <p className="text-gray-500 text-xs truncate">{track.artist}</p>
            </div>
            <span className="text-gray-500 text-xs">{track.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Netflix Section
function NetflixSection() {
  return (
    <div className="bg-black rounded-2xl p-5 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center">
            <Tv className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">Recommended For You</span>
        </div>
        <button className="text-gray-400 text-sm hover:text-white transition-colors flex items-center gap-1">
          See All <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Content Row */}
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {netflixContent.map((content, i) => (
          <div key={content.id} className="relative flex-shrink-0 w-36 group cursor-pointer">
            {/* Thumbnail */}
            <div className={`relative aspect-[2/3] rounded-lg bg-gradient-to-br ${content.gradient} overflow-hidden shadow-lg`}>
              {/* Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <SkillIcon name={content.icon} className="w-12 h-12 text-white/50" />
              </div>

              {/* Top 10 Badge */}
              {content.topTen && (
                <div className="absolute top-2 left-2 flex items-center">
                  <div className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    TOP 10
                  </div>
                  <span className="text-white font-black text-2xl ml-1 drop-shadow-lg">#{content.topTen}</span>
                </div>
              )}

              {/* New Badge */}
              {content.isNew && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  NEW
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <Play className="w-6 h-6 text-black ml-0.5" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="mt-2">
              <h4 className="text-white text-sm font-medium truncate">{content.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-green-500 text-xs font-bold">{content.match}% Match</span>
                <span className="text-gray-500 text-xs">{content.year}</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-gray-500 text-[10px] border border-gray-600 px-1 rounded">{content.rating}</span>
                <span className="text-gray-500 text-[10px]">{content.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// WhatsApp Section
function WhatsAppSection() {
  return (
    <div className="bg-[#111B21] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#202C33] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center">
            <Phone className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">Messages</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Camera className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="divide-y divide-gray-800">
        {whatsappMessages.map((msg) => (
          <div key={msg.id} className="flex items-center gap-3 p-3 hover:bg-[#202C33] cursor-pointer transition-colors">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-2xl">
                {msg.avatar}
              </div>
              {msg.isOnline && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#25D366] rounded-full border-2 border-[#111B21]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium truncate">{msg.sender}</h4>
                <span className={`text-xs ${msg.unread > 0 ? 'text-[#25D366]' : 'text-gray-500'}`}>{msg.time}</span>
              </div>
              <div className="flex items-center gap-1">
                {msg.isTyping ? (
                  <span className="text-[#25D366] text-sm italic">typing...</span>
                ) : (
                  <>
                    <CheckCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <p className="text-gray-400 text-sm truncate">{msg.message}</p>
                  </>
                )}
              </div>
            </div>
            {msg.unread > 0 && (
              <div className="w-5 h-5 rounded-full bg-[#25D366] flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">{msg.unread}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-[#202C33] px-3 py-2 flex items-center gap-2">
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <Smile className="w-6 h-6" />
        </button>
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <Image className="w-6 h-6" />
        </button>
        <div className="flex-1 bg-[#2A3942] rounded-full px-4 py-2">
          <input type="text" placeholder="Type a message" className="w-full bg-transparent text-white text-sm outline-none placeholder-gray-500" />
        </div>
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <Mic className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

// Snapchat Streaks Section
function SnapchatStreaksSection() {
  return (
    <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-4 relative overflow-hidden">
      {/* Ghost pattern */}
      <div className="absolute top-2 right-2 text-6xl opacity-20">👻</div>

      {/* Header */}
      <div className="flex items-center gap-2 mb-4 relative">
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
          <Flame className="w-5 h-5 text-orange-500" />
        </div>
        <span className="font-bold text-black">Snap Streaks</span>
      </div>

      {/* Streaks */}
      <div className="space-y-3 relative">
        {snapStreaks.map((streak) => (
          <div key={streak.id} className="flex items-center gap-3 bg-white/90 rounded-xl p-3 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl">
              {streak.avatar}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900">{streak.name}</h4>
              <p className="text-gray-500 text-xs">{streak.lastSnap}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <span className="text-2xl">{streak.emoji}</span>
                <span className="font-black text-2xl text-gray-900">{streak.streak}</span>
              </div>
              <p className="text-[10px] text-gray-500 font-medium">day streak</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Snap */}
      <button className="mt-4 w-full py-3 bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors">
        <Camera className="w-5 h-5" />
        Send a Snap
      </button>
    </div>
  );
}

// Telegram Channels Section
function TelegramSection() {
  return (
    <div className="bg-gradient-to-br from-[#2AABEE] to-[#229ED9] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
          <Send className="w-4 h-4 text-[#2AABEE] -rotate-45" />
        </div>
        <span className="font-bold text-white">Channels</span>
      </div>

      {/* Channels List */}
      <div className="bg-white">
        {telegramChannels.map((channel, i) => (
          <div key={channel.id} className={`flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors ${i < telegramChannels.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-2xl">
              {channel.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <h4 className="font-semibold text-gray-900 truncate">{channel.name}</h4>
                {channel.verified && (
                  <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-gray-500 text-sm truncate">{channel.lastMessage}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs">{channel.time}</p>
              <p className="text-gray-400 text-xs mt-1">{formatNumber(channel.subscribers)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Facebook Post Section
function FacebookPostSection() {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(128400);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl">
          👴
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-900">Warren Buffett</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <span>2h</span>
            <span>·</span>
            <Globe2 className="w-3 h-3" />
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-900">
          The best investment you can make is in yourself. Read 500 pages every day. That&apos;s how knowledge works—it builds up like compound interest. 📚💡
        </p>
      </div>

      {/* Image */}
      <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 h-64 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-2">📖</div>
          <p className="text-xl font-bold">500 Pages Daily</p>
          <p className="text-sm opacity-80">The path to knowledge</p>
        </div>
      </div>

      {/* Reactions Count */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
              <ThumbsUp className="w-3 h-3 text-white" />
            </div>
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
              <Heart className="w-3 h-3 text-white" />
            </div>
            <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-[10px]">
              😮
            </div>
          </div>
          <span className="text-gray-500 text-sm ml-1">{formatNumber(likeCount)}</span>
        </div>
        <div className="text-gray-500 text-sm">
          <span>8.2K comments</span>
          <span className="mx-2">·</span>
          <span>2.5K shares</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-1 flex items-center justify-around">
        <button
          onClick={() => { setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1); }}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors ${liked ? 'text-blue-500' : 'text-gray-500'}`}
        >
          <ThumbsUp className={`w-5 h-5 ${liked ? 'fill-blue-500' : ''}`} />
          <span className="font-medium">Like</span>
        </button>
        <button className="flex items-center gap-2 px-6 py-2 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">Comment</span>
        </button>
        <button className="flex items-center gap-2 px-6 py-2 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
          <Share2 className="w-5 h-5" />
          <span className="font-medium">Share</span>
        </button>
      </div>
    </div>
  );
}

// Messenger Chat Head
function MessengerSection() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-white" />
          <span className="font-bold text-white">Messenger</span>
        </div>
      </div>

      {/* Active Now */}
      <div className="p-3 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-500 mb-2">ACTIVE NOW</p>
        <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {['👨‍🦳', '🧑‍💼', '👨‍💻', '🚀'].map((avatar, i) => (
            <div key={i} className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-2xl">
                {avatar}
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Replies */}
      <div className="p-3">
        <p className="text-xs font-semibold text-gray-500 mb-2">QUICK REPLIES</p>
        <div className="flex flex-wrap gap-2">
          {['👍', '❤️', '😂', '😮', '😢', '😡'].map((emoji, i) => (
            <button key={i} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl transition-colors">
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="px-3 py-2 border-t border-gray-100 flex items-center gap-2">
        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
          <PlusCircle className="w-6 h-6" />
        </button>
        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
          <Camera className="w-6 h-6" />
        </button>
        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
          <Image className="w-6 h-6" />
        </button>
        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
          <Mic className="w-6 h-6" />
        </button>
        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center">
          <input type="text" placeholder="Aa" className="w-full bg-transparent text-sm outline-none" />
          <Smile className="w-5 h-5 text-gray-400" />
        </div>
        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
          <ThumbsUp className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

// CapCut Templates Section
function CapCutSection() {
  return (
    <div className="bg-black rounded-2xl p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-500/20" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4 relative">
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
          <Clapperboard className="w-5 h-5 text-black" />
        </div>
        <span className="font-bold text-white">CapCut Templates</span>
        <span className="ml-auto px-2 py-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-[10px] font-bold text-white rounded">PRO</span>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-3 gap-3 relative">
        {capCutTemplates.map((template) => (
          <div key={template.id} className="group cursor-pointer">
            <div className={`aspect-[9/16] rounded-xl bg-gradient-to-br ${template.gradient} relative overflow-hidden`}>
              {/* Preview Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 text-white ml-0.5" />
                </div>
              </div>
              {/* Duration */}
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 rounded text-[10px] text-white font-medium">
                {template.duration}
              </div>
              {/* Use Button */}
              <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-full py-1.5 bg-white text-black text-xs font-bold rounded-lg">
                  Use Template
                </button>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-white text-xs font-medium truncate">{template.name}</p>
              <p className="text-gray-500 text-[10px]">{formatNumber(template.uses)} uses</p>
            </div>
          </div>
        ))}
      </div>

      {/* Create Button */}
      <button className="mt-4 w-full py-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
        <Plus className="w-5 h-5" />
        Create Video
      </button>
    </div>
  );
}

// ============ ADDICTIVE FEATURE COMPONENTS ============

// 1. Daily Rewards Section (Variable Rewards + Streaks)
function DailyRewardsSection() {
  const [claimedToday, setClaimedToday] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleClaim = () => {
    setClaimedToday(true);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-5 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_40%)]" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />

      {/* Celebration overlay */}
      {showCelebration && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20 animate-fadeIn">
          <div className="text-center">
            <div className="text-6xl mb-2 animate-bounce">🎉</div>
            <p className="text-white font-bold text-xl">+150 XP!</p>
            <p className="text-white/80 text-sm">Day 4 Reward Claimed!</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-300" />
          </div>
          <div>
            <h3 className="font-bold text-white">Daily Rewards</h3>
            <p className="text-white/60 text-xs">Day 4 of 7</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-white">🔥 2,547</p>
          <p className="text-white/60 text-xs">day streak</p>
        </div>
      </div>

      {/* Rewards Row */}
      <div className="flex gap-2 mb-4 relative">
        {dailyRewards.map((reward) => (
          <div
            key={reward.day}
            className={`flex-1 relative rounded-xl p-2 text-center transition-all ${
              reward.claimed ? 'bg-white/10' :
              reward.isToday ? 'bg-white/30 ring-2 ring-yellow-400 animate-pulse' :
              'bg-white/5'
            } ${reward.special ? 'ring-2 ring-amber-400' : ''}`}
          >
            {reward.special && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-amber-400 text-[8px] font-bold text-black rounded">
                BONUS
              </div>
            )}
            <p className="text-[10px] text-white/60 mb-1">Day {reward.day}</p>
            <div className={`text-2xl ${reward.claimed ? 'grayscale opacity-50' : ''}`}>
              {reward.reward}
            </div>
            <p className="text-[10px] text-white/80 font-medium">+{reward.xp} XP</p>
            {reward.claimed && (
              <div className="absolute inset-0 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Claim Button */}
      <button
        onClick={handleClaim}
        disabled={claimedToday}
        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
          claimedToday
            ? 'bg-white/20 text-white/50 cursor-not-allowed'
            : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:scale-[1.02] shadow-lg shadow-orange-500/30'
        }`}
      >
        {claimedToday ? (
          <>
            <CheckCircle2 className="w-5 h-5" />
            Claimed Today!
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Claim Day 4 Reward (+150 XP)
          </>
        )}
      </button>
    </div>
  );
}

// 2. Leaderboard Section (Social Competition)
function LeaderboardSection() {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-white" />
            <div>
              <h3 className="font-bold text-white">Weekly Leaderboard</h3>
              <p className="text-white/80 text-xs">Diamond League</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-white/80" />
            <span className="text-white/80 text-xs">Resets in 2d 14h</span>
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="divide-y divide-gray-100">
        {leaderboardData.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center gap-3 p-4 transition-colors ${
              entry.isYou ? 'bg-amber-50' : 'hover:bg-gray-50'
            }`}
          >
            {/* Rank */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              entry.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white' :
              entry.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
              entry.rank === 3 ? 'bg-gradient-to-br from-amber-600 to-orange-700 text-white' :
              'bg-gray-100 text-gray-600'
            }`}>
              {entry.rank}
            </div>

            {/* Avatar */}
            <div className="relative">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                entry.isYou ? 'bg-gradient-to-br from-amber-400 to-orange-500 ring-2 ring-amber-400' : 'bg-gradient-to-br from-gray-200 to-gray-300'
              }`}>
                {entry.avatar}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow text-[10px] font-bold">
                {entry.level}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${entry.isYou ? 'text-amber-700' : 'text-gray-900'}`}>
                  {entry.name}
                </span>
                {entry.isYou && (
                  <span className="px-1.5 py-0.5 bg-amber-200 text-amber-700 text-[10px] font-bold rounded">YOU</span>
                )}
              </div>
              <p className="text-gray-500 text-sm">{formatNumber(entry.xp)} XP</p>
            </div>

            {/* Change indicator */}
            <div className={`flex items-center gap-1 text-sm font-medium ${
              entry.change === 'up' ? 'text-green-500' :
              entry.change === 'down' ? 'text-red-500' :
              'text-gray-400'
            }`}>
              {entry.change === 'up' && <TrendingUp className="w-4 h-4" />}
              {entry.change === 'down' && <TrendingUp className="w-4 h-4 rotate-180" />}
              {entry.change === 'same' && <span>—</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <button className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          <Zap className="w-5 h-5" />
          Climb to #1 - Start Practicing
        </button>
      </div>
    </div>
  );
}

// 3. Achievements Section (Progress System)
function AchievementsSection() {
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const rarityColors = {
    common: 'from-gray-400 to-gray-500',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-amber-400 to-orange-500',
  };

  const rarityBg = {
    common: 'bg-gray-100',
    rare: 'bg-blue-100',
    epic: 'bg-purple-100',
    legendary: 'bg-amber-100',
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Achievements</h3>
              <p className="text-gray-500 text-xs">{unlockedCount}/{achievements.length} unlocked</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-purple-600">{unlockedCount * 100 + 400}</p>
            <p className="text-gray-500 text-xs">Total XP earned</p>
          </div>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`relative rounded-xl p-3 border-2 transition-all ${
              achievement.unlocked
                ? `${rarityBg[achievement.rarity]} border-transparent`
                : 'bg-gray-50 border-dashed border-gray-200'
            }`}
          >
            {/* Rarity indicator */}
            {achievement.unlocked && (
              <div className={`absolute top-2 right-2 w-2 h-2 rounded-full bg-gradient-to-br ${rarityColors[achievement.rarity]}`} />
            )}

            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                achievement.unlocked
                  ? `bg-gradient-to-br ${rarityColors[achievement.rarity]} shadow-lg`
                  : 'bg-gray-200'
              }`}>
                {achievement.unlocked ? achievement.icon : '🔒'}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold text-sm truncate ${achievement.unlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                  {achievement.name}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-1">{achievement.description}</p>
                {!achievement.unlocked && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                        style={{ width: `${Math.min((achievement.progress / achievement.total) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">{achievement.progress}/{achievement.total}</p>
                  </div>
                )}
                {achievement.unlocked && (
                  <p className="text-xs text-green-600 font-medium mt-1">+{achievement.xp} XP earned</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Limited Events Section (FOMO)
function LimitedEventsSection() {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 34, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-br from-red-600 via-pink-600 to-purple-700 rounded-2xl p-5 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.15),transparent_50%)]" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500" />

      {/* Urgent badge */}
      <div className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded animate-pulse flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
        ENDING SOON
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 mb-4 relative">
        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center animate-bounce">
          <Zap className="w-6 h-6 text-yellow-300" />
        </div>
        <div>
          <h3 className="font-bold text-white">Limited Time Events</h3>
          <p className="text-white/60 text-xs">Don&apos;t miss out!</p>
        </div>
      </div>

      {/* Events */}
      <div className="space-y-3 relative">
        {limitedEvents.map((event, index) => (
          <div
            key={event.id}
            className={`bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 ${
              index === 2 ? 'animate-pulse ring-2 ring-yellow-400' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${event.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                {event.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-sm">{event.name}</h4>
                <p className="text-white/60 text-xs">{event.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-white/80 text-xs flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {formatNumber(event.participants)} joined
                  </span>
                </div>
              </div>
              <div className="text-right">
                {event.endTime <= 3 ? (
                  <div className="px-2 py-1 bg-red-500 rounded text-white text-xs font-bold animate-pulse">
                    {event.endTime}h left!
                  </div>
                ) : (
                  <div className="text-white/80 text-xs">
                    {event.endTime}h left
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Countdown for most urgent */}
      <div className="mt-4 p-3 bg-black/30 rounded-xl border border-yellow-400/50">
        <p className="text-yellow-300 text-xs font-medium mb-2 text-center">⏰ Golden Investor Frame ends in:</p>
        <div className="flex justify-center gap-2">
          {[
            { value: timeLeft.hours, label: 'HRS' },
            { value: timeLeft.minutes, label: 'MIN' },
            { value: timeLeft.seconds, label: 'SEC' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 bg-black/50 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-black text-white">{String(item.value).padStart(2, '0')}</span>
              </div>
              <p className="text-[10px] text-white/60 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
        <button className="mt-3 w-full py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold rounded-xl hover:scale-[1.02] transition-transform">
          Claim Now - Only 3,847 left!
        </button>
      </div>
    </div>
  );
}

// 5. Notifications Bell Component
function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-all"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-[10px] text-white font-bold">{unreadCount}</span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h4 className="font-bold text-gray-900">Notifications</h4>
            <span className="text-xs text-blue-500 font-medium cursor-pointer hover:underline">Mark all read</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notif.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xl">
                  {notif.avatar || (notif.type === 'achievement' ? '🏆' : notif.type === 'reminder' ? '🔔' : '📣')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!notif.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{notif.time} ago</p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 6. For You Recommendations (Personalized Algorithm)
function ForYouSection() {
  return (
    <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-5 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1),transparent_50%)]" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4 relative">
        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-yellow-300" />
        </div>
        <div>
          <h3 className="font-bold text-white flex items-center gap-2">
            For You
            <span className="px-2 py-0.5 bg-green-400/20 text-green-300 text-[10px] font-bold rounded-full">AI</span>
          </h3>
          <p className="text-white/60 text-xs">Personalized just for you</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-3 relative">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:bg-white/20 hover:border-white/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rec.gradient} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                {rec.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm">{rec.name}</h4>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    rec.type === 'skill' ? 'bg-blue-400/20 text-blue-300' :
                    rec.type === 'course' ? 'bg-purple-400/20 text-purple-300' :
                    rec.type === 'person' ? 'bg-green-400/20 text-green-300' :
                    'bg-amber-400/20 text-amber-300'
                  }`}>
                    {rec.type}
                  </span>
                </div>
                <p className="text-white/60 text-xs mt-0.5">{rec.reason}</p>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-bold text-lg">{rec.match}%</p>
                <p className="text-white/40 text-[10px]">match</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Refresh */}
      <button className="mt-4 w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all border border-white/10">
        <Shuffle className="w-4 h-4" />
        Refresh Recommendations
      </button>
    </div>
  );
}

// 7. XP Progress Bar (Investment Loop + Progress)
function XPProgressBar() {
  const currentXP = 118200;
  const levelXP = 120000;
  const currentLevel = 97;
  const progress = (currentXP / levelXP) * 100;

  return (
    <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]" />

      <div className="flex items-center gap-4 relative">
        {/* Level Badge */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-black text-white">{currentLevel}</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
            <Star className="w-4 h-4 text-white fill-white" />
          </div>
        </div>

        {/* Progress */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white font-bold">Level {currentLevel}</span>
            <span className="text-white/80 text-sm">{formatNumber(currentXP)} / {formatNumber(levelXP)} XP</span>
          </div>
          <div className="h-4 bg-black/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
          <p className="text-white/60 text-xs mt-1">{formatNumber(levelXP - currentXP)} XP to Level {currentLevel + 1}</p>
        </div>
      </div>
    </div>
  );
}

// 8. Streak Reminder Toast
function StreakReminder() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 shadow-2xl flex items-center gap-3 max-w-sm">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl animate-bounce">
          🔥
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-white">Keep your streak alive!</h4>
          <p className="text-white/80 text-sm">Practice now to maintain your 2,547 day streak</p>
        </div>
        <button onClick={() => setVisible(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}

// Enhanced Life Balance Component
function EnhancedLifeBalanceSection() {
  const [selectedAspect, setSelectedAspect] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const aspects = lifeAspects.aspects;
  const overallScore = Math.round(aspects.reduce((a, b) => a + b.value, 0) / aspects.length);
  const animatedScore = useAnimatedNumber(overallScore);

  // Calculate balance level
  const getBalanceLevel = (score: number) => {
    if (score >= 90) return { level: 'Legendary', color: 'from-amber-400 to-yellow-500', emoji: '👑', rank: 'Top 1%' };
    if (score >= 80) return { level: 'Master', color: 'from-purple-500 to-pink-500', emoji: '💎', rank: 'Top 5%' };
    if (score >= 70) return { level: 'Expert', color: 'from-blue-500 to-cyan-500', emoji: '⭐', rank: 'Top 15%' };
    if (score >= 60) return { level: 'Advanced', color: 'from-emerald-500 to-teal-500', emoji: '🌟', rank: 'Top 30%' };
    return { level: 'Growing', color: 'from-gray-400 to-gray-500', emoji: '🌱', rank: 'Keep going!' };
  };

  const balanceLevel = getBalanceLevel(overallScore);

  // Tips based on lowest aspect
  const lowestAspect = aspects.reduce((min, a) => a.value < min.value ? a : min, aspects[0]);
  const tips: Record<string, string> = {
    'Health': '🏃 Try 30 min daily exercise',
    'Wealth': '💰 Review your investment portfolio',
    'Relationships': '👥 Call a friend today',
    'Growth': '📚 Read for 1 hour',
    'Fun': '🎮 Take a break and have fun!',
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.4),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.3),transparent_50%)]" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" />

      {/* Header */}
      <div className="relative p-5 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${balanceLevel.color} flex items-center justify-center text-xl shadow-lg`}>
              {balanceLevel.emoji}
            </div>
            <div>
              <h3 className="font-bold text-white flex items-center gap-2">
                Life Balance
                <span className={`px-2 py-0.5 bg-gradient-to-r ${balanceLevel.color} text-[10px] font-bold text-white rounded-full`}>
                  {balanceLevel.level}
                </span>
              </h3>
              <p className="text-purple-300 text-xs">{balanceLevel.rank}</p>
            </div>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Main Score Circle */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            {/* Outer glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${balanceLevel.color} rounded-full blur-xl opacity-50 animate-pulse`} />

            {/* Progress ring background */}
            <svg className="w-40 h-40 -rotate-90 relative">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="12"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(overallScore / 100) * 440} 440`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white">{animatedScore}</span>
              <span className="text-purple-300 text-sm font-medium">Balance Score</span>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-green-400 text-xs font-medium">+3 this week</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aspect Rings */}
      <div className="px-5 pb-4">
        <div className="grid grid-cols-5 gap-2 mb-4">
          {aspects.map((aspect, i) => {
            const colors = ['from-pink-500 to-rose-500', 'from-amber-500 to-orange-500', 'from-emerald-500 to-teal-500', 'from-blue-500 to-cyan-500', 'from-purple-500 to-violet-500'];
            const isSelected = selectedAspect === i;

            return (
              <button
                key={i}
                onClick={() => setSelectedAspect(isSelected ? null : i)}
                className={`relative group transition-all ${isSelected ? 'scale-110' : 'hover:scale-105'}`}
              >
                {/* Mini progress ring */}
                <svg className="w-full aspect-square -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="40%"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="40%"
                    fill="none"
                    className={`stroke-current ${isSelected ? 'text-white' : ''}`}
                    style={{ stroke: isSelected ? 'white' : `url(#gradient${i})` }}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${(aspect.value / 100) * 251} 251`}
                  />
                  <defs>
                    <linearGradient id={`gradient${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" className={`${colors[i].split(' ')[0].replace('from-', 'text-')}`} stopColor="currentColor" />
                      <stop offset="100%" className={`${colors[i].split(' ')[1].replace('to-', 'text-')}`} stopColor="currentColor" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Icon in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    isSelected ? `bg-gradient-to-br ${colors[i]} shadow-lg` : 'bg-white/10'
                  }`}>
                    <SkillIcon name={aspect.icon} className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-white/70'}`} />
                  </div>
                </div>

                {/* Score badge */}
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                  isSelected ? `bg-gradient-to-r ${colors[i]} text-white` : 'bg-white/20 text-white/80'
                }`}>
                  {aspect.value}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected aspect details */}
        {selectedAspect !== null && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 mb-4 animate-fadeIn border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <SkillIcon name={aspects[selectedAspect].icon} className="w-5 h-5 text-white" />
                <span className="font-bold text-white">{aspects[selectedAspect].name}</span>
              </div>
              <span className="text-2xl font-black text-white">{aspects[selectedAspect].value}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${aspects[selectedAspect].value}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">
                {aspects[selectedAspect].value >= 90 ? '🏆 Excellent!' :
                 aspects[selectedAspect].value >= 70 ? '⭐ Great progress!' :
                 '📈 Room to grow'}
              </span>
              <span className="text-green-400">+5 vs last month</span>
            </div>
          </div>
        )}

        {/* Improvement tip */}
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-3 border border-amber-500/30">
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-amber-200 text-xs font-medium mb-1">💡 Quick Win for {lowestAspect.name}</p>
              <p className="text-white text-sm">{tips[lowestAspect.name] || '🎯 Set a goal today!'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/60 text-xs font-medium">Weekly Activity</span>
          <span className="text-green-400 text-xs font-medium">5/7 days active</span>
        </div>
        <div className="flex gap-1">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
            const active = i < 5;
            const isToday = i === 4;
            return (
              <div key={i} className="flex-1 text-center">
                <div className={`h-8 rounded-lg mb-1 flex items-center justify-center transition-all ${
                  active
                    ? 'bg-gradient-to-t from-purple-600 to-pink-500'
                    : isToday
                    ? 'bg-white/20 ring-2 ring-purple-400 animate-pulse'
                    : 'bg-white/5'
                }`}>
                  {active && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className={`text-[10px] ${isToday ? 'text-purple-300 font-bold' : 'text-white/40'}`}>{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4 bg-black/20">
        <button className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-purple-500/30 hover:scale-[1.02]">
          <Target className="w-5 h-5" />
          Set Daily Goals (+50 XP)
        </button>
      </div>

      {/* Compare with others */}
      <div className="px-5 pb-5">
        <div className="bg-white/5 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-xs">vs. Global Average</span>
            <span className="text-green-400 text-xs font-bold">+{overallScore - 65} points ahead</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-white/30 rounded-full" style={{ width: '65%' }} />
            </div>
            <span className="text-white/40 text-xs">65</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" style={{ width: `${overallScore}%` }} />
            </div>
            <span className="text-white text-xs font-bold">{overallScore}</span>
          </div>
          <div className="flex items-center justify-between mt-2 text-[10px]">
            <span className="text-white/40">Global Avg</span>
            <span className="text-purple-300 font-medium">You</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Education card
function EducationCard({ course, index }: { course: Course; index: number }) {
  return (
    <div className="group animate-fadeIn" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl hover:border-gray-200 transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <SkillIcon name={course.icon} className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900">{course.name}</h4>
            <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
              <GraduationCap className="w-4 h-4" /> {course.instructor}
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" style={{ width: `${course.progress}%` }} />
              </div>
              <span className="text-sm font-bold text-gray-700">{course.progress}%</span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            course.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
            course.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-600'
          }`}>
            {course.status === 'completed' ? 'Done' : course.status === 'in_progress' ? 'Learning' : 'Planned'}
          </span>
        </div>
      </div>
    </div>
  );
}

function AddSkillModal({ isOpen, onClose, onAdd, editSkill }: { isOpen: boolean; onClose: () => void; onAdd: (s: Omit<UserCustomSkill, 'id' | 'createdAt' | 'lastPracticed' | 'totalPractices'>) => void; editSkill?: UserCustomSkill | null }) {
  const [name, setName] = useState(""); const [description, setDescription] = useState(""); const [icon, setIcon] = useState("Star"); const [color, setColor] = useState(0);
  const [currentScore, setCurrentScore] = useState(0); const [targetScore, setTargetScore] = useState(100); const [showIconPicker, setShowIconPicker] = useState(false); const [iconSearch, setIconSearch] = useState(""); const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { if (isOpen) { if (editSkill) { setName(editSkill.name); setDescription(editSkill.description); setIcon(editSkill.icon); setColor(editSkill.color); setCurrentScore(editSkill.currentScore); setTargetScore(editSkill.targetScore); } else { setName(""); setDescription(""); setIcon("Star"); setColor(0); setCurrentScore(0); setTargetScore(100); } setErrors({}); setShowIconPicker(false); setIconSearch(""); } }, [isOpen, editSkill]);

  const filteredIcons = useMemo(() => iconSearch ? POPULAR_ICONS.filter(i => i.toLowerCase().includes(iconSearch.toLowerCase())) : POPULAR_ICONS, [iconSearch]);
  const validate = () => { const e: Record<string, string> = {}; if (!name.trim()) e.name = "Required"; if (currentScore > targetScore) e.currentScore = "Exceeds target"; setErrors(e); return !Object.keys(e).length; };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!validate()) return; onAdd({ name: name.trim(), description: description.trim(), icon, color, currentScore, targetScore }); onClose(); };
  const selectedColor = SKILL_COLORS[color];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editSkill ? "Edit Skill" : "Add Skill"} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Skill Name *" value={name} onChange={e => setName(e.target.value)} error={errors.name} placeholder="e.g. Value Investing" />
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="Describe this skill..." /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
            <button type="button" onClick={() => setShowIconPicker(!showIconPicker)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-3 hover:bg-gray-100 transition-colors"><div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedColor.gradient} flex items-center justify-center`}><SkillIcon name={icon} className="w-4 h-4 text-white" /></div><span className="flex-1 text-left text-gray-700">{icon}</span><ChevronDown className="w-4 h-4 text-gray-400" /></button>
            {showIconPicker && <div className="mt-2 p-3 bg-gray-50 rounded-xl border"><div className="relative mb-3"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={iconSearch} onChange={e => setIconSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white border rounded-lg text-sm" placeholder="Search..." /></div><div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto">{filteredIcons.map(n => <button key={n} type="button" onClick={() => { setIcon(n); setShowIconPicker(false); }} className={`p-2 rounded-lg transition-all ${icon === n ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}><SkillIcon name={n} className="w-4 h-4" /></button>)}</div></div>}
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Color</label><div className="grid grid-cols-5 gap-1.5">{SKILL_COLORS.map((c, i) => <button key={i} type="button" onClick={() => setColor(i)} className={`h-9 rounded-lg bg-gradient-to-br ${c.gradient} transition-all hover:scale-105 ${color === i ? 'ring-2 ring-offset-1 ring-blue-500 scale-105' : ''}`}>{color === i && <Check className="w-4 h-4 text-white mx-auto" />}</button>)}</div></div>
        </div>
        <div className="grid grid-cols-2 gap-4"><Input label="Current Score" type="number" value={currentScore} onChange={e => setCurrentScore(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))} error={errors.currentScore} /><Input label="Target Score" type="number" value={targetScore} onChange={e => setTargetScore(Math.max(1, Math.min(100, parseInt(e.target.value) || 100)))} /></div>
        <div className="flex justify-end gap-3 pt-4 border-t"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit">{editSkill ? "Save" : "Add Skill"}</Button></div>
      </form>
    </Modal>
  );
}

export default function Page() {
  const [skills, setSkills] = useState<UserCustomSkill[]>(initialUserSkills);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<UserCustomSkill | null>(null);
  const [activeTab, setActiveTab] = useState<"skills" | "experience" | "education" | "projects" | "certificates">("skills");

  const handleAdd = (d: Omit<UserCustomSkill, 'id' | 'createdAt' | 'lastPracticed' | 'totalPractices'>) => {
    if (editingSkill) {
      setSkills(p => p.map(s => s.id === editingSkill.id ? { ...s, ...d } : s));
      setEditingSkill(null);
    } else {
      setSkills(p => [{ ...d, id: Date.now(), createdAt: new Date().toISOString().split('T')[0], lastPracticed: new Date().toISOString().split('T')[0], totalPractices: 0 }, ...p]);
    }
  };

  const masterSkills = skills.filter(s => s.currentScore >= 95).length;
  const expertSkills = skills.filter(s => s.currentScore >= 85 && s.currentScore < 95).length;
  const avgScore = Math.round(skills.reduce((a, s) => a + s.currentScore, 0) / skills.length);
  const totalPractices = skills.reduce((a, s) => a + s.totalPractices, 0);

  const tabs = [
    { id: "skills", label: "Skills", icon: Sparkles, count: skills.length },
    { id: "experience", label: "Experience", icon: Briefcase, count: roles.length },
    { id: "education", label: "Education", icon: GraduationCap, count: courses.length },
    { id: "projects", label: "Projects", icon: FolderKanban, count: projects.length },
    { id: "certificates", label: "Licenses", icon: Award, count: certificates.length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes shimmer { from { transform: translateX(-100%); } to { transform: translateX(200%); } }
        @keyframes pulse-slow { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.7; } }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; opacity: 0; }
        .animate-slideIn { animation: slideIn 0.5s ease-out forwards; opacity: 0; }
        .animate-shimmer { animation: shimmer 2.5s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>

      <DemoHeader title={`${PERSON_NAME}`} storyId="US-6-2" description="Premium Profile" />

      {/* Cover Banner */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(251,191,36,0.2),transparent_50%)]" />
        <div className="absolute top-10 left-[10%] w-48 h-48 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-[15%] w-64 h-64 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fadeIn">
              {/* Avatar */}
              <div className="relative flex justify-center -mb-16 pt-6">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-full blur opacity-50 group-hover:opacity-75 transition-all" />
                  <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center shadow-2xl border-4 border-white">
                    <span className="text-6xl">👴</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="pt-20 pb-6 px-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <h1 className="text-xl font-bold text-gray-900">{PERSON_NAME}</h1>
                  <BadgeCheck className="w-5 h-5 text-blue-500" />
                </div>
                <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full mb-3">
                  Age {PERSON_AGE}
                </span>
                <p className="text-gray-600 text-sm mb-3">{PERSON_HEADLINE}</p>
                <div className="flex items-center justify-center gap-1 text-gray-400 text-sm">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{PERSON_LOCATION}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100" />

              {/* Quick Stats */}
              <div className="grid grid-cols-3 divide-x divide-gray-100">
                <div className="py-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{skills.length}</p>
                  <p className="text-xs text-gray-500">Skills</p>
                </div>
                <div className="py-4 text-center">
                  <p className="text-2xl font-bold text-amber-600">{masterSkills}</p>
                  <p className="text-xs text-gray-500">Masters</p>
                </div>
                <div className="py-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{expertSkills}</p>
                  <p className="text-xs text-gray-500">Experts</p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100" />

              {/* Action Buttons */}
              <div className="p-4 space-y-2">
                <button
                  onClick={() => { setEditingSkill(null); setShowAddModal(true); }}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" /> Add Skill
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all text-sm">
                    <Users className="w-4 h-4" /> Connect
                  </button>
                  <button className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all text-sm">
                    <MessageCircle className="w-4 h-4" /> Message
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Life Balance Card */}
            <EnhancedLifeBalanceSection />

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 animate-fadeIn" style={{ animationDelay: '200ms' }}>
              <h3 className="font-bold text-gray-900 mb-4">Resources</h3>
              <div className="space-y-2">
                <a href="#" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Link2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">berkshirehathaway.com</p>
                    <p className="text-xs text-gray-400">Company Website</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-300" />
                </a>
                <a href="#" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Award className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Annual Letters</p>
                    <p className="text-xs text-gray-400">Shareholder Letters</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <GlowingStat icon={Sparkles} value={skills.length} label="Total Skills" color="from-violet-500 to-purple-600" delay={0} />
              <GlowingStat icon={Crown} value={masterSkills} label="Master Skills" color="from-amber-500 to-orange-600" delay={50} />
              <GlowingStat icon={Target} value={avgScore} label="Avg Score" suffix="%" color="from-emerald-500 to-teal-600" delay={100} />
              <GlowingStat icon={Flame} value={totalPractices} label="Practices" color="from-rose-500 to-pink-600" delay={150} />
            </div>

            {/* XP Progress Bar (Investment Loop) */}
            <XPProgressBar />

            {/* Instagram Stories + Notification Bell */}
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <InstagramStoriesSection />
              </div>
              <NotificationBell />
            </div>

            {/* Daily Rewards + Leaderboard Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Rewards (Variable Rewards + Streaks) */}
              <DailyRewardsSection />

              {/* For You (Personalized Algorithm) */}
              <ForYouSection />
            </div>

            {/* Limited Events (FOMO) */}
            <LimitedEventsSection />

            {/* TikTok-style Highlights (Infinite Scroll) */}
            <TikTokSection />

            {/* Leaderboard + Achievements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Leaderboard (Social Competition) */}
              <LeaderboardSection />

              {/* Achievements (Progress System) */}
              <AchievementsSection />
            </div>

            {/* Social Media Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Spotify Player */}
              <SpotifyPlayerSection />

              {/* WhatsApp Messages */}
              <WhatsAppSection />
            </div>

            {/* Netflix Recommendations */}
            <NetflixSection />

            {/* More Social Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Snapchat Streaks */}
              <SnapchatStreaksSection />

              {/* Telegram Channels */}
              <TelegramSection />

              {/* CapCut Templates */}
              <CapCutSection />
            </div>

            {/* Facebook & Messenger */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Facebook Post */}
              <FacebookPostSection />

              {/* Messenger */}
              <MessengerSection />
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fadeIn" style={{ animationDelay: '100ms' }}>
              <div className="flex border-b border-gray-100 overflow-x-auto">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`relative flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-blue-600'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {tab.count}
                    </span>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "skills" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {skills.map((skill, i) => (
                      <SkillCard3D
                        key={skill.id}
                        skill={skill}
                        index={i}
                        onEdit={s => { setEditingSkill(s); setShowAddModal(true); }}
                        onDelete={id => confirm("Remove skill?") && setSkills(p => p.filter(s => s.id !== id))}
                      />
                    ))}
                  </div>
                )}

                {activeTab === "experience" && (
                  <div className="space-y-4">
                    {roles.map((role, i) => (
                      <ExperienceCard key={role.id} role={role} isLast={i === roles.length - 1} />
                    ))}
                  </div>
                )}

                {activeTab === "education" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {courses.map((course, i) => (
                      <EducationCard key={course.id} course={course} index={i} />
                    ))}
                  </div>
                )}

                {activeTab === "projects" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {projects.map((project, i) => (
                      <ProjectCard key={project.id} project={project} index={i} />
                    ))}
                  </div>
                )}

                {activeTab === "certificates" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {certificates.map((cert, i) => (
                      <CertificateCard key={cert.id} certificate={cert} index={i} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddSkillModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setEditingSkill(null); }}
        onAdd={handleAdd}
        editSkill={editingSkill}
      />

      {/* Streak Reminder Toast (Push Notification) */}
      <StreakReminder />
    </div>
  );
}
