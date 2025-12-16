"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { DemoHeader, UserSkill, mockUserSkills, getScoreLevel, ScoreLevelGuide, AcceptanceCriteriaSection } from "../_shared";

export default function US63RecordSkillScore() {
  const [userSkills, setUserSkills] = useState<UserSkill[]>(mockUserSkills);
  const [selectedSkill, setSelectedSkill] = useState<UserSkill | null>(null);
  const [score, setScore] = useState(50);
  const [source, setSource] = useState<"test" | "practice" | "assessment">("practice");
  const [note, setNote] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkill) return;

    setUserSkills(prev =>
      prev.map(us =>
        us.id === selectedSkill.id
          ? { ...us, currentScore: score, lastAssessedAt: new Date().toISOString().split("T")[0] }
          : us
      )
    );

    setSelectedSkill(prev =>
      prev ? { ...prev, currentScore: score, lastAssessedAt: new Date().toISOString().split("T")[0] } : null
    );

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setNote("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoHeader
        storyId="US-6.3"
        title="Record Skill Score"
        description="As a user, I can record my proficiency score for a skill"
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
            <span>✓</span>
            <span>Score recorded successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skill Selection */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Select Skill</h2>
            <div className="space-y-2">
              {userSkills.map(us => (
                <button
                  key={us.id}
                  onClick={() => {
                    setSelectedSkill(us);
                    setScore(us.currentScore);
                  }}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedSkill?.id === us.id ? "bg-blue-100 border-2 border-blue-500" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{us.skillName}</span>
                    <Badge variant={getScoreLevel(us.currentScore).variant}>
                      {us.currentScore}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Last: {us.lastAssessedAt}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Score Input Form */}
          <Card className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Record Score</h2>
            {selectedSkill ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Recording score for</p>
                  <p className="text-xl font-semibold">{selectedSkill.skillName}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Current score: <span className="font-semibold">{selectedSkill.currentScore}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Score: <span className="text-2xl font-bold text-blue-600">{score}</span>
                    <Badge variant={getScoreLevel(score).variant} className="ml-2">
                      {getScoreLevel(score).level}
                    </Badge>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 - Beginner</span>
                    <span>50 - Intermediate</span>
                    <span>100 - Expert</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { value: "test", label: "Test", desc: "Formal examination" },
                      { value: "practice", label: "Practice", desc: "Practice session" },
                      { value: "assessment", label: "Assessment", desc: "Self-evaluation" },
                    ] as const).map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setSource(s.value)}
                        className={`p-3 rounded-lg text-center transition-colors ${
                          source === s.value
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <div className="font-medium">{s.label}</div>
                        <div className={`text-xs ${source === s.value ? "text-blue-100" : "text-gray-500"}`}>
                          {s.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Note (optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note about this score..."
                />

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">Save Score</Button>
                  <Button type="button" variant="secondary" onClick={() => {
                    setScore(selectedSkill.currentScore);
                    setNote("");
                  }}>
                    Reset
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Select a skill from the list to record a score</p>
              </div>
            )}
          </Card>
        </div>

        {/* Score Level Guide */}
        <Card className="mt-6">
          <h3 className="font-semibold mb-4">Score Level Guide</h3>
          <ScoreLevelGuide />
        </Card>

        <AcceptanceCriteriaSection storyId="US-6.3" />
      </main>
    </div>
  );
}
