"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DemoHeader, UserSkill, ScoreHistory, mockUserSkills, mockScoreHistory, getScoreLevel, getSourceLabel, AcceptanceCriteriaSection } from "../_shared";

export default function US66ProgressVisualization() {
  const [userSkills] = useState<UserSkill[]>(mockUserSkills);
  const [selectedSkill, setSelectedSkill] = useState<UserSkill | null>(mockUserSkills[0]);
  const [chartType, setChartType] = useState<"bar" | "line" | "area">("bar");
  const [scoreHistory] = useState<ScoreHistory[]>(mockScoreHistory);

  const skillHistory = selectedSkill
    ? scoreHistory.filter(h => h.userSkillId === selectedSkill.id)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    : [];

  const getProgressStats = () => {
    if (skillHistory.length < 2) return null;
    const first = skillHistory[0].score;
    const last = skillHistory[skillHistory.length - 1].score;
    const improvement = last - first;
    const avgImprovement = improvement / (skillHistory.length - 1);
    return { first, last, improvement, avgImprovement };
  };

  const stats = getProgressStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoHeader
        storyId="US-6.6"
        title="Progress Visualization"
        description="As a user, I can visualize my skill progress with charts and graphs"
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Skill Selection */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Select Skill</h2>
            <div className="space-y-2">
              {userSkills.map(us => (
                <button
                  key={us.id}
                  onClick={() => setSelectedSkill(us)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedSkill?.id === us.id ? "bg-blue-100 border-2 border-blue-500" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{us.skillName}</span>
                    <span className="font-bold">{us.currentScore}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Charts */}
          <div className="lg:col-span-3 space-y-6">
            {selectedSkill ? (
              <>
                {/* Stats Cards */}
                {stats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="text-center">
                      <div className="text-2xl font-bold text-gray-600">{stats.first}</div>
                      <div className="text-sm text-gray-500">Starting Score</div>
                    </Card>
                    <Card className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.last}</div>
                      <div className="text-sm text-gray-500">Current Score</div>
                    </Card>
                    <Card className="text-center">
                      <div className={`text-2xl font-bold ${stats.improvement >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {stats.improvement >= 0 ? "+" : ""}{stats.improvement}
                      </div>
                      <div className="text-sm text-gray-500">Total Change</div>
                    </Card>
                    <Card className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        +{stats.avgImprovement.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-500">Avg per Session</div>
                    </Card>
                  </div>
                )}

                {/* Chart Type Toggle */}
                <Card>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Progress Chart - {selectedSkill.skillName}</h3>
                    <div className="flex gap-2">
                      {[
                        { value: "bar", label: "Bar" },
                        { value: "line", label: "Line" },
                        { value: "area", label: "Area" },
                      ].map(type => (
                        <Button
                          key={type.value}
                          size="sm"
                          variant={chartType === type.value ? "primary" : "secondary"}
                          onClick={() => setChartType(type.value as typeof chartType)}
                        >
                          {type.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {skillHistory.length > 0 ? (
                    <div className="space-y-4">
                      {/* Chart Area */}
                      <div className="relative h-64 border rounded-lg bg-gray-50 p-4">
                        {/* Y-axis labels */}
                        <div className="absolute left-0 top-4 bottom-4 w-8 flex flex-col justify-between text-xs text-gray-500">
                          <span>100</span>
                          <span>75</span>
                          <span>50</span>
                          <span>25</span>
                          <span>0</span>
                        </div>

                        {/* Chart content */}
                        <div className="ml-10 h-full flex items-end gap-2">
                          {chartType === "bar" && skillHistory.map((entry) => {
                            const { variant } = getSourceLabel(entry.source);
                            return (
                              <div key={entry.id} className="flex-1 flex flex-col items-center gap-1">
                                <span className="text-xs font-medium">{entry.score}</span>
                                <div
                                  className={`w-full rounded-t transition-all ${
                                    variant === "danger" ? "bg-red-400" :
                                    variant === "primary" ? "bg-blue-400" : "bg-yellow-400"
                                  }`}
                                  style={{ height: `${(entry.score / 100) * 100}%` }}
                                />
                              </div>
                            );
                          })}

                          {chartType === "line" && (
                            <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                              <polyline
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="3"
                                points={skillHistory.map((entry, i) =>
                                  `${(i / (skillHistory.length - 1)) * 400},${200 - (entry.score / 100) * 200}`
                                ).join(" ")}
                              />
                              {skillHistory.map((entry, i) => (
                                <circle
                                  key={entry.id}
                                  cx={(i / (skillHistory.length - 1)) * 400}
                                  cy={200 - (entry.score / 100) * 200}
                                  r="6"
                                  fill="#3b82f6"
                                />
                              ))}
                            </svg>
                          )}

                          {chartType === "area" && (
                            <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                                </linearGradient>
                              </defs>
                              <polygon
                                fill="url(#gradient)"
                                points={`0,200 ${skillHistory.map((entry, i) =>
                                  `${(i / (skillHistory.length - 1)) * 400},${200 - (entry.score / 100) * 200}`
                                ).join(" ")} 400,200`}
                              />
                              <polyline
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="2"
                                points={skillHistory.map((entry, i) =>
                                  `${(i / (skillHistory.length - 1)) * 400},${200 - (entry.score / 100) * 200}`
                                ).join(" ")}
                              />
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* X-axis labels */}
                      <div className="ml-10 flex gap-2 text-xs text-gray-500">
                        {skillHistory.map((entry) => (
                          <div key={entry.id} className="flex-1 text-center">
                            {new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                        ))}
                      </div>

                      {/* Legend */}
                      <div className="flex gap-4 justify-center text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-red-400 rounded" />
                          <span>Test</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-blue-400 rounded" />
                          <span>Practice</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-yellow-400 rounded" />
                          <span>Assessment</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-12">No history data available for this skill</p>
                  )}
                </Card>

                {/* Level Progress */}
                <Card>
                  <h3 className="font-semibold mb-4">Level Progress</h3>
                  <div className="space-y-4">
                    {[
                      { level: "Expert", min: 81, max: 100, color: "bg-purple-500" },
                      { level: "Advanced", min: 61, max: 80, color: "bg-green-500" },
                      { level: "Intermediate", min: 41, max: 60, color: "bg-blue-500" },
                      { level: "Elementary", min: 21, max: 40, color: "bg-yellow-500" },
                      { level: "Beginner", min: 0, max: 20, color: "bg-red-500" },
                    ].map(level => {
                      const isCurrentLevel = selectedSkill.currentScore >= level.min && selectedSkill.currentScore <= level.max;
                      const isPassed = selectedSkill.currentScore > level.max;
                      return (
                        <div key={level.level} className="flex items-center gap-4">
                          <div className="w-24 text-sm font-medium">{level.level}</div>
                          <div className="flex-1 relative">
                            <div className="h-4 bg-gray-200 rounded-full">
                              <div
                                className={`h-4 rounded-full ${isPassed ? level.color : isCurrentLevel ? level.color : "bg-gray-300"}`}
                                style={{
                                  width: isPassed ? "100%" :
                                    isCurrentLevel ? `${((selectedSkill.currentScore - level.min) / (level.max - level.min)) * 100}%` : "0%"
                                }}
                              />
                            </div>
                          </div>
                          <div className="w-16 text-right text-sm text-gray-500">
                            {level.min}-{level.max}
                          </div>
                          {isCurrentLevel && (
                            <Badge variant="primary">Current</Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </>
            ) : (
              <Card className="text-center py-12">
                <p className="text-gray-500">Select a skill to view progress visualization</p>
              </Card>
            )}
          </div>
        </div>

        <AcceptanceCriteriaSection storyId="US-6.6" />
      </main>
    </div>
  );
}
