"use client";

import { MoreVertical, Edit2, Trash2, Users, BookOpen } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export interface Course {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  status: "draft" | "published" | "archived";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  enrollmentCount?: number;
}

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

const statusColors = {
  draft: "bg-gray-100 text-gray-700",
  published: "bg-green-100 text-green-700",
  archived: "bg-amber-100 text-amber-700",
};

const statusLabels = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

export function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-violet-200">
      {/* Image/Placeholder */}
      <div className="relative h-40 bg-gradient-to-br from-violet-100 to-purple-100">
        {course.imageUrl ? (
          <img
            src={course.imageUrl}
            alt={course.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-violet-300" />
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              statusColors[course.status]
            }`}
          >
            {statusLabels[course.status]}
          </span>
        </div>

        {/* Menu button */}
        <div className="absolute top-3 right-3" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-10">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onEdit(course);
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onDelete(course);
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
          {course.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
          {course.description || "No description"}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>{course.enrollmentCount || 0} enrolled</span>
          </div>
        </div>
      </div>
    </div>
  );
}
