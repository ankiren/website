"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RoleForm } from "./RoleForm";

interface Role {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  userCount: number;
  permissions: string[];
}

export function RoleList() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchRoles = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/roles");
      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }
      const data = await response.json();
      setRoles(data.roles);
    } catch {
      setError("Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/roles/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Failed to delete role");
        return;
      }

      fetchRoles();
    } catch {
      alert("An error occurred");
    } finally {
      setDeleting(null);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingRole(null);
  };

  const handleFormSuccess = () => {
    fetchRoles();
    handleFormClose();
  };

  if (loading && roles.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-500">Loading roles...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <div className="text-red-500">{error}</div>
        <Button onClick={fetchRoles} className="mt-4">
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setShowForm(true)}>Create Role</Button>
      </div>

      <div className="space-y-4">
        {roles.map((role) => (
          <Card key={role.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{role.name}</h3>
                  {role.isSystem && (
                    <Badge variant="warning">
                      <svg
                        className="mr-1 h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      System
                    </Badge>
                  )}
                  <Badge variant="default">{role.userCount} users</Badge>
                </div>
                {role.description && (
                  <p className="mt-1 text-sm text-gray-500">{role.description}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-1">
                  {role.permissions.map((perm) => (
                    <Badge key={perm} variant="primary">
                      {perm}
                    </Badge>
                  ))}
                  {role.permissions.length === 0 && (
                    <span className="text-sm text-gray-400">No permissions</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingRole(role);
                    setShowForm(true);
                  }}
                >
                  Edit
                </Button>
                {!role.isSystem && (
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={deleting === role.id || role.userCount > 0}
                    onClick={() => handleDelete(role.id)}
                  >
                    {deleting === role.id ? "Deleting..." : "Delete"}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {(showForm || editingRole) && (
        <RoleForm
          role={editingRole}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
