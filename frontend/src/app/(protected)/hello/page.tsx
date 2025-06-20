"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";

const page = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  return (
    <>
      <p>Hello</p>
      <p className="font-mono">This is a protected route</p>
      <p>{JSON.stringify(user)}</p>
    </>
  );
};

export default page;
