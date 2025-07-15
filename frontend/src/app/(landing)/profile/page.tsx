"use client";
import {
  useUser,
  SignInButton,
  SignUpButton,
  SignOutButton,
} from "@clerk/nextjs";
import { useUserSync } from "@/hooks/useUserSync";
import React, { useState, useEffect } from "react";
import Link from "next/link";

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

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    academicYear: "",
    academicLevel: "",
    institution: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        academicYear: "2", // Default value
        academicLevel: "Undergraduate", // Default value
        institution: "Northeastern University", // Default value
      });
    }
  }, [user]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setHasChanges(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual profile update API call
    console.log("Saving profile data:", formData);
    setIsEditing(false);
    setHasChanges(false);
    // Here you would typically make an API call to update the user profile
  };

  // Handle cancel editing
  const handleCancel = () => {
    // Reset form data to original values
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        academicYear: "2",
        academicLevel: "Undergraduate",
        institution: "Northeastern University",
      });
    }
    setIsEditing(false);
    setHasChanges(false);
  };

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black/[0.96] text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/[0.96] text-white px-4 md:px-8 lg:px-16 pb-20 pt-35">
      <div className="max-w-4xl mx-auto">
        {/* Header with sign out option */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          {user && (
            <SignOutButton>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200 flex items-center gap-2">
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </button>
            </SignOutButton>
          )}
        </div>

        {/* User sync status - only show when user is signed in */}
        {user && (
          <div className="mb-6">
            {isSyncing && (
              <div className="p-3 bg-blue-800/70 text-blue-100 rounded-lg text-center flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-100"></div>
                Syncing your profile with our database...
              </div>
            )}
            {syncError && (
              <div className="p-3 bg-red-800/70 text-red-100 rounded-lg text-center">
                ❌ Failed to sync profile: {syncError}
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
          <div className="max-w-xl mx-auto bg-gray-800/70 p-8 rounded-xl shadow-xl text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Welcome to AxiomAI</h2>
              <p className="text-gray-300">
                Please sign in to view and manage your profile
              </p>
            </div>
            <div className="space-y-3">
              <SignInButton mode="modal">
                <button className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 font-medium">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 font-medium">
                  Create Account
                </button>
              </SignUpButton>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture and Basic Info */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/70 p-6 rounded-xl shadow-xl">
                <div className="text-center">
                  <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    {user.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        {user.firstName?.charAt(0) ||
                          user.emailAddresses[0]?.emailAddress.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-1">
                    {user.fullName || "Student"}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {user.emailAddresses[0]?.emailAddress}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Member since{" "}
                    {new Date(user.createdAt!).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <Link
                href="/canvas/connect"
                className="block bg-gray-800/70 p-6 rounded-xl shadow-xl mt-6 hover:bg-gray-800/90 transition duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
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
                    <div>
                      <h4 className="font-semibold text-white">
                        Connect Canvas Account
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Sync courses and assignments
                      </p>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
              <div className="bg-gray-800/70 p-6 rounded-xl shadow-xl mt-7">
                Connect Google Calendar
              </div>
            </div>

            {/* Editable Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/70 p-6 rounded-xl shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Profile Information</h3>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-200 flex items-center gap-2"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit Profile
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={user?.emailAddresses[0]?.emailAddress || ""}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-400 focus:outline-none cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed here. Use your Clerk account
                      settings.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                        isEditing
                          ? "bg-gray-900 border-gray-700 text-white"
                          : "bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed"
                      }`}
                      placeholder="Your Full Name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="academicYear"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Academic Year / Grade
                      </label>
                      <input
                        type="text"
                        id="academicYear"
                        name="academicYear"
                        value={formData.academicYear}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                          isEditing
                            ? "bg-gray-900 border-gray-700 text-white"
                            : "bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed"
                        }`}
                        placeholder="e.g., 1, 2, 11, 12"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="academicLevel"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Academic Level
                      </label>
                      <select
                        id="academicLevel"
                        name="academicLevel"
                        value={formData.academicLevel}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                          isEditing
                            ? "bg-gray-900 border-gray-700 text-white"
                            : "bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed"
                        }`}
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
                      value={formData.institution}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                        isEditing
                          ? "bg-gray-900 border-gray-700 text-white"
                          : "bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed"
                      }`}
                      placeholder="Name of your institution"
                    />
                  </div>

                  {/* Show action buttons only when editing */}
                  {isEditing && (
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!hasChanges}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white rounded-lg transition duration-200"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
