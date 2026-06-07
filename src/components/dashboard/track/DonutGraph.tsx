import React, { useEffect, useState } from "react";

interface DonutGraphProps {
  percentage: number; // Value from 0 to 100
  size?: number;      // Overall width/height in pixels
  strokeWidth?: number; // Thickness of the donut ring
  textSize?: number;
}

const DonutGraph = ({
  percentage = 0,
  size = 120,
  strokeWidth = 1.5, // Keeps the edge thin
  textSize=12
}: DonutGraphProps) => {
  // Clamp percentage between 0 and 100
  const validPercentage = Math.max(0, Math.min(100, percentage));
  
  // SVG Geometry configuration
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // State to handle smooth entrance animation on mount
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    // Calculate the missing chunk to reveal progress
    const progressOffset = circumference - (validPercentage / 100) * circumference;
    setOffset(progressOffset);
  }, [validPercentage, circumference]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90 transform" // Rotates SVG so progress starts from the top 12 o'clock position
      >
        {/* Background Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-white/10 fill-transparent light:stroke-black/10"
          strokeWidth={strokeWidth}
        />
        
        {/* Animated Green Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-darkSuccess fill-transparent transition-all duration-1000 ease-out" // Gives it the smooth transition
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round" // Smooth rounded edges on progress tips
        />
      </svg>

      {/* Centered Percentage Label */}
      {/* <div className="absolute flex flex-col items-center justify-center">
        <span className="text-gray-500 light:text-gray-800" style={{ fontSize: `${textSize}px` }}>{validPercentage}%</span>
      </div> */}
    </div>
  );
};

export default DonutGraph;
