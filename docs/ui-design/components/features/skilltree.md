# SkillTree Component

**Location:** `src/components/SkillTree.tsx`

## Overview

A hierarchical tree component for displaying skills organized by parent-child relationships. Features rich visual styling with icons, colors, and descriptions. Used in admin skill management and the skills catalog for browsing available skills.

## Props

```typescript
interface SkillTreeProps {
  skills: Skill[];                          // Hierarchical skill data
  onSelect?: (skill: Skill) => void;        // Click handler for skill items
  selectedId?: number;                       // Currently selected skill ID
  searchQuery?: string;                      // Search term to filter/highlight
  viewMode?: "tree" | "grid";               // Display mode (default: tree)
  colors?: ColorSet[];                       // Color palette for skills
}

interface Skill {
  id: number;
  name: string;
  description?: string;
  icon?: string;              // Lucide icon name (default: "FileText")
  color?: number;             // Color index (0-9)
  parentId: number | null;
  children?: Skill[];
}

interface ColorSet {
  from: string;               // Gradient start (e.g., "from-violet-500")
  to: string;                 // Gradient end (e.g., "to-purple-500")
  bg: string;                 // Solid background (e.g., "bg-violet-500")
  light: string;              // Light variant (e.g., "bg-violet-100")
  text: string;               // Text color (e.g., "text-violet-600")
  gradient: string;           // Full gradient class
}
```

## Default Color Palette

```typescript
const COLORS = [
  { from: "from-violet-500", to: "to-purple-500", bg: "bg-violet-500", light: "bg-violet-100", text: "text-violet-600", gradient: "bg-gradient-to-br from-violet-500 to-purple-500" },
  { from: "from-blue-500", to: "to-cyan-500", bg: "bg-blue-500", light: "bg-blue-100", text: "text-blue-600", gradient: "bg-gradient-to-br from-blue-500 to-cyan-500" },
  { from: "from-emerald-500", to: "to-teal-500", bg: "bg-emerald-500", light: "bg-emerald-100", text: "text-emerald-600", gradient: "bg-gradient-to-br from-emerald-500 to-teal-500" },
  { from: "from-orange-500", to: "to-amber-500", bg: "bg-orange-500", light: "bg-orange-100", text: "text-orange-600", gradient: "bg-gradient-to-br from-orange-500 to-amber-500" },
  { from: "from-pink-500", to: "to-rose-500", bg: "bg-pink-500", light: "bg-pink-100", text: "text-pink-600", gradient: "bg-gradient-to-br from-pink-500 to-rose-500" },
  { from: "from-indigo-500", to: "to-blue-500", bg: "bg-indigo-500", light: "bg-indigo-100", text: "text-indigo-600", gradient: "bg-gradient-to-br from-indigo-500 to-blue-500" },
];
```

## Structure

### Tree View (Default)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ ┌────────┐                                                        │   │
│  │ │ [icon] │  English                                          (4)  │   │
│  │ │gradient│  Master reading, writing, listening, and speaking...   │   │
│  │ └────────┘                                                        │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│    │                                                                     │
│    │ ┌ ml-6 pl-6 border-l-2 border-dashed border-gray-200 ──────────┐   │
│    │ │                                                               │   │
│    │ │ ┌──────────────────────────────────────────────────────────┐ │   │
│    │ │ │ ┌────────┐                                                │ │   │
│    │ │ │ │ [icon] │  Reading                                  (2)  │ │   │
│    │ │ │ │gradient│  Understand written texts and extract...       │ │   │
│    │ │ │ └────────┘                                                │ │   │
│    │ │ └──────────────────────────────────────────────────────────┘ │   │
│    │ │   │                                                           │   │
│    │ │   │ ┌─────────────────────────────────────────────────────┐  │   │
│    │ │   │ │ [🧠]  Comprehension                                  │  │   │
│    │ │   │ │       Grasp main ideas and details from texts        │  │   │
│    │ │   │ └─────────────────────────────────────────────────────┘  │   │
│    │ │   │                                                           │   │
│    │ │   │ ┌─────────────────────────────────────────────────────┐  │   │
│    │ │   │ │ [📚]  Vocabulary                                     │  │   │
│    │ │   │ │       Learn and apply new words in context           │  │   │
│    │ │   │ └─────────────────────────────────────────────────────┘  │   │
│    │ │                                                               │   │
│    │ │ ┌──────────────────────────────────────────────────────────┐ │   │
│    │ │ │ [🎧]  Listening                                      (2)  │ │   │
│    │ │ │       Understand spoken language in various contexts      │ │   │
│    │ │ └──────────────────────────────────────────────────────────┘ │   │
│    │ │                                                               │   │
│    │ │ ┌──────────────────────────────────────────────────────────┐ │   │
│    │ │ │ [✏️]  Writing                                              │ │   │
│    │ │ │       Express ideas clearly in written form               │ │   │
│    │ │ └──────────────────────────────────────────────────────────┘ │   │
│    │ │                                                               │   │
│    │ └───────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ ┌────────┐                                                        │   │
│  │ │ [🔢]  │  Mathematics                                       (3)  │   │
│  │ │gradient│  Develop numerical reasoning and problem-solving...    │   │
│  │ └────────┘                                                        │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Grid View

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────┐  │
│  │  ┌──────────────┐   │  │  ┌──────────────┐   │  │  ┌──────────┐   │  │
│  │  │              │   │  │  │              │   │  │  │          │   │  │
│  │  │   [🌐]      │   │  │  │   [📖]      │   │  │  │  [🎧]    │   │  │
│  │  │  gradient    │   │  │  │  gradient    │   │  │  │ gradient │   │  │
│  │  └──────────────┘   │  │  └──────────────┘   │  │  └──────────┘   │  │
│  │                      │  │                      │  │                │  │
│  │  English             │  │  Reading             │  │  Listening     │  │
│  │                      │  │                      │  │                │  │
│  │  Master reading...   │  │  Understand texts... │  │  Understand... │  │
│  │                      │  │                      │  │                │  │
│  │  ┌──────┐ ┌──────┐  │  │  ┌─────┐ ┌─────┐    │  │  ┌─────┐┌────┐ │  │
│  │  │ Read │ │ List │  │  │  │Comp │ │Voca │    │  │  │Conv ││Lect│ │  │
│  │  └──────┘ └──────┘  │  │  └─────┘ └─────┘    │  │  └─────┘└────┘ │  │
│  │        +2           │  │                      │  │                │  │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Styles

### Tree Node Container

| Element | Styles |
|---------|--------|
| Root wrapper | (no extra classes for root level) |
| Nested wrapper | `ml-6 pl-6 border-l-2 border-dashed border-gray-200` |

### Skill Item (Tree Node)

| Element | Styles |
|---------|--------|
| Button container | `group flex items-center gap-4 w-full p-4 mb-2 rounded-2xl text-left transition-all duration-300` |
| Normal state | `bg-white hover:bg-gray-50 border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50` |
| Selected state | `{color.gradient} shadow-xl shadow-{color.bg}/25 text-white` |

### Icon Container

| Element | Styles |
|---------|--------|
| Container | `relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300` |
| Normal state | `{color.gradient}` |
| Selected state | `bg-white/25` |
| Icon | `w-6 h-6 text-white` with `strokeWidth={1.5}` |

### Content

| Element | Styles |
|---------|--------|
| Content wrapper | `flex-1 min-w-0` |
| Name | `font-semibold truncate` + `text-gray-800` (normal) / `text-white` (selected) |
| Description | `text-sm truncate` + `text-gray-500` (normal) / `text-white/70` (selected) |

### Child Count Badge

| Element | Styles |
|---------|--------|
| Badge | `px-3 py-1 rounded-full text-sm font-bold` |
| Normal state | `{color.light} {color.text}` |
| Selected state | `bg-white/25 text-white` |

### Grid Card

| Element | Styles |
|---------|--------|
| Card container | `group relative p-5 rounded-2xl text-left transition-all duration-500 hover:scale-[1.02]` |
| Normal state | `bg-white hover:shadow-xl border border-gray-100` |
| Selected state | `{color.gradient} shadow-xl shadow-{color.bg}/30 text-white` |
| Hover overlay | `absolute inset-0 rounded-2xl {color.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300` |

### Grid Icon Container

| Element | Styles |
|---------|--------|
| Container | `w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg` |
| Normal state | `{color.gradient} group-hover:scale-110 group-hover:rotate-3` |
| Selected state | `bg-white/25` |
| Icon | `w-7 h-7 text-white` with `strokeWidth={1.5}` |

### Grid Content

| Element | Styles |
|---------|--------|
| Content wrapper | `flex-1 min-w-0` |
| Name | `font-bold truncate` + `text-gray-800` (normal) / `text-white` (selected) |
| Description | `text-sm mt-0.5 line-clamp-2` + `text-gray-500` (normal) / `text-white/70` (selected) |

### Sub-skill Tags (Grid)

| Element | Styles |
|---------|--------|
| Tags container | `flex flex-wrap gap-1.5 mt-3` |
| Tag | `px-2.5 py-1 rounded-lg text-xs font-semibold` |
| Normal state | `{color.light} {color.text}` |
| Selected state | `bg-white/20 text-white` |
| More badge | `bg-gray-100 text-gray-500` (normal) / `bg-white/20 text-white` (selected) |

## States

### Loading

```tsx
<div className="animate-pulse space-y-4">
  {[...Array(3)].map((_, i) => (
    <div key={i} className="h-20 bg-gray-200 rounded-2xl" />
  ))}
</div>
```

### Empty

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                    ┌───────────────────────┐                            │
│                    │                       │                            │
│                    │          🔍           │                            │
│                    │    (gradient bg)      │                            │
│                    └───────────────────────┘                            │
│                                                                          │
│                       No skills found                                   │
│                                                                          │
│               Try adjusting your search or add                          │
│                        a new skill                                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

| Element | Styles |
|---------|--------|
| Container | `py-20 text-center` |
| Icon box | `w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center` |
| Icon | `w-12 h-12 text-gray-400` |
| Title | `text-xl font-black text-gray-800 mb-2` |
| Message | `text-gray-500 font-medium` |

## Animation

### Staggered Entry
```tsx
<div
  className={`transition-all duration-500 ${
    mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
  }`}
  style={{ transitionDelay: `${idx * 50}ms` }}
>
```

### Grid Card Entry
```tsx
<button
  className={`... ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
  style={{ transitionDelay: `${idx * 30}ms` }}
>
```

### Icon Hover (Grid)
- Scale: `group-hover:scale-110`
- Rotate: `group-hover:rotate-3`

## Usage Examples

### Admin Skill Management (Tree)

```tsx
import { SkillTree } from "@/components/SkillTree";
import { SkillIcon } from "@/app/demo/skills/_shared";

// Render tree view
const renderTree = (list: Skill[], depth = 0, parentColor?: ColorSet) => (
  <div className={depth > 0 ? "ml-6 pl-6 border-l-2 border-dashed border-gray-200" : ""}>
    {list.map((skill, idx) => {
      const color = skill.color !== undefined
        ? COLORS[skill.color % COLORS.length]
        : (depth === 0 ? getColorByIndex(idx) : parentColor || COLORS[0]);
      const isSelected = selectedSkill?.id === skill.id;

      return (
        <div key={skill.id}>
          <button
            onClick={() => router.push(`/admin/skills/${skill.id}`)}
            className={`group flex items-center gap-4 w-full p-4 mb-2 rounded-2xl text-left transition-all duration-300 ${
              isSelected
                ? `${color.gradient} shadow-xl text-white`
                : "bg-white hover:bg-gray-50 border border-gray-100 hover:shadow-lg"
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isSelected ? "bg-white/25" : color.gradient
            }`}>
              <SkillIcon name={skill.icon} className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold truncate ${isSelected ? "text-white" : "text-gray-800"}`}>
                {skill.name}
              </p>
              {skill.description && (
                <p className={`text-sm truncate ${isSelected ? "text-white/70" : "text-gray-500"}`}>
                  {skill.description}
                </p>
              )}
            </div>
            {skill.children?.length > 0 && (
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                isSelected ? "bg-white/25 text-white" : `${color.light} ${color.text}`
              }`}>
                {skill.children.length}
              </span>
            )}
          </button>
          {skill.children?.length > 0 && renderTree(skill.children, depth + 1, color)}
        </div>
      );
    })}
  </div>
);
```

### Admin Skill Management (Grid)

```tsx
// Render grid view
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {flattenedSkills.map((skill, idx) => {
    const color = getSkillColor(skill);
    const isSelected = selectedSkill?.id === skill.id;

    return (
      <button
        key={skill.id}
        onClick={() => router.push(`/admin/skills/${skill.id}`)}
        className={`group relative p-5 rounded-2xl text-left transition-all duration-500 hover:scale-[1.02] ${
          isSelected
            ? `${color.gradient} shadow-xl text-white`
            : "bg-white hover:shadow-xl border border-gray-100"
        }`}
      >
        <div className="relative flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
            isSelected ? "bg-white/25" : `${color.gradient} group-hover:scale-110 group-hover:rotate-3`
          }`}>
            <SkillIcon name={skill.icon} className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold truncate ${isSelected ? "text-white" : "text-gray-800"}`}>
              {skill.name}
            </h3>
            {skill.description && (
              <p className={`text-sm mt-0.5 line-clamp-2 ${isSelected ? "text-white/70" : "text-gray-500"}`}>
                {skill.description}
              </p>
            )}
            {skill.children?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {skill.children.slice(0, 2).map(child => (
                  <span key={child.id} className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    isSelected ? "bg-white/20 text-white" : `${color.light} ${color.text}`
                  }`}>
                    {child.name}
                  </span>
                ))}
                {skill.children.length > 2 && (
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    +{skill.children.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </button>
    );
  })}
</div>
```

### With Search Filtering

```tsx
const [searchQuery, setSearchQuery] = useState("");

// Filter tree while preserving structure
const filterSkillTree = (skillList: Skill[]): Skill[] => {
  return skillList
    .map((skill): Skill | null => {
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
      const filteredChildren = skill.children ? filterSkillTree(skill.children) : [];
      if (matchesSearch || filteredChildren.length > 0) {
        return { ...skill, children: filteredChildren.length > 0 ? filteredChildren : skill.children };
      }
      return null;
    })
    .filter((skill): skill is Skill => skill !== null);
};

const filteredSkillTree = searchQuery ? filterSkillTree(skills) : skills;

// Usage
<>
  <input
    type="search"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search skills..."
    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl"
  />
  {renderTree(filteredSkillTree)}
</>
```

## Helper Functions

### Flatten Skills

```typescript
const flattenSkills = (skillList: Skill[]): Skill[] => {
  const result: Skill[] = [];
  const traverse = (skill: Skill) => {
    result.push(skill);
    skill.children?.forEach(traverse);
  };
  skillList.forEach(traverse);
  return result;
};
```

### Get Skill Color

```typescript
const getSkillColor = (skill: Skill, fallbackIndex?: number) => {
  // Use skill's color property if set
  if (skill.color !== undefined) {
    return COLORS[skill.color % COLORS.length];
  }
  // Otherwise fall back to index-based color
  if (fallbackIndex !== undefined) {
    return COLORS[fallbackIndex % COLORS.length];
  }
  // Find root skill index
  const rootIndex = skills.findIndex(s => {
    if (s.id === skill.id) return true;
    const findInChildren = (children: Skill[] | undefined): boolean => {
      if (!children) return false;
      return children.some(c => c.id === skill.id || findInChildren(c.children));
    };
    return findInChildren(s.children);
  });
  return COLORS[rootIndex >= 0 ? rootIndex : 0 % COLORS.length];
};
```

## SkillIcon Component

```tsx
import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

interface SkillIconProps extends LucideProps {
  name?: string;
}

export function SkillIcon({ name, ...props }: SkillIconProps) {
  if (!name) {
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
```

## Accessibility

- Interactive elements use `<button>` with proper focus states
- Color contrast meets WCAG guidelines (white text on colored backgrounds)
- Icons include proper sizing and stroke widths for visibility
- Keyboard navigation supported (Tab, Enter to activate)
- `truncate` and `line-clamp-2` ensure text doesn't overflow unexpectedly
