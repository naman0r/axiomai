import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "../services"; // small c, means the instance of CourseService....
import { queryKeys } from "../lib/query-client";
import { Course, CreateCourseData, UpdateCourseData } from "../types/course";

/**
 * Get all courses for a user
 * Automatically caches results and handles loading/error states
 */
export function useCourses(userId: string) {
  return useQuery({
    queryKey: queryKeys.courses.list(userId),
    queryFn: () => courseService.getCourses(userId),
    enabled: !!userId, // Only run query if userId is provided
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    select: (data) => {
      // Sort courses by name for consistent ordering
      return data.sort((a, b) => a.name.localeCompare(b.name));
    },
  });
}

/**
 * Get a single course by ID
 * Useful for course detail pages or when you need specific course data
 */
export function useCourse(id: string, userId: string) {
  return useQuery({
    queryKey: queryKeys.courses.detail(id, userId),
    queryFn: () => courseService.getCourseById(id, userId),
    enabled: !!id && !!userId, // Only run if both IDs are provided
    staleTime: 10 * 60 * 1000, // Course details stay fresh longer
  });
}

/**
 * Create a new course
 * Handles optimistic updates and cache invalidation
 */
export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseData) => {
      console.log("Creating course mutation triggered");
      return courseService.createCourse(data);
    },

    onMutate: async (newCourse: CreateCourseData) => {
      console.log("Optimistic update: Adding course to cache");

      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: queryKeys.courses.list(newCourse.userId),
      });

      // Snapshot the previous value
      const previousCourses = queryClient.getQueryData(
        queryKeys.courses.list(newCourse.userId)
      );

      // Optimistically update to the new value
      if (previousCourses) {
        const optimisticCourse: Course = {
          id: `temp-${Date.now()}`, // Temporary ID
          ...newCourse,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        queryClient.setQueryData(
          queryKeys.courses.list(newCourse.userId),
          (old: Course[] = []) => [optimisticCourse, ...old]
        );
      }

      // Return a context object with the snapshotted value
      return { previousCourses, newCourse };
    },

    onError: (error, newCourse, context) => {
      console.error("Course creation failed, reverting optimistic update");

      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCourses) {
        queryClient.setQueryData(
          queryKeys.courses.list(newCourse.userId),
          context.previousCourses
        );
      }
    },

    onSuccess: (createdCourse, variables) => {
      console.log("Course created successfully:", createdCourse.name);

      // Update the cache with the real course data from server
      queryClient.setQueryData(
        queryKeys.courses.list(variables.userId),
        (old: Course[] = []) => {
          // Remove the optimistic entry and add the real one
          const withoutOptimistic = old.filter(
            (course) => !course.id.startsWith("temp-")
          );
          return [createdCourse, ...withoutOptimistic];
        }
      );

      // Invalidate and refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.list(variables.userId),
      });
    },

    onSettled: (data, error, variables) => {
      // Always refetch after error or success to ensure consistency
      console.log("Refetching courses after mutation");
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.list(variables.userId),
      });
    },
  });
}

/**
 * Update an existing course
 * Handles cache updates and optimistic updates
 */
export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseData }) => {
      console.log("Updating course mutation triggered:", id);
      return courseService.updateCourse(id, data);
    },

    onMutate: async ({ id, data }) => {
      console.log("Optimistic update: Updating course in cache");

      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.courses.list(data.userId),
      });
      await queryClient.cancelQueries({
        queryKey: queryKeys.courses.detail(id, data.userId),
      });

      // Snapshot previous values
      const previousCourses = queryClient.getQueryData(
        queryKeys.courses.list(data.userId)
      );
      const previousCourse = queryClient.getQueryData(
        queryKeys.courses.detail(id, data.userId)
      );

      // Optimistically update courses list
      queryClient.setQueryData(
        queryKeys.courses.list(data.userId),
        (old: Course[] = []) =>
          old.map((course) =>
            course.id === id
              ? { ...course, ...data, updatedAt: new Date().toISOString() }
              : course
          )
      );

      // Optimistically update individual course
      if (previousCourse) {
        queryClient.setQueryData(
          queryKeys.courses.detail(id, data.userId),
          (old: Course) => ({
            ...old,
            ...data,
            updatedAt: new Date().toISOString(),
          })
        );
      }

      return { previousCourses, previousCourse, id, data };
    },

    onError: (error, variables, context) => {
      console.error("Course update failed, reverting optimistic update");

      // Revert optimistic updates
      if (context?.previousCourses) {
        queryClient.setQueryData(
          queryKeys.courses.list(context.data.userId),
          context.previousCourses
        );
      }
      if (context?.previousCourse) {
        queryClient.setQueryData(
          queryKeys.courses.detail(context.id, context.data.userId),
          context.previousCourse
        );
      }
    },

    onSuccess: (updatedCourse, variables) => {
      console.log("Course updated successfully:", updatedCourse.name);

      // Update caches with real data from server
      queryClient.setQueryData(
        queryKeys.courses.list(variables.data.userId),
        (old: Course[] = []) =>
          old.map((course) =>
            course.id === variables.id ? updatedCourse : course
          )
      );

      queryClient.setQueryData(
        queryKeys.courses.detail(variables.id, variables.data.userId),
        updatedCourse
      );
    },

    onSettled: (data, error, variables) => {
      // Ensure cache consistency
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.list(variables.data.userId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.detail(variables.id, variables.data.userId),
      });
    },
  });
}

/**
 * Delete a course
 * Handles optimistic removal from cache
 */
export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) => {
      console.log("Deleting course mutation triggered:", id);
      return courseService.deleteCourse(id, userId);
    },

    onMutate: async ({ id, userId }) => {
      console.log("Optimistic update: Removing course from cache");

      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.courses.list(userId),
      });

      // Snapshot the previous value
      const previousCourses = queryClient.getQueryData(
        queryKeys.courses.list(userId)
      );

      // Optimistically remove from cache
      queryClient.setQueryData(
        queryKeys.courses.list(userId),
        (old: Course[] = []) => old.filter((course) => course.id !== id)
      );

      return { previousCourses, id, userId };
    },

    onError: (error, variables, context) => {
      console.error("Course deletion failed, reverting optimistic update");

      // Revert the optimistic update
      if (context?.previousCourses) {
        queryClient.setQueryData(
          queryKeys.courses.list(context.userId),
          context.previousCourses
        );
      }
    },

    onSuccess: (_, variables) => {
      console.log("Course deleted successfully:", variables.id);

      // Remove individual course from cache
      queryClient.removeQueries({
        queryKey: queryKeys.courses.detail(variables.id, variables.userId),
      });
    },

    onSettled: (data, error, variables) => {
      // Ensure cache consistency
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.list(variables.userId),
      });
    },
  });
}

/**
 * Utility hook to prefetch course data
 * Useful for improving perceived performance
 */
export function usePrefetchCourse() {
  const queryClient = useQueryClient();

  return {
    prefetchCourse: (id: string, userId: string) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.courses.detail(id, userId),
        queryFn: () => courseService.getCourseById(id, userId),
        staleTime: 10 * 60 * 1000,
      });
    },

    prefetchCourses: (userId: string) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.courses.list(userId),
        queryFn: () => courseService.getCourses(userId),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
