"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Role {
  id: string;
  name: string;
  description: string | null;
}

interface User {
  id: string;
  email: string;
  name: string | null;
  roles: Role[];
}

interface UserRoleManagerProps {
  user: User;
  onClose: () => void;
  onUpdated: () => void;
}

export function UserRoleManager({
  user,
  onClose,
  onUpdated,
}: UserRoleManagerProps) {
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<Role[]>(user.roles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/admin/roles");
      if (response.ok) {
        const data = await response.json();
        setAllRoles(data.roles);
      }
    } catch {
      console.error("Failed to fetch roles");
    }
  };

  const assignRole = async (roleId: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/users/${user.id}/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to assign role");
        return;
      }

      const data = await response.json();
      setUserRoles(data.roles);
      onUpdated();
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const removeRole = async (roleId: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/admin/users/${user.id}/roles/${roleId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to remove role");
        return;
      }

      setUserRoles(userRoles.filter((r) => r.id !== roleId));
      onUpdated();
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const availableRoles = allRoles.filter(
    (role) => !userRoles.some((ur) => ur.id === role.id)
  );

  return (
    <Modal isOpen onClose={onClose} title="Manage User Roles">
      <div className="space-y-4">
        <div>
          <div className="font-medium text-gray-900">
            {user.name || "No name"}
          </div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <div>
          <h4 className="mb-2 text-sm font-medium text-gray-700">
            Current Roles
          </h4>
          <div className="flex flex-wrap gap-2">
            {userRoles.map((role) => (
              <Badge
                key={role.id}
                variant={role.name === "admin" ? "primary" : "default"}
                className="flex items-center gap-1 pr-1"
              >
                {role.name}
                <button
                  onClick={() => removeRole(role.id)}
                  disabled={loading}
                  className="ml-1 rounded-full p-0.5 hover:bg-black/10"
                  title="Remove role"
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </Badge>
            ))}
            {userRoles.length === 0 && (
              <span className="text-sm text-gray-400">No roles assigned</span>
            )}
          </div>
        </div>

        {availableRoles.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">
              Add Role
            </h4>
            <div className="flex flex-wrap gap-2">
              {availableRoles.map((role) => (
                <Button
                  key={role.id}
                  variant="secondary"
                  size="sm"
                  disabled={loading}
                  onClick={() => assignRole(role.id)}
                >
                  + {role.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
