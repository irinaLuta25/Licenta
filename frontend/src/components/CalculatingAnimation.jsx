import React, { useEffect, useState } from "react";

function CalculatingAnimation({ duration = 3000, onComplete }) {
  const [percentage, setPercentage] = useState(randomPercentage());

  useEffect(() => {
    const interval = setInterval(() => {
      setPercentage(randomPercentage());
    }, 200); 

    const timeout = setTimeout(() => {
      clearInterval(interval);
      onComplete();
    }, duration); 

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [duration, onComplete]);

  function randomPercentage() {
    return Math.floor(Math.random() * 101);
  }

  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <p className="text-lg text-indigo-800 font-medium mb-4 animate-pulse">
        Se caută cele mai bune recomandări pentru tine...
      </p>
      <span className="text-6xl font-bold text-indigo-700 animate-bounce">
        {percentage}%
      </span>
    </div>
  );
}

export default CalculatingAnimation;
