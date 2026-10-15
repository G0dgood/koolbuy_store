"use client";

import React from "react";

export const EmptySavedIllustration: React.FC<{ className?: string }> = ({
  className = "w-48 h-40 md:w-56 md:h-44",
}) => {
  return (
    <svg
      viewBox="0 0 280 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Soft Radial Ambient Glow */}
        <radialGradient
          id="savedGlow"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(140 115) scale(95 85)"
        >
          <stop stopColor="#F57E16" stopOpacity="0.14" />
          <stop offset="0.65" stopColor="#F57E16" stopOpacity="0.03" />
          <stop offset="1" stopColor="#F57E16" stopOpacity="0" />
        </radialGradient>

        {/* Base Ground Ellipse */}
        <radialGradient
          id="savedGround"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(140 188) scale(75 12)"
        >
          <stop stopColor="#1C1C1E" stopOpacity="0.1" />
          <stop offset="0.75" stopColor="#1C1C1E" stopOpacity="0.02" />
          <stop offset="1" stopColor="#1C1C1E" stopOpacity="0" />
        </radialGradient>

        {/* Bookmark Ribbon Gradient */}
        <linearGradient
          id="ribbonGrad"
          x1="120"
          y1="50"
          x2="160"
          y2="165"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F57E16" />
          <stop offset="1" stopColor="#E06500" />
        </linearGradient>

        {/* Card Background Gradient */}
        <linearGradient
          id="cardGrad"
          x1="80"
          y1="60"
          x2="200"
          y2="180"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F9FAFB" />
        </linearGradient>

        {/* Badge Fill */}
        <linearGradient
          id="heartBadgeGrad"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop stopColor="#FFF7ED" />
          <stop offset="1" stopColor="#FFEDD5" />
        </linearGradient>
      </defs>

      {/* Ambient Glow */}
      <circle cx="140" cy="115" r="90" fill="url(#savedGlow)" />

      {/* Ground Shadow */}
      <ellipse cx="140" cy="188" rx="75" ry="10" fill="url(#savedGround)" />

      {/* Decorative Sparkles & Dots */}
      {/* Top Left Sparkle */}
      <path
        d="M68 62L70 68L76 70L70 72L68 78L66 72L60 70L66 68L68 62Z"
        fill="#F57E16"
        fillOpacity="0.75"
      />
      {/* Top Right Sparkle */}
      <path
        d="M214 48L216.5 55L223.5 57.5L216.5 60L214 67L211.5 60L204.5 57.5L211.5 55L214 48Z"
        fill="#FB923C"
        fillOpacity="0.8"
      />
      {/* Floating Circles */}
      <circle cx="78" cy="132" r="3" fill="#FDBA74" fillOpacity="0.6" />
      <circle cx="218" cy="120" r="2.5" fill="#FDBA74" fillOpacity="0.5" />
      <circle cx="188" cy="38" r="3.5" fill="#F57E16" fillOpacity="0.3" />

      {/* Main Base Card / Notepad Outline */}
      <rect
        x="84"
        y="58"
        width="112"
        height="124"
        rx="18"
        fill="url(#cardGrad)"
        stroke="#E5E7EB"
        strokeWidth="2"
        filter="drop-shadow(0 6px 16px rgba(0,0,0,0.04))"
      />

      {/* Subtle Card Grid Lines */}
      <line
        x1="102"
        y1="92"
        x2="128"
        y2="92"
        stroke="#E5E7EB"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="102"
        y1="108"
        x2="178"
        y2="108"
        stroke="#F3F4F6"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="102"
        y1="124"
        x2="162"
        y2="124"
        stroke="#F3F4F6"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="102"
        y1="140"
        x2="172"
        y2="140"
        stroke="#F3F4F6"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="102"
        y1="156"
        x2="145"
        y2="156"
        stroke="#F3F4F6"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Primary Bookmark Ribbon */}
      <path
        d="M142 42V142L158 128L174 142V42C174 38.7 171.3 36 168 36H148C144.7 36 142 38.7 142 42Z"
        fill="url(#ribbonGrad)"
        filter="drop-shadow(0 4px 10px rgba(245,126,22,0.32))"
      />

      {/* Inner Heart Emblem on Ribbon */}
      <path
        d="M158 72C158 67 154 63 149 63C146.5 63 144.3 64.2 143 66C141.7 64.2 139.5 63 137 63C132 63 128 67 128 72C128 79 137 86.5 143 91C149 86.5 158 79 158 72Z"
        fill="none"
      />
      {/* Heart inside bookmark ribbon */}
      <path
        d="M158 80C158 76.5 155.2 73.7 151.7 73.7C149.9 73.7 148.4 74.5 147.5 75.8C146.6 74.5 145.1 73.7 143.3 73.7C139.8 73.7 137 76.5 137 80C137 84.9 143.3 90.1 147.5 93.3C151.7 90.1 158 84.9 158 80Z"
        transform="translate(10.5, -4)"
        fill="#FFFFFF"
        fillOpacity="0.95"
      />

      {/* Floating Mini Bookmark / Tag Badge */}
      <g transform="translate(86, 126) rotate(-10)">
        <rect
          x="0"
          y="0"
          width="28"
          height="34"
          rx="7"
          fill="url(#heartBadgeGrad)"
          stroke="#FDBA74"
          strokeWidth="1.2"
          filter="drop-shadow(0 2px 6px rgba(245,126,22,0.12))"
        />
        {/* Bookmark Notch icon */}
        <path
          d="M8 8H20V26L14 22L8 26V8Z"
          fill="#F57E16"
          fillOpacity="0.75"
        />
      </g>
    </svg>
  );
};
