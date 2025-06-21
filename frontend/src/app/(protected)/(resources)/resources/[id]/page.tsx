"use client";
import React from "react";
import { useParams } from "next/navigation";

const ResourceView = () => {
  const { id } = useParams();

  return (
    <>
      <div>
        <p>Resource view for id {id}</p>
      </div>
    </>
  );
};

export default ResourceView;
