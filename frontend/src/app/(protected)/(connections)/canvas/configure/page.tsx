"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useCanvasCourses, useImportCanvasCourses } from "@/hooks/useCanvas";
import { CanvasCourse } from "@/types/canvas";

export default function ConfigureCanvasPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const {
    data: canvasCourses,
    isLoading: fetchingCourses,
    error: fetchError,
    refetch,
  } = useCanvasCourses();
  const importCoursesMutation = useImportCanvasCourses();

  // Selected courses state
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(
    new Set()
  );

  // Toast notification state
  const [toast, setToast] = useState<{
    type: "success" | "warning" | "error";
    message: string;
    visible: boolean;
  }>({ type: "success", message: "", visible: false });

  // Fetch Canvas courses when component mounts
  useEffect(() => {
    if (isLoaded && user) {
      refetch();
    }
  }, [isLoaded, user, refetch]);

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  // Helper function to show toast
  const showToast = (
    type: "success" | "warning" | "error",
    message: string
  ) => {
    setToast({ type, message, visible: true });
  };

  // Handle course selection toggle
  const toggleCourseSelection = (courseId: string) => {
    setSelectedCourses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  // Handle select all / deselect all
  const toggleSelectAll = () => {
    if (!canvasCourses) return;

    if (selectedCourses.size === canvasCourses.length) {
      // Deselect all
      setSelectedCourses(new Set());
    } else {
      // Select all
      setSelectedCourses(
        new Set(canvasCourses.map((course) => course.id.toString()))
      );
    }
  };

  // Handle import selected courses
  const handleImportCourses = async () => {
    if (selectedCourses.size === 0) return;

    try {
      const courseIds = Array.from(selectedCourses).map((id) => parseInt(id));
      const result = await importCoursesMutation.mutateAsync({
        courseIds,
        actualUserId: user?.id,
      });

      if (result && result.length > 0) {
        showToast(
          "success",
          `Successfully imported ${result.length} course${
            result.length !== 1 ? "s" : ""
          }!`
        );

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to import courses:", error);

      // Handle different types of errors gracefully
      const errorMessage =
        error instanceof Error ? error.message : "Failed to import courses";

      if (
        errorMessage.includes("already imported") ||
        errorMessage.includes("Skipped")
      ) {
        // Partial success with some duplicates
        showToast("warning", errorMessage);
      } else {
        // Complete failure
        showToast("error", errorMessage);
      }
    }
  };

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black/[0.96] text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // Show sign-in prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-black/[0.96] text-white flex items-center justify-center">
        <div className="max-w-md bg-gray-800/70 p-8 rounded-xl shadow-xl text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-300 mb-6">
            You need to be signed in to configure Canvas integration.
          </p>
          <button
            onClick={() => router.push("/profile")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/[0.96] text-white px-4 md:px-8 lg:px-16 pt-20 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Toast Notification */}
        {toast.visible && (
          <div
            className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md animate-in slide-in-from-right duration-300 ${
              toast.type === "success"
                ? "bg-green-800 border border-green-600"
                : toast.type === "warning"
                ? "bg-yellow-800 border border-yellow-600"
                : "bg-red-800 border border-red-600"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {toast.type === "success" && (
                  <svg
                    className="w-5 h-5 text-green-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                {toast.type === "warning" && (
                  <svg
                    className="w-5 h-5 text-yellow-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                )}
                {toast.type === "error" && (
                  <svg
                    className="w-5 h-5 text-red-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm ${
                    toast.type === "success"
                      ? "text-green-100"
                      : toast.type === "warning"
                      ? "text-yellow-100"
                      : "text-red-100"
                  }`}
                >
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() =>
                  setToast((prev) => ({ ...prev, visible: false }))
                }
                className={`flex-shrink-0 p-1 rounded ${
                  toast.type === "success"
                    ? "hover:bg-green-700 text-green-200"
                    : toast.type === "warning"
                    ? "hover:bg-yellow-700 text-yellow-200"
                    : "hover:bg-red-700 text-red-200"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.push("/profile")}
              className="p-2 hover:bg-gray-800 rounded-lg transition duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold">Configure Your Courses</h1>
              <p className="text-gray-400 mt-1">
                Select the courses from Canvas you want to manage in AxiomAI.
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {fetchingCourses && (
          <div className="bg-gray-800/70 p-8 rounded-xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading your Canvas courses...</p>
          </div>
        )}

        {/* Error State */}
        {fetchError && (
          <div className="bg-red-800/70 border border-red-600 p-6 rounded-xl mb-6">
            <h3 className="text-lg font-semibold text-red-100 mb-2">
              Failed to Load Courses
            </h3>
            <p className="text-red-200 mb-4">
              We couldn't fetch your Canvas courses. Please check your
              connection and try again.
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* Success State - Course List */}
        {canvasCourses && canvasCourses.length > 0 && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="bg-gray-800/70 p-6 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Available Courses</h2>
                  <p className="text-gray-400 text-sm">
                    {selectedCourses.size} of {canvasCourses.length} courses
                    selected
                  </p>
                </div>
                <button
                  onClick={toggleSelectAll}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition duration-200 text-sm"
                >
                  {selectedCourses.size === canvasCourses.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>
            </div>

            {/* Course List */}
            <div className="space-y-3">
              {canvasCourses.map((course: CanvasCourse) => (
                <div
                  key={course.id}
                  className="bg-gray-800/70 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition duration-200"
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      id={`course-${course.id}`}
                      checked={selectedCourses.has(course.id.toString())}
                      onChange={() =>
                        toggleCourseSelection(course.id.toString())
                      }
                      className="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={`course-${course.id}`}
                        className="cursor-pointer block"
                      >
                        <h3 className="font-semibold text-lg text-white">
                          {course.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-gray-400 text-sm">
                            {course.course_code}
                          </p>
                          <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                            {course.enrollment_state}
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Import Button */}
            <div className="bg-gray-800/70 p-6 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-300">
                    {selectedCourses.size === 0
                      ? "Select courses to import them into AxiomAI"
                      : `Ready to import ${selectedCourses.size} course${
                          selectedCourses.size !== 1 ? "s" : ""
                        }`}
                  </p>
                </div>
                <button
                  onClick={handleImportCourses}
                  disabled={
                    selectedCourses.size === 0 ||
                    importCoursesMutation.isPending
                  }
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white rounded-lg transition duration-200 flex items-center gap-2"
                >
                  {importCoursesMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Importing...
                    </>
                  ) : (
                    <>
                      Add {selectedCourses.size} Selected Course
                      {selectedCourses.size !== 1 ? "s" : ""}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {canvasCourses && canvasCourses.length === 0 && (
          <div className="bg-gray-800/70 p-12 rounded-xl text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No Courses Found</h3>
            <p className="text-gray-400 mb-6">
              We couldn't find any active courses in your Canvas account.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition duration-200"
              >
                Refresh
              </button>
              <button
                onClick={() => router.push("/profile")}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-200"
              >
                Back to Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
