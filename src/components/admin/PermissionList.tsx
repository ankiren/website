"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PermissionForm } from "./PermissionForm";

interface Permission {
  id: string;
  name: string;
  description: string | null;
  resource: string;
  action: string;
  isSystem: boolean;
}

export function PermissionList() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPermissions = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/permissions");
      if (!response.ok) {
        throw new Error("Failed to fetch permissions");
      }
      const data = await response.json();
      setPermissions(data.permissions);
    } catch {
      setError("Failed to load permissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this permission?")) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/permissions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Failed to delete permission");
        return;
      }

      fetchPermissions();
    } catch {
      alert("An error occurred");
    } finally {
      setDeleting(null);
    }
  };

  const handleFormSuccess = () => {
    fetchPermissions();
    setShowForm(false);
  };

  if (loading && permissions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-500">Loading permissions...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <div className="text-red-500">{error}</div>
        <Button onClick={fetchPermissions} className="mt-4">
          Retry
        </Button>
      </Card>
    );
  }

  // Group permissions by resource
  const groupedPermissions = permissions.reduce(
    (acc, perm) => {
      if (!acc[perm.resource]) acc[perm.resource] = [];
      acc[perm.resource].push(perm);
      return acc;
    },
    {} as Record<string, Permission[]>
  );

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setShowForm(true)}>Create Permission</Button>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedPermissions).map(([resource, perms]) => (
          <Card key={resource} className="overflow-hidden">
            <div className="border-b bg-gray-50 px-4 py-2">
              <h3 className="font-medium capitalize text-gray-900">{resource}</h3>
            </div>
            <div className="divide-y">
              {perms.map((perm) => (
                <div
                  key={perm.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {perm.name}
                      </span>
                      {perm.isSystem && (
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
                    </div>
                    {perm.description && (
                      <p className="text-sm text-gray-500">{perm.description}</p>
                    )}
                  </div>
                  {!perm.isSystem && (
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={deleting === perm.id}
                      onClick={() => handleDelete(perm.id)}
                    >
                      {deleting === perm.id ? "..." : "Delete"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {showForm && (
        <PermissionForm
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
