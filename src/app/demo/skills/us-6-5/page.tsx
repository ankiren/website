"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DemoHeader, UserSkill, mockUserSkills, getScoreLevel, ScoreLevelGuide, AcceptanceCriteriaSection } from "../_shared";

export default function US65MySkillsDashboard() {
  const [userSkills] = useState<UserSkill[]>(mockUserSkills);
  const [sortBy, setSortBy] = useState<"name" | "score" | "date">("score");
  const [filterLevel, setFilterLevel] = useState<string>("all");

  const sortedSkills = [...userSkills].sort((a, b) => {
    switch (sortBy) {
      case "name": return a.skillName.localeCompare(b.skillName);
      case "score": return b.currentScore - a.currentScore;
      case "date": return new Date(b.lastAssessedAt).getTime() - new Date(a.lastAssessedAt).getTime();
      default: return 0;
    }
  });

  const filteredSkills = filterLevel === "all"
    ? sortedSkills
    : sortedSkills.filter(s => getScoreLevel(s.currentScore).level.toLowerCase() === filterLevel);

  const avgScore = userSkills.length
    ? Math.round(userSkills.reduce((sum, s) => sum + s.currentScore, 0) / userSkills.length)
    : 0;

  const skillsByLevel = {
    expert: userSkills.filter(s => s.currentScore >= 81).length,
    advanced: userSkills.filter(s => s.currentScore >= 61 && s.currentScore < 81).length,
    intermediate: userSkills.filter(s => s.currentScore >= 41 && s.currentScore < 61).length,
    elementary: userSkills.filter(s => s.currentScore >= 21 && s.currentScore < 41).length,
    beginner: userSkills.filter(s => s.currentScore < 21).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoHeader
        storyId="US-6.5"
        title="My Skills Dashboard"
        description="As a user, I can see an overview of all my tracked skills"
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="text-center">
            <div className="text-3xl font-bold text-blue-600">{userSkills.length}</div>
            <div className="text-sm text-gray-500">Total Skills</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-green-600">{avgScore}</div>
            <div className="text-sm text-gray-500">Average Score</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-purple-600">{skillsByLevel.expert + skillsByLevel.advanced}</div>
            <div className="text-sm text-gray-500">Advanced+</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-yellow-600">{skillsByLevel.beginner + skillsByLevel.elementary}</div>
            <div className="text-sm text-gray-500">Need Work</div>
          </Card>
        </div>

        {/* Skill Level Distribution */}
        <Card className="mb-6">
          <h3 className="font-semibold mb-4">Skill Level Distribution</h3>
          <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
            {skillsByLevel.expert > 0 && (
              <div className="bg-purple-500 flex items-center justify-center text-white text-xs"
                style={{ width: `${(skillsByLevel.expert / userSkills.length) * 100}%` }}>
                {skillsByLevel.expert}
              </div>
            )}
            {skillsByLevel.advanced > 0 && (
              <div className="bg-green-500 flex items-center justify-center text-white text-xs"
                style={{ width: `${(skillsByLevel.advanced / userSkills.length) * 100}%` }}>
                {skillsByLevel.advanced}
              </div>
            )}
            {skillsByLevel.intermediate > 0 && (
              <div className="bg-blue-500 flex items-center justify-center text-white text-xs"
                style={{ width: `${(skillsByLevel.intermediate / userSkills.length) * 100}%` }}>
                {skillsByLevel.intermediate}
              </div>
            )}
            {skillsByLevel.elementary > 0 && (
              <div className="bg-yellow-500 flex items-center justify-center text-white text-xs"
                style={{ width: `${(skillsByLevel.elementary / userSkills.length) * 100}%` }}>
                {skillsByLevel.elementary}
              </div>
            )}
            {skillsByLevel.beginner > 0 && (
              <div className="bg-red-500 flex items-center justify-center text-white text-xs"
                style={{ width: `${(skillsByLevel.beginner / userSkills.length) * 100}%` }}>
                {skillsByLevel.beginner}
              </div>
            )}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Expert</span>
            <span>Advanced</span>
            <span>Intermediate</span>
            <span>Elementary</span>
            <span>Beginner</span>
          </div>
        </Card>

        {/* Filters and Sort */}
        <Card className="mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-500">Sort by:</span>
              {[
                { value: "score", label: "Score" },
                { value: "name", label: "Name" },
                { value: "date", label: "Last Assessed" },
              ].map(option => (
                <Button
                  key={option.value}
                  size="sm"
                  variant={sortBy === option.value ? "primary" : "secondary"}
                  onClick={() => setSortBy(option.value as typeof sortBy)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-500">Filter:</span>
              <select
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="expert">Expert</option>
                <option value="advanced">Advanced</option>
                <option value="intermediate">Intermediate</option>
                <option value="elementary">Elementary</option>
                <option value="beginner">Beginner</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {filteredSkills.map(us => {
            const { level, variant } = getScoreLevel(us.currentScore);
            return (
              <Card key={us.id} className="hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{us.skillName}</h3>
                    <p className="text-sm text-gray-500">Last: {us.lastAssessedAt}</p>
                  </div>
                  <Badge variant={variant}>{level}</Badge>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span className="font-semibold">{us.currentScore}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        us.currentScore >= 81 ? "bg-purple-500" :
                        us.currentScore >= 61 ? "bg-green-500" :
                        us.currentScore >= 41 ? "bg-blue-500" :
                        us.currentScore >= 21 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${us.currentScore}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" className="flex-1">View History</Button>
                  <Button size="sm" className="flex-1">Update Score</Button>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredSkills.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-gray-500">No skills found matching the filter</p>
          </Card>
        )}

        {/* Score Level Guide */}
        <Card>
          <h3 className="font-semibold mb-4">Score Level Guide</h3>
          <ScoreLevelGuide />
        </Card>

        <AcceptanceCriteriaSection storyId="US-6.5" />
      </main>
    </div>
  );
}
