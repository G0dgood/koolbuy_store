"use client";

import React from "react";

interface CartLoaderProps {
  /** If true, fills the entire viewport with a soft backdrop blur */
  fullScreen?: boolean;
  /** Optional loading caption text */
  text?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CartLoader({
  fullScreen = false,
  text = "Loading KoolBuy...",
  size = "md",
  className = "",
}: CartLoaderProps) {
  const scale = size === "sm" ? 0.75 : size === "lg" ? 1.25 : 1;

  const content = (
    <div
      className={`flex flex-col items-center justify-center gap-4 select-none ${className}`}
      role="status"
      aria-label={text}
    >
      {/* Animated Shopping Cart SVG Stage */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: `${140 * scale}px`, height: `${110 * scale}px` }}
      >
        {/* Ambient Glow */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(245,126,22,0.45) 0%, rgba(245,126,22,0) 70%)",
          }}
        />

        <svg
          viewBox="0 0 160 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          {/* Animated Speed Lines Underneath */}
          <g className="cart-track-lines">
            <line
              x1="10"
              y1="106"
              x2="150"
              y2="106"
              stroke="#E2E8F0"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="16 10"
              className="animate-[trackRun_0.75s_linear_infinite]"
            />
            <line
              x1="30"
              y1="112"
              x2="130"
              y2="112"
              stroke="#F57E16"
              strokeOpacity="0.4"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="8 12"
              className="animate-[trackRun_0.5s_linear_infinite]"
            />
          </g>

          {/* Cart Bouncing Container */}
          <g className="cart-body animate-[cartBob_1.2s_ease-in-out_infinite]">
            {/* Box Dropping into Basket */}
            <g className="animate-[boxDrop_2.4s_cubic-bezier(0.34,1.56,0.64,1)_infinite]">
              {/* Product Box */}
              <rect
                x="56"
                y="34"
                width="34"
                height="30"
                rx="5"
                fill="#F57E16"
                className="shadow-sm"
              />
              {/* Tape stripe */}
              <rect x="70" y="34" width="6" height="30" fill="#E06905" />
              {/* KoolBuy Mini Emblem */}
              <circle cx="73" cy="49" r="4.5" fill="white" fillOpacity="0.95" />
              <path
                d="M71.5 49L72.8 50.3L74.8 47.7"
                stroke="#F57E16"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* Cart Wire Basket */}
            <path
              d="M32 30H43L54 74H112L124 38H45"
              stroke="#1E293B"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Inner basket grid lines */}
            <path
              d="M58 45H121"
              stroke="#64748B"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeOpacity="0.6"
            />
            <path
              d="M52 59H115"
              stroke="#64748B"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeOpacity="0.6"
            />
            <path
              d="M74 38L70 73"
              stroke="#64748B"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeOpacity="0.6"
            />
            <path
              d="M94 38L90 73"
              stroke="#64748B"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeOpacity="0.6"
            />

            {/* Cart Handle */}
            <path
              d="M26 24H32L34 32"
              stroke="#F57E16"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="22" y="21" width="8" height="6" rx="2" fill="#F57E16" />

            {/* Under-chassis */}
            <path
              d="M55 74L63 88H106"
              stroke="#1E293B"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Front Wheel */}
          <g transform="translate(104, 92)" className="animate-[wheelSpin_0.8s_linear_infinite]">
            <circle cx="0" cy="0" r="9" fill="white" stroke="#1E293B" strokeWidth="3" />
            <circle cx="0" cy="0" r="3" fill="#F57E16" />
            <line x1="0" y1="-8" x2="0" y2="8" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="-8" y1="0" x2="8" y2="0" stroke="#94A3B8" strokeWidth="1.5" />
          </g>

          {/* Rear Wheel */}
          <g transform="translate(62, 92)" className="animate-[wheelSpin_0.8s_linear_infinite]">
            <circle cx="0" cy="0" r="9" fill="white" stroke="#1E293B" strokeWidth="3" />
            <circle cx="0" cy="0" r="3" fill="#F57E16" />
            <line x1="0" y1="-8" x2="0" y2="8" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="-8" y1="0" x2="8" y2="0" stroke="#94A3B8" strokeWidth="1.5" />
          </g>
        </svg>
      </div>

      {/* Loading Label with Smooth Shimmer */}
      {text && (
        <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-brand-charcoal">
          <span>{text}</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-[bounce_1.4s_infinite_0ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-[bounce_1.4s_infinite_200ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-[bounce_1.4s_infinite_400ms]" />
          </span>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-card/80 backdrop-blur-md transition-opacity">
        {content}
      </div>
    );
  }

  return content;
}

export default CartLoader;
