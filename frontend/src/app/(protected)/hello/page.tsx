"use client";
import React, { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useCourses } from "@/hooks/useCourses";
import * as cowsay from "cowsay";

const Page = () => {
  const { isLoaded, userId } = useAuth();
  const { data: courses } = useCourses(userId || "");

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
      <p>{JSON.stringify(userId)}</p>
      <p>{JSON.stringify(courses)}</p>
    </>
  );
};

export default Page;
