import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes - cache garbage collection time
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes("4")) {
          return false;
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
      refetchOnWindowFocus: false, // Don't refetch when window gains focus
      refetchOnReconnect: true, // Refetch when connection is restored
    },
    mutations: {
      retry: 1, // Retry mutations once on failure
    },
  },
});

// Query key factory for consistent cache management
export const queryKeys = {
  // Course-related query keys
  courses: {
    all: () => ["courses"] as const,
    lists: () => [...queryKeys.courses.all(), "list"] as const,
    list: (userId: string) => [...queryKeys.courses.lists(), userId] as const,
    details: () => [...queryKeys.courses.all(), "detail"] as const,
    detail: (id: string, userId: string) =>
      [...queryKeys.courses.details(), id, userId] as const,
  },
  // Canvas-related query keys
  canvas: {
    all: () => ["canvas"] as const,
    status: () => [...queryKeys.canvas.all(), "status"] as const,
    courses: () => [...queryKeys.canvas.all(), "courses"] as const,
    isConnected: () => [...queryKeys.canvas.all(), "isConnected"] as const,
  },

  // User-related query keys
  user: {
    all: () => ["user"] as const,
    profile: () => [...queryKeys.user.all(), "profile"] as const,
  },

  // Future: Add other domains here
  // assignments: { ... },
  // users: { ... },
} as const;
