"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface PermissionFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function PermissionForm({ onClose, onSuccess }: PermissionFormProps) {
  const [resource, setResource] = useState("");
  const [action, setAction] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const name = resource && action ? `${resource}:${action}` : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!resource.trim() || !action.trim()) {
      setError("Resource and action are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          resource: resource.trim().toLowerCase(),
          action: action.trim().toLowerCase(),
          description: description || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to create permission");
        return;
      }

      onSuccess();
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title="Create Permission">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Resource"
            value={resource}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setResource(e.target.value)}
            disabled={loading}
            required
            placeholder="e.g., decks"
          />
          <Input
            label="Action"
            value={action}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAction(e.target.value)}
            disabled={loading}
            required
            placeholder="e.g., export"
          />
        </div>

        {name && (
          <div className="rounded-lg bg-gray-50 px-4 py-2">
            <span className="text-sm text-gray-500">Permission name: </span>
            <span className="font-mono text-sm font-medium">{name}</span>
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
            rows={2}
            placeholder="What this permission allows"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || !name}>
            {loading ? "Creating..." : "Create Permission"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
