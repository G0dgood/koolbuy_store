"use client";

import React from "react";

/**
 * Empty Saved Items Illustration
 * Ported from the Koolboks Sales CRM illustration design system (DESIGN.md §7 & §10):
 * - Canvas: 200×160 (5:4 aspect ratio)
 * - Backdrop: warm peach disc (#FEF1E6) with floor shadow and sparkles
 * - Chunky 2.5px charcoal (#050711) outlines
 * - Saved bookmark card & dashed heart focal point
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

export const EmptySavedIllustration: React.FC<{ className?: string }> = ({
  className = "w-48 h-40 md:w-56 md:h-44",
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
      aria-label="No saved items"
    >
      <defs>
        <radialGradient id={`savedGlow-${glowId}`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor={S} stopOpacity="0.55" />
          <stop offset="1" stopColor={S} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── Backdrop Disc & Glow ── */}
      <circle cx="100" cy="76" r="62" fill={BG} />
      <circle cx="100" cy="76" r="62" fill={`url(#savedGlow-${glowId})`} />

      {/* ── Floor Shadow ── */}
      <ellipse cx="100" cy="142" rx="56" ry="5" fill={K} opacity="0.08" />

      {/* ── Background Slanted Wishlist Card ── */}
      <rect
        x="62"
        y="38"
        width="82"
        height="96"
        rx="8"
        fill={M}
        {...ink}
        transform="rotate(6 103 86)"
      />

      {/* ── Main Foreground Wishlist Plate ── */}
      <rect x="56" y="34" width="84" height="98" rx="8" fill={S} {...ink} />

      {/* Card Header Strip */}
      <path d="M56 42a8 8 0 0 1 8-8h68a8 8 0 0 1 8 8v12H56z" fill={AS} {...ink} />

      {/* Card Horizontal Guideline Slots */}
      {[64, 78, 92].map((y) => (
        <path
          key={y}
          d={`M68 ${y}h42`}
          stroke={M}
          strokeWidth="2.5"
          strokeDasharray="4 3"
          strokeLinecap="round"
        />
      ))}

      {/* ── Bookmark Ribbon (Brand Orange) ── */}
      <path
        d="M116 34v36l10-7 10 7V34z"
        fill={A}
        {...ink}
      />

      {/* ── Dashed Wishlist Heart at the center ── */}
      <path
        d="M98 108c-10-8-18-14-18-22a8 8 0 0 1 14-5.5L98 83l4-2.5a8 8 0 0 1 14 5.5c0 8-8 14-18 22z"
        stroke={A}
        strokeWidth="2.5"
        strokeDasharray="4 3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={S}
      />

      {/* ── Signature Sparkles & Accents ── */}
      <Sparkle x={38} y={34} s={5} />
      <Sparkle x={166} y={52} s={4} />
      <circle cx="160" cy="24" r="2.5" fill={A} opacity="0.6" />
      <circle cx="30" cy="110" r="2" fill={K} opacity="0.25" />
      <circle cx="174" cy="118" r="3" fill={AS} />
    </svg>
  );
};

export default EmptySavedIllustration;
