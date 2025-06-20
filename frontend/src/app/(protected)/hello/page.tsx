"use client";
import React from "react";
import { useUser, useAuth, useClerk } from "@clerk/nextjs";

const Page = () => {
  const { user } = useUser();
  const { signOut, isSignedIn, isLoaded } = useAuth();
  const { userId } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <p>Hello</p>
      <p className="font-mono">This is a protected route</p>
      {/* <p>{JSON.stringify(user)}</p> */}
      <p>{JSON.stringify(userId)}</p>
    </>
  );
};

export default Page;
