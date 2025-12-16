"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { IconPicker } from "./IconPicker";
import { Skill, SKILL_COLORS, flattenSkills } from "../_shared";

interface CreateEditSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    icon: string;
    color: number;
    parentId: number | null;
  }) => Promise<void>;
  skill?: Skill | null;
  allSkills: Skill[];
  isLoading?: boolean;
}

export function CreateEditSkillModal({
  isOpen,
  onClose,
  onSubmit,
  skill,
  allSkills,
  isLoading,
}: CreateEditSkillModalProps) {
  const isEdit = Boolean(skill);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("FileText");
  const [color, setColor] = useState(0);
  const [parentId, setParentId] = useState<number | null>(null);

  const [parentDropdownOpen, setParentDropdownOpen] = useState(false);
  const [parentSearch, setParentSearch] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens or skill changes
  useEffect(() => {
    if (isOpen) {
      if (skill) {
        setName(skill.name);
        setDescription(skill.description || "");
        setIcon(skill.icon);
        setColor(skill.color);
        setParentId(skill.parentId);
      } else {
        setName("");
        setDescription("");
        setIcon("FileText");
        setColor(0);
        setParentId(null);
      }
      setErrors({});
      setParentSearch("");
      setParentDropdownOpen(false);
    }
  }, [isOpen, skill]);

  // Get flat list of available parent skills
  const flatSkills = flattenSkills(allSkills);
  // Filter out current skill and its descendants from parent options
  const availableParents = flatSkills.filter((s) => {
    if (!skill) return true;
    if (s.id === skill.id) return false;

    // Check if s is a descendant of skill (can't set descendant as parent)
    const isDescendant = (parent: Skill, targetId: number): boolean => {
      if (!parent.children) return false;
      for (const child of parent.children) {
        if (child.id === targetId) return true;
        if (isDescendant(child, targetId)) return true;
      }
      return false;
    };

    // Find skill in tree and check if s is a descendant
    const findAndCheck = (skills: Skill[]): boolean => {
      for (const sk of skills) {
        if (sk.id === skill.id) {
          return isDescendant(sk, s.id);
        }
        if (sk.children && findAndCheck(sk.children)) {
          return true;
        }
      }
      return false;
    };

    return !findAndCheck(allSkills);
  });

  const filteredParents = parentSearch
    ? availableParents.filter((s) =>
        s.name.toLowerCase().includes(parentSearch.toLowerCase())
      )
    : availableParents;

  const selectedParent = parentId
    ? availableParents.find((s) => s.id === parentId)
    : null;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Skill name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Skill name must be at least 2 characters";
    } else if (name.trim().length > 100) {
      newErrors.name = "Skill name must be at most 100 characters";
    }

    if (description && description.length > 500) {
      newErrors.description = "Description must be at most 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    await onSubmit({
      name: name.trim(),
      description: description.trim(),
      icon,
      color,
      parentId,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Skill" : "Create New Skill"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Skill Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter skill name..."
            className={`w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium ${
              errors.name ? "ring-2 ring-red-500" : ""
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this skill..."
            rows={2}
            className={`w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium resize-none ${
              errors.description ? "ring-2 ring-red-500" : ""
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            {description.length}/500 characters
          </p>
        </div>

        {/* Parent Skill */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Parent Skill
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setParentDropdownOpen(!parentDropdownOpen);
                setParentSearch("");
              }}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium cursor-pointer text-left"
            >
              <span>
                {selectedParent ? selectedParent.name : "None (Root Level)"}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  parentDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {parentDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-2 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={parentSearch}
                      onChange={(e) => setParentSearch(e.target.value)}
                      placeholder="Search skills..."
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border-0 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setParentId(null);
                      setParentDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                      parentId === null
                        ? "bg-violet-50 text-violet-700 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {parentId === null && <Check className="w-4 h-4" />}
                    <span className={parentId === null ? "" : "ml-6"}>
                      None (Root Level)
                    </span>
                  </button>
                  {filteredParents.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setParentId(s.id);
                        setParentDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                        parentId === s.id
                          ? "bg-violet-50 text-violet-700 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {parentId === s.id && <Check className="w-4 h-4" />}
                      <span className={parentId === s.id ? "" : "ml-6"}>
                        {s.name}
                      </span>
                    </button>
                  ))}
                  {filteredParents.length === 0 && parentSearch && (
                    <p className="px-4 py-3 text-sm text-gray-400 text-center">
                      No skills found
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {SKILL_COLORS.map((c, idx) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(idx)}
                className={`w-10 h-10 rounded-xl ${c.bg} transition-all duration-200 ${
                  color === idx
                    ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                    : "hover:scale-105"
                }`}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Icon */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Icon
          </label>
          <IconPicker value={icon} onChange={setIcon} />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEdit ? "Save Changes" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
