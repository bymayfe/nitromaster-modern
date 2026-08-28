import React from "react";

export const NitroLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Core Nitro Gradient */}
        <linearGradient id="nitroGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff2e4d" />
          <stop offset="50%" stopColor="#ff0055" />
          <stop offset="100%" stopColor="#9900ff" />
        </linearGradient>

        <linearGradient id="cyberCyan" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00e5ff" />
          <stop offset="100%" stopColor="#ff2e4d" />
        </linearGradient>

        <filter id="nitroShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ff2e4d" floodOpacity="0.8" />
        </filter>
      </defs>

      {/* Outer Cyber Shield Frame */}
      <path
        d="M 50 4 L 90 22 L 90 60 L 50 96 L 10 60 L 10 22 Z"
        fill="#0b0f17"
        stroke="url(#nitroGlow)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Inner Accent Cyber Wings */}
      <path
        d="M 50 12 L 82 27 L 82 56 L 50 86 L 18 56 L 18 27 Z"
        fill="none"
        stroke="rgba(255, 255, 255, 0.08)"
        strokeWidth="1.5"
      />

      {/* Bold Stylized Futuristic 'N' Apex Core */}
      <path
        d="M 28 72 L 28 28 L 42 28 L 60 58 L 60 28 L 72 28 L 72 72 L 58 72 L 40 42 L 40 72 Z"
        fill="url(#nitroGlow)"
        filter="url(#nitroShadow)"
      />

      {/* Central Cyber Diamond Core */}
      <polygon points="50,44 56,50 50,56 44,50" fill="#00e5ff" />

      {/* Top Laser Slash Accent */}
      <path d="M 32 18 L 68 18" stroke="#00e5ff" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
};
