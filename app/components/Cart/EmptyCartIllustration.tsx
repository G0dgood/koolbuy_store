"use client";

import React from "react";

/**
 * Empty Cart Illustration
 * Ported from the Koolboks Sales CRM illustration design system (DESIGN.md §7 & §10):
 * - Canvas: 200×160 (5:4 aspect ratio)
 * - Backdrop: warm peach disc (#FEF1E6) with soft radial highlight and floor shadow
 * - Chunky 2.5px charcoal (#050711) outlines
 * - Crisp white (#FFFFFF) cart basket with wire lines
 * - Koolboks orange (#F57E16) handle grip and wheel hubs
 * - Ghost dashed item inside basket
 */

const palette = {
  "--ill-bg": "var(--koolbuy-ill-bg, #FEF1E6)",
  "--ill-surface": "var(--koolbuy-ill-surface, #FFFFFF)",
  "--ill-ink": "var(--ill-ink, #050711)",
  "--ill-accent": "var(--koolbuy-ill-accent, #F57E16)",
  "--ill-accent-soft": "var(--koolbuy-ill-accent-soft, #FCD3AE)",
  "--ill-muted": "var(--koolbuy-ill-muted, #CBD5E1)",
} as React.CSSProperties;

const S = "var(--ill-surface, #FFFFFF)";
const A = "var(--ill-accent, #F57E16)";
const AS = "var(--ill-accent-soft, #FCD3AE)";
const M = "var(--ill-muted, #CBD5E1)";
const K = "var(--ill-ink, #050711)";
const BG = "var(--ill-bg, #FEF1E6)";

const ink = {
  stroke: K,
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Sparkle({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <path
      d={`M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s}Z`}
      fill={A}
    />
  );
}

export const EmptyCartIllustration: React.FC<{ className?: string }> = ({
  className = "w-52 h-40 sm:w-64 sm:h-48",
}) => {
  const glowId = React.useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={palette}
      role="img"
      aria-label="Your cart is empty"
    >
      <defs>
        <radialGradient id={`cartGlow-${glowId}`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor={S} stopOpacity="0.55" />
          <stop offset="1" stopColor={S} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── Backdrop Disc & Glow ── */}
      <circle cx="100" cy="76" r="62" fill={BG} />
      <circle cx="100" cy="76" r="62" fill={`url(#cartGlow-${glowId})`} />

      {/* ── Floor Shadow ── */}
      <ellipse cx="100" cy="142" rx="56" ry="5" fill={K} opacity="0.08" />

      {/* ── Shopping Cart Frame ── */}
      {/* Chassis Under-Bar */}
      <path d="M68 116h66" stroke={M} strokeWidth="3" strokeLinecap="round" />

      {/* Wheel struts */}
      <path d="M78 104v13M126 104v13" {...ink} />

      {/* Wheels */}
      <circle cx="78" cy="122" r="10" fill={S} {...ink} />
      <circle cx="78" cy="122" r="3.5" fill={A} />

      <circle cx="126" cy="122" r="10" fill={S} {...ink} />
      <circle cx="126" cy="122" r="3.5" fill={A} />

      {/* Basket Solid Body */}
      <path
        d="M58 56h92l-10 38H68z"
        fill={S}
        {...ink}
      />

      {/* Basket Wire Grid Lines */}
      {[82, 104, 126].map((x) => (
        <path key={x} d={`M${x} 61v28`} stroke={M} strokeWidth="2.5" />
      ))}
      <path d="M64 74h80" stroke={M} strokeWidth="2" />

      {/* Main Handle Push Bar */}
      <path d="M44 42h12l14 62h66" {...ink} />

      {/* Orange Handle Grip */}
      <rect x="36" y="37" width="18" height="10" rx="5" fill={A} {...ink} />

      {/* Ghost Box inside basket (Dashed outline awaiting items) */}
      <rect
        x="88"
        y="62"
        width="26"
        height="18"
        rx="3"
        fill={AS}
        fillOpacity="0.5"
        stroke={A}
        strokeWidth="1.8"
        strokeDasharray="3 2"
      />
      <circle cx="101" cy="71" r="2.5" fill={A} />

      {/* ── Floating Zero / Empty Badge (Top Right) ── */}
      <g>
        <circle cx="152" cy="48" r="15" fill={S} {...ink} />
        {/* Dash inside badge */}
        <path d="M145 48h14" stroke={A} strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* ── Signature CRM Sparkles & Dots ── */}
      <Sparkle x={38} y={34} s={5} />
      <Sparkle x={168} y={54} s={4} />
      <circle cx="160" cy="24" r="2.5" fill={A} opacity="0.6" />
      <circle cx="30" cy="110" r="2" fill={K} opacity="0.25" />
      <circle cx="174" cy="118" r="3" fill={AS} />
    </svg>
  );
};

export default EmptyCartIllustration;
