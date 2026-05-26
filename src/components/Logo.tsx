import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className, size = 32 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id="logoAccentGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>

      {/* Handle */}
      <path
        d="M 206 180 C 206 135, 306 135, 306 180"
        fill="none"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
      />

      {/* Main Box */}
      <rect
        x="156"
        y="180"
        width="200"
        height="200"
        rx="36"
        fill="none"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Left Pocket */}
      <rect
        x="136"
        y="225"
        width="20"
        height="110"
        rx="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Pocket */}
      <rect
        x="356"
        y="225"
        width="20"
        height="110"
        rx="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Stats Bars */}
      <rect x="186" y="296" width="28" height="60" rx="8" fill="url(#logoAccentGrad)" />
      <rect x="242" y="256" width="28" height="100" rx="8" fill="url(#logoAccentGrad)" />
      <rect x="298" y="216" width="28" height="140" rx="8" fill="url(#logoAccentGrad)" />

      {/* Line Chart */}
      <path
        d="M 200 281 L 256 241 L 312 201 L 348 161"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Vertices */}
      <circle cx="200" cy="281" r="9" fill="currentColor" />
      <circle cx="256" cy="241" r="9" fill="currentColor" />
      <circle cx="312" cy="201" r="9" fill="currentColor" />
      <circle cx="348" cy="161" r="9" fill="currentColor" />
    </svg>
  );
};
