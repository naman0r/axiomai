"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
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

const Resources = () => {
  const { user } = useUser();
  const userId = user?.id;

  // Simple React state for UI management
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Hooks for CRUD operations
  const { data: courses, isLoading, error } = useCourses(userId || "");
  // aliasing the `data` returned by the useCourses hook as courses
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
    setEditingCourse(null); // Ensure edit is closed
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    resetForm();
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setIsCreateModalOpen(false); // Ensure create is closed
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
        // this is what is expected of type CreateCourseData...
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

  const handleDelete = async (courseId: string) => {
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
      <div className="p-8">
        <div>Please sign in to manage courses.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading courses: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Course Management</h1>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Create New Course
        </button>
      </div>

      {/* Create Course Form */}
      {isCreateModalOpen && (
        <div className="mb-8 bg-gray-50 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Create New Course</h2>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Code *
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="e.g., CS101, MATH201"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructor *
              </label>
              <input
                type="text"
                required
                value={formData.instructor}
                onChange={(e) =>
                  setFormData({ ...formData, instructor: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={createCourse.isPending}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md transition-colors"
              >
                {createCourse.isPending ? "Creating..." : "Create Course"}
              </button>
              <button
                type="button"
                onClick={closeCreateModal}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Courses List */}
      <div className="space-y-4">
        {courses?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No courses found. Create your first course to get started!
          </div>
        ) : (
          courses?.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              {editingCourse?.id === course.id ? (
                // Edit Form
                <form onSubmit={handleUpdateSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instructor *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.instructor}
                      onChange={(e) =>
                        setFormData({ ...formData, instructor: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={updateCourse.isPending}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      {updateCourse.isPending ? "Updating..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                // Display Course
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {course.name}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        <span className="font-medium">{course.code}</span> •{" "}
                        {course.instructor}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(course)}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        disabled={deleteCourse.isPending}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-3 py-1 rounded-md text-sm transition-colors"
                      >
                        {deleteCourse.isPending ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                  {course.description && (
                    <p className="text-gray-700 mb-4">{course.description}</p>
                  )}
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>
                      Created: {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      Updated: {new Date(course.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Resources;
