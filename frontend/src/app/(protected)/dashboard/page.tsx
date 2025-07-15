"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  useCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from "@/hooks/useCourses";
import type {
  CreateCourseData,
  UpdateCourseData,
  Course,
} from "@/types/course";

const Dashboard = () => {
  const { user } = useUser();
  const userId = user?.id;

  // Simple React state for UI management
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Hooks for CRUD operations
  const { data: courses, isLoading, error } = useCourses(userId || "");
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const [formData, setFormData] = useState<CreateCourseData>({
    name: "",
    code: "",
    instructor: "",
    description: "",
    userId: userId || "",
  });

  // Simple handlers for modal management
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    setEditingCourse(null);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    resetForm();
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setIsCreateModalOpen(false);
    setFormData({
      name: course.name,
      code: course.code,
      instructor: course.instructor,
      description: course.description || "",
      userId: userId || "",
    });
  };

  const closeEditModal = () => {
    setEditingCourse(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      instructor: "",
      description: "",
      userId: userId || "",
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      await createCourse.mutateAsync({
        ...formData,
        userId,
      });
      closeCreateModal();
    } catch (error) {
      console.error("Failed to create course:", error);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !editingCourse) return;

    try {
      const updateData: UpdateCourseData = {
        name: formData.name,
        code: formData.code,
        instructor: formData.instructor,
        description: formData.description,
        userId,
      };
      await updateCourse.mutateAsync({
        id: editingCourse.id,
        data: updateData,
      });
      closeEditModal();
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };

  const handleDelete = async (courseId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) return;

    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse.mutateAsync({ id: courseId, userId });
      } catch (error) {
        console.error("Failed to delete course:", error);
      }
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-black/[0.96] text-white flex justify-center items-center">
        <div>Please sign in to manage courses.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black/[0.96] text-white flex justify-center items-center">
        <div>Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black/[0.96] text-red-500 flex flex-col justify-center items-center p-8">
        <p>Error loading courses: {error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/[0.96] text-white pt-20 px-4 md:px-8 lg:px-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Courses</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-200 shadow-lg"
        >
          + Add New Course
        </button>
      </div>

      {courses?.length === 0 && !isLoading ? (
        <div className="text-center py-10 px-6 bg-gray-800/40 rounded-lg shadow-md">
          <h2 className="text-xl text-gray-300 mb-4">No courses added yet.</h2>
          <p className="text-gray-400 mb-6">
            Get started by adding your first course!
          </p>
          <button
            onClick={openCreateModal}
            className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-200 shadow-lg text-lg font-semibold"
          >
            Add Your First Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <Link href={`/classes/${course.id}`} key={course.id}>
              <div
                key={course.id}
                className="bg-gray-800/70 p-5 h-full rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-shadow duration-300 border border-transparent hover:border-indigo-600/50 cursor-pointer flex flex-col justify-between relative group"
              >
                <div>
                  <h3
                    className="text-xl font-semibold text-white mb-2 truncate"
                    title={course.name}
                  >
                    {course.name}
                  </h3>
                  {course.code && (
                    <p className="text-sm text-indigo-300 mb-1">
                      Code: {course.code}
                    </p>
                  )}
                  {course.instructor && (
                    <p className="text-sm text-gray-400 mb-3">
                      Instructor: {course.instructor}
                    </p>
                  )}
                  {course.description && (
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                      {course.description}
                    </p>
                  )}
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-xs text-gray-500">
                    Created: {new Date(course.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openEditModal(course);
                      }}
                      className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => handleDelete(course.id, e)}
                      disabled={deleteCourse.isPending}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs rounded transition-colors"
                    >
                      {deleteCourse.isPending ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Course Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Create New Course
            </h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Course Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                  placeholder="Enter course name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="e.g., CS101, MATH201"
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Instructor *
                </label>
                <input
                  type="text"
                  required
                  value={formData.instructor}
                  onChange={(e) =>
                    setFormData({ ...formData, instructor: e.target.value })
                  }
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                  placeholder="Enter instructor name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                  placeholder="Enter course description"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={createCourse.isPending}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-md transition-colors font-medium"
                >
                  {createCourse.isPending ? "Creating..." : "Create Course"}
                </button>
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Edit Course
            </h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Course Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Instructor *
                </label>
                <input
                  type="text"
                  required
                  value={formData.instructor}
                  onChange={(e) =>
                    setFormData({ ...formData, instructor: e.target.value })
                  }
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={updateCourse.isPending}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-md transition-colors font-medium"
                >
                  {updateCourse.isPending ? "Updating..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
