"use client";

import { useState, useEffect, useCallback } from "react";
import { BookOpen, Search, Users, CheckCircle, LogIn } from "lucide-react";

interface Course {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  status: string;
  enrollmentCount?: number;
}

interface Enrollment {
  id: number;
  courseId: number;
  status: string;
  course?: Course;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [enrollingId, setEnrollingId] = useState<number | null>(null);

  // Fetch published courses
  const fetchCourses = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);

      const response = await fetch(`/api/courses?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch courses");
    }
  }, [searchQuery]);

  // Fetch user's enrollments
  const fetchEnrollments = useCallback(async () => {
    try {
      const response = await fetch("/api/me/enrollments");
      if (!response.ok) throw new Error("Failed to fetch enrollments");
      const data = await response.json();
      setEnrollments(data.enrollments || []);
    } catch (err) {
      console.error("Failed to fetch enrollments:", err);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchCourses(), fetchEnrollments()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchCourses, fetchEnrollments]);

  // Check if user is enrolled in a course
  const isEnrolled = (courseId: number) => {
    return enrollments.some(
      (e) => e.courseId === courseId && e.status === "active"
    );
  };

  // Enroll in a course
  const handleEnroll = async (courseId: number) => {
    setEnrollingId(courseId);
    try {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: "POST",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to enroll");
      }
      await fetchEnrollments();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to enroll");
    } finally {
      setEnrollingId(null);
    }
  };

  // Unenroll from a course
  const handleUnenroll = async (courseId: number) => {
    if (!confirm("Are you sure you want to leave this course?")) return;

    setEnrollingId(courseId);
    try {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to unenroll");
      }
      await fetchEnrollments();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to unenroll");
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Available Courses</h1>
          <p className="text-gray-600 mt-1">
            Browse and enroll in courses to start learning
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchCourses();
            }}
            className="mt-4 text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No courses available
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? `No courses found for "${searchQuery}"`
              : "Check back later for new courses"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const enrolled = isEnrolled(course.id);
            const isProcessing = enrollingId === course.id;

            return (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-40 bg-gradient-to-br from-blue-100 to-indigo-100">
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-blue-300" />
                    </div>
                  )}
                  {enrolled && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Enrolled
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
                    {course.description || "No description"}
                  </p>

                  {/* Stats & Action */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{course.enrollmentCount || 0} enrolled</span>
                    </div>

                    {enrolled ? (
                      <button
                        onClick={() => handleUnenroll(course.id)}
                        disabled={isProcessing}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        {isProcessing ? "..." : "Leave"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course.id)}
                        disabled={isProcessing}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {isProcessing ? (
                          "..."
                        ) : (
                          <>
                            <LogIn className="w-4 h-4" />
                            Enroll
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      {!isLoading && !error && courses.length > 0 && (
        <p className="text-sm text-gray-500 mt-6">
          {courses.length} course{courses.length === 1 ? "" : "s"} available
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      )}
    </div>
  );
}
