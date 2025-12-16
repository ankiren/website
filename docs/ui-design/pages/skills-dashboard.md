# Skills Dashboard Page

**Location:** `src/app/dashboard/skills/page.tsx`

## Overview

The Skills Dashboard is the main hub for users to view and manage their tracked skills. It displays all tracked skills in a responsive grid with current scores, levels, and quick actions for recording new scores.

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  My Skills                              [Browse Skills] │
│  Tracking 8 skills across 3 categories                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─ Summary Cards ──────────────────────────────────┐   │
│  │ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐     │   │
│  │ │ Total  │ │ Expert │ │Advanced│ │Beginner│     │   │
│  │ │   8    │ │   1    │ │   3    │ │   2    │     │   │
│  │ └────────┘ └────────┘ └────────┘ └────────┘     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─ Filters & Sort ─────────────────────────────────┐   │
│  │ Sort: [Score ▼]  Filter: [All Levels ▼] [🔍    ]│   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─ English ────────────────────────────────────────┐   │
│  │                                                   │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐       │   │
│  │  │ Reading  │  │ Listening│  │ Speaking │       │   │
│  │  │   75     │  │   60     │  │   --     │       │   │
│  │  │ Advanced │  │ Intermed │  │ No score │       │   │
│  │  └──────────┘  └──────────┘  └──────────┘       │   │
│  │                                                   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─ Programming ────────────────────────────────────┐   │
│  │  ┌──────────┐  ┌──────────┐                      │   │
│  │  │JavaScript│  │  Python  │                      │   │
│  │  │   85     │  │   70     │                      │   │
│  │  │  Expert  │  │ Advanced │                      │   │
│  │  └──────────┘  └──────────┘                      │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Components Used

- `SkillCard` - Individual skill cards with score
- `Button` - Actions (Browse Skills)
- `Badge` - Level indicators
- `ScoreInput` - Modal for recording scores

## Sections

### Page Header

| Element | Styles |
|---------|--------|
| Container | `flex justify-between items-center mb-6` |
| Title | `text-3xl font-bold text-gray-900` |
| Subtitle | `text-gray-600 mt-1` |

### Summary Cards

| Element | Styles |
|---------|--------|
| Container | `grid grid-cols-2 md:grid-cols-4 gap-4 mb-6` |
| Card | `bg-white rounded-lg shadow-sm p-4 text-center` |
| Value | `text-2xl font-bold text-gray-900` |
| Label | `text-sm text-gray-500` |

```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
  <div className="bg-white rounded-lg shadow-sm p-4 text-center">
    <div className="text-2xl font-bold text-gray-900">{totalSkills}</div>
    <div className="text-sm text-gray-500">Total Skills</div>
  </div>
  <div className="bg-white rounded-lg shadow-sm p-4 text-center">
    <div className="text-2xl font-bold text-emerald-600">{expertCount}</div>
    <div className="text-sm text-gray-500">Expert</div>
  </div>
  <div className="bg-white rounded-lg shadow-sm p-4 text-center">
    <div className="text-2xl font-bold text-green-600">{advancedCount}</div>
    <div className="text-sm text-gray-500">Advanced</div>
  </div>
  <div className="bg-white rounded-lg shadow-sm p-4 text-center">
    <div className="text-2xl font-bold text-red-600">{beginnerCount}</div>
    <div className="text-sm text-gray-500">Beginner</div>
  </div>
</div>
```

### Filter & Sort Bar

```tsx
<div className="flex flex-wrap gap-4 mb-6 bg-white rounded-lg shadow-sm p-4">
  {/* Sort Dropdown */}
  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="px-3 py-2 border border-gray-300 rounded-lg"
  >
    <option value="name">Name (A-Z)</option>
    <option value="score-desc">Score (High to Low)</option>
    <option value="score-asc">Score (Low to High)</option>
    <option value="recent">Recently Assessed</option>
  </select>

  {/* Level Filter */}
  <select
    value={levelFilter}
    onChange={(e) => setLevelFilter(e.target.value)}
    className="px-3 py-2 border border-gray-300 rounded-lg"
  >
    <option value="all">All Levels</option>
    <option value="expert">Expert (81-100)</option>
    <option value="advanced">Advanced (61-80)</option>
    <option value="intermediate">Intermediate (41-60)</option>
    <option value="elementary">Elementary (21-40)</option>
    <option value="beginner">Beginner (0-20)</option>
    <option value="unscored">Not Assessed</option>
  </select>

  {/* Search */}
  <input
    type="search"
    placeholder="Search skills..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg"
  />
</div>
```

### Skill Groups (By Parent)

| Element | Styles |
|---------|--------|
| Group Container | `mb-8` |
| Group Header | `text-lg font-semibold text-gray-700 mb-4 flex items-center` |
| Group Badge | `ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full` |
| Skills Grid | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4` |

```tsx
{Object.entries(groupedSkills).map(([parentName, skills]) => (
  <div key={parentName} className="mb-8">
    <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
      {parentName || "Other Skills"}
      <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
        {skills.length}
      </span>
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {skills.map((skill) => (
        <SkillCard
          key={skill.id}
          {...skill}
          onRecordScore={openScoreModal}
          onRemove={handleRemoveSkill}
        />
      ))}
    </div>
  </div>
))}
```

## States

### Loading State

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {[...Array(8)].map((_, i) => (
    <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
      <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
    </div>
  ))}
</div>
```

### Empty State

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│                    [Skills icon]                         │
│                                                          │
│               No skills tracked yet                      │
│        Browse available skills and add them to           │
│              start tracking your progress                │
│                                                          │
│                  [Browse Skills]                         │
└─────────────────────────────────────────────────────────┘
```

```tsx
<div className="text-center py-16 bg-white rounded-xl shadow-md">
  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
    <svg className="w-10 h-10 text-gray-400" /* skills icon */ />
  </div>
  <h2 className="text-xl font-semibold text-gray-900 mb-2">
    No skills tracked yet
  </h2>
  <p className="text-gray-600 mb-6 max-w-md mx-auto">
    Browse available skills and add them to start tracking your progress
  </p>
  <Link href="/dashboard/skills/browse">
    <Button>Browse Skills</Button>
  </Link>
</div>
```

### No Results (After Filter)

```tsx
<div className="text-center py-12 bg-gray-50 rounded-lg">
  <p className="text-gray-600">No skills match your filters</p>
  <button
    onClick={clearFilters}
    className="mt-2 text-blue-600 hover:underline"
  >
    Clear filters
  </button>
</div>
```

## Data Flow

```typescript
interface UserSkill {
  id: string;
  skillId: string;
  name: string;
  parentName: string | null;
  currentScore: number | null;
  lastAssessedAt: string | null;
}

interface DashboardData {
  skills: UserSkill[];
  summary: {
    total: number;
    byLevel: {
      expert: number;
      advanced: number;
      intermediate: number;
      elementary: number;
      beginner: number;
      unscored: number;
    };
  };
}
```

## Actions

### Record Score
1. Click "+" on skill card → Opens ScoreInput modal
2. Enter score, source, optional note
3. Submit → API call → Refresh skill data
4. Show success toast

### Remove Skill
1. Click menu → "Remove Skill"
2. Confirmation dialog
3. API call → Remove from list
4. Show success toast

### Browse Skills
Navigate to `/dashboard/skills/browse` to add new skills

## Responsive Behavior

| Breakpoint | Grid Columns | Summary Cards |
|------------|--------------|---------------|
| Mobile | 1 column | 2 columns |
| `sm` | 2 columns | 2 columns |
| `md` | 2 columns | 4 columns |
| `lg` | 3 columns | 4 columns |
| `xl` | 4 columns | 4 columns |

## Code Example

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import SkillCard from "@/components/SkillCard";
import ScoreInput from "@/components/ScoreInput";

export default function SkillsDashboard() {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoreModalSkill, setScoreModalSkill] = useState<UserSkill | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const groupedSkills = groupByParent(skills);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Skills</h1>
          <p className="text-gray-600 mt-1">
            Tracking {skills.length} skills
          </p>
        </div>
        <Link href="/dashboard/skills/browse">
          <Button>Browse Skills</Button>
        </Link>
      </div>

      {/* Summary Cards */}
      {/* ... */}

      {/* Filter Bar */}
      {/* ... */}

      {/* Skills Grid */}
      {Object.entries(groupedSkills).map(([parent, skillList]) => (
        <div key={parent} className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            {parent}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {skillList.map((skill) => (
              <SkillCard
                key={skill.id}
                {...skill}
                onRecordScore={() => setScoreModalSkill(skill)}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Score Modal */}
      <ScoreInput
        isOpen={!!scoreModalSkill}
        onClose={() => setScoreModalSkill(null)}
        onSubmit={handleSubmitScore}
        skillName={scoreModalSkill?.name ?? ""}
        currentScore={scoreModalSkill?.currentScore}
      />
    </div>
  );
}
```
