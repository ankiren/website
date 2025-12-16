# ScoreInput Component

**Location:** `src/components/ScoreInput.tsx`

## Overview

A modal form component for recording skill scores. Allows users to input a score (0-100), select the assessment source, and add optional notes. Used when recording new assessments for tracked skills.

## Props

```typescript
interface ScoreInputProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ScoreEntry) => Promise<void>;
  skillName: string;
  currentScore?: number | null;
}

interface ScoreEntry {
  score: number;
  source: "test" | "practice" | "assessment";
  note?: string;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Controls modal visibility |
| `onClose` | `function` | Called when modal closes |
| `onSubmit` | `function` | Called with score data on submit |
| `skillName` | `string` | Name of skill being scored |
| `currentScore` | `number \| null` | Previous score for reference |

## Structure

```
┌─────────────────────────────────────────────────────────┐
│  Record Score                                      [×]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Skill: Reading                                        │
│  Current: 75 (Advanced)                                │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                  │   │
│  │              ← ────●──────────── →              │   │
│  │                                                  │   │
│  │                    [  78  ]                     │   │
│  │                                                  │   │
│  │  ○ Beginner  ○ Elementary  ● Intermediate       │   │
│  │  ○ Advanced  ○ Expert                           │   │
│  │                                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Source *                                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ○ Test    ○ Practice    ○ Assessment            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Note (optional)                                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │ IELTS practice test - Reading section           │   │
│  │                                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│               [Cancel]    [Save Score]                 │
└─────────────────────────────────────────────────────────┘
```

## Sections

### Score Slider

Visual slider with number input for precise control:

```tsx
<div className="mb-6">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Score (0-100)
  </label>

  {/* Slider */}
  <input
    type="range"
    min="0"
    max="100"
    value={score}
    onChange={(e) => setScore(Number(e.target.value))}
    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
    style={{
      background: `linear-gradient(to right, ${levelColor} ${score}%, #e5e7eb ${score}%)`
    }}
  />

  {/* Number input */}
  <div className="flex justify-center mt-4">
    <input
      type="number"
      min="0"
      max="100"
      value={score}
      onChange={(e) => setScore(Math.min(100, Math.max(0, Number(e.target.value))))}
      className="w-20 text-center text-2xl font-bold border-2 rounded-lg p-2"
    />
  </div>

  {/* Level indicators */}
  <div className="flex justify-between text-xs text-gray-500 mt-2">
    <span>Beginner</span>
    <span>Elementary</span>
    <span>Intermediate</span>
    <span>Advanced</span>
    <span>Expert</span>
  </div>
</div>
```

### Source Selection

Radio button group for assessment source:

```tsx
<div className="mb-6">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Source <span className="text-red-500">*</span>
  </label>
  <div className="flex gap-4">
    {[
      { value: "test", label: "Test", icon: "📝" },
      { value: "practice", label: "Practice", icon: "💪" },
      { value: "assessment", label: "Assessment", icon: "📊" },
    ].map((option) => (
      <label
        key={option.value}
        className={`
          flex-1 p-3 border-2 rounded-lg cursor-pointer text-center
          transition-colors
          ${source === option.value
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-gray-300"
          }
        `}
      >
        <input
          type="radio"
          name="source"
          value={option.value}
          checked={source === option.value}
          onChange={(e) => setSource(e.target.value)}
          className="sr-only"
        />
        <span className="text-lg">{option.icon}</span>
        <span className="block text-sm mt-1">{option.label}</span>
      </label>
    ))}
  </div>
</div>
```

### Note Field

Optional textarea for additional context:

```tsx
<div className="mb-6">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Note <span className="text-gray-400">(optional)</span>
  </label>
  <textarea
    value={note}
    onChange={(e) => setNote(e.target.value)}
    placeholder="Add any notes about this assessment..."
    rows={3}
    maxLength={500}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg
               focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <div className="text-xs text-gray-400 text-right mt-1">
    {note.length}/500
  </div>
</div>
```

## Styles

### Modal Overlay
```css
fixed inset-0
bg-black/50
flex items-center justify-center
z-50
```

### Modal Container
```css
bg-white
rounded-xl
shadow-xl
max-w-md
w-full
mx-4
max-h-[90vh]
overflow-y-auto
```

### Header
```css
flex justify-between items-center
p-4
border-b border-gray-200
```

### Body
```css
p-6
```

### Footer
```css
flex justify-end gap-3
p-4
border-t border-gray-200
```

### Slider Thumb (Custom)
```css
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #2563eb;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
```

## Score Change Indicator

When user has a current score, show the difference:

```
Current: 75 (Advanced)
New:     78 (+3) ↑
```

```tsx
{currentScore !== null && score !== currentScore && (
  <div className={`text-sm ${score > currentScore ? 'text-green-600' : 'text-red-600'}`}>
    {score > currentScore ? '↑' : '↓'} {score > currentScore ? '+' : ''}{score - currentScore} from last score
  </div>
)}
```

## Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| Score | Required, 0-100 | "Score must be between 0 and 100" |
| Source | Required | "Please select a source" |
| Note | Max 500 chars | "Note must be 500 characters or less" |

## Usage Examples

### Basic Usage

```tsx
import ScoreInput from "@/components/ScoreInput";

const [isOpen, setIsOpen] = useState(false);

<ScoreInput
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={handleSubmitScore}
  skillName="Reading"
  currentScore={75}
/>
```

### Submit Handler

```tsx
const handleSubmitScore = async (data: ScoreEntry) => {
  try {
    await fetch(`/api/me/skills/${skillId}/history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setIsOpen(false);
    refreshSkills();
  } catch (error) {
    setError("Failed to save score");
  }
};
```

## Quick Score Mode

For dashboard quick-add, a compact inline version:

```
┌───────────────────────────────────┐
│ [  75  ]  ○T ○P ●A   [Save]      │
└───────────────────────────────────┘
```

## Accessibility

- Modal traps focus when open
- ESC key closes modal
- Click outside closes modal
- Form labels properly associated
- Required fields marked with asterisk
- Error messages linked to inputs via `aria-describedby`
