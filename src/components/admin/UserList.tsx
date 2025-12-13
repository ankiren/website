"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { UserRoleManager } from "./UserRoleManager";

interface Role {
  id: string;
  name: string;
  description: string | null;
}

interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  roles: Role[];
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "20" });
      if (search) params.set("search", search);

      const response = await fetch(`/api/admin/users?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleUserUpdated = () => {
    fetchUsers();
    setSelectedUser(null);
  };

  if (loading && users.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-500">Loading users...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <div className="text-red-500">{error}</div>
        <Button onClick={fetchUsers} className="mt-4">
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <Input
          placeholder="Search by email or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">Search</Button>
      </form>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  User
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Roles
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Joined
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt=""
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600">
                          {(user.name || user.email)[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.name || "No name"}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <Badge
                          key={role.id}
                          variant={role.name === "admin" ? "primary" : "default"}
                        >
                          {role.name}
                        </Badge>
                      ))}
                      {user.roles.length === 0 && (
                        <span className="text-sm text-gray-400">No roles</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                    >
                      Manage Roles
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <div className="text-sm text-gray-500">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} users
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page === pagination.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {selectedUser && (
        <UserRoleManager
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
}
