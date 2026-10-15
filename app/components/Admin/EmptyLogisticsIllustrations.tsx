"use client";

import React from "react";

/**
 * Custom SVG Illustration for Empty Dropping Orders
 * Follows Koolboks Sales CRM / KoolBuy design language:
 * - 260x200 canvas
 * - Soft #F57E16 brand glow
 * - Ground shadow
 * - Clean vectors, charcoal lines & Koolboks orange accents
 */
export const EmptyDroppingOrdersIllustration: React.FC<{ className?: string }> = ({
  className = "w-52 h-40",
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
          id="dropGlow"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(130 100) scale(95 75)"
        >
          <stop stopColor="#F57E16" stopOpacity="0.14" />
          <stop offset="0.7" stopColor="#F57E16" stopOpacity="0.02" />
          <stop offset="1" stopColor="#F57E16" stopOpacity="0" />
        </radialGradient>

        {/* Ground Shadow */}
        <radialGradient
          id="dropGround"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(130 172) scale(80 10)"
        >
          <stop stopColor="#1C1C1E" stopOpacity="0.12" />
          <stop offset="0.8" stopColor="#1C1C1E" stopOpacity="0.01" />
          <stop offset="1" stopColor="#1C1C1E" stopOpacity="0" />
        </radialGradient>

        {/* Truck Body Gradient */}
        <linearGradient
          id="truckBodyGrad"
          x1="50"
          y1="60"
          x2="170"
          y2="150"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F8FAFC" />
        </linearGradient>

        {/* Soft Orange Accent Gradient */}
        <linearGradient
          id="orangeGrad"
          x1="120"
          y1="80"
          x2="190"
          y2="140"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FB923C" />
          <stop offset="1" stopColor="#F57E16" />
        </linearGradient>
      </defs>

      {/* Ambient Glow */}
      <circle cx="130" cy="100" r="90" fill="url(#dropGlow)" />

      {/* Ground Shadow */}
      <ellipse cx="130" cy="172" rx="75" ry="9" fill="url(#dropGround)" />

      {/* Decorative Sparkles & Dots */}
      <path
        d="M48 60L50 66L56 68L50 70L48 76L46 70L40 68L46 66L48 60Z"
        fill="#F57E16"
        fillOpacity="0.75"
      />
      <path
        d="M212 52L214 58L220 60L214 62L212 68L210 62L204 60L210 58L212 52Z"
        fill="#FB923C"
        fillOpacity="0.8"
      />
      <circle cx="56" cy="120" r="2.5" fill="#FDBA74" fillOpacity="0.6" />
      <circle cx="218" cy="116" r="3" fill="#F57E16" fillOpacity="0.5" />
      <circle cx="190" cy="38" r="2.5" fill="#FDBA74" fillOpacity="0.6" />

      {/* Background Route Path (Dotted curve) */}
      <path
        d="M40 148C60 148 70 120 100 120C130 120 140 145 170 145C195 145 205 130 220 130"
        stroke="#CBD5E1"
        strokeWidth="2"
        strokeDasharray="4 4"
        strokeLinecap="round"
      />

      {/* Van Cargo Body */}
      <rect
        x="52"
        y="68"
        width="104"
        height="74"
        rx="8"
        fill="url(#truckBodyGrad)"
        stroke="#CBD5E1"
        strokeWidth="2"
        filter="drop-shadow(0 6px 16px rgba(0,0,0,0.05))"
      />

      {/* Refrigerated / Cold-chain Panel Dividers */}
      <line x1="104" y1="72" x2="104" y2="138" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="4 3" />
      <rect x="62" y="78" width="32" height="6" rx="3" fill="#F57E16" fillOpacity="0.8" />
      <rect x="62" y="90" width="22" height="4" rx="2" fill="#E2E8F0" />
      <rect x="62" y="98" width="28" height="4" rx="2" fill="#E2E8F0" />

      {/* Van Cab Front */}
      <path
        d="M156 86H180C184 86 188 89 191 93L202 108C204 111 205 114 205 118V142H156V86Z"
        fill="url(#orangeGrad)"
        filter="drop-shadow(0 4px 10px rgba(245,126,22,0.25))"
      />

      {/* Cab Window */}
      <path
        d="M162 92H178L188 106H162V92Z"
        fill="#FFFFFF"
        fillOpacity="0.95"
      />

      {/* Headlight */}
      <rect x="200" y="124" width="6" height="8" rx="2" fill="#FEF08A" />

      {/* Front Bumper */}
      <path d="M198 142H207V146H198V142Z" fill="#1C1C1E" rx="1" />

      {/* Wheels */}
      {/* Rear Wheel 1 */}
      <circle cx="82" cy="148" r="15" fill="#1C1C1E" />
      <circle cx="82" cy="148" r="8" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
      <circle cx="82" cy="148" r="3.5" fill="#F57E16" />

      {/* Rear Wheel 2 */}
      <circle cx="128" cy="148" r="15" fill="#1C1C1E" />
      <circle cx="128" cy="148" r="8" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
      <circle cx="128" cy="148" r="3.5" fill="#F57E16" />

      {/* Front Wheel */}
      <circle cx="184" cy="148" r="15" fill="#1C1C1E" />
      <circle cx="184" cy="148" r="8" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
      <circle cx="184" cy="148" r="3.5" fill="#F57E16" />

      {/* Floating Parcel / Dropping Order Badge */}
      <g filter="drop-shadow(0 8px 18px rgba(28,28,30,0.14))">
        {/* Floating Box Badge */}
        <rect
          x="118"
          y="34"
          width="46"
          height="42"
          rx="10"
          fill="#FFFFFF"
          stroke="#F57E16"
          strokeWidth="2"
        />
        {/* Box ribbon / tape */}
        <line x1="141" y1="35" x2="141" y2="75" stroke="#F57E16" strokeWidth="2.5" />
        <line x1="119" y1="55" x2="163" y2="55" stroke="#F57E16" strokeWidth="2.5" />
        {/* Checkmark badge */}
        <circle cx="156" cy="38" r="8" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M153 38L155 40L160 36" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Location Map Pin on the left */}
      <g filter="drop-shadow(0 4px 8px rgba(245,126,22,0.25))">
        <path
          d="M62 42C56.5 42 52 46.5 52 52C52 59.5 62 68 62 68C62 68 72 59.5 72 52C72 46.5 67.5 42 62 42Z"
          fill="#F57E16"
        />
        <circle cx="62" cy="51" r="3.5" fill="#FFFFFF" />
      </g>
    </svg>
  );
};

/**
 * Custom SVG Illustration for Empty Vendor Addresses / Depots
 */
export const EmptyVendorWarehouseIllustration: React.FC<{ className?: string }> = ({
  className = "w-52 h-40",
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
        <radialGradient
          id="whGlow"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(130 100) scale(95 75)"
        >
          <stop stopColor="#F57E16" stopOpacity="0.14" />
          <stop offset="0.7" stopColor="#F57E16" stopOpacity="0.02" />
          <stop offset="1" stopColor="#F57E16" stopOpacity="0" />
        </radialGradient>

        <radialGradient
          id="whGround"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(130 172) scale(85 10)"
        >
          <stop stopColor="#1C1C1E" stopOpacity="0.12" />
          <stop offset="0.8" stopColor="#1C1C1E" stopOpacity="0.01" />
          <stop offset="1" stopColor="#1C1C1E" stopOpacity="0" />
        </radialGradient>

        <linearGradient
          id="whWallGrad"
          x1="60"
          y1="50"
          x2="200"
          y2="150"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F1F5F9" />
        </linearGradient>
      </defs>

      {/* Ambient Glow */}
      <circle cx="130" cy="100" r="90" fill="url(#whGlow)" />

      {/* Ground Shadow */}
      <ellipse cx="130" cy="172" rx="80" ry="9" fill="url(#whGround)" />

      {/* Decorative Sparkles */}
      <path
        d="M50 50L52 56L58 58L52 60L50 66L48 60L42 58L48 56L50 50Z"
        fill="#F57E16"
        fillOpacity="0.75"
      />
      <path
        d="M214 60L216 66L222 68L216 70L214 76L212 70L206 68L212 66L214 60Z"
        fill="#FB923C"
        fillOpacity="0.75"
      />
      <circle cx="56" cy="115" r="2.5" fill="#FDBA74" fillOpacity="0.6" />
      <circle cx="218" cy="120" r="3" fill="#F57E16" fillOpacity="0.5" />

      {/* Warehouse Main Structure */}
      <path
        d="M60 92L130 52L200 92V156H60V92Z"
        fill="url(#whWallGrad)"
        stroke="#CBD5E1"
        strokeWidth="2"
        filter="drop-shadow(0 6px 16px rgba(0,0,0,0.05))"
      />

      {/* Roof Canopy & Ridge */}
      <path
        d="M56 94L130 50L204 94"
        stroke="#F57E16"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Roof Vent / Flag Marker */}
      <rect x="126" y="38" width="8" height="12" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
      <path d="M130 38V28L144 33L130 38Z" fill="#F57E16" />

      {/* Warehouse Triangular Gable Window */}
      <circle cx="130" cy="78" r="10" fill="#FFF7ED" stroke="#F57E16" strokeWidth="1.5" />
      <line x1="130" y1="68" x2="130" y2="88" stroke="#F57E16" strokeWidth="1.5" />
      <line x1="120" y1="78" x2="140" y2="78" stroke="#F57E16" strokeWidth="1.5" />

      {/* Bay Door 1 (Roll-up loading shutter) */}
      <rect
        x="76"
        y="108"
        width="46"
        height="48"
        rx="4"
        fill="#FFFFFF"
        stroke="#94A3B8"
        strokeWidth="1.5"
      />
      {/* Horizontal shutter slats */}
      {[116, 124, 132, 140, 148].map((y) => (
        <line key={y} x1="77" y1={y} x2="121" y2={y} stroke="#CBD5E1" strokeWidth="1.2" />
      ))}
      <rect x="94" y="148" width="10" height="4" rx="1" fill="#F57E16" />

      {/* Bay Door 2 (Roll-up loading shutter with hazard yellow/orange base) */}
      <rect
        x="138"
        y="108"
        width="46"
        height="48"
        rx="4"
        fill="#FFFFFF"
        stroke="#94A3B8"
        strokeWidth="1.5"
      />
      {[116, 124, 132, 140, 148].map((y) => (
        <line key={y} x1="139" y1={y} x2="183" y2={y} stroke="#CBD5E1" strokeWidth="1.2" />
      ))}
      <rect x="156" y="148" width="10" height="4" rx="1" fill="#F57E16" />

      {/* Loading Dock Platform Ramp */}
      <rect x="52" y="156" width="156" height="8" rx="2" fill="#1C1C1E" />

      {/* Palette with Stored Appliance Crates on the Dock */}
      <rect x="194" y="132" width="28" height="24" rx="3" fill="#FFFFFF" stroke="#F57E16" strokeWidth="1.5" />
      <line x1="194" y1="144" x2="222" y2="144" stroke="#F57E16" strokeWidth="1" strokeDasharray="3 2" />
      <rect x="192" y="156" width="32" height="4" rx="1" fill="#78350F" />

      {/* Pin Marker on Warehouse */}
      <g filter="drop-shadow(0 6px 12px rgba(245,126,22,0.35))">
        <path
          d="M178 36C172 36 167 41 167 47C167 55 178 65 178 65C178 65 189 55 189 47C189 41 184 36 178 36Z"
          fill="#F57E16"
        />
        <circle cx="178" cy="46" r="4" fill="#FFFFFF" />
      </g>
    </svg>
  );
};

/**
 * Custom SVG Illustration for Empty Delivery Rates / Tariffs
 */
export const EmptyDeliveryRatesIllustration: React.FC<{ className?: string }> = ({
  className = "w-52 h-40",
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
        <radialGradient
          id="rateGlow"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(130 100) scale(95 75)"
        >
          <stop stopColor="#F57E16" stopOpacity="0.14" />
          <stop offset="0.7" stopColor="#F57E16" stopOpacity="0.02" />
          <stop offset="1" stopColor="#F57E16" stopOpacity="0" />
        </radialGradient>

        <radialGradient
          id="rateGround"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(130 172) scale(80 10)"
        >
          <stop stopColor="#1C1C1E" stopOpacity="0.12" />
          <stop offset="0.8" stopColor="#1C1C1E" stopOpacity="0.01" />
          <stop offset="1" stopColor="#1C1C1E" stopOpacity="0" />
        </radialGradient>

        <linearGradient
          id="mapGrad"
          x1="60"
          y1="40"
          x2="190"
          y2="160"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F8FAFC" />
        </linearGradient>
      </defs>

      {/* Ambient Glow */}
      <circle cx="130" cy="100" r="90" fill="url(#rateGlow)" />

      {/* Ground Shadow */}
      <ellipse cx="130" cy="172" rx="75" ry="9" fill="url(#rateGround)" />

      {/* Sparkles */}
      <path
        d="M48 56L50 62L56 64L50 66L48 72L46 66L40 64L46 62L48 56Z"
        fill="#F57E16"
        fillOpacity="0.75"
      />
      <path
        d="M212 48L214 54L220 56L214 58L212 64L210 58L204 56L210 54L212 48Z"
        fill="#FB923C"
        fillOpacity="0.75"
      />
      <circle cx="56" cy="120" r="2.5" fill="#FDBA74" fillOpacity="0.6" />
      <circle cx="216" cy="118" r="3" fill="#F57E16" fillOpacity="0.5" />

      {/* Folded Logistics Map (Tilted) */}
      <g filter="drop-shadow(0 6px 16px rgba(0,0,0,0.06))">
        {/* Panel 1 */}
        <polygon
          points="58,54 102,44 102,154 58,162"
          fill="url(#mapGrad)"
          stroke="#E2E8F0"
          strokeWidth="1.5"
        />
        {/* Panel 2 */}
        <polygon
          points="102,44 150,56 150,166 102,154"
          fill="#F1F5F9"
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />
        {/* Panel 3 */}
        <polygon
          points="150,56 196,44 196,154 150,166"
          fill="url(#mapGrad)"
          stroke="#E2E8F0"
          strokeWidth="1.5"
        />
      </g>

      {/* Map Zone Contours & Routes */}
      <path
        d="M68 84C82 78 90 98 114 90C138 82 144 106 172 100C184 96 188 108 192 110"
        stroke="#F57E16"
        strokeWidth="2.5"
        strokeDasharray="4 3"
        strokeLinecap="round"
      />
      <circle cx="78" cy="82" r="3" fill="#F57E16" />
      <circle cx="124" cy="88" r="3.5" fill="#F57E16" />
      <circle cx="168" cy="102" r="3" fill="#F57E16" />

      {/* Secondary route line */}
      <path
        d="M72 124C92 120 108 136 136 128C154 122 170 134 186 130"
        stroke="#94A3B8"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        strokeLinecap="round"
      />

      {/* Floating Tariff Badge (Naira symbol badge) */}
      <g filter="drop-shadow(0 8px 18px rgba(28,28,30,0.16))">
        <circle cx="130" cy="56" r="26" fill="#FFFFFF" stroke="#F57E16" strokeWidth="2.5" />
        <circle cx="130" cy="56" r="20" fill="#FFF7ED" />
        {/* Naira ₦ character */}
        <text
          x="130"
          y="63"
          textAnchor="middle"
          fontSize="22"
          fontWeight="bold"
          fill="#F57E16"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          ₦
        </text>
      </g>

      {/* Zone 1 / Zone 2 Floating Chips */}
      <g filter="drop-shadow(0 4px 10px rgba(0,0,0,0.06))">
        <rect x="68" y="136" width="46" height="18" rx="5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
        <text x="91" y="149" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#334155">
          Zone 1
        </text>

        <rect x="144" y="142" width="46" height="18" rx="5" fill="#FFFFFF" stroke="#F57E16" strokeWidth="1" />
        <text x="167" y="155" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#F57E16">
          Zone 2
        </text>
      </g>
    </svg>
  );
};
