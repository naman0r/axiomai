"use client";
import React, { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import * as cowsay from "cowsay";
import { useIsConnected } from "@/hooks/useCanvas";

const Page = () => {
  const { isLoaded } = useAuth();

  const isConnected = useIsConnected();

  useEffect(() => {
    console.log(cowsay.say({ text: "Hello, world!" }));
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <p>Hello</p>
      <p className="font-mono">This is a protected route</p>
      {/* <p>{JSON.stringify(user)}</p> */}
      {/* <p>{JSON.stringify(userId)}</p>
      <p>{JSON.stringify(courses)}</p> */}
      <p>{JSON.stringify(isConnected)}</p>
    </>
  );
};

export default Page;
