"use client";

import { Badge } from "@/components/ui/Badge";
import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

// =============================================================================
// Types
// =============================================================================

export interface Skill {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: number;
  parentId: number | null;
  children?: Skill[];
}

export interface UserSkill {
  id: number;
  skillId: number;
  skillName: string;
  currentScore: number;
  lastAssessedAt: string;
}

export interface ScoreHistory {
  id: number;
  userSkillId: number;
  score: number;
  source: "test" | "practice" | "assessment";
  note: string;
  createdAt: string;
}

// =============================================================================
// Mock Data
// =============================================================================

export const mockSkills: Skill[] = [
  {
    id: 1,
    name: "English",
    description: "Master reading, writing, listening, and speaking skills",
    icon: "Languages",
    parentId: null,
    children: [
      {
        id: 2,
        name: "Reading",
        description: "Understand written texts and extract meaning",
        icon: "BookOpen",
        parentId: 1,
        children: [
          { id: 5, name: "Comprehension", description: "Grasp main ideas and details from texts", icon: "Brain", parentId: 2 },
          { id: 6, name: "Vocabulary", description: "Learn and apply new words in context", icon: "BookA", parentId: 2 },
        ],
      },
      {
        id: 3,
        name: "Listening",
        description: "Understand spoken language in various contexts",
        icon: "Headphones",
        parentId: 1,
        children: [
          { id: 7, name: "Conversation", description: "Follow everyday dialogues and discussions", icon: "MessageCircle", parentId: 3 },
          { id: 8, name: "Lecture", description: "Comprehend academic and formal presentations", icon: "GraduationCap", parentId: 3 },
        ],
      },
      { id: 4, name: "Writing", description: "Express ideas clearly in written form", icon: "PenTool", parentId: 1 },
      { id: 9, name: "Speaking", description: "Communicate verbally with fluency and clarity", icon: "Mic", parentId: 1 },
    ],
  },
  {
    id: 10,
    name: "Mathematics",
    description: "Develop numerical reasoning and problem-solving abilities",
    icon: "Calculator",
    parentId: null,
    children: [
      { id: 11, name: "Algebra", description: "Solve equations and work with variables", icon: "Variable", parentId: 10 },
      { id: 12, name: "Geometry", description: "Understand shapes, spaces, and measurements", icon: "Triangle", parentId: 10 },
      { id: 13, name: "Calculus", description: "Analyze change and motion with derivatives", icon: "TrendingUp", parentId: 10 },
    ],
  },
  {
    id: 20,
    name: "Programming",
    description: "Build software applications and automate tasks",
    icon: "Code",
    parentId: null,
    children: [
      { id: 21, name: "JavaScript", description: "Create interactive web applications", icon: "Braces", parentId: 20 },
      { id: 22, name: "Python", description: "Write versatile scripts and data solutions", icon: "Terminal", parentId: 20 },
      { id: 23, name: "TypeScript", description: "Build type-safe JavaScript applications", icon: "FileCode", parentId: 20 },
    ],
  },
];

export const mockUserSkills: UserSkill[] = [
  { id: 1, skillId: 5, skillName: "Comprehension", currentScore: 75, lastAssessedAt: "2024-12-10" },
  { id: 2, skillId: 6, skillName: "Vocabulary", currentScore: 62, lastAssessedAt: "2024-12-08" },
  { id: 3, skillId: 7, skillName: "Conversation", currentScore: 45, lastAssessedAt: "2024-12-05" },
  { id: 4, skillId: 11, skillName: "Algebra", currentScore: 88, lastAssessedAt: "2024-12-12" },
  { id: 5, skillId: 21, skillName: "JavaScript", currentScore: 72, lastAssessedAt: "2024-12-11" },
];

export const mockScoreHistory: ScoreHistory[] = [
  { id: 1, userSkillId: 1, score: 45, source: "test", note: "Initial placement test", createdAt: "2024-10-01" },
  { id: 2, userSkillId: 1, score: 52, source: "practice", note: "Practice session 1", createdAt: "2024-10-15" },
  { id: 3, userSkillId: 1, score: 58, source: "practice", note: "Practice session 2", createdAt: "2024-11-01" },
  { id: 4, userSkillId: 1, score: 65, source: "assessment", note: "Mid-term self-assessment", createdAt: "2024-11-15" },
  { id: 5, userSkillId: 1, score: 70, source: "test", note: "Monthly test", createdAt: "2024-12-01" },
  { id: 6, userSkillId: 1, score: 75, source: "practice", note: "Recent practice", createdAt: "2024-12-10" },
  { id: 7, userSkillId: 2, score: 40, source: "test", note: "Initial test", createdAt: "2024-10-05" },
  { id: 8, userSkillId: 2, score: 55, source: "practice", note: "Flashcard practice", createdAt: "2024-11-10" },
  { id: 9, userSkillId: 2, score: 62, source: "assessment", note: "Self-assessment", createdAt: "2024-12-08" },
];

// =============================================================================
// Helper Functions
// =============================================================================

export function getScoreLevel(score: number): { level: string; color: string; variant: "default" | "primary" | "success" | "warning" | "danger" } {
  if (score >= 81) return { level: "Expert", color: "text-purple-600", variant: "primary" };
  if (score >= 61) return { level: "Advanced", color: "text-green-600", variant: "success" };
  if (score >= 41) return { level: "Intermediate", color: "text-blue-600", variant: "primary" };
  if (score >= 21) return { level: "Elementary", color: "text-yellow-600", variant: "warning" };
  return { level: "Beginner", color: "text-red-600", variant: "danger" };
}

export function getSourceLabel(source: "test" | "practice" | "assessment"): { label: string; variant: "default" | "primary" | "success" | "warning" | "danger" } {
  switch (source) {
    case "test": return { label: "Test", variant: "danger" };
    case "practice": return { label: "Practice", variant: "primary" };
    case "assessment": return { label: "Assessment", variant: "warning" };
  }
}

export function flattenSkills(skills: Skill[]): Skill[] {
  const result: Skill[] = [];
  const traverse = (skill: Skill) => {
    result.push(skill);
    skill.children?.forEach(traverse);
  };
  skills.forEach(traverse);
  return result;
}

// =============================================================================
// Shared Components
// =============================================================================

interface SkillIconProps extends LucideProps {
  name?: string;
}

export function SkillIcon({ name, ...props }: SkillIconProps) {
  if (!name) {
    // Default fallback icon
    const FallbackIcon = LucideIcons.FileText;
    return <FallbackIcon {...props} />;
  }

  const IconComponent = LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<LucideProps>;

  if (!IconComponent) {
    const FallbackIcon = LucideIcons.FileText;
    return <FallbackIcon {...props} />;
  }

  return <IconComponent {...props} />;
}

export function DemoHeader({ title, storyId, description }: { title: string; storyId: string; description: string }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <a href="/demo/skills" className="text-blue-600 hover:text-blue-800 text-sm">← All Stories</a>
              <Badge variant="primary">{storyId}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
          <Badge variant="warning">Demo</Badge>
        </div>
      </div>
    </header>
  );
}

export function ScoreLevelGuide() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
      {[
        { range: "0-20", level: "Beginner", desc: "Just started", color: "bg-red-100 text-red-800" },
        { range: "21-40", level: "Elementary", desc: "Basic understanding", color: "bg-yellow-100 text-yellow-800" },
        { range: "41-60", level: "Intermediate", desc: "Can apply with guidance", color: "bg-blue-100 text-blue-800" },
        { range: "61-80", level: "Advanced", desc: "Can apply independently", color: "bg-green-100 text-green-800" },
        { range: "81-100", level: "Expert", desc: "Mastery level", color: "bg-purple-100 text-purple-800" },
      ].map((item) => (
        <div key={item.level} className={`p-3 rounded-lg ${item.color}`}>
          <div className="font-semibold">{item.level}</div>
          <div className="text-xs">{item.range}</div>
          <div className="text-xs opacity-75">{item.desc}</div>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// Acceptance Criteria
// =============================================================================

export interface AcceptanceCriteria {
  id: string;
  title: string;
  description: string;
}

export const acceptanceCriteriaData: Record<string, AcceptanceCriteria[]> = {
  "US-6.1": [
    { id: "AC-6.1.1", title: "View Skills List", description: "Admin can view all skills in Tree or Grid view" },
    { id: "AC-6.1.2", title: "View Skill Detail", description: "Admin can view detailed information of a skill" },
    { id: "AC-6.1.3", title: "Create New Skill", description: "Admin can create skills with name, description, icon, color, and parent" },
    { id: "AC-6.1.4", title: "Edit Skill", description: "Admin can edit all skill properties including parent" },
    { id: "AC-6.1.5", title: "Delete Skill", description: "Admin can delete skills (cascade to sub-skills)" },
    { id: "AC-6.1.6", title: "Skill Hierarchy", description: "Skills support parent-child relationships" },
    { id: "AC-6.1.7", title: "Search Skills", description: "Admin can search for skills by name" },
  ],
  "US-6.2": [
    { id: "AC-6.2.1", title: "View Skills Catalog", description: "User can view all available skills" },
    { id: "AC-6.2.2", title: "Skill Hierarchy Display", description: "Skills shown in organized tree structure" },
    { id: "AC-6.2.3", title: "Search Skills", description: "User can search for specific skills" },
    { id: "AC-6.2.4", title: "Skill Details", description: "User can view skill information" },
  ],
  "US-6.3": [
    { id: "AC-6.3.1", title: "Add Skill to Track", description: "User can add a skill to their tracking list" },
    { id: "AC-6.3.2", title: "Record New Score", description: "User can record a score with source and note" },
    { id: "AC-6.3.3", title: "Update Current Score", description: "Recording updates the current score" },
    { id: "AC-6.3.4", title: "Remove Skill from Tracking", description: "User can stop tracking a skill" },
  ],
  "US-6.4": [
    { id: "AC-6.4.1", title: "View History List", description: "User can see all recorded scores" },
    { id: "AC-6.4.2", title: "History Details", description: "Each entry shows score, source, date, note" },
    { id: "AC-6.4.3", title: "Filter History", description: "User can filter by source or date range" },
    { id: "AC-6.4.4", title: "Delete History Entry", description: "User can delete individual entries" },
  ],
  "US-6.5": [
    { id: "AC-6.5.1", title: "Dashboard Overview", description: "User sees all tracked skills at a glance" },
    { id: "AC-6.5.2", title: "Score Display", description: "Current score shown with level indicator" },
    { id: "AC-6.5.3", title: "Quick Actions", description: "Easy access to record scores" },
    { id: "AC-6.5.4", title: "Sort and Filter", description: "User can organize their skills view" },
  ],
  "US-6.6": [
    { id: "AC-6.6.1", title: "Score Trend Chart", description: "Line chart showing score progression" },
    { id: "AC-6.6.2", title: "Time Range Selection", description: "View progress over different periods" },
    { id: "AC-6.6.3", title: "Source Breakdown", description: "See distribution of score sources" },
    { id: "AC-6.6.4", title: "Progress Summary", description: "Key metrics and insights" },
  ],
  "US-6.7": [
    { id: "AC-6.7.1", title: "Overall Statistics", description: "Summary stats across all skills" },
    { id: "AC-6.7.2", title: "Skills Comparison", description: "Compare progress across skills" },
    { id: "AC-6.7.3", title: "Activity Trends", description: "View assessment frequency" },
    { id: "AC-6.7.4", title: "Recommendations", description: "Identify skills needing attention" },
  ],
  "US-6.8": [
    { id: "AC-6.8.1", title: "Download Template", description: "User can download import template" },
    { id: "AC-6.8.2", title: "Upload File", description: "User can upload CSV file with scores" },
    { id: "AC-6.8.3", title: "Validation Preview", description: "User sees validation before import" },
    { id: "AC-6.8.4", title: "Import Execution", description: "Scores are imported with progress" },
  ],
};

export function AcceptanceCriteriaSection({ storyId }: { storyId: string }) {
  const criteria = acceptanceCriteriaData[storyId] || [];

  return (
    <div className="mt-8 bg-white rounded-xl shadow-md p-6">
      <h3 className="font-semibold text-lg mb-4">Acceptance Criteria</h3>
      <div className="space-y-3">
        {criteria.map((ac) => (
          <div key={ac.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
            <Badge variant="primary">{ac.id}</Badge>
            <div>
              <div className="font-medium">{ac.title}</div>
              <div className="text-sm text-gray-600">{ac.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
