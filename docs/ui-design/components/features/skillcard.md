# SkillCard Component

**Location:** `src/components/SkillCard.tsx`

## Overview

A card component for displaying a user's tracked skill with current score, level indicator, and quick actions. Used in the My Skills dashboard to show skill progress at a glance.

## Props

```typescript
interface SkillCardProps {
  id: string;
  skillId: string;
  name: string;
  parentName?: string | null;
  currentScore: number | null;
  lastAssessedAt: string | null;
  onRecordScore: (skillId: string) => void;
  onRemove: (skillId: string) => void;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | User skill record ID |
| `skillId` | `string` | Skill definition ID |
| `name` | `string` | Skill name |
| `parentName` | `string \| null` | Parent skill name (e.g., "English") |
| `currentScore` | `number \| null` | Current score (0-100) or null if not assessed |
| `lastAssessedAt` | `string \| null` | ISO date of last assessment |
| `onRecordScore` | `function` | Callback to open score recording |
| `onRemove` | `function` | Callback to remove skill from tracking |

## Structure

```
┌─────────────────────────────────────────────────────────┐
│ [Parent Badge]                                     [⋮] │
│                                                         │
│   ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
│                                                         │
│          ┌─────────────────┐                           │
│          │       75        │                           │
│          │    Advanced     │                           │
│          └─────────────────┘                           │
│                                                         │
│  Skill Name                                            │
│  Last assessed: Dec 13, 2025                           │
│                                                         │
│  [    Record Score    ]                                │
└─────────────────────────────────────────────────────────┘
```

## Styles

### Container
```css
bg-white
rounded-xl
shadow-md
p-6
hover:shadow-lg
transition-shadow
relative
```

### Parent Badge
```css
absolute top-3 left-3
text-xs
px-2 py-1
bg-gray-100
text-gray-600
rounded-full
```

### Score Circle
```css
w-24 h-24
rounded-full
border-4
flex flex-col items-center justify-center
mx-auto mb-4
```

### Score Value
```css
text-2xl font-bold
```

### Level Label
```css
text-xs text-gray-500
```

### Skill Name
```css
text-lg font-semibold text-gray-900 text-center
```

### Last Assessed
```css
text-sm text-gray-500 text-center mt-1
```

### Menu Button
```css
absolute top-3 right-3
text-gray-400
hover:text-gray-600
```

## Score Level Colors

| Range | Level | Border Color | Text Color |
|-------|-------|--------------|------------|
| 0-20 | Beginner | `border-red-400` | `text-red-600` |
| 21-40 | Elementary | `border-orange-400` | `text-orange-600` |
| 41-60 | Intermediate | `border-yellow-400` | `text-yellow-600` |
| 61-80 | Advanced | `border-green-400` | `text-green-600` |
| 81-100 | Expert | `border-emerald-500` | `text-emerald-600` |
| null | No Score | `border-gray-200` | `text-gray-400` |

## Progress Ring

The circular progress indicator uses SVG:

```tsx
<svg className="w-24 h-24 transform -rotate-90">
  {/* Background circle */}
  <circle
    cx="48" cy="48" r="40"
    stroke="#e5e7eb"
    strokeWidth="8"
    fill="none"
  />
  {/* Progress circle */}
  <circle
    cx="48" cy="48" r="40"
    stroke={levelColor}
    strokeWidth="8"
    fill="none"
    strokeDasharray={`${(score / 100) * 251.2} 251.2`}
    strokeLinecap="round"
  />
</svg>
```

## States

### With Score
- Shows circular progress indicator
- Displays score number and level
- Shows last assessed date

### No Score Yet
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│          ┌─────────────────┐                           │
│          │       --        │                           │
│          │   Not assessed  │                           │
│          └─────────────────┘                           │
│                                                         │
│  Reading                                               │
│  No assessments yet                                    │
│                                                         │
│  [    Record First Score    ]                          │
└─────────────────────────────────────────────────────────┘
```

### Hover
- Shadow increases (`shadow-md` → `shadow-lg`)

## Menu Dropdown

```
┌─────────────────┐
│ View History    │
│ View Details    │
│ ─────────────── │
│ Remove Skill    │ <- text-red-500
└─────────────────┘
```

## Usage Examples

### Basic Usage

```tsx
import SkillCard from "@/components/SkillCard";

<SkillCard
  id="us-123"
  skillId="s-456"
  name="Reading"
  parentName="English"
  currentScore={75}
  lastAssessedAt="2025-12-13T10:00:00Z"
  onRecordScore={handleRecordScore}
  onRemove={handleRemove}
/>
```

### In Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {skills.map((skill) => (
    <SkillCard
      key={skill.id}
      {...skill}
      onRecordScore={handleRecordScore}
      onRemove={handleRemove}
    />
  ))}
</div>
```

### No Score State

```tsx
<SkillCard
  id="us-789"
  skillId="s-101"
  name="Writing"
  parentName="English"
  currentScore={null}
  lastAssessedAt={null}
  onRecordScore={handleRecordScore}
  onRemove={handleRemove}
/>
```

## Helper Function

```typescript
function getScoreLevel(score: number | null): {
  level: string;
  color: string;
  bgColor: string;
} {
  if (score === null) {
    return { level: "Not assessed", color: "text-gray-400", bgColor: "border-gray-200" };
  }
  if (score <= 20) return { level: "Beginner", color: "text-red-600", bgColor: "border-red-400" };
  if (score <= 40) return { level: "Elementary", color: "text-orange-600", bgColor: "border-orange-400" };
  if (score <= 60) return { level: "Intermediate", color: "text-yellow-600", bgColor: "border-yellow-400" };
  if (score <= 80) return { level: "Advanced", color: "text-green-600", bgColor: "border-green-400" };
  return { level: "Expert", color: "text-emerald-600", bgColor: "border-emerald-500" };
}
```

## Accessibility

- Menu button has `aria-label="Skill options"`
- Remove action requires confirmation
- Uses semantic elements
- Keyboard navigable dropdown menu
