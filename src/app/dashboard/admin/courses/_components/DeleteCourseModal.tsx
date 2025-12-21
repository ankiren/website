"use client";

import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Course } from "./CourseCard";

interface DeleteCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  course: Course | null;
  isLoading?: boolean;
}

export function DeleteCourseModal({
  isOpen,
  onClose,
  onConfirm,
  course,
  isLoading,
}: DeleteCourseModalProps) {
  if (!course) return null;

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Course" size="sm">
      <div className="text-center">
        {/* Warning icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Delete &quot;{course.name}&quot;?
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4">
          This action cannot be undone. This will permanently delete the course
          and remove all enrollments.
        </p>

        {/* Warning for enrollments */}
        {course.enrollmentCount && course.enrollmentCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-amber-800 font-medium">
              This course has {course.enrollmentCount} enrolled student
              {course.enrollmentCount === 1 ? "" : "s"}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
