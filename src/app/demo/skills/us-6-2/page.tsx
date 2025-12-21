"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Star,
  ChevronDown,
  Check,
  Trophy,
  BookOpen,
  Filter,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { DemoHeader, SkillIcon, AcceptanceCriteriaSection, getScoreLevel } from "../_shared";

// =============================================================================
// Types
// =============================================================================

interface UserCustomSkill {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: number;
  currentScore: number;
  targetScore: number;
  lastPracticed: string;
  totalPractices: number;
  createdAt: string;
}

// =============================================================================
// Color Palette
// =============================================================================

const SKILL_COLORS = [
  { name: "Violet", gradient: "from-violet-500 to-purple-600", bg: "bg-violet-500", light: "bg-violet-100", text: "text-violet-600", ring: "ring-violet-500" },
  { name: "Blue", gradient: "from-blue-500 to-cyan-500", bg: "bg-blue-500", light: "bg-blue-100", text: "text-blue-600", ring: "ring-blue-500" },
  { name: "Emerald", gradient: "from-emerald-500 to-teal-500", bg: "bg-emerald-500", light: "bg-emerald-100", text: "text-emerald-600", ring: "ring-emerald-500" },
  { name: "Orange", gradient: "from-orange-500 to-amber-500", bg: "bg-orange-500", light: "bg-orange-100", text: "text-orange-600", ring: "ring-orange-500" },
  { name: "Pink", gradient: "from-pink-500 to-rose-500", bg: "bg-pink-500", light: "bg-pink-100", text: "text-pink-600", ring: "ring-pink-500" },
  { name: "Indigo", gradient: "from-indigo-500 to-blue-600", bg: "bg-indigo-500", light: "bg-indigo-100", text: "text-indigo-600", ring: "ring-indigo-500" },
  { name: "Cyan", gradient: "from-cyan-500 to-blue-500", bg: "bg-cyan-500", light: "bg-cyan-100", text: "text-cyan-600", ring: "ring-cyan-500" },
  { name: "Rose", gradient: "from-rose-500 to-pink-600", bg: "bg-rose-500", light: "bg-rose-100", text: "text-rose-600", ring: "ring-rose-500" },
  { name: "Amber", gradient: "from-amber-500 to-yellow-500", bg: "bg-amber-500", light: "bg-amber-100", text: "text-amber-600", ring: "ring-amber-500" },
  { name: "Teal", gradient: "from-teal-500 to-emerald-500", bg: "bg-teal-500", light: "bg-teal-100", text: "text-teal-600", ring: "ring-teal-500" },
];

// =============================================================================
// Icon Categories
// =============================================================================

const POPULAR_ICONS = [
  "BookOpen", "Code", "Languages", "Calculator", "Brain", "Target", "Trophy", "Star",
  "Lightbulb", "Palette", "Music", "Camera", "Dumbbell", "Heart", "Globe", "Rocket",
  "Briefcase", "GraduationCap", "Gamepad2", "PenTool", "Mic", "Video", "FileCode", "Terminal",
  "Database", "Cpu", "Smartphone", "Watch", "Headphones", "Coffee", "Leaf", "Sun",
];

// =============================================================================
// Mock Data - Warren Buffett's Skills
// =============================================================================

const initialUserSkills: UserCustomSkill[] = [
  {
    id: 1,
    name: "Value Investing",
    description: "Buy wonderful companies at fair prices, hold forever. Focus on intrinsic value over market price.",
    icon: "TrendingUp",
    color: 2,
    currentScore: 98,
    targetScore: 100,
    lastPracticed: "2024-12-15",
    totalPractices: 25550,
    createdAt: "1956-01-01",
  },
  {
    id: 2,
    name: "Financial Statement Analysis",
    description: "Reading balance sheets, income statements, and cash flows to understand business health.",
    icon: "FileText",
    color: 1,
    currentScore: 95,
    targetScore: 100,
    lastPracticed: "2024-12-15",
    totalPractices: 18000,
    createdAt: "1950-01-01",
  },
  {
    id: 3,
    name: "Reading & Research",
    description: "Read 500 pages every day. Knowledge builds up like compound interest.",
    icon: "BookOpen",
    color: 5,
    currentScore: 99,
    targetScore: 100,
    lastPracticed: "2024-12-15",
    totalPractices: 27375,
    createdAt: "1940-01-01",
  },
  {
    id: 4,
    name: "Business Valuation",
    description: "Determining intrinsic value of companies. What is a business truly worth?",
    icon: "Calculator",
    color: 0,
    currentScore: 96,
    targetScore: 100,
    lastPracticed: "2024-12-14",
    totalPractices: 15000,
    createdAt: "1956-01-01",
  },
  {
    id: 5,
    name: "Patience & Discipline",
    description: "The stock market transfers money from the impatient to the patient. Wait for the fat pitch.",
    icon: "Target",
    color: 8,
    currentScore: 97,
    targetScore: 100,
    lastPracticed: "2024-12-15",
    totalPractices: 20000,
    createdAt: "1960-01-01",
  },
  {
    id: 6,
    name: "Risk Management",
    description: "Rule #1: Never lose money. Rule #2: Never forget rule #1. Margin of safety is key.",
    icon: "Shield",
    color: 7,
    currentScore: 94,
    targetScore: 100,
    lastPracticed: "2024-12-13",
    totalPractices: 12000,
    createdAt: "1956-01-01",
  },
  {
    id: 7,
    name: "Public Speaking",
    description: "Clear communication of complex ideas. Shareholder letters and annual meetings.",
    icon: "Mic",
    color: 4,
    currentScore: 92,
    targetScore: 100,
    lastPracticed: "2024-12-10",
    totalPractices: 5000,
    createdAt: "1965-01-01",
  },
  {
    id: 8,
    name: "Capital Allocation",
    description: "Deploying capital where it generates the highest returns. Opportunity cost thinking.",
    icon: "Briefcase",
    color: 3,
    currentScore: 97,
    targetScore: 100,
    lastPracticed: "2024-12-14",
    totalPractices: 16000,
    createdAt: "1965-01-01",
  },
];

// =============================================================================
// Components
// =============================================================================

function SkillCard({ skill, onEdit, onDelete }: {
  skill: UserCustomSkill;
  onEdit: (skill: UserCustomSkill) => void;
  onDelete: (id: number) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const color = SKILL_COLORS[skill.color] || SKILL_COLORS[0];
  const level = getScoreLevel(skill.currentScore);
  const progress = (skill.currentScore / skill.targetScore) * 100;

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Header with gradient */}
      <div className={`h-24 bg-gradient-to-br ${color.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-white/10 rounded-full" />

        {/* Icon */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color.gradient} flex items-center justify-center`}>
            <SkillIcon name={skill.icon} className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Menu button */}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4 text-white" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[120px] z-10">
              <button
                onClick={() => { onEdit(skill); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => { onDelete(skill.id); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Content */}
      <div className="pt-12 pb-5 px-5">
        <h3 className="text-lg font-bold text-gray-900 text-center mb-1">{skill.name}</h3>
        <p className="text-sm text-gray-500 text-center mb-4 line-clamp-2">{skill.description}</p>

        {/* Score display */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-3xl font-bold text-gray-900">{skill.currentScore}</span>
            <span className="text-gray-400 text-sm">/{skill.targetScore}</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            level.variant === 'primary' ? 'bg-purple-100 text-purple-700' :
            level.variant === 'success' ? 'bg-green-100 text-green-700' :
            level.variant === 'warning' ? 'bg-yellow-100 text-yellow-700' :
            level.variant === 'danger' ? 'bg-red-100 text-red-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {level.level}
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
          <div
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${color.gradient} rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-gray-50 rounded-xl p-2.5">
            <p className="text-lg font-bold text-gray-900">{skill.totalPractices.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Practices</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5">
            <p className="text-lg font-bold text-gray-900">{Math.round(progress)}%</p>
            <p className="text-xs text-gray-500">To Goal</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddSkillModal({ isOpen, onClose, onAdd, editSkill }: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (skill: Omit<UserCustomSkill, 'id' | 'createdAt' | 'lastPracticed' | 'totalPractices'>) => void;
  editSkill?: UserCustomSkill | null;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Star");
  const [color, setColor] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [targetScore, setTargetScore] = useState(100);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconSearch, setIconSearch] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens or editSkill changes
  useEffect(() => {
    if (isOpen) {
      if (editSkill) {
        setName(editSkill.name);
        setDescription(editSkill.description);
        setIcon(editSkill.icon);
        setColor(editSkill.color);
        setCurrentScore(editSkill.currentScore);
        setTargetScore(editSkill.targetScore);
      } else {
        setName("");
        setDescription("");
        setIcon("Star");
        setColor(0);
        setCurrentScore(0);
        setTargetScore(100);
      }
      setErrors({});
      setShowIconPicker(false);
      setIconSearch("");
    }
  }, [isOpen, editSkill]);

  const filteredIcons = useMemo(() => {
    if (!iconSearch) return POPULAR_ICONS;
    return POPULAR_ICONS.filter(i => i.toLowerCase().includes(iconSearch.toLowerCase()));
  }, [iconSearch]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = "Skill name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    if (currentScore > targetScore) {
      newErrors.currentScore = "Current score cannot exceed target";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onAdd({ name: name.trim(), description: description.trim(), icon, color, currentScore, targetScore });
    onClose();
  };

  const selectedColor = SKILL_COLORS[color];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editSkill ? "Edit Skill" : "Add New Skill"}
      size="lg"
    >
      {/* Custom Header with Icon Preview */}
      <div className={`-mx-6 -mt-4 mb-6 px-6 py-6 bg-gradient-to-br ${selectedColor.gradient} relative overflow-hidden`}>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full" />
        <div className="flex items-center gap-4 relative">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedColor.gradient} flex items-center justify-center`}>
              <SkillIcon name={icon} className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-white font-bold text-lg">{name || "Your Skill"}</p>
            <p className="text-white/70 text-sm">Preview</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <Input
          label="Skill Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., JavaScript, Spanish, Piano..."
          error={errors.name}
          className="bg-gray-50 border-gray-200 rounded-xl py-3"
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this skill involve?"
            rows={2}
            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Icon Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
          <button
            type="button"
            onClick={() => setShowIconPicker(!showIconPicker)}
            className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-left flex items-center gap-3 hover:bg-gray-100 transition-colors ${showIconPicker ? 'ring-2 ring-blue-500 border-transparent' : ''}`}
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedColor.gradient} flex items-center justify-center`}>
              <SkillIcon name={icon} className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-700 flex-1">{icon}</span>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showIconPicker ? 'rotate-180' : ''}`} />
          </button>

          {showIconPicker && (
            <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  placeholder="Search icons..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-8 gap-1 max-h-36 overflow-y-auto">
                {filteredIcons.map((iconName) => (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => { setIcon(iconName); setShowIconPicker(false); }}
                    className={`p-2 rounded-lg transition-all ${icon === iconName ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 text-gray-600'}`}
                    title={iconName}
                  >
                    <SkillIcon name={iconName} className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color Theme</label>
          <div className="grid grid-cols-5 gap-2">
            {SKILL_COLORS.map((c, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setColor(index)}
                className={`h-10 rounded-xl bg-gradient-to-br ${c.gradient} transition-all ${color === index ? 'ring-2 ring-offset-2 ring-gray-400 scale-105' : 'hover:scale-105'}`}
                title={c.name}
              >
                {color === index && <Check className="w-5 h-5 text-white mx-auto" />}
              </button>
            ))}
          </div>
        </div>

        {/* Score Settings */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Current Score"
            type="number"
            value={currentScore}
            onChange={(e) => setCurrentScore(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
            min={0}
            max={100}
            error={errors.currentScore}
            className="bg-gray-50 border-gray-200 rounded-xl py-3"
          />
          <Input
            label="Target Score"
            type="number"
            value={targetScore}
            onChange={(e) => setTargetScore(Math.max(1, Math.min(100, parseInt(e.target.value) || 100)))}
            min={1}
            max={100}
            className="bg-gray-50 border-gray-200 rounded-xl py-3"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {editSkill ? (
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Save Changes
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Create Skill
              </span>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gradient-to-br from-violet-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <BookOpen className="w-12 h-12 text-violet-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">No skills yet</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        Start tracking your learning journey by adding your first custom skill.
      </p>
      <button
        onClick={onAdd}
        className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
      >
        <Plus className="w-5 h-5" />
        Add Your First Skill
      </button>
    </div>
  );
}

// =============================================================================
// Main Page Component
// =============================================================================

export default function UserSkillsDemoPage() {
  const [skills, setSkills] = useState<UserCustomSkill[]>(initialUserSkills);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<UserCustomSkill | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "score" | "recent">("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Filter and sort skills
  const filteredSkills = useMemo(() => {
    let result = skills.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (sortBy) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "score":
        result.sort((a, b) => b.currentScore - a.currentScore);
        break;
      case "recent":
        result.sort((a, b) => new Date(b.lastPracticed).getTime() - new Date(a.lastPracticed).getTime());
        break;
    }

    return result;
  }, [skills, searchQuery, sortBy]);

  // Stats calculations
  const stats = useMemo(() => {
    const totalSkills = skills.length;
    const avgScore = totalSkills > 0 ? Math.round(skills.reduce((sum, s) => sum + s.currentScore, 0) / totalSkills) : 0;
    const totalPractices = skills.reduce((sum, s) => sum + s.totalPractices, 0);
    const maxScore = totalSkills > 0 ? Math.max(...skills.map(s => s.currentScore)) : 0;
    return { totalSkills, avgScore, totalPractices, maxScore };
  }, [skills]);

  const handleAddSkill = (skillData: Omit<UserCustomSkill, 'id' | 'createdAt' | 'lastPracticed' | 'totalPractices'>) => {
    if (editingSkill) {
      setSkills(prev => prev.map(s =>
        s.id === editingSkill.id
          ? { ...s, ...skillData }
          : s
      ));
      setEditingSkill(null);
    } else {
      const newSkill: UserCustomSkill = {
        ...skillData,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        lastPracticed: new Date().toISOString().split('T')[0],
        totalPractices: 0,
      };
      setSkills(prev => [newSkill, ...prev]);
    }
  };

  const handleDeleteSkill = (id: number) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      setSkills(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleEditSkill = (skill: UserCustomSkill) => {
    setEditingSkill(skill);
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50">
      <DemoHeader
        title="My Skills Dashboard"
        storyId="US-6-2"
        description="Add custom skills and track your learning journey"
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-3xl p-8 mb-8">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full" />

          <div className="relative">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Warren Buffett&apos;s Skills</h2>
                <p className="text-violet-200">The Oracle of Omaha&apos;s mastery areas</p>
              </div>
              <button
                onClick={() => { setEditingSkill(null); setShowAddModal(true); }}
                className="px-5 py-3 bg-white text-violet-600 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New Skill
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white/80 text-sm">Total Skills</span>
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalSkills}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white/80 text-sm">Avg. Score</span>
                </div>
                <p className="text-3xl font-bold text-white">{stats.avgScore}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white/80 text-sm">Practices</span>
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalPractices.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white/80 text-sm">Top Score</span>
                </div>
                <p className="text-3xl font-bold text-white">{stats.maxScore}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your skills..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-sm"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Filter className="w-5 h-5" />
              <span>Sort: {sortBy === 'name' ? 'Name' : sortBy === 'score' ? 'Score' : 'Recent'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showSortDropdown && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[150px] z-10">
                {[
                  { value: 'recent', label: 'Most Recent' },
                  { value: 'name', label: 'Name' },
                  { value: 'score', label: 'Highest Score' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => { setSortBy(option.value as typeof sortBy); setShowSortDropdown(false); }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${sortBy === option.value ? 'text-violet-600 font-medium bg-violet-50' : 'text-gray-700'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-violet-100 text-violet-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-violet-100 text-violet-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Skills Grid/List */}
        {filteredSkills.length > 0 ? (
          <div className={viewMode === 'grid'
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {filteredSkills.map((skill) => (
              viewMode === 'grid' ? (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  onEdit={handleEditSkill}
                  onDelete={handleDeleteSkill}
                />
              ) : (
                <div
                  key={skill.id}
                  className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-5 flex items-center gap-5 hover:shadow-xl transition-all"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${SKILL_COLORS[skill.color]?.gradient || SKILL_COLORS[0].gradient} flex items-center justify-center flex-shrink-0`}>
                    <SkillIcon name={skill.icon} className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{skill.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{skill.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{skill.currentScore}</p>
                    <p className="text-sm text-gray-500">/ {skill.targetScore}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSkill(skill)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No skills found</h3>
            <p className="text-gray-500">Try a different search term</p>
          </div>
        ) : (
          <EmptyState onAdd={() => { setEditingSkill(null); setShowAddModal(true); }} />
        )}

        {/* Acceptance Criteria */}
        <AcceptanceCriteriaSection storyId="US-6-2" />
      </main>

      {/* Add/Edit Skill Modal */}
      <AddSkillModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setEditingSkill(null); }}
        onAdd={handleAddSkill}
        editSkill={editingSkill}
      />
    </div>
  );
}
