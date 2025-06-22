"use client";
import React from "react";
import { useAuth } from "@clerk/nextjs";
import { useCourses, useCreateCourse } from "@/hooks/useCourses";

const Page = () => {
  const { isLoaded, userId } = useAuth();
  const { data: courses, isLoading, error } = useCourses(userId || "");

  const createCourse = useCreateCourse(); // can call createCourse.mutate()
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
