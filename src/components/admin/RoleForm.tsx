"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Permission {
  id: string;
  name: string;
  description: string | null;
}

interface Role {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  permissions: string[];
}

interface RoleFormProps {
  role?: Role | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function RoleForm({ role, onClose, onSuccess }: RoleFormProps) {
  const isEditing = !!role;
  const [name, setName] = useState(role?.name || "");
  const [description, setDescription] = useState(role?.description || "");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await fetch("/api/admin/permissions");
      if (response.ok) {
        const data = await response.json();
        setAllPermissions(data.permissions);

        // If editing, fetch role details to get permission IDs
        if (role) {
          const roleResponse = await fetch(`/api/admin/roles/${role.id}`);
          if (roleResponse.ok) {
            const roleData = await roleResponse.json();
            setSelectedPermissions(
              roleData.permissions.map((p: Permission) => p.id)
            );
          }
        }
      }
    } catch {
      console.error("Failed to fetch permissions");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = isEditing ? `/api/admin/roles/${role.id}` : "/api/admin/roles";
      const method = isEditing ? "PUT" : "POST";

      const body: Record<string, unknown> = {
        description: description || null,
        permissions: selectedPermissions,
      };

      if (!isEditing) {
        body.name = name;
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to save role");
        return;
      }

      onSuccess();
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Group permissions by resource
  const groupedPermissions = allPermissions.reduce(
    (acc, perm) => {
      const resource = perm.name.split(":")[0];
      if (!acc[resource]) acc[resource] = [];
      acc[resource].push(perm);
      return acc;
    },
    {} as Record<string, Permission[]>
  );

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEditing ? "Edit Role" : "Create Role"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isEditing || loading}
          required={!isEditing}
          placeholder="e.g., moderator"
        />

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
            placeholder="Role description"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Permissions
          </label>
          <div className="max-h-64 space-y-4 overflow-y-auto rounded-lg border p-4">
            {Object.entries(groupedPermissions).map(([resource, perms]) => (
              <div key={resource}>
                <h4 className="mb-2 text-sm font-medium capitalize text-gray-700">
                  {resource}
                </h4>
                <div className="space-y-2">
                  {perms.map((perm) => (
                    <label
                      key={perm.id}
                      className="flex items-start gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(perm.id)}
                        onChange={() => togglePermission(perm.id)}
                        disabled={loading}
                        className="mt-0.5 rounded border-gray-300"
                      />
                      <span>
                        <span className="font-medium">{perm.name}</span>
                        {perm.description && (
                          <span className="text-gray-500">
                            {" "}
                            - {perm.description}
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            {allPermissions.length === 0 && (
              <div className="text-sm text-gray-400">No permissions available</div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Update Role" : "Create Role"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
