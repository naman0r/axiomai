"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useConnectCanvas } from "@/hooks/useCanvas";

// Utility function to validate and normalize Canvas domain
const validateAndNormalizeDomain = (
  domain: string
): { isValid: boolean; normalized?: string; error?: string } => {
  if (!domain.trim()) {
    return { isValid: false, error: "Domain is required" };
  }

  let normalized = domain.trim().toLowerCase();

  // Remove protocol if present
  normalized = normalized.replace(/^https?:\/\//, "");

  // Remove trailing slash if present
  normalized = normalized.replace(/\/$/, "");

  // Basic domain validation - should contain instructure.com or be a valid Canvas domain
  const domainPattern =
    /^[a-z0-9.-]+\.(instructure\.com|canvas\.edu|canvaslms\.com)$/i;

  if (!domainPattern.test(normalized)) {
    return {
      isValid: false,
      error:
        "Please enter a valid Canvas domain (e.g., school.instructure.com)",
    };
  }

  return { isValid: true, normalized };
};

// Utility function to validate Canvas access token
const validateAccessToken = (
  token: string
): { isValid: boolean; error?: string } => {
  if (!token.trim()) {
    return { isValid: false, error: "Access token is required" };
  }

  const trimmed = token.trim();

  // Canvas tokens are typically long alphanumeric strings
  if (trimmed.length < 20) {
    return { isValid: false, error: "Access token appears to be too short" };
  }

  // Basic pattern check - should be alphanumeric with possible special characters
  const tokenPattern = /^[a-zA-Z0-9_~-]+$/;
  if (!tokenPattern.test(trimmed)) {
    return {
      isValid: false,
      error: "Access token contains invalid characters",
    };
  }

  return { isValid: true };
};

export default function ConnectCanvasPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const connectCanvasMutation = useConnectCanvas();

  // Form state
  const [formData, setFormData] = useState({
    domain: "",
    accessToken: "",
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState<{
    domain?: string;
    accessToken?: string;
    general?: string;
  }>({});

  // Handle input changes with real-time validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    // Validate domain
    const domainValidation = validateAndNormalizeDomain(formData.domain);
    if (!domainValidation.isValid) {
      errors.domain = domainValidation.error;
    }

    // Validate access token
    const tokenValidation = validateAccessToken(formData.accessToken);
    if (!tokenValidation.isValid) {
      errors.accessToken = tokenValidation.error;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Normalize domain for submission
    const domainValidation = validateAndNormalizeDomain(formData.domain);
    if (!domainValidation.isValid || !domainValidation.normalized) {
      setValidationErrors({ general: "Invalid domain format" });
      return;
    }

    try {
      await connectCanvasMutation.mutateAsync({
        domain: domainValidation.normalized,
        accessToken: formData.accessToken.trim(),
        actualUserId: user?.id,
      });

      // On success, redirect to configure page
      router.push("/canvas/configure");
    } catch (error) {
      console.error("Canvas connection failed:", error);
      setValidationErrors({
        general:
          "Failed to connect to Canvas. Please check your credentials and try again.",
      });
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
            You need to be signed in to connect your Canvas account.
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
    <div className="min-h-screen bg-black/[0.96] text-white pt-20 px-4 md:px-8 lg:px-16 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Connect Canvas Account</h1>
          <p className="text-gray-300">
            Integrate your Canvas LMS to sync courses, assignments, and grades
            automatically.
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-gray-800/70 p-8 rounded-xl shadow-xl">
          {/* General error message */}
          {validationErrors.general && (
            <div className="mb-6 p-4 bg-red-800/70 border border-red-600 rounded-lg">
              <p className="text-red-100">{validationErrors.general}</p>
            </div>
          )}

          {/* Success message during connection */}
          {connectCanvasMutation.isPending && (
            <div className="mb-6 p-4 bg-blue-800/70 border border-blue-600 rounded-lg flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-100"></div>
              <p className="text-blue-100">Connecting to Canvas...</p>
            </div>
          )}

          {/* Instructions */}
          <div className="mb-8 p-4 bg-gray-700/50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
            <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
              <li>
                Enter your Canvas domain (e.g.,{" "}
                <code className="bg-gray-600 px-1 rounded">
                  school.instructure.com
                </code>
                )
              </li>
              <li>
                Generate an access token in Canvas: Account → Settings →
                Approved Integrations → New Access Token
              </li>
              <li>Copy and paste the token below</li>
            </ol>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Canvas Domain Field */}
            <div>
              <label
                htmlFor="domain"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Canvas Domain <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="domain"
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ${
                  validationErrors.domain
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-700"
                }`}
                placeholder="school.instructure.com"
                disabled={connectCanvasMutation.isPending}
              />
              {validationErrors.domain && (
                <p className="mt-2 text-sm text-red-400">
                  {validationErrors.domain}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Do not include "https://" or trailing slashes
              </p>
            </div>

            {/* Access Token Field */}
            <div>
              <label
                htmlFor="accessToken"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Canvas Access Token <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                id="accessToken"
                name="accessToken"
                value={formData.accessToken}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ${
                  validationErrors.accessToken
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-700"
                }`}
                placeholder="Enter your Canvas access token"
                disabled={connectCanvasMutation.isPending}
              />
              {validationErrors.accessToken && (
                <p className="mt-2 text-sm text-red-400">
                  {validationErrors.accessToken}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Your token will be encrypted and stored securely
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition duration-200 disabled:opacity-50"
                disabled={connectCanvasMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition duration-200 disabled:cursor-not-allowed"
                disabled={
                  connectCanvasMutation.isPending ||
                  !formData.domain.trim() ||
                  !formData.accessToken.trim()
                }
              >
                {connectCanvasMutation.isPending
                  ? "Connecting..."
                  : "Connect Canvas Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
