"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Sparkles, ChevronRight } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { UserList } from "@/components/admin/UserList";
import { RoleList } from "@/components/admin/RoleList";
import { PermissionList } from "@/components/admin/PermissionList";

const tabs = [
  { id: "users", label: "Users" },
  { id: "roles", label: "Roles" },
  { id: "permissions", label: "Permissions" },
];

const adminSections = [
  {
    href: "/dashboard/admin/courses",
    icon: BookOpen,
    title: "Courses",
    description: "Manage courses and enrollments",
    color: "from-violet-500 to-purple-500",
  },
  {
    href: "/dashboard/admin/skills",
    icon: Sparkles,
    title: "Skills",
    description: "Manage skill hierarchy",
    color: "from-pink-500 to-rose-500",
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
        <p className="text-gray-600">Manage users, roles, and permissions</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {adminSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 hover:shadow-lg transition-all duration-300"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-5 transition-opacity`}
            />
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center`}
              >
                <section.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{section.title}</h3>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
          </Link>
        ))}
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
