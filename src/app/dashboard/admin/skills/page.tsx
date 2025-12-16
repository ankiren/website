"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search, LayoutGrid, List } from "lucide-react";
import {
  SkillTree,
  SkillGrid,
  CreateEditSkillModal,
  DeleteSkillModal,
} from "./_components";
import {
  Skill,
  flattenSkills,
  filterSkillTree,
  getViewPreference,
  setViewPreference,
} from "./_shared";

export default function AdminSkillsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View mode from URL or localStorage
  const viewFromUrl = searchParams.get("view");
  const [viewMode, setViewMode] = useState<"tree" | "grid">(
    (viewFromUrl as "tree" | "grid") || "tree"
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize view mode from localStorage
  useEffect(() => {
    if (!viewFromUrl) {
      const saved = getViewPreference();
      setViewMode(saved);
    }
  }, [viewFromUrl]);

  // Fetch skills
  const fetchSkills = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/skills");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch skills");
      }
      const data = await response.json();
      setSkills(data.skills || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch skills");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  // Handle view mode change
  const handleViewModeChange = (mode: "tree" | "grid") => {
    setViewMode(mode);
    setViewPreference(mode);
    // Update URL without full navigation
    const params = new URLSearchParams(searchParams);
    params.set("view", mode);
    router.replace(`/dashboard/admin/skills?${params.toString()}`, { scroll: false });
  };

  // Create skill
  const handleCreateSkill = async (data: {
    name: string;
    description: string;
    icon: string;
    color: number;
    parentId: number | null;
  }) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create skill");
      }

      setIsCreateModalOpen(false);
      await fetchSkills();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create skill");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter skills based on search
  const filteredTreeSkills = searchQuery
    ? filterSkillTree(skills, searchQuery)
    : skills;
  const allFlatSkills = flattenSkills(skills);
  const filteredFlatSkills = searchQuery
    ? allFlatSkills.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allFlatSkills;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30">
      {/* Decorative Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-200/40 to-purple-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-200/40 to-cyan-200/40 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Skill Management
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage skills and their hierarchy
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="rounded-3xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl shadow-gray-200/50 overflow-hidden">
            {/* Header with gradient */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50" />
              <div className="relative p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-white">
                    <h2 className="text-3xl font-black">Skill Library</h2>
                    <p className="text-white/70 mt-1 font-medium">
                      Organize and manage your skill hierarchy
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-white rounded-2xl font-bold text-violet-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
                    Add Skill
                  </button>
                </div>
              </div>
            </div>

            {/* Search & Toggle */}
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:bg-white transition-all duration-300 font-medium"
                />
              </div>
              <div className="flex p-1.5 bg-gray-100 rounded-2xl">
                <button
                  onClick={() => handleViewModeChange("tree")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    viewMode === "tree"
                      ? "bg-white text-violet-600 shadow-lg"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List className="w-4 h-4" />
                  Tree
                </button>
                <button
                  onClick={() => handleViewModeChange("grid")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-white text-violet-600 shadow-lg"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Grid
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-16 text-red-500">
                  <p className="text-lg font-medium">{error}</p>
                  <button
                    onClick={fetchSkills}
                    className="mt-4 text-sm text-violet-600 hover:underline"
                  >
                    Try again
                  </button>
                </div>
              ) : viewMode === "tree" ? (
                <SkillTree skills={filteredTreeSkills} />
              ) : (
                <SkillGrid skills={filteredFlatSkills} />
              )}
            </div>

            {/* Footer stats */}
            {!isLoading && !error && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  {allFlatSkills.length} total skills
                  {searchQuery &&
                    ` (${filteredFlatSkills.length} matching "${searchQuery}")`}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Modal */}
      <CreateEditSkillModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSkill}
        allSkills={skills}
        isLoading={isSubmitting}
      />
    </div>
  );
}
