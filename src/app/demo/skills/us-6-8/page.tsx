"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DemoHeader, UserSkill, mockUserSkills, getScoreLevel, AcceptanceCriteriaSection } from "../_shared";

interface ImportEntry {
  skillName: string;
  score: number;
  source: "test" | "practice" | "assessment";
  date: string;
  note: string;
  status: "pending" | "success" | "error";
  error?: string;
}

const sampleCSV = `skill_name,score,source,date,note
Comprehension,80,test,2024-12-15,Final exam
Vocabulary,70,practice,2024-12-14,Daily practice
Conversation,55,assessment,2024-12-13,Self-evaluation
Algebra,92,test,2024-12-12,Quiz result`;

export default function US68BulkScoreImport() {
  const [userSkills] = useState<UserSkill[]>(mockUserSkills);
  const [csvInput, setCsvInput] = useState(sampleCSV);
  const [importEntries, setImportEntries] = useState<ImportEntry[]>([]);
  const [importStatus, setImportStatus] = useState<"idle" | "preview" | "importing" | "done">("idle");
  const [importProgress, setImportProgress] = useState(0);

  const parseCSV = () => {
    const lines = csvInput.trim().split("\n");
    if (lines.length < 2) {
      alert("CSV must have at least a header and one data row");
      return;
    }

    const entries: ImportEntry[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map(v => v.trim());
      if (values.length < 4) continue;

      const [skillName, scoreStr, source, date, note = ""] = values;
      const score = parseInt(scoreStr, 10);

      const validSources = ["test", "practice", "assessment"];
      const isValidSource = validSources.includes(source);
      const isValidScore = !isNaN(score) && score >= 0 && score <= 100;
      const matchingSkill = userSkills.find(s => s.skillName.toLowerCase() === skillName.toLowerCase());

      entries.push({
        skillName,
        score: isValidScore ? score : 0,
        source: isValidSource ? source as ImportEntry["source"] : "practice",
        date,
        note,
        status: "pending",
        error: !matchingSkill ? "Skill not found" :
               !isValidScore ? "Invalid score (0-100)" :
               !isValidSource ? "Invalid source" : undefined,
      });
    }

    setImportEntries(entries);
    setImportStatus("preview");
  };

  const simulateImport = async () => {
    setImportStatus("importing");
    setImportProgress(0);

    for (let i = 0; i < importEntries.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setImportEntries(prev =>
        prev.map((entry, idx) =>
          idx === i
            ? { ...entry, status: entry.error ? "error" : "success" }
            : entry
        )
      );
      setImportProgress(((i + 1) / importEntries.length) * 100);
    }

    setImportStatus("done");
  };

  const resetImport = () => {
    setImportEntries([]);
    setImportStatus("idle");
    setImportProgress(0);
  };

  const successCount = importEntries.filter(e => e.status === "success").length;
  const errorCount = importEntries.filter(e => e.status === "error").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoHeader
        storyId="US-6.8"
        title="Bulk Score Import"
        description="As a user, I can import multiple scores from external sources"
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {importStatus === "idle" && (
          <>
            {/* CSV Input */}
            <Card className="mb-6">
              <h3 className="font-semibold mb-4">CSV Import</h3>
              <p className="text-sm text-gray-500 mb-4">
                Paste your CSV data below. Format: skill_name, score, source, date, note
              </p>
              <textarea
                className="w-full h-48 p-3 border border-gray-300 rounded-lg font-mono text-sm"
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                placeholder="skill_name,score,source,date,note"
              />
              <div className="flex gap-2 mt-4">
                <Button onClick={parseCSV}>Preview Import</Button>
                <Button variant="secondary" onClick={() => setCsvInput(sampleCSV)}>
                  Load Sample Data
                </Button>
              </div>
            </Card>

            {/* Format Guide */}
            <Card>
              <h3 className="font-semibold mb-4">CSV Format Guide</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="">
                      <th className="text-left py-2 px-3">Column</th>
                      <th className="text-left py-2 px-3">Description</th>
                      <th className="text-left py-2 px-3">Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="">
                      <td className="py-2 px-3 font-medium">skill_name</td>
                      <td className="py-2 px-3">Name of the skill (must match existing)</td>
                      <td className="py-2 px-3 text-gray-500">Comprehension</td>
                    </tr>
                    <tr className="">
                      <td className="py-2 px-3 font-medium">score</td>
                      <td className="py-2 px-3">Score value (0-100)</td>
                      <td className="py-2 px-3 text-gray-500">75</td>
                    </tr>
                    <tr className="">
                      <td className="py-2 px-3 font-medium">source</td>
                      <td className="py-2 px-3">test, practice, or assessment</td>
                      <td className="py-2 px-3 text-gray-500">test</td>
                    </tr>
                    <tr className="">
                      <td className="py-2 px-3 font-medium">date</td>
                      <td className="py-2 px-3">Date of assessment (YYYY-MM-DD)</td>
                      <td className="py-2 px-3 text-gray-500">2024-12-15</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium">note</td>
                      <td className="py-2 px-3">Optional note</td>
                      <td className="py-2 px-3 text-gray-500">Final exam</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Your Tracked Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {userSkills.map(skill => (
                    <Badge key={skill.id} variant="primary">{skill.skillName}</Badge>
                  ))}
                </div>
              </div>
            </Card>
          </>
        )}

        {importStatus === "preview" && (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Preview Import ({importEntries.length} entries)</h3>
              <div className="flex gap-2">
                <Button onClick={simulateImport}>Start Import</Button>
                <Button variant="secondary" onClick={resetImport}>Cancel</Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="">
                    <th className="text-left py-2 px-3">Skill</th>
                    <th className="text-left py-2 px-3">Score</th>
                    <th className="text-left py-2 px-3">Source</th>
                    <th className="text-left py-2 px-3">Date</th>
                    <th className="text-left py-2 px-3">Note</th>
                    <th className="text-left py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {importEntries.map((entry, idx) => (
                    <tr key={idx} className={`${entry.error ? "bg-red-50" : ""}`}>
                      <td className="py-2 px-3 font-medium">{entry.skillName}</td>
                      <td className="py-2 px-3">
                        <span className="font-bold">{entry.score}</span>
                        <Badge variant={getScoreLevel(entry.score).variant} className="ml-2">
                          {getScoreLevel(entry.score).level}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 capitalize">{entry.source}</td>
                      <td className="py-2 px-3">{entry.date}</td>
                      <td className="py-2 px-3 text-gray-600">{entry.note}</td>
                      <td className="py-2 px-3">
                        {entry.error ? (
                          <Badge variant="danger">{entry.error}</Badge>
                        ) : (
                          <Badge variant="success">Ready</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {(importStatus === "importing" || importStatus === "done") && (
          <Card>
            <h3 className="font-semibold mb-4">
              {importStatus === "importing" ? "Importing..." : "Import Complete"}
            </h3>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{Math.round(importProgress)}%</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${importProgress}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            {importStatus === "done" && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold">{importEntries.length}</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{successCount}</div>
                  <div className="text-sm text-green-600">Success</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                  <div className="text-sm text-red-600">Failed</div>
                </div>
              </div>
            )}

            {/* Results Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="">
                    <th className="text-left py-2 px-3">Skill</th>
                    <th className="text-left py-2 px-3">Score</th>
                    <th className="text-left py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {importEntries.map((entry, idx) => (
                    <tr key={idx} className="">
                      <td className="py-2 px-3 font-medium">{entry.skillName}</td>
                      <td className="py-2 px-3">{entry.score}</td>
                      <td className="py-2 px-3">
                        {entry.status === "pending" && <Badge>Pending</Badge>}
                        {entry.status === "success" && <Badge variant="success">Imported</Badge>}
                        {entry.status === "error" && <Badge variant="danger">{entry.error}</Badge>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {importStatus === "done" && (
              <div className="flex gap-2 mt-4">
                <Button onClick={resetImport}>Import More</Button>
                <Button variant="secondary" onClick={() => window.location.href = "/demo/skills/us-6-5"}>
                  View Dashboard
                </Button>
              </div>
            )}
          </Card>
        )}

        <AcceptanceCriteriaSection storyId="US-6.8" />
      </main>
    </div>
  );
}
