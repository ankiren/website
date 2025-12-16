"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DemoHeader, UserSkill, ScoreHistory, mockUserSkills, mockScoreHistory, getScoreLevel, getSourceLabel, AcceptanceCriteriaSection } from "../_shared";

export default function US64ViewScoreHistory() {
  const [userSkills] = useState<UserSkill[]>(mockUserSkills);
  const [selectedSkill, setSelectedSkill] = useState<UserSkill | null>(mockUserSkills[0]);
  const [scoreHistory] = useState<ScoreHistory[]>(mockScoreHistory);

  const skillHistory = selectedSkill
    ? scoreHistory.filter(h => h.userSkillId === selectedSkill.id)
    : [];

  const sortedHistory = [...skillHistory].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getScoreChange = (current: number, previous: number): { change: number; trend: "up" | "down" | "same" } => {
    const change = current - previous;
    return {
      change: Math.abs(change),
      trend: change > 0 ? "up" : change < 0 ? "down" : "same",
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoHeader
        storyId="US-6.4"
        title="View Score History"
        description="As a user, I can view my score history for a skill over time"
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Skill Selection */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">My Skills</h2>
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
                    <span className="font-bold text-blue-600">{us.currentScore}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* History Display */}
          <div className="lg:col-span-3 space-y-6">
            {selectedSkill ? (
              <>
                {/* Current Status */}
                <Card>
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold">{selectedSkill.skillName}</h2>
                      <p className="text-sm text-gray-500">History of {skillHistory.length} assessments</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-blue-600">{selectedSkill.currentScore}</div>
                      <Badge variant={getScoreLevel(selectedSkill.currentScore).variant}>
                        {getScoreLevel(selectedSkill.currentScore).level}
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* Timeline Chart */}
                <Card>
                  <h3 className="font-semibold mb-4">Score Timeline</h3>
                  {skillHistory.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-end gap-2 h-48 border-gray-200 pt-4">
                        {[...skillHistory].sort((a, b) =>
                          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                        ).map((entry) => {
                          const { variant } = getSourceLabel(entry.source);
                          const heightPercent = (entry.score / 100) * 100;

                          return (
                            <div key={entry.id} className="flex-1 flex flex-col items-center gap-1">
                              <span className="text-xs font-medium">{entry.score}</span>
                              <div
                                className={`w-full rounded-t transition-all ${
                                  variant === "danger" ? "bg-red-400" :
                                  variant === "primary" ? "bg-blue-400" : "bg-yellow-400"
                                }`}
                                style={{ height: `${heightPercent}%` }}
                                title={entry.note}
                              />
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex gap-2 text-xs text-gray-500 overflow-x-auto">
                        {[...skillHistory].sort((a, b) =>
                          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                        ).map((entry) => (
                          <div key={entry.id} className="flex-1 text-center min-w-[60px]">
                            {new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                        ))}
                      </div>

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
                    <p className="text-gray-500 text-center py-8">No history available</p>
                  )}
                </Card>

                {/* History Table */}
                <Card>
                  <h3 className="font-semibold mb-4">Detailed History</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="">
                          <th className="text-left py-3 px-3">Date</th>
                          <th className="text-left py-3 px-3">Score</th>
                          <th className="text-left py-3 px-3">Change</th>
                          <th className="text-left py-3 px-3">Source</th>
                          <th className="text-left py-3 px-3">Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedHistory.map((entry, index) => {
                          const { label, variant } = getSourceLabel(entry.source);
                          const prevEntry = sortedHistory[index + 1];
                          const scoreChange = prevEntry ? getScoreChange(entry.score, prevEntry.score) : null;

                          return (
                            <tr key={entry.id} className="hover:bg-gray-50">
                              <td className="py-3 px-3">
                                {new Date(entry.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </td>
                              <td className="py-3 px-3">
                                <span className="font-semibold text-lg">{entry.score}</span>
                                <Badge variant={getScoreLevel(entry.score).variant} className="ml-2">
                                  {getScoreLevel(entry.score).level}
                                </Badge>
                              </td>
                              <td className="py-3 px-3">
                                {scoreChange ? (
                                  <span className={`font-medium ${
                                    scoreChange.trend === "up" ? "text-green-600" :
                                    scoreChange.trend === "down" ? "text-red-600" : "text-gray-500"
                                  }`}>
                                    {scoreChange.trend === "up" && "↑ +"}
                                    {scoreChange.trend === "down" && "↓ -"}
                                    {scoreChange.change}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </td>
                              <td className="py-3 px-3">
                                <Badge variant={variant}>{label}</Badge>
                              </td>
                              <td className="py-3 px-3 text-gray-600">{entry.note}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            ) : (
              <Card className="text-center py-12">
                <p className="text-gray-500">Select a skill to view its history</p>
              </Card>
            )}
          </div>
        </div>

        <AcceptanceCriteriaSection storyId="US-6.4" />
      </main>
    </div>
  );
}
