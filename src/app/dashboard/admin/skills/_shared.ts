// Shared types and utilities for skill management

export interface Skill {
  id: number;
  name: string;
  description: string | null;
  icon: string;
  color: number;
  parentId: number | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  children?: Skill[];
}

export interface SkillWithStats extends Skill {
  ancestors: Skill[];
  stats: {
    directChildCount: number;
    totalDescendants: number;
    depth: number;
  };
}

// Color palette for skills (index 0-9)
export const SKILL_COLORS = [
  {
    name: "Violet",
    bg: "bg-violet-500",
    light: "bg-violet-100",
    text: "text-violet-600",
    gradient: "bg-gradient-to-br from-violet-500 to-purple-500",
    ring: "ring-violet-500",
  },
  {
    name: "Blue",
    bg: "bg-blue-500",
    light: "bg-blue-100",
    text: "text-blue-600",
    gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
    ring: "ring-blue-500",
  },
  {
    name: "Emerald",
    bg: "bg-emerald-500",
    light: "bg-emerald-100",
    text: "text-emerald-600",
    gradient: "bg-gradient-to-br from-emerald-500 to-teal-500",
    ring: "ring-emerald-500",
  },
  {
    name: "Orange",
    bg: "bg-orange-500",
    light: "bg-orange-100",
    text: "text-orange-600",
    gradient: "bg-gradient-to-br from-orange-500 to-amber-500",
    ring: "ring-orange-500",
  },
  {
    name: "Pink",
    bg: "bg-pink-500",
    light: "bg-pink-100",
    text: "text-pink-600",
    gradient: "bg-gradient-to-br from-pink-500 to-rose-500",
    ring: "ring-pink-500",
  },
  {
    name: "Indigo",
    bg: "bg-indigo-500",
    light: "bg-indigo-100",
    text: "text-indigo-600",
    gradient: "bg-gradient-to-br from-indigo-500 to-blue-500",
    ring: "ring-indigo-500",
  },
  {
    name: "Cyan",
    bg: "bg-cyan-500",
    light: "bg-cyan-100",
    text: "text-cyan-600",
    gradient: "bg-gradient-to-br from-cyan-500 to-blue-500",
    ring: "ring-cyan-500",
  },
  {
    name: "Rose",
    bg: "bg-rose-500",
    light: "bg-rose-100",
    text: "text-rose-600",
    gradient: "bg-gradient-to-br from-rose-500 to-pink-500",
    ring: "ring-rose-500",
  },
  {
    name: "Amber",
    bg: "bg-amber-500",
    light: "bg-amber-100",
    text: "text-amber-600",
    gradient: "bg-gradient-to-br from-amber-500 to-yellow-500",
    ring: "ring-amber-500",
  },
  {
    name: "Teal",
    bg: "bg-teal-500",
    light: "bg-teal-100",
    text: "text-teal-600",
    gradient: "bg-gradient-to-br from-teal-500 to-emerald-500",
    ring: "ring-teal-500",
  },
];

export function getSkillColor(colorIndex: number) {
  return SKILL_COLORS[colorIndex % SKILL_COLORS.length];
}

// Flatten skill tree to a flat array
export function flattenSkills(skills: Skill[]): Skill[] {
  const result: Skill[] = [];
  const traverse = (skill: Skill) => {
    result.push(skill);
    skill.children?.forEach(traverse);
  };
  skills.forEach(traverse);
  return result;
}

// Count all descendants in a skill tree
export function countDescendants(skill: Skill): number {
  let count = 0;
  const traverse = (s: Skill) => {
    if (s.children) {
      count += s.children.length;
      s.children.forEach(traverse);
    }
  };
  traverse(skill);
  return count;
}

// Filter skill tree by search query (preserves tree structure)
export function filterSkillTree(skills: Skill[], query: string): Skill[] {
  if (!query) return skills;
  const lowerQuery = query.toLowerCase();

  return skills
    .map((skill): Skill | null => {
      const matchesSearch = skill.name.toLowerCase().includes(lowerQuery);
      const filteredChildren = skill.children
        ? filterSkillTree(skill.children, query)
        : [];

      if (matchesSearch || filteredChildren.length > 0) {
        return {
          ...skill,
          children: filteredChildren.length > 0 ? filteredChildren : skill.children,
        };
      }
      return null;
    })
    .filter((skill): skill is Skill => skill !== null);
}

// Get view preference from localStorage
export function getViewPreference(): "tree" | "grid" {
  if (typeof window === "undefined") return "tree";
  return (localStorage.getItem("skillViewPreference") as "tree" | "grid") || "tree";
}

// Save view preference to localStorage
export function setViewPreference(view: "tree" | "grid"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("skillViewPreference", view);
}
