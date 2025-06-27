import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "../services";
import { queryKeys } from "../lib/query-client";
import { Course, CreateCourseData, UpdateCourseData } from "../types/course";

/**
 * Get all courses for a user
 */
export function useCourses(userId: string) {
  return useQuery({
    queryKey: queryKeys.courses(userId),
    queryFn: () => courseService.getCourses(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => data.sort((a, b) => a.name.localeCompare(b.name)),
  });
}

/**
 * Get a single course by ID
 */
export function useCourse(id: string, userId: string) {
  return useQuery({
    queryKey: queryKeys.course(id, userId),
    queryFn: () => courseService.getCourseById(id, userId),
    enabled: !!id && !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Create a new course
 */
export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseData) => courseService.createCourse(data),

    onSuccess: (createdCourse, variables) => {
      // Update cache and invalidate
      queryClient.setQueryData(
        queryKeys.courses(variables.userId),
        (old: Course[] = []) => [createdCourse, ...old]
      );

      queryClient.invalidateQueries({
        queryKey: queryKeys.courses(variables.userId),
      });
    },
  });
}

/**
 * Update an existing course
 */
export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseData }) =>
      courseService.updateCourse(id, data),

    onSuccess: (updatedCourse, variables) => {
      // Update courses list cache
      queryClient.setQueryData(
        queryKeys.courses(variables.data.userId),
        (old: Course[] = []) =>
          old.map((course) =>
            course.id === variables.id ? updatedCourse : course
          )
      );

      // Update individual course cache
      queryClient.setQueryData(
        queryKeys.course(variables.id, variables.data.userId),
        updatedCourse
      );
    },
  });
}

/**
 * Delete a course
 */
export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      courseService.deleteCourse(id, userId),

    onSuccess: (_, variables) => {
      // Remove from cache
      queryClient.setQueryData(
        queryKeys.courses(variables.userId),
        (old: Course[] = []) =>
          old.filter((course) => course.id !== variables.id)
      );

      // Remove individual course cache
      queryClient.removeQueries({
        queryKey: queryKeys.course(variables.id, variables.userId),
      });
    },
  });
}

/**
 * Prefetch a course
 */
export function usePrefetchCourse() {
  const queryClient = useQueryClient();

  return (id: string, userId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.course(id, userId),
      queryFn: () => courseService.getCourseById(id, userId),
      staleTime: 10 * 60 * 1000,
    });
  };
}
