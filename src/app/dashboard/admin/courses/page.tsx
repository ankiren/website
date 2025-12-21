"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Filter } from "lucide-react";
import {
  CourseCard,
  Course,
  CreateEditCourseModal,
  DeleteCourseModal,
} from "./_components";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch courses
  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (statusFilter) params.set("status", statusFilter);

      const response = await fetch(`/api/admin/courses?${params.toString()}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch courses");
      }
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch courses");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Create/Update course
  const handleSaveCourse = async (data: {
    name: string;
    description: string;
    imageUrl: string;
    status: "draft" | "published" | "archived";
  }) => {
    setIsSubmitting(true);
    try {
      const isEdit = Boolean(editingCourse);
      const url = isEdit
        ? `/api/admin/courses/${editingCourse!.id}`
        : "/api/admin/courses";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save course");
      }

      setIsCreateModalOpen(false);
      setEditingCourse(null);
      await fetchCourses();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save course");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete course
  const handleDeleteCourse = async () => {
    if (!deletingCourse) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/courses/${deletingCourse.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete course");
      }

      setDeletingCourse(null);
      await fetchCourses();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete course");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter courses based on search
  const filteredCourses = courses;

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
                  Course Management
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage courses and enrollments
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
                    <h2 className="text-3xl font-black">Course Library</h2>
                    <p className="text-white/70 mt-1 font-medium">
                      Create and manage your courses
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-white rounded-2xl font-bold text-violet-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
                    Add Course
                  </button>
                </div>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:bg-white transition-all duration-300 font-medium"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3.5 bg-gray-50 rounded-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:bg-white transition-all duration-300 font-medium"
                >
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-16 text-red-500">
                  <p className="text-lg font-medium">{error}</p>
                  <button
                    onClick={fetchCourses}
                    className="mt-4 text-sm text-violet-600 hover:underline"
                  >
                    Try again
                  </button>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <p className="text-gray-500 text-lg">No courses found</p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-4 text-sm text-violet-600 hover:underline"
                  >
                    Create your first course
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onEdit={(c) => setEditingCourse(c)}
                      onDelete={(c) => setDeletingCourse(c)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer stats */}
            {!isLoading && !error && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  {filteredCourses.length} course
                  {filteredCourses.length === 1 ? "" : "s"}
                  {searchQuery && ` matching "${searchQuery}"`}
                  {statusFilter && ` (${statusFilter})`}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create/Edit Modal */}
      <CreateEditCourseModal
        isOpen={isCreateModalOpen || Boolean(editingCourse)}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingCourse(null);
        }}
        onSubmit={handleSaveCourse}
        course={editingCourse}
        isLoading={isSubmitting}
      />

      {/* Delete Modal */}
      <DeleteCourseModal
        isOpen={Boolean(deletingCourse)}
        onClose={() => setDeletingCourse(null)}
        onConfirm={handleDeleteCourse}
        course={deletingCourse}
        isLoading={isSubmitting}
      />
    </div>
  );
}
