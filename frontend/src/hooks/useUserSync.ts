"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { userService, type CreateUserPayload } from "@/services/userService";

interface UserSyncState {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

export function useUserSync() {
  const { user, isLoaded } = useUser();
  const [syncState, setSyncState] = useState<UserSyncState>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const syncUserToDatabase = async () => {
    if (!user) return;

    setSyncState({ isLoading: true, error: null, isSuccess: false });

    const userData: CreateUserPayload = {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || "",
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      name: user.fullName || undefined,
    };

    const result = await userService.syncUser(userData);

    if (result.error) {
      setSyncState({ isLoading: false, error: result.error, isSuccess: false });
    } else {
      setSyncState({ isLoading: false, error: null, isSuccess: true });
      console.log("User synced successfully:", result.data);
    }
  };

  // Auto-sync when user signs in
  useEffect(() => {
    if (isLoaded && user && !syncState.isSuccess && !syncState.isLoading) {
      syncUserToDatabase();
    }
  }, [isLoaded, user, syncState.isSuccess, syncState.isLoading]);

  return {
    ...syncState,
    syncUser: syncUserToDatabase,
  };
}
