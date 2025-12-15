# ProgressChart Component

**Location:** `src/components/ProgressChart.tsx`

## Overview

A chart component for visualizing skill score progression over time. Shows a line chart of historical scores with interactive tooltips, time range selection, and source color coding.

## Props

```typescript
interface ProgressChartProps {
  data: ChartDataPoint[];
  timeRange: "7d" | "30d" | "90d" | "all";
  onTimeRangeChange: (range: string) => void;
  height?: number;
}

interface ChartDataPoint {
  date: string;       // ISO date string
  score: number;      // 0-100
  source: "test" | "practice" | "assessment";
  note?: string;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `data` | `ChartDataPoint[]` | Array of score entries |
| `timeRange` | `string` | Selected time filter |
| `onTimeRangeChange` | `function` | Callback when range changes |
| `height` | `number` | Chart height in pixels (default: 300) |

## Structure

```
┌─────────────────────────────────────────────────────────┐
│  Score Progress                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  [7D]  [30D]  [90D]  [All]                       │  │
│  └──────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 100 ┤                                                   │
│     │                                    ●              │
│  80 ┤                          ●────────●              │
│     │              ●──────────●                        │
│  60 ┤      ●──────●                                    │
│     │  ●──●                                            │
│  40 ┤                                                   │
│     │                                                   │
│  20 ┤                                                   │
│     │                                                   │
│   0 ┼────┬────┬────┬────┬────┬────┬────┬────┬────┬──   │
│       Dec 1   5    10   15   20   25   30  Jan 5       │
│                                                         │
│  Legend: ● Test  ● Practice  ● Assessment              │
└─────────────────────────────────────────────────────────┘
```

## Time Range Tabs

```tsx
<div className="flex gap-2 mb-4">
  {[
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
    { value: "90d", label: "90D" },
    { value: "all", label: "All" },
  ].map((range) => (
    <button
      key={range.value}
      onClick={() => onTimeRangeChange(range.value)}
      className={`
        px-3 py-1 text-sm font-medium rounded-md
        ${timeRange === range.value
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }
      `}
    >
      {range.label}
    </button>
  ))}
</div>
```

## Source Colors

| Source | Line Color | Point Color | Legend |
|--------|------------|-------------|--------|
| test | `#2563eb` (blue-600) | `#1d4ed8` | Blue |
| practice | `#16a34a` (green-600) | `#15803d` | Green |
| assessment | `#ea580c` (orange-600) | `#c2410c` | Orange |

## Tooltip

```
┌───────────────────────────┐
│  Dec 13, 2025             │
│  ─────────────────────    │
│  Score: 75                │
│  Source: Test             │
│  Note: IELTS practice...  │
└───────────────────────────┘
```

```tsx
<div className="absolute bg-gray-900 text-white text-sm rounded-lg p-3 shadow-lg">
  <div className="font-medium">{formatDate(point.date)}</div>
  <div className="border-t border-gray-700 my-2" />
  <div>Score: <span className="font-bold">{point.score}</span></div>
  <div className="flex items-center gap-2">
    Source:
    <span className={`px-2 py-0.5 rounded text-xs ${sourceStyles[point.source]}`}>
      {point.source}
    </span>
  </div>
  {point.note && (
    <div className="text-gray-300 text-xs mt-1 max-w-xs truncate">
      {point.note}
    </div>
  )}
</div>
```

## Chart Configuration

Using a lightweight charting library (Recharts or Chart.js):

```tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

<ResponsiveContainer width="100%" height={height}>
  <LineChart data={data}>
    <XAxis
      dataKey="date"
      tickFormatter={formatDateAxis}
      stroke="#9ca3af"
    />
    <YAxis
      domain={[0, 100]}
      ticks={[0, 20, 40, 60, 80, 100]}
      stroke="#9ca3af"
    />
    <Tooltip content={<CustomTooltip />} />
    <Line
      type="monotone"
      dataKey="score"
      stroke="#2563eb"
      strokeWidth={2}
      dot={({ payload }) => (
        <circle
          r={6}
          fill={sourceColors[payload.source]}
          stroke="white"
          strokeWidth={2}
        />
      )}
    />
  </LineChart>
</ResponsiveContainer>
```

## Reference Lines

Optional level reference lines:

```tsx
<ReferenceLine y={20} stroke="#fee2e2" label="Beginner" />
<ReferenceLine y={40} stroke="#ffedd5" label="Elementary" />
<ReferenceLine y={60} stroke="#fef9c3" label="Intermediate" />
<ReferenceLine y={80} stroke="#dcfce7" label="Advanced" />
```

## States

### Loading State
```tsx
<div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
  <div className="text-gray-500">Loading chart...</div>
</div>
```

### Empty State (No Data)
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    [Chart icon]                         │
│                                                         │
│                No data to display                       │
│           Record scores to see your progress            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Single Data Point
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                         ●                               │
│                                                         │
│        Record more scores to see your trend            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Summary Stats

Below the chart, show key metrics:

```
┌─────────────────────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │ Current  │  │ Starting │  │ Change   │  │ Entries│  │
│  │   75     │  │   45     │  │  +30 ↑   │  │   12   │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Usage Examples

### Basic Usage

```tsx
import ProgressChart from "@/components/ProgressChart";

<ProgressChart
  data={scoreHistory}
  timeRange="30d"
  onTimeRangeChange={setTimeRange}
/>
```

### With Custom Height

```tsx
<ProgressChart
  data={scoreHistory}
  timeRange="all"
  onTimeRangeChange={setTimeRange}
  height={400}
/>
```

### In Skill Detail Page

```tsx
<div className="bg-white rounded-xl shadow-md p-6">
  <h2 className="text-xl font-semibold mb-4">Score Progress</h2>
  <ProgressChart
    data={skillHistory}
    timeRange={timeRange}
    onTimeRangeChange={setTimeRange}
  />
</div>
```

## Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Full width, reduced height (200px) |
| Tablet | Full width, standard height |
| Desktop | Constrained within container |

## Accessibility

- Chart has `role="img"` with `aria-label` describing the data
- Interactive elements are keyboard navigable
- Color coding supplemented with legends
- Tooltips accessible via focus
