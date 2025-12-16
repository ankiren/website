"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Edit,
  Trash2,
  ArrowLeft,
  Users,
  TreeDeciduous,
  Layers,
  FolderTree,
} from "lucide-react";
import {
  SkillIcon,
  SkillCard,
  CreateEditSkillModal,
  DeleteSkillModal,
} from "../_components";
import { SkillWithStats, Skill, getSkillColor } from "../_shared";

export default function SkillDetailPage() {
  const router = useRouter();
  const params = useParams();
  const skillId = parseInt(params.id as string, 10);

  const [skill, setSkill] = useState<SkillWithStats | null>(null);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch skill details
  const fetchSkill = useCallback(async () => {
    if (isNaN(skillId)) {
      setError("Invalid skill ID");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [skillRes, allSkillsRes] = await Promise.all([
        fetch(`/api/admin/skills/${skillId}`),
        fetch("/api/admin/skills"),
      ]);

      if (!skillRes.ok) {
        if (skillRes.status === 404) {
          setError("Skill not found");
        } else {
          const data = await skillRes.json();
          throw new Error(data.error || "Failed to fetch skill");
        }
        return;
      }

      const skillData = await skillRes.json();
      const allSkillsData = await allSkillsRes.json();

      setSkill(skillData);
      setAllSkills(allSkillsData.skills || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch skill");
    } finally {
      setIsLoading(false);
    }
  }, [skillId]);

  useEffect(() => {
    fetchSkill();
  }, [fetchSkill]);

  // Update skill
  const handleUpdateSkill = async (data: {
    name: string;
    description: string;
    icon: string;
    color: number;
    parentId: number | null;
  }) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/skills/${skillId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update skill");
      }

      setIsEditModalOpen(false);
      await fetchSkill();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update skill");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete skill
  const handleDeleteSkill = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/skills/${skillId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete skill");
      }

      router.push("/dashboard/admin/skills");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete skill");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500" />
      </div>
    );
  }

  // Not found state
  if (error || !skill) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <FolderTree className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Skill Not Found
            </h1>
            <p className="text-gray-500 mb-8">
              The skill you&apos;re looking for doesn&apos;t exist or has been
              deleted.
            </p>
            <Link
              href="/dashboard/admin/skills"
              className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Skills
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const color = getSkillColor(skill.color);
  const hasChildren = skill.children && skill.children.length > 0;

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
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-4">
              <Link
                href="/dashboard/admin/skills"
                className="text-gray-500 hover:text-violet-600 transition-colors"
              >
                Skills
              </Link>
              {skill.ancestors.map((ancestor) => (
                <span key={ancestor.id} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <Link
                    href={`/dashboard/admin/skills/${ancestor.id}`}
                    className="text-gray-500 hover:text-violet-600 transition-colors"
                  >
                    {ancestor.name}
                  </Link>
                </span>
              ))}
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">{skill.name}</span>
            </nav>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Skill Details
                </h1>
              </div>
              <Link
                href="/dashboard/admin/skills"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero card */}
              <div className="rounded-3xl bg-white shadow-xl overflow-hidden">
                <div
                  className={`${color.gradient} p-8 text-white relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50" />
                  <div className="relative flex items-start gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      <SkillIcon
                        name={skill.icon}
                        className="w-10 h-10 text-white"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-3xl font-black">{skill.name}</h2>
                      {skill.description && (
                        <p className="text-white/80 mt-2 text-lg">
                          {skill.description}
                        </p>
                      )}
                      {skill.parentId && skill.ancestors.length > 0 && (
                        <div className="mt-4">
                          <Link
                            href={`/dashboard/admin/skills/${skill.ancestors[skill.ancestors.length - 1].id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors"
                          >
                            Parent:{" "}
                            {skill.ancestors[skill.ancestors.length - 1].name}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 divide-x divide-gray-100">
                  <div className="p-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-xl bg-blue-50 text-blue-600 mb-3">
                      <Users className="w-6 h-6" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {skill.stats.directChildCount}
                    </p>
                    <p className="text-sm text-gray-500">Direct sub-skills</p>
                  </div>
                  <div className="p-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-xl bg-emerald-50 text-emerald-600 mb-3">
                      <TreeDeciduous className="w-6 h-6" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {skill.stats.totalDescendants}
                    </p>
                    <p className="text-sm text-gray-500">Total in tree</p>
                  </div>
                  <div className="p-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-xl bg-violet-50 text-violet-600 mb-3">
                      <Layers className="w-6 h-6" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      Level {skill.stats.depth}
                    </p>
                    <p className="text-sm text-gray-500">Depth in hierarchy</p>
                  </div>
                </div>
              </div>

              {/* Sub-skills section */}
              <div className="rounded-3xl bg-white shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Sub-skills
                </h3>
                {hasChildren ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {skill.children!.map((child) => (
                      <SkillCard key={child.id} skill={child as Skill} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <FolderTree className="w-16 h-16 mx-auto mb-4" strokeWidth={1} />
                    <p className="text-lg font-medium">No Sub-skills Yet</p>
                    <p className="text-sm">
                      This is a leaf skill with no children
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Skill Path */}
              <div className="rounded-2xl bg-white shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Skill Path
                </h3>
                <div className="space-y-2">
                  {skill.ancestors.map((ancestor, index) => (
                    <Link
                      key={ancestor.id}
                      href={`/dashboard/admin/skills/${ancestor.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg ${getSkillColor(ancestor.color).gradient} flex items-center justify-center`}
                      >
                        <SkillIcon
                          name={ancestor.icon}
                          className="w-4 h-4 text-white"
                          strokeWidth={1.5}
                        />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {ancestor.name}
                      </span>
                    </Link>
                  ))}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-50 border-2 border-violet-200">
                    <div
                      className={`w-8 h-8 rounded-lg ${color.gradient} flex items-center justify-center`}
                    >
                      <SkillIcon
                        name={skill.icon}
                        className="w-4 h-4 text-white"
                        strokeWidth={1.5}
                      />
                    </div>
                    <span className="text-violet-700 font-bold">
                      {skill.name}
                    </span>
                    <span className="ml-auto text-xs font-medium text-violet-500 bg-violet-100 px-2 py-1 rounded-full">
                      Current
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="rounded-2xl bg-white shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${color.gradient} text-white rounded-xl font-bold hover:opacity-90 transition-all`}
                  >
                    <Edit className="w-4 h-4" />
                    Edit Skill
                  </button>
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Skill
                  </button>
                </div>
              </div>

              {/* Metadata */}
              <div className="rounded-2xl bg-white shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Metadata
                </h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">ID</dt>
                    <dd className="text-gray-900 font-medium">{skill.id}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Created</dt>
                    <dd className="text-gray-900 font-medium">
                      {new Date(skill.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Updated</dt>
                    <dd className="text-gray-900 font-medium">
                      {new Date(skill.updatedAt).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      <CreateEditSkillModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateSkill}
        skill={skill}
        allSkills={allSkills}
        isLoading={isSubmitting}
      />

      {/* Delete Modal */}
      <DeleteSkillModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteSkill}
        skill={skill}
        descendantCount={skill.stats.totalDescendants}
        isLoading={isSubmitting}
      />
    </div>
  );
}
