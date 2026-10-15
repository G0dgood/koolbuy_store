"use client";

import React from "react";

interface FailedOrdersIllustrationProps {
  className?: string;
  width?: number;
  height?: number;
}

export const FailedOrdersIllustration: React.FC<FailedOrdersIllustrationProps> = ({
  className = "w-44 h-36",
  width = 180,
  height = 140,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 180 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background Soft Shadow & Tinted Disk */}
      <circle cx="90" cy="70" r="54" fill="#FFF1F2" />
      <ellipse cx="90" cy="116" rx="46" ry="7" fill="#FEE2E2" />

      {/* Decorative Dashed Ring */}
      <circle
        cx="90"
        cy="70"
        r="44"
        stroke="#FECDD3"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />

      {/* Isometric Order Package / Box */}
      <g transform="translate(48, 38)">
        {/* Box Shadow */}
        <path d="M12 40 L42 54 L72 40 L42 26 Z" fill="#FEE2E2" />

        {/* Left Face */}
        <path
          d="M12 40 L42 54 V74 L12 60 Z"
          fill="#FFFFFF"
          stroke="#0F172A"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Right Face */}
        <path
          d="M42 54 L72 40 V60 L42 74 Z"
          fill="#F8FAFC"
          stroke="#0F172A"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Top Left Flap */}
        <path
          d="M12 40 L42 26 L42 38 L12 50 Z"
          fill="#FFFFFF"
          stroke="#0F172A"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Top Right Flap */}
        <path
          d="M72 40 L42 26 L42 38 L72 50 Z"
          fill="#F1F5F9"
          stroke="#0F172A"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Package Tape Strip */}
        <path
          d="M36 32 L48 26 L48 65 L36 71 Z"
          fill="#FEE2E2"
          stroke="#E11D48"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Barcode / Label details on package */}
        <path
          d="M20 54 L30 50"
          stroke="#CBD5E1"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M22 59 L28 56"
          stroke="#CBD5E1"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M54 50 L64 45"
          stroke="#CBD5E1"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Floating Alert / Error Warning Badge */}
      <g transform="translate(112, 32)">
        {/* Soft Badge Drop Shadow */}
        <circle cx="16" cy="18" r="16" fill="#FEE2E2" />

        {/* Red Warning Disc */}
        <circle
          cx="16"
          cy="16"
          r="15"
          fill="#E11D48"
          stroke="#FFFFFF"
          strokeWidth="2.5"
        />

        {/* Exclamation Mark */}
        <path
          d="M16 9 V16"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="16" cy="21" r="1.5" fill="#FFFFFF" />
      </g>

      {/* Decorative Sparkles & Disconnection Symbols */}
      <path
        d="M32 44 Q32 49 37 49 Q32 49 32 54 Q32 49 27 49 Q32 49 32 44 Z"
        fill="#FB7185"
      />
      <circle cx="146" cy="88" r="3" fill="#FDA4AF" />
      <circle cx="36" cy="85" r="2.5" fill="#FDA4AF" />

      {/* Cross mark */}
      <path
        d="M142 42 L148 48 M148 42 L142 48"
        stroke="#F43F5E"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
