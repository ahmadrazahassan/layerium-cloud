"use client";

import { memo } from "react";

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

// Memoized for performance - prevents re-renders
export const LayeriumLogo = memo(function LayeriumLogo({ 
  size = 28, 
  className = "",
  showText = false 
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Inline SVG for instant rendering - no network request */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 36 36" 
        fill="none"
        aria-label="Layerium Cloud logo"
        role="img"
      >
        {/* Bottom layer - most transparent */}
        <path 
          d="M4 24L18 32L32 24" 
          stroke="#ff5533" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          opacity="0.3"
        />
        {/* Middle layer */}
        <path 
          d="M4 18L18 26L32 18" 
          stroke="#ff5533" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          opacity="0.6"
        />
        {/* Top layer - solid */}
        <path 
          d="M4 12L18 20L32 12L18 4L4 12Z" 
          fill="#ff5533" 
          stroke="#ff5533" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      {showText && (
        <span className="font-google-sans font-semibold text-[15px] text-dark tracking-tight">
          Layerium
        </span>
      )}
    </div>
  );
});

// Icon-only version for favicon/small contexts
export const LayeriumIcon = memo(function LayeriumIcon({ 
  size = 32,
  className = "" 
}: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 36 36" 
      fill="none"
      className={className}
    >
      <path d="M4 24L18 32L32 24" stroke="#ff5533" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
      <path d="M4 18L18 26L32 18" stroke="#ff5533" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
      <path d="M4 12L18 20L32 12L18 4L4 12Z" fill="#ff5533" stroke="#ff5533" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
});

export default LayeriumLogo;
