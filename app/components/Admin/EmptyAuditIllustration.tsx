"use client";

import React from "react";

export const EmptyAuditIllustration: React.FC<{ className?: string }> = ({
  className = "w-48 h-36",
}) => {
  return (
    <svg
      viewBox="0 0 260 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Soft Radial Ambient Glow */}
        <radialGradient
          id="auditGlow"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(130 100) scale(90 75)"
        >
          <stop stopColor="#F57E16" stopOpacity="0.12" />
          <stop offset="0.7" stopColor="#F57E16" stopOpacity="0.02" />
          <stop offset="1" stopColor="#F57E16" stopOpacity="0" />
        </radialGradient>

        {/* Ground Shadow */}
        <radialGradient
          id="auditGround"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(130 172) scale(75 10)"
        >
          <stop stopColor="#1C1C1E" stopOpacity="0.1" />
          <stop offset="0.8" stopColor="#1C1C1E" stopOpacity="0.01" />
          <stop offset="1" stopColor="#1C1C1E" stopOpacity="0" />
        </radialGradient>

        {/* Clipboard Gradient */}
        <linearGradient
          id="clipboardGrad"
          x1="80"
          y1="40"
          x2="180"
          y2="165"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F8FAFC" />
        </linearGradient>

        {/* Magnifying Glass Gradient */}
        <linearGradient
          id="glassGrad"
          x1="125"
          y1="75"
          x2="175"
          y2="125"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFF7ED" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFEDD5" stopOpacity="0.75" />
        </linearGradient>
      </defs>

      {/* Ambient Glow */}
      <circle cx="130" cy="100" r="85" fill="url(#auditGlow)" />

      {/* Ground Shadow */}
      <ellipse cx="130" cy="172" rx="70" ry="8" fill="url(#auditGround)" />

      {/* Background Decorative Sparkles */}
      <path
        d="M62 58L64 64L70 66L64 68L62 74L60 68L54 66L60 64L62 58Z"
        fill="#F57E16"
        fillOpacity="0.65"
      />
      <path
        d="M196 46L198 52L204 54L198 56L196 62L194 56L188 54L194 52L196 46Z"
        fill="#FB923C"
        fillOpacity="0.75"
      />
      <circle cx="68" cy="120" r="2.5" fill="#FDBA74" fillOpacity="0.6" />
      <circle cx="204" cy="115" r="3" fill="#F57E16" fillOpacity="0.4" />
      <circle cx="178" cy="34" r="2.5" fill="#FDBA74" fillOpacity="0.5" />

      {/* Secondary Back Paper Sheet (Rotated slightly) */}
      <rect
        x="64"
        y="48"
        width="110"
        height="116"
        rx="12"
        transform="rotate(-5 64 48)"
        fill="#F1F5F9"
        stroke="#E2E8F0"
        strokeWidth="1.5"
      />

      {/* Main Clipboard Body */}
      <rect
        x="74"
        y="42"
        width="112"
        height="124"
        rx="14"
        fill="url(#clipboardGrad)"
        stroke="#E2E8F0"
        strokeWidth="2"
        filter="drop-shadow(0 6px 14px rgba(0,0,0,0.04))"
      />

      {/* Top Clip of the Clipboard */}
      <rect
        x="108"
        y="32"
        width="44"
        height="16"
        rx="5"
        fill="#F57E16"
        filter="drop-shadow(0 2px 5px rgba(245,126,22,0.3))"
      />
      <rect x="120" y="37" width="20" height="5" rx="2.5" fill="#FFFFFF" fillOpacity="0.9" />

      {/* Document Header Marker */}
      <rect x="92" y="62" width="28" height="6" rx="3" fill="#F57E16" fillOpacity="0.8" />
      <circle cx="164" cy="65" r="4" fill="#E2E8F0" />
      <circle cx="152" cy="65" r="4" fill="#E2E8F0" />

      {/* Audit Log Rows on Document (Clean dashed ghost lines) */}
      {/* Row 1 */}
      <circle cx="94" cy="82" r="3.5" fill="#10B981" fillOpacity="0.7" />
      <line x1="104" y1="82" x2="166" y2="82" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 4" />

      {/* Row 2 */}
      <circle cx="94" cy="98" r="3.5" fill="#F57E16" fillOpacity="0.7" />
      <line x1="104" y1="98" x2="154" y2="98" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 4" />

      {/* Row 3 */}
      <circle cx="94" cy="114" r="3.5" fill="#64748B" fillOpacity="0.7" />
      <line x1="104" y1="114" x2="162" y2="114" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 4" />

      {/* Row 4 */}
      <circle cx="94" cy="130" r="3.5" fill="#F43F5E" fillOpacity="0.7" />
      <line x1="104" y1="130" x2="148" y2="130" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 4" />

      {/* Row 5 */}
      <line x1="92" y1="146" x2="136" y2="146" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />

      {/* Magnifying Glass Overlaid */}
      <g filter="drop-shadow(0 6px 12px rgba(28,28,30,0.14))">
        {/* Glass Handle */}
        <line
          x1="168"
          y1="134"
          x2="194"
          y2="160"
          stroke="#1C1C1E"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <line
          x1="168"
          y1="134"
          x2="194"
          y2="160"
          stroke="#F57E16"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Outer Ring */}
        <circle
          cx="145"
          cy="111"
          r="26"
          fill="url(#glassGrad)"
          stroke="#1C1C1E"
          strokeWidth="3.5"
        />

        {/* Inner Glare Arc */}
        <path
          d="M130 98A19 19 0 0 1 158 98"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />

        {/* Inspection Zero / Empty Indicator Inside Lens */}
        <circle
          cx="145"
          cy="111"
          r="10"
          stroke="#F57E16"
          strokeWidth="2.5"
          strokeDasharray="4 3"
        />
        <circle cx="145" cy="111" r="3" fill="#F57E16" />
      </g>
    </svg>
  );
};

export default EmptyAuditIllustration;
