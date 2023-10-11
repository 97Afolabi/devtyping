import { useState, useEffect } from "react";

export default function Timer({ isTyping }: { isTyping: boolean }) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (isTyping) {
      const timer = setInterval(() => {
        // Increment seconds
        setSeconds((prevSeconds) => {
          if (prevSeconds === 59) {
            // If seconds reach 59, reset seconds and increment minutes
            setMinutes((prevMinutes) => {
              if (prevMinutes === 59) {
                // If minutes reach 59, reset minutes and increment hours
                setHours((prevHours) => prevHours + 1);
                return 0;
              }
              return prevMinutes + 1;
            });
            return 0;
          }
          return prevSeconds + 1;
        });
      }, 1000);

      return () => clearInterval(timer); // Clean up the timer when the component unmounts
    }
  }, [isTyping]);

  return (
    <div className="float-right border-b-2 border-white bg-slate-900 text-white text-sm font-mono rounded-full px-2">
      {`${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`}
    </div>
  );
}
