"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DemoHeader, UserSkill, ScoreHistory, mockUserSkills, mockScoreHistory, getScoreLevel, AcceptanceCriteriaSection } from "../_shared";

export default function US67SkillScoreAnalytics() {
  const [userSkills] = useState<UserSkill[]>(mockUserSkills);
  const [scoreHistory] = useState<ScoreHistory[]>(mockScoreHistory);

  // Calculate analytics
  const totalAssessments = scoreHistory.length;
  const avgScore = userSkills.length
    ? Math.round(userSkills.reduce((sum, s) => sum + s.currentScore, 0) / userSkills.length)
    : 0;

  const scoresBySource = {
    test: scoreHistory.filter(h => h.source === "test"),
    practice: scoreHistory.filter(h => h.source === "practice"),
    assessment: scoreHistory.filter(h => h.source === "assessment"),
  };

  const avgBySource = {
    test: scoresBySource.test.length
      ? Math.round(scoresBySource.test.reduce((sum, h) => sum + h.score, 0) / scoresBySource.test.length)
      : 0,
    practice: scoresBySource.practice.length
      ? Math.round(scoresBySource.practice.reduce((sum, h) => sum + h.score, 0) / scoresBySource.practice.length)
      : 0,
    assessment: scoresBySource.assessment.length
      ? Math.round(scoresBySource.assessment.reduce((sum, h) => sum + h.score, 0) / scoresBySource.assessment.length)
      : 0,
  };

  const topSkill = userSkills.reduce((max, s) => s.currentScore > max.currentScore ? s : max, userSkills[0]);
  const lowestSkill = userSkills.reduce((min, s) => s.currentScore < min.currentScore ? s : min, userSkills[0]);

  const recentActivity = [...scoreHistory]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const skillDistribution = {
    expert: userSkills.filter(s => s.currentScore >= 81).length,
    advanced: userSkills.filter(s => s.currentScore >= 61 && s.currentScore < 81).length,
    intermediate: userSkills.filter(s => s.currentScore >= 41 && s.currentScore < 61).length,
    elementary: userSkills.filter(s => s.currentScore >= 21 && s.currentScore < 41).length,
    beginner: userSkills.filter(s => s.currentScore < 21).length,
  };

  const getSkillName = (userSkillId: number) => {
    const skill = userSkills.find(s => s.id === userSkillId);
    return skill?.skillName || "Unknown";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoHeader
        storyId="US-6.7"
        title="Skill Score Analytics"
        description="As a user, I can view analytics and insights about my skill performance"
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="text-center">
            <div className="text-3xl font-bold text-blue-600">{userSkills.length}</div>
            <div className="text-sm text-gray-500">Skills Tracked</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-green-600">{avgScore}</div>
            <div className="text-sm text-gray-500">Average Score</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-purple-600">{totalAssessments}</div>
            <div className="text-sm text-gray-500">Total Assessments</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {skillDistribution.expert + skillDistribution.advanced}
            </div>
            <div className="text-sm text-gray-500">Skills Advanced+</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top & Bottom Skills */}
          <Card>
            <h3 className="font-semibold mb-4">Skill Highlights</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Strongest Skill</p>
                    <p className="text-lg font-semibold">{topSkill?.skillName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{topSkill?.currentScore}</div>
                    <Badge variant={getScoreLevel(topSkill?.currentScore || 0).variant}>
                      {getScoreLevel(topSkill?.currentScore || 0).level}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-red-600 font-medium">Needs Improvement</p>
                    <p className="text-lg font-semibold">{lowestSkill?.skillName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">{lowestSkill?.currentScore}</div>
                    <Badge variant={getScoreLevel(lowestSkill?.currentScore || 0).variant}>
                      {getScoreLevel(lowestSkill?.currentScore || 0).level}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Score by Source */}
          <Card>
            <h3 className="font-semibold mb-4">Performance by Source</h3>
            <div className="space-y-4">
              {[
                { source: "Test", count: scoresBySource.test.length, avg: avgBySource.test, color: "bg-red-500" },
                { source: "Practice", count: scoresBySource.practice.length, avg: avgBySource.practice, color: "bg-blue-500" },
                { source: "Assessment", count: scoresBySource.assessment.length, avg: avgBySource.assessment, color: "bg-yellow-500" },
              ].map(item => (
                <div key={item.source} className="flex items-center gap-4">
                  <div className="w-24">
                    <div className="font-medium">{item.source}</div>
                    <div className="text-xs text-gray-500">{item.count} entries</div>
                  </div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} transition-all flex items-center justify-end pr-2`}
                        style={{ width: `${item.avg}%` }}
                      >
                        <span className="text-xs text-white font-medium">{item.avg}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Skill Distribution */}
          <Card>
            <h3 className="font-semibold mb-4">Skill Level Distribution</h3>
            <div className="space-y-3">
              {[
                { level: "Expert", count: skillDistribution.expert, color: "bg-purple-500", textColor: "text-purple-600" },
                { level: "Advanced", count: skillDistribution.advanced, color: "bg-green-500", textColor: "text-green-600" },
                { level: "Intermediate", count: skillDistribution.intermediate, color: "bg-blue-500", textColor: "text-blue-600" },
                { level: "Elementary", count: skillDistribution.elementary, color: "bg-yellow-500", textColor: "text-yellow-600" },
                { level: "Beginner", count: skillDistribution.beginner, color: "bg-red-500", textColor: "text-red-600" },
              ].map(item => (
                <div key={item.level} className="flex items-center gap-4">
                  <div className="w-24 font-medium">{item.level}</div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color}`}
                        style={{ width: `${(item.count / userSkills.length) * 100}%` }}
                      />
                    </div>
                    <span className={`w-8 font-bold ${item.textColor}`}>{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map(entry => (
                <div key={entry.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    entry.source === "test" ? "bg-red-500" :
                    entry.source === "practice" ? "bg-blue-500" : "bg-yellow-500"
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium">{getSkillName(entry.userSkillId)}</div>
                    <div className="text-xs text-gray-500">{entry.note}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{entry.score}</div>
                    <div className="text-xs text-gray-500">{entry.createdAt}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* All Skills Comparison */}
        <Card>
          <h3 className="font-semibold mb-4">All Skills Comparison</h3>
          <div className="space-y-3">
            {[...userSkills]
              .sort((a, b) => b.currentScore - a.currentScore)
              .map(skill => {
                const { variant } = getScoreLevel(skill.currentScore);
                return (
                  <div key={skill.id} className="flex items-center gap-4">
                    <div className="w-32 font-medium truncate">{skill.skillName}</div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            skill.currentScore >= 81 ? "bg-purple-500" :
                            skill.currentScore >= 61 ? "bg-green-500" :
                            skill.currentScore >= 41 ? "bg-blue-500" :
                            skill.currentScore >= 21 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${skill.currentScore}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-12 text-right font-bold">{skill.currentScore}</div>
                    <Badge variant={variant}>{getScoreLevel(skill.currentScore).level}</Badge>
                  </div>
                );
              })}
          </div>
        </Card>

        <AcceptanceCriteriaSection storyId="US-6.7" />
      </main>
    </div>
  );
}
