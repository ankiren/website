"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { UserList } from "@/components/admin/UserList";
import { RoleList } from "@/components/admin/RoleList";
import { PermissionList } from "@/components/admin/PermissionList";

const tabs = [
  { id: "users", label: "Users" },
  { id: "roles", label: "Roles" },
  { id: "permissions", label: "Permissions" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
        <p className="text-gray-600">Manage users, roles, and permissions</p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === "users" && <UserList />}
        {activeTab === "roles" && <RoleList />}
        {activeTab === "permissions" && <PermissionList />}
      </div>
    </div>
  );
}
