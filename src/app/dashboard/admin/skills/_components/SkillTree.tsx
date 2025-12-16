"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { SkillIcon } from "./SkillIcon";
import { Skill, getSkillColor } from "../_shared";

interface SkillTreeProps {
  skills: Skill[];
  selectedId?: number;
}

interface TreeNodeProps {
  skill: Skill;
  depth: number;
  selectedId?: number;
  parentColor?: ReturnType<typeof getSkillColor>;
}

function TreeNode({ skill, depth, selectedId, parentColor }: TreeNodeProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = skill.children && skill.children.length > 0;
  const isSelected = selectedId === skill.id;

  // Use skill's own color if set, otherwise inherit from parent or use index-based color
  const color = getSkillColor(skill.color);
  const childColor = color;

  const handleClick = () => {
    router.push(`/dashboard/admin/skills/${skill.id}`);
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative">
      {/* Tree connector lines */}
      {depth > 0 && (
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" style={{ left: "-1.5rem" }} />
      )}

      <div className="relative">
        {/* Horizontal connector to parent */}
        {depth > 0 && (
          <div className="absolute w-6 h-px bg-gray-200" style={{ left: "-1.5rem", top: "1.75rem" }} />
        )}

        <button
          onClick={handleClick}
          className={`group flex items-center gap-4 w-full p-4 mb-2 rounded-2xl text-left transition-all duration-300 ${
            isSelected
              ? `${color.gradient} shadow-xl text-white`
              : "bg-white hover:bg-gray-50 border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50"
          }`}
        >
          {/* Expand/Collapse button */}
          {hasChildren && (
            <button
              onClick={handleExpandClick}
              className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                isSelected
                  ? "bg-white/20 hover:bg-white/30"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <ChevronRight
                className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""} ${
                  isSelected ? "text-white" : "text-gray-500"
                }`}
              />
            </button>
          )}
          {!hasChildren && <div className="w-6" />}

          {/* Icon */}
          <div
            className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isSelected ? "bg-white/25" : color.gradient
            }`}
          >
            <SkillIcon
              name={skill.icon}
              className="w-6 h-6 text-white"
              strokeWidth={1.5}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p
              className={`font-semibold truncate ${
                isSelected ? "text-white" : "text-gray-800"
              }`}
            >
              {skill.name}
            </p>
            {skill.description && (
              <p
                className={`text-sm truncate ${
                  isSelected ? "text-white/70" : "text-gray-500"
                }`}
              >
                {skill.description}
              </p>
            )}
          </div>

          {/* Children count badge */}
          {hasChildren && (
            <div
              className={`px-3 py-1 rounded-full text-sm font-bold ${
                isSelected
                  ? "bg-white/25 text-white"
                  : `${color.light} ${color.text}`
              }`}
            >
              {skill.children!.length}
            </div>
          )}
        </button>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="ml-6 pl-6 border-l-2 border-dashed border-gray-200">
          {skill.children!.map((child) => (
            <TreeNode
              key={child.id}
              skill={child}
              depth={depth + 1}
              selectedId={selectedId}
              parentColor={childColor}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function SkillTree({ skills, selectedId }: SkillTreeProps) {
  if (skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <SkillIcon name="FolderTree" className="w-16 h-16 mb-4" strokeWidth={1} />
        <p className="text-lg font-medium">No skills found</p>
        <p className="text-sm">Try adjusting your search or add a new skill</p>
      </div>
    );
  }

  return (
    <div>
      {skills.map((skill, index) => (
        <TreeNode
          key={skill.id}
          skill={skill}
          depth={0}
          selectedId={selectedId}
        />
      ))}
    </div>
  );
}
