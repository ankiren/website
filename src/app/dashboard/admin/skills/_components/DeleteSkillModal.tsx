"use client";

import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Skill } from "../_shared";

interface DeleteSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  skill: Skill | null;
  descendantCount: number;
  isLoading?: boolean;
}

export function DeleteSkillModal({
  isOpen,
  onClose,
  onConfirm,
  skill,
  descendantCount,
  isLoading,
}: DeleteSkillModalProps) {
  if (!skill) return null;

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Skill" size="sm">
      <div className="text-center">
        {/* Warning icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Delete &quot;{skill.name}&quot;?
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4">
          This action cannot be undone. This will permanently delete the skill
          from your library.
        </p>

        {/* Warning for sub-skills */}
        {descendantCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-amber-800 font-medium">
              This will also delete {descendantCount} sub-skill
              {descendantCount === 1 ? "" : "s"}
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
