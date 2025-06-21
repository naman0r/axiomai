"use client";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useUserSync } from "@/hooks/useUserSync";

import React from "react";

// Academic levels for select dropdown
const academicLevels = [
  "High School",
  "Undergraduate",
  "Graduate",
  "Postgraduate",
  "Other",
];

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const {
    isLoading: isSyncing,
    error: syncError,
    isSuccess: isSynced,
  } = useUserSync();

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black/[0.96] text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/[0.96] text-white px-4 md:px-8 lg:px-16 pb-20 pt-35">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Profile</h1>

      {/* User sync status - only show when user is signed in */}
      {user && (
        <div className="max-w-xl mx-auto mb-4">
          {isSyncing && (
            <div className="p-3 bg-blue-800/70 text-blue-100 rounded-lg text-center">
              Syncing your profile with our database...
            </div>
          )}
          {syncError && (
            <div className="p-3 bg-red-800/70 text-red-100 rounded-lg text-center">
              Failed to sync profile: {syncError}
            </div>
          )}
          {isSynced && !isSyncing && (
            <div className="p-3 bg-green-800/70 text-green-100 rounded-lg text-center">
              ✅ Profile synced successfully
            </div>
          )}
        </div>
      )}

      {/* Show sign-in buttons if not authenticated */}
      {!user ? (
        <div className="max-w-xl mx-auto bg-gray-800/70 p-6 rounded-lg shadow-xl text-center">
          <p className="mb-6 text-gray-300">
            Please sign in to view your profile
          </p>
          <div className="space-y-4">
            <SignInButton mode="modal">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </div>
      ) : (
        <div className="max-w-xl mx-auto bg-gray-800/70 p-6 rounded-lg shadow-xl">
          {/* --------- Editable Profile Form --------- */}
          <form className="space-y-4">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={user?.emailAddresses[0]?.emailAddress || ""}
                readOnly
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-400 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={user?.fullName || ""}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Your Full Name"
                readOnly
              />
            </div>
            <div>
              <label
                htmlFor="academic_year"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Academic Year / Grade
              </label>
              <input
                type="number"
                id="academic_year"
                name="academic_year"
                value="2"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., 1, 2, 11, 12"
                readOnly
              />
            </div>
            <div>
              <label
                htmlFor="academic_level"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Academic Level
              </label>
              <select
                id="academic_level"
                name="academic_level"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                disabled
                value="Undergraduate"
              >
                <option value="" disabled>
                  Select Level
                </option>
                {academicLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="institution"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                School / University
              </label>
              <input
                type="text"
                id="institution"
                name="institution"
                value="Northeastern University"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Name of your institution"
                readOnly
              />
            </div>
            {/* Optional: error message */}
            {/* <p className="text-red-400 text-sm">Profile error message here</p> */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition duration-200"
                disabled
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
                disabled
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
