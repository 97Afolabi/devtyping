"use client";
import React from "react";

const ValidationError = ({ errors }: { errors: string[] }) => {
  return (
    <div className="bg-pink-100 text-red-600 p-2 mb-4 rounded-sm">
      {errors.map((error, index) => (
        <p key={index}>{error}</p>
      ))}
    </div>
  );
};

export default ValidationError;
