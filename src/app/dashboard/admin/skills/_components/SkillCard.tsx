"use client";

import { useRouter } from "next/navigation";
import { SkillIcon } from "./SkillIcon";
import { Skill, getSkillColor } from "../_shared";

interface SkillCardProps {
  skill: Skill;
  isSelected?: boolean;
}

export function SkillCard({ skill, isSelected }: SkillCardProps) {
  const router = useRouter();
  const color = getSkillColor(skill.color);
  const hasChildren = skill.children && skill.children.length > 0;

  const handleClick = () => {
    router.push(`/dashboard/admin/skills/${skill.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`group relative p-5 rounded-2xl text-left transition-all duration-300 hover:scale-[1.02] ${
        isSelected
          ? `${color.gradient} shadow-xl text-white`
          : "bg-white hover:shadow-xl border border-gray-100"
      }`}
    >
      {/* Hover gradient overlay */}
      {!isSelected && (
        <div
          className={`absolute inset-0 rounded-2xl ${color.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
        />
      )}

      <div className="relative flex items-start gap-4">
        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isSelected
              ? "bg-white/25"
              : `${color.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-3`
          }`}
        >
          <SkillIcon
            name={skill.icon}
            className="w-7 h-7 text-white"
            strokeWidth={1.5}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-bold truncate ${
              isSelected ? "text-white" : "text-gray-800"
            }`}
          >
            {skill.name}
          </h3>
          {skill.description && (
            <p
              className={`text-sm mt-0.5 line-clamp-2 ${
                isSelected ? "text-white/70" : "text-gray-500"
              }`}
            >
              {skill.description}
            </p>
          )}

          {/* Children tags */}
          {hasChildren && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {skill.children!.slice(0, 2).map((child) => (
                <span
                  key={child.id}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : `${color.light} ${color.text}`
                  }`}
                >
                  {child.name}
                </span>
              ))}
              {skill.children!.length > 2 && (
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  +{skill.children!.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

interface SkillGridProps {
  skills: Skill[];
  selectedId?: number;
}

export function SkillGrid({ skills, selectedId }: SkillGridProps) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {skills.map((skill) => (
        <SkillCard
          key={skill.id}
          skill={skill}
          isSelected={selectedId === skill.id}
        />
      ))}
    </div>
  );
}
