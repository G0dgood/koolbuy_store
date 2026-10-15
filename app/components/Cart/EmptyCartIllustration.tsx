"use client";

import React from "react";

export const EmptyCartIllustration: React.FC<{ className?: string }> = ({
  className = "w-64 h-52 md:w-80 md:h-64",
}) => {
  return (
    <svg
      viewBox="0 0 360 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Ambient Glow */}
        <radialGradient
          id="cartGlow"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(180 150) rotate(90) scale(120 160)"
        >
          <stop stopColor="#F57E16" stopOpacity="0.14" />
          <stop offset="0.6" stopColor="#F57E16" stopOpacity="0.04" />
          <stop offset="1" stopColor="#F57E16" stopOpacity="0" />
        </radialGradient>

        {/* Soft Base Shadow */}
        <radialGradient
          id="groundShadow"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(180 235) scale(110 16)"
        >
          <stop stopColor="#1C1C1E" stopOpacity="0.12" />
          <stop offset="0.7" stopColor="#1C1C1E" stopOpacity="0.03" />
          <stop offset="1" stopColor="#1C1C1E" stopOpacity="0" />
        </radialGradient>

        {/* Brand Orange Gradient */}
        <linearGradient
          id="orangeGradient"
          x1="120"
          y1="80"
          x2="240"
          y2="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F57E16" />
          <stop offset="1" stopColor="#E06500" />
        </linearGradient>

        {/* Wheel Gradient */}
        <linearGradient
          id="wheelGrad"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop stopColor="#2D2D30" />
          <stop offset="1" stopColor="#1C1C1E" />
        </linearGradient>

        {/* Floating Tag Gradient */}
        <linearGradient
          id="tagGrad"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop stopColor="#FFF7ED" />
          <stop offset="1" stopColor="#FFEDD5" />
        </linearGradient>
      </defs>

      {/* Background Ambient Aura */}
      <circle cx="180" cy="140" r="110" fill="url(#cartGlow)" />

      {/* Ground Ellipse Shadow */}
      <ellipse cx="180" cy="235" rx="105" ry="14" fill="url(#groundShadow)" />

      {/* Floating Decorative Elements */}
      {/* Sparkle Top-Right */}
      <path
        d="M268 70L271.5 79.5L281 83L271.5 86.5L268 96L264.5 86.5L255 83L264.5 79.5L268 70Z"
        fill="#F57E16"
        fillOpacity="0.8"
      />
      {/* Sparkle Left */}
      <path
        d="M86 112L88.5 119L95.5 121.5L88.5 124L86 131L83.5 124L76.5 121.5L83.5 119L86 112Z"
        fill="#FB923C"
        fillOpacity="0.6"
      />
      {/* Little Star Top-Left */}
      <circle cx="114" cy="74" r="3" fill="#FDBA74" fillOpacity="0.7" />
      <circle cx="282" cy="132" r="2.5" fill="#FDBA74" fillOpacity="0.6" />

      {/* Floating Badge (Sun / Clean Energy Spark) */}
      <g transform="translate(198, 52) rotate(8)">
        <rect
          x="0"
          y="0"
          width="44"
          height="44"
          rx="14"
          fill="url(#tagGrad)"
          stroke="#FDBA74"
          strokeWidth="1.5"
          filter="drop-shadow(0 4px 10px rgba(245,126,22,0.15))"
        />
        {/* Mini Sun / Star Icon */}
        <circle cx="22" cy="22" r="6" fill="#F57E16" />
        <path
          d="M22 10V13M22 31V34M10 22H13M31 22H34M13.5 13.5L15.6 15.6M28.4 28.4L30.5 30.5M13.5 30.5L15.6 28.4M28.4 15.6L30.5 13.5"
          stroke="#F57E16"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Main Shopping Cart Frame */}
      {/* Rear Wheel Support */}
      <line
        x1="134"
        y1="196"
        x2="134"
        y2="216"
        stroke="#4B5563"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Front Wheel Support */}
      <line
        x1="226"
        y1="196"
        x2="226"
        y2="216"
        stroke="#4B5563"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Cart Wheels */}
      {/* Back Wheel */}
      <g transform="translate(134, 218)">
        <circle cx="0" cy="0" r="14" fill="url(#wheelGrad)" />
        <circle cx="0" cy="0" r="7" fill="#E5E7EB" />
        <circle cx="0" cy="0" r="3.5" fill="#F57E16" />
      </g>
      {/* Front Wheel */}
      <g transform="translate(226, 218)">
        <circle cx="0" cy="0" r="14" fill="url(#wheelGrad)" />
        <circle cx="0" cy="0" r="7" fill="#E5E7EB" />
        <circle cx="0" cy="0" r="3.5" fill="#F57E16" />
      </g>

      {/* Bottom Under-Chassis Bar */}
      <path
        d="M124 196H234"
        stroke="#374151"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Basket Main Wireframe Body */}
      {/* Basket Solid Semi-Transparent Fill */}
      <path
        d="M112 112L126 182C127.2 187.8 132.3 192 138.2 192H226C231.8 192 236.8 187.9 238.2 182.2L254 116C255.4 110.1 250.9 104.5 244.9 104.5H110"
        fill="#F9FAFB"
        stroke="#D1D5DB"
        strokeWidth="1.5"
      />

      {/* Horizontal Wire Grid Lines */}
      <path
        d="M116 126H249M120 148H244M124 170H237"
        stroke="#E5E7EB"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Vertical Wire Grid Lines */}
      <path
        d="M145 110V186M175 108V188M205 108V188M232 110V184"
        stroke="#E5E7EB"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Prominent Basket Top Rim and Handle */}
      {/* Handle Line going up and back */}
      <path
        d="M92 90H106L112 112H246C252.5 112 257.5 118 256 124.5L240 183C238.5 188.5 233.5 192.5 227.8 192.5H138C132.2 192.5 127.2 188.3 125.8 182.5L108 98C107.2 94.2 103.8 91.5 100 91.5H92"
        stroke="#1C1C1E"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Handle Grip (Orange accent) */}
      <rect
        x="80"
        y="85"
        width="22"
        height="11"
        rx="5.5"
        fill="url(#orangeGradient)"
        filter="drop-shadow(0 2px 4px rgba(245,126,22,0.3))"
      />

      {/* Empty State Dashed Floating Heart / Clean Package Trail inside Basket */}
      <path
        d="M165 145C165 137.8 170.8 132 178 132C181.5 132 184.6 133.4 187 135.7C189.4 133.4 192.5 132 196 132C203.2 132 209 137.8 209 145C209 155 197 165.5 187 172C177 165.5 165 155 165 145Z"
        stroke="#F57E16"
        strokeWidth="2.5"
        strokeDasharray="4 4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#FFF7ED"
        fillOpacity="0.7"
      />

      {/* Subtle plus icons floating */}
      <path
        d="M152 74V82M148 78H156"
        stroke="#FB923C"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
