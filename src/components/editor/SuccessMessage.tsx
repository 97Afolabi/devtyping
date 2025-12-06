"use client";
import React from "react";

const SuccessMessage = ({ messages }: { messages: string[] }) => {
  return (
    <div className="bg-green-100 text-green-600 p-2 mb-4 rounded-sm">
      {messages.map((error, index) => (
        <p key={index}>{error}</p>
      ))}
    </div>
  );
};

export default SuccessMessage;
