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
        <mask id="logoMaskReact">
          <rect width="512" height="512" fill="white" />
          <line x1="166" y1="212" x2="346" y2="212" stroke="black" stroke-width="10" stroke-linecap="round" />
          <rect x="200" y="285" width="24" height="50" rx="6" fill="black" />
          <rect x="244" y="250" width="24" height="85" rx="6" fill="black" />
          <rect x="288" y="215" width="24" height="120" rx="6" fill="black" />
        </mask>
      </defs>

      <g mask="url(#logoMaskReact)">
        <path
          d="M 216 185 C 216 135, 296 135, 296 185"
          fill="none"
          stroke="currentColor"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <rect x="166" y="185" width="180" height="180" rx="30" fill="currentColor" />
        <rect x="146" y="225" width="20" height="100" rx="6" fill="currentColor" />
        <rect x="346" y="225" width="20" height="100" rx="6" fill="currentColor" />
      </g>
    </svg>
  );
};
