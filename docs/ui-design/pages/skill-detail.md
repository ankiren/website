# Skill Detail Page

**Location:** `src/app/dashboard/skills/[id]/page.tsx`

## Overview

The Skill Detail page shows comprehensive information about a single tracked skill, including the current score, score history with charts, and the ability to record new scores.

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to My Skills                                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─ Skill Header ───────────────────────────────────┐   │
│  │                                                   │   │
│  │  [English Badge]                                  │   │
│  │                                                   │   │
│  │         ████████████████░░░░░░░░░░░░░░░░░░░░░    │   │
│  │                                                   │   │
│  │                    75                            │   │
│  │                 Advanced                          │   │
│  │                                                   │   │
│  │               Reading                            │   │
│  │       Last assessed: Dec 13, 2025                │   │
│  │                                                   │   │
│  │              [Record New Score]                  │   │
│  │                                                   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─ Progress Chart ─────────────────────────────────┐   │
│  │  Score Progress                                   │   │
│  │  [7D] [30D] [90D] [All]                          │   │
│  │                                                   │   │
│  │  100 ┤                                            │   │
│  │      │                          ●────●           │   │
│  │   80 ┤              ●──────────●                  │   │
│  │      │      ●──────●                              │   │
│  │   60 ┤  ●──●                                      │   │
│  │      │                                            │   │
│  │   40 ┼────┬────┬────┬────┬────┬────┬────        │   │
│  │        Dec 1   5   10   15   20   25   30        │   │
│  │                                                   │   │
│  │  ● Test  ● Practice  ● Assessment                │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─ Summary Stats ──────────────────────────────────┐   │
│  │ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐     │   │
│  │ │Current │ │Starting│ │ Change │ │Entries │     │   │
│  │ │  75    │ │  45    │ │ +30 ↑  │ │  12    │     │   │
│  │ └────────┘ └────────┘ └────────┘ └────────┘     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─ Score History ──────────────────────────────────┐   │
│  │  History                                          │   │
│  │  Filter: [All Sources ▼]  [Last 30 days ▼]       │   │
│  │                                                   │   │
│  │  ┌────────────────────────────────────────────┐  │   │
│  │  │ Dec 13, 2025                           [🗑]│  │   │
│  │  │ Score: 75  [Test]                          │  │   │
│  │  │ IELTS practice test - Reading section      │  │   │
│  │  └────────────────────────────────────────────┘  │   │
│  │                                                   │   │
│  │  ┌────────────────────────────────────────────┐  │   │
│  │  │ Dec 10, 2025                           [🗑]│  │   │
│  │  │ Score: 70  [Practice]                      │  │   │
│  │  │                                            │  │   │
│  │  └────────────────────────────────────────────┘  │   │
│  │                                                   │   │
│  │  [Load More]                                      │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Components Used

- `ProgressChart` - Score trend visualization
- `Button` - Actions
- `Badge` - Source and level indicators
- `ScoreInput` - Modal for recording scores
- `Card` - Content containers

## Sections

### Back Navigation

```tsx
<Link
  href="/dashboard/skills"
  className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
>
  <svg className="w-5 h-5 mr-2" /* arrow left */ />
  Back to My Skills
</Link>
```

### Skill Header Card

| Element | Styles |
|---------|--------|
| Container | `bg-white rounded-xl shadow-md p-8 text-center mb-6` |
| Parent Badge | `inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm mb-4` |
| Score Circle | `w-32 h-32 mx-auto mb-4` (see SkillCard for details) |
| Skill Name | `text-2xl font-bold text-gray-900 mb-1` |
| Last Assessed | `text-gray-500 mb-6` |

### Summary Stats

| Element | Styles |
|---------|--------|
| Container | `grid grid-cols-2 md:grid-cols-4 gap-4 mb-6` |
| Stat Card | `bg-white rounded-lg shadow-sm p-4 text-center` |
| Value | `text-2xl font-bold` |
| Label | `text-sm text-gray-500` |
| Positive Change | `text-green-600` |
| Negative Change | `text-red-600` |

```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
  <div className="bg-white rounded-lg shadow-sm p-4 text-center">
    <div className="text-2xl font-bold text-gray-900">{currentScore}</div>
    <div className="text-sm text-gray-500">Current</div>
  </div>
  <div className="bg-white rounded-lg shadow-sm p-4 text-center">
    <div className="text-2xl font-bold text-gray-900">{firstScore}</div>
    <div className="text-sm text-gray-500">Starting</div>
  </div>
  <div className="bg-white rounded-lg shadow-sm p-4 text-center">
    <div className={`text-2xl font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {change >= 0 ? '+' : ''}{change} {change >= 0 ? '↑' : '↓'}
    </div>
    <div className="text-sm text-gray-500">Change</div>
  </div>
  <div className="bg-white rounded-lg shadow-sm p-4 text-center">
    <div className="text-2xl font-bold text-gray-900">{totalEntries}</div>
    <div className="text-sm text-gray-500">Entries</div>
  </div>
</div>
```

### Progress Chart Section

```tsx
<div className="bg-white rounded-xl shadow-md p-6 mb-6">
  <h2 className="text-xl font-semibold text-gray-900 mb-4">Score Progress</h2>
  <ProgressChart
    data={chartData}
    timeRange={timeRange}
    onTimeRangeChange={setTimeRange}
  />
</div>
```

### History Section

| Element | Styles |
|---------|--------|
| Container | `bg-white rounded-xl shadow-md p-6` |
| Header | `flex justify-between items-center mb-4` |
| Title | `text-xl font-semibold text-gray-900` |
| Filters | `flex gap-4` |

### History Entry

```
┌─────────────────────────────────────────────────────────┐
│  Dec 13, 2025                                      [🗑] │
│  ┌──────┐                                               │
│  │  75  │  [Test]                                      │
│  └──────┘                                               │
│  IELTS practice test - Reading section                  │
└─────────────────────────────────────────────────────────┘
```

| Element | Styles |
|---------|--------|
| Entry Container | `border border-gray-200 rounded-lg p-4 mb-3` |
| Date | `text-sm text-gray-500` |
| Score | `text-xl font-bold` with level color |
| Source Badge | Level-specific background color |
| Note | `text-gray-600 text-sm mt-2` |
| Delete Button | `text-gray-400 hover:text-red-500` |

```tsx
<div className="border border-gray-200 rounded-lg p-4 mb-3">
  <div className="flex justify-between items-start">
    <div>
      <div className="text-sm text-gray-500">{formatDate(entry.createdAt)}</div>
      <div className="flex items-center gap-3 mt-1">
        <span className={`text-xl font-bold ${getLevelColor(entry.score)}`}>
          {entry.score}
        </span>
        <span className={`px-2 py-0.5 text-xs rounded ${getSourceBadgeStyles(entry.source)}`}>
          {entry.source}
        </span>
      </div>
      {entry.note && (
        <p className="text-gray-600 text-sm mt-2">{entry.note}</p>
      )}
    </div>
    <button
      onClick={() => handleDeleteEntry(entry.id)}
      className="text-gray-400 hover:text-red-500"
    >
      <svg className="w-5 h-5" /* trash icon */ />
    </button>
  </div>
</div>
```

### Source Badge Styles

| Source | Background | Text |
|--------|------------|------|
| test | `bg-blue-100` | `text-blue-700` |
| practice | `bg-green-100` | `text-green-700` |
| assessment | `bg-orange-100` | `text-orange-700` |

## States

### Loading State

```tsx
<div className="animate-pulse">
  <div className="bg-white rounded-xl shadow-md p-8 mb-6">
    <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4" />
    <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-2" />
    <div className="h-4 bg-gray-200 rounded w-24 mx-auto" />
  </div>
  <div className="bg-white rounded-xl shadow-md p-6 h-80" />
</div>
```

### No History State

```
┌─────────────────────────────────────────────────────────┐
│  History                                                │
│                                                          │
│                  No scores recorded yet                  │
│           Record your first score to start              │
│                 tracking progress                        │
│                                                          │
│                 [Record First Score]                     │
└─────────────────────────────────────────────────────────┘
```

### Error State

```tsx
<div className="bg-red-50 text-red-600 p-4 rounded-lg">
  Failed to load skill data. Please try again.
  <button onClick={refetch} className="underline ml-2">Retry</button>
</div>
```

## Data Flow

```typescript
interface SkillDetail {
  id: string;
  skillId: string;
  name: string;
  parentName: string | null;
  currentScore: number | null;
  lastAssessedAt: string | null;
}

interface SkillStats {
  currentScore: number | null;
  firstScore: number | null;
  change: number;
  totalEntries: number;
  avgScore: number;
}

interface HistoryEntry {
  id: string;
  score: number;
  source: "test" | "practice" | "assessment";
  note: string | null;
  createdAt: string;
}
```

## Actions

### Record New Score
1. Click "Record New Score" button
2. ScoreInput modal opens
3. Submit → API call
4. Refresh skill data and history
5. Show success toast

### Delete History Entry
1. Click trash icon on entry
2. Confirmation dialog
3. API call → Remove entry
4. Update current score if needed
5. Refresh chart data

### Filter History
- By source (test/practice/assessment)
- By date range (7d/30d/90d/all)

## Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| Mobile | Single column, stacked sections |
| Tablet | Side padding increases |
| Desktop | Max-width container (4xl) |

## Code Example

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ProgressChart from "@/components/ProgressChart";
import ScoreInput from "@/components/ScoreInput";

export default function SkillDetailPage({ params }: { params: { id: string } }) {
  const [skill, setSkill] = useState<SkillDetail | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [stats, setStats] = useState<SkillStats | null>(null);
  const [timeRange, setTimeRange] = useState("30d");
  const [showScoreModal, setShowScoreModal] = useState(false);

  useEffect(() => {
    fetchSkillData(params.id);
  }, [params.id]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Link */}
      <Link href="/dashboard/skills" className="...">
        ← Back to My Skills
      </Link>

      {/* Skill Header */}
      <div className="bg-white rounded-xl shadow-md p-8 text-center mb-6">
        {skill?.parentName && (
          <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm mb-4">
            {skill.parentName}
          </span>
        )}
        {/* Score Circle */}
        <div className="text-2xl font-bold text-gray-900 mb-1">{skill?.name}</div>
        <div className="text-gray-500 mb-6">
          Last assessed: {formatDate(skill?.lastAssessedAt)}
        </div>
        <Button onClick={() => setShowScoreModal(true)}>
          Record New Score
        </Button>
      </div>

      {/* Progress Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Score Progress</h2>
        <ProgressChart
          data={history}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
      </div>

      {/* Summary Stats */}
      {/* ... */}

      {/* History List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">History</h2>
        {history.map((entry) => (
          <HistoryEntry key={entry.id} entry={entry} onDelete={handleDelete} />
        ))}
      </div>

      {/* Score Modal */}
      <ScoreInput
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        onSubmit={handleSubmitScore}
        skillName={skill?.name ?? ""}
        currentScore={skill?.currentScore}
      />
    </div>
  );
}
```
