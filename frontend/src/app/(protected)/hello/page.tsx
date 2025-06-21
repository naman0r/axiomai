"use client";
import React from "react";
import { useAuth } from "@clerk/nextjs";

const Page = () => {
  const { isLoaded, userId } = useAuth();

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
