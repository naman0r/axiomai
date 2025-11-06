"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { canvasService } from "../services";
import { queryKeys } from "../lib/query-client";
import { ConnectCanvasData, ImportCanvasCoursesData } from "../types/canvas";
import { Course } from "../types/course";
import { useUser } from "@clerk/nextjs";

/**
 * Get Canvas connection status
 * Checks if user has connected their Canvas account
 */
export function useCanvasStatus() {
  return useQuery({
    queryKey: queryKeys.canvas.status(),
    queryFn: () => canvasService.getCanvasStatus(),
    staleTime: 5 * 60 * 1000, // Status fresh for 5 minutes
    retry: 1, // Only retry once if it fails
  });
}

/**
 * Connect to Canvas account
 * Stores Canvas credentials and establishes connection
 */
export function useConnectCanvas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConnectCanvasData) => {
      console.log("Connecting to Canvas...");
      return canvasService.connectCanvas(data);
    },

    onSuccess: () => {
      console.log("Canvas connected successfully");

      // Invalidate related queries to refresh UI
      queryClient.invalidateQueries({ queryKey: queryKeys.canvas.status() });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },

    onError: (error) => {
      console.error("Canvas connection failed:", error);
    },
  });
}

/**
 * Disconnect from Canvas account
 * Removes Canvas credentials and connection
 */
export function useDisconnectCanvas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      console.log("Disconnecting from Canvas...");
      return canvasService.disconnectCanvas();
    },

    onSuccess: () => {
      console.log("Canvas disconnected successfully");

      // Invalidate related queries to refresh UI
      queryClient.invalidateQueries({ queryKey: queryKeys.canvas.status() });
      queryClient.invalidateQueries({ queryKey: queryKeys.canvas.courses() });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },

    onError: (error) => {
      console.error("Canvas disconnection failed:", error);
    },
  });
}

/**
 * Fetch Canvas courses
 * Gets list of courses from Canvas (only when explicitly called)
 */
export function useCanvasCourses() {
  const { user } = useUser();
  return useQuery({
    queryKey: queryKeys.canvas.courses(),
    queryFn: () => {
      console.log("Fetching Canvas courses...");
      return canvasService.fetchCanvasCourses(user?.id);
    },
    enabled: false, // Only fetch when explicitly triggered
    staleTime: 10 * 60 * 1000, // Canvas courses fresh for 10 minutes
  });
}

/**
 * Import selected Canvas courses
 * Imports courses from Canvas into AxiomAI
 */
export function useImportCanvasCourses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ImportCanvasCoursesData) => {
      console.log("Importing Canvas courses:", data.courseIds);
      return canvasService.importCanvasCourses(data);
    },

    onSuccess: (importedCourses: Course[]) => {
      console.log(`Successfully imported ${importedCourses.length} courses`);

      // Invalidate courses list to show newly imported courses
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all() });
    },

    onError: (error) => {
      console.error("Canvas course import failed:", error);
    },
  });
}

/**
 * Prefetch Canvas courses
 * Useful for preloading Canvas courses when user opens import dialog
 */
export function usePrefetchCanvasCourses() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.canvas.courses(),
      queryFn: () => canvasService.fetchCanvasCourses(),
      staleTime: 10 * 60 * 1000,
    });
  };
}

export function useIsConnected() {
  const { user } = useUser();
  return useQuery({
    queryKey: [...queryKeys.canvas.isConnected(), user?.id ?? "anon"],
    queryFn: () => canvasService.isConnected(user?.id),
    staleTime: 5 * 60 * 1000, // Connection status fresh for 5 minutes
    retry: 1, // Only retry once if it fails
  });
}
