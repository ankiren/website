"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Course } from "./CourseCard";

interface CreateEditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    imageUrl: string;
    status: "draft" | "published" | "archived";
  }) => Promise<void>;
  course?: Course | null;
  isLoading?: boolean;
}

export function CreateEditCourseModal({
  isOpen,
  onClose,
  onSubmit,
  course,
  isLoading,
}: CreateEditCourseModalProps) {
  const isEdit = Boolean(course);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens or course changes
  useEffect(() => {
    if (isOpen) {
      if (course) {
        setName(course.name);
        setDescription(course.description || "");
        setImageUrl(course.imageUrl || "");
        setStatus(course.status);
      } else {
        setName("");
        setDescription("");
        setImageUrl("");
        setStatus("draft");
      }
      setErrors({});
    }
  }, [isOpen, course]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Course name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Course name must be at least 2 characters";
    } else if (name.trim().length > 200) {
      newErrors.name = "Course name must be at most 200 characters";
    }

    if (imageUrl && !isValidUrl(imageUrl)) {
      newErrors.imageUrl = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    await onSubmit({
      name: name.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      status,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Course" : "Create New Course"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Course Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter course name..."
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
            placeholder="Brief description of this course..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium resize-none"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className={`w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium ${
              errors.imageUrl ? "ring-2 ring-red-500" : ""
            }`}
          />
          {errors.imageUrl && (
            <p className="mt-1 text-sm text-red-500">{errors.imageUrl}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Status
          </label>
          <div className="flex gap-3">
            {(["draft", "published", "archived"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  status === s
                    ? s === "draft"
                      ? "bg-gray-200 text-gray-800"
                      : s === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
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
