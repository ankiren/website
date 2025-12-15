"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { DemoHeader, Skill, mockSkills, AcceptanceCriteriaSection } from "../_shared";

export default function US62ViewAvailableSkills() {
  const [skills] = useState<Skill[]>(mockSkills);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"tree" | "list">("tree");

  const flattenSkills = (skillList: Skill[]): Skill[] => {
    const result: Skill[] = [];
    const traverse = (skill: Skill, path: string[] = []) => {
      result.push({ ...skill, name: skill.name, parentId: skill.parentId });
      skill.children?.forEach(child => traverse(child, [...path, skill.name]));
    };
    skillList.forEach(skill => traverse(skill));
    return result;
  };

  const allSkills = flattenSkills(skills);
  const filteredSkills = searchQuery
    ? allSkills.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : allSkills;

  const getSkillPath = (skill: Skill): string => {
    const findPath = (skillList: Skill[], targetId: number, path: string[] = []): string[] | null => {
      for (const s of skillList) {
        if (s.id === targetId) return [...path, s.name];
        if (s.children) {
          const result = findPath(s.children, targetId, [...path, s.name]);
          if (result) return result;
        }
      }
      return null;
    };
    const path = findPath(skills, skill.id) || [skill.name];
    return path.join(" → ");
  };

  const renderSkillTree = (skillList: Skill[], depth = 0) => (
    <div className={depth > 0 ? "ml-6 border-l-2 border-gray-200 pl-4" : ""}>
      {skillList.map(skill => (
        <div key={skill.id}>
          <button
            onClick={() => setSelectedSkill(skill)}
            className={`flex items-center gap-2 py-2 px-3 rounded-lg w-full text-left transition-colors ${
              selectedSkill?.id === skill.id ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${skill.children?.length ? "bg-blue-500" : "bg-gray-400"}`} />
            <span className="font-medium">{skill.name}</span>
            {skill.children && skill.children.length > 0 && (
              <span className="text-xs text-gray-500">({skill.children.length})</span>
            )}
          </button>
          {skill.children && skill.children.length > 0 && renderSkillTree(skill.children, depth + 1)}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoHeader
        storyId="US-6.2"
        title="View Available Skills"
        description="As a user, I can browse all available skills in the system"
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and View Toggle */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="w-full md:w-96">
              <Input
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={viewMode === "tree" ? "primary" : "secondary"}
                onClick={() => setViewMode("tree")}
              >
                Tree View
              </Button>
              <Button
                size="sm"
                variant={viewMode === "list" ? "primary" : "secondary"}
                onClick={() => setViewMode("list")}
              >
                List View
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skills Display */}
          <Card className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">
              Available Skills
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({allSkills.length} total)
              </span>
            </h2>

            {viewMode === "tree" && !searchQuery ? (
              renderSkillTree(skills)
            ) : (
              <div className="space-y-2">
                {filteredSkills.map(skill => (
                  <button
                    key={skill.id}
                    onClick={() => setSelectedSkill(skill)}
                    className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                      selectedSkill?.id === skill.id ? "bg-blue-100" : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div>
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-xs text-gray-500 ml-2">{getSkillPath(skill)}</span>
                    </div>
                    <Badge variant={skill.children?.length ? "primary" : "default"}>
                      {skill.children?.length ? "Parent" : "Leaf"}
                    </Badge>
                  </button>
                ))}
                {filteredSkills.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No skills found</p>
                )}
              </div>
            )}
          </Card>

          {/* Skill Detail */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Skill Details</h2>
            {selectedSkill ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Name</label>
                  <p className="font-semibold text-lg">{selectedSkill.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Path</label>
                  <p className="text-sm">{getSkillPath(selectedSkill)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Type</label>
                  <p>
                    <Badge variant={selectedSkill.children?.length ? "primary" : "success"}>
                      {selectedSkill.children?.length ? "Category" : "Trackable Skill"}
                    </Badge>
                  </p>
                </div>
                {selectedSkill.children && selectedSkill.children.length > 0 && (
                  <div>
                    <label className="text-sm text-gray-500">Sub-skills ({selectedSkill.children.length})</label>
                    <div className="mt-2 space-y-1">
                      {selectedSkill.children.map(child => (
                        <button
                          key={child.id}
                          onClick={() => setSelectedSkill(child)}
                          className="block w-full text-left p-2 bg-gray-50 rounded hover:bg-gray-100 text-sm"
                        >
                          {child.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {!selectedSkill.children?.length && (
                  <Button className="w-full">+ Add to My Skills</Button>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Select a skill to view details</p>
            )}
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: "Total Skills", value: allSkills.length },
            { label: "Categories", value: allSkills.filter(s => s.children?.length).length },
            { label: "Trackable Skills", value: allSkills.filter(s => !s.children?.length).length },
            { label: "Root Skills", value: skills.length },
          ].map(stat => (
            <Card key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </Card>
          ))}
        </div>

        <AcceptanceCriteriaSection storyId="US-6.2" />
      </main>
    </div>
  );
}
