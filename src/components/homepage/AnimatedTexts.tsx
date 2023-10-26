"use client";
import { useState, useEffect } from "react";
import "../../app/globals.css";

const sentences = [
  "Learn something new",
  "Practise concepts",
  "Prepare for interviews",
  "Escape boring meetings",
  "Share knowledge",
];

function AnimatedTexts() {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  const nextSentence = () => {
    setCurrentSentenceIndex((prevIndex) => (prevIndex + 1) % sentences.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSentence, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="moving-text mt-3 font-bold text-lg text-bold text-gray-900">
      {sentences.map((sentence, index) => (
        <div
          key={index}
          className={`text ${currentSentenceIndex === index ? "visible" : ""}`}
        >
          {sentence}
        </div>
      ))}
    </div>
  );
}

export default AnimatedTexts;
