'use client';

import React from 'react';

interface CircularProgressProps {
  value: number | undefined | null;
  size?: number;
  strokeWidth?: number;
  isOverall?: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ 
  value, 
  size = 60, 
  strokeWidth = 6,
  isOverall = false
}) => {
  const normalizedValue = value ? Math.max(0, Math.min(1, value)) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const targetOffset = circumference - normalizedValue * circumference;

  // Generate a unique key to force animation restart
  const animationKey = `${size}-${strokeWidth}-${normalizedValue}`;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        className="absolute inset-0 origin-center"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(55, 65, 81, 0.3)" // gray-700 with opacity
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle with animation */}
        <circle
          key={animationKey} // This key forces remount and animation
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={normalizedValue >= 0.7 ? '#10b981' : normalizedValue >= 0.5 ? '#f59e0b' : '#ef4444'} // green, yellow, red based on score
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference} // Start at 0 (empty circle)
          strokeLinecap="round"
          style={{
            strokeDashoffset: targetOffset, // Animate to target value
            transition: 'stroke-dashoffset 0.2s ease-in-out',
            transform: 'rotate(-90deg)', // Start at 12 o'clock
            transformOrigin: 'center',
          }}
        />
      </svg>
      <span className={`absolute font-bold text-white ${isOverall ? 'text-2xl' : 'text-sm'}`}>
        {value !== undefined && value !== null ? Math.round(value * 100) : 0}%
      </span>
    </div>
  );
};

export default CircularProgress;