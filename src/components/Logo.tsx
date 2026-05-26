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
          <line x1="116" y1="182" x2="396" y2="182" stroke="black" stroke-width="14" stroke-linecap="round" />
          <rect x="170" y="300" width="36" height="80" rx="10" fill="black" />
          <rect x="238" y="250" width="36" height="130" rx="10" fill="black" />
          <rect x="306" y="200" width="36" height="180" rx="10" fill="black" />
        </mask>
      </defs>

      <g mask="url(#logoMaskReact)">
        <path
          d="M 186 142 C 186 72, 326 72, 326 142"
          fill="none"
          stroke="currentColor"
          strokeWidth="26"
          strokeLinecap="round"
        />
        <rect x="116" y="142" width="280" height="280" rx="48" fill="currentColor" />
        <rect x="86" y="202" width="30" height="160" rx="10" fill="currentColor" />
        <rect x="396" y="202" width="30" height="160" rx="10" fill="currentColor" />
      </g>
    </svg>
  );
};
