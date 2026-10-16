"use client";

import React from "react";

/**
 * Empty Products Illustration
 * Same system as EmptyCartIllustration (DESIGN.md §7 & §10):
 * - Canvas: 200×160 (5:4 aspect ratio)
 * - Backdrop: warm peach disc (#FEF1E6) with soft radial highlight and floor shadow
 * - Chunky 2.5px charcoal (#050711) outlines
 * - An open, empty white product box with a dashed ghost item inside
 * - Magnifying glass with a Koolboks orange (#F57E16) handle and "?" in the lens
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

export const EmptyProductsIllustration: React.FC<{ className?: string; label?: string }> = ({
  className = "w-44 h-36 sm:w-52 sm:h-44",
  label = "No products found",
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
      aria-label={label}
    >
      <defs>
        <radialGradient id={`boxGlow-${glowId}`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor={S} stopOpacity="0.55" />
          <stop offset="1" stopColor={S} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── Backdrop Disc & Glow ── */}
      <circle cx="100" cy="76" r="62" fill={BG} />
      <circle cx="100" cy="76" r="62" fill={`url(#boxGlow-${glowId})`} />

      {/* ── Floor Shadow ── */}
      <ellipse cx="96" cy="140" rx="58" ry="5" fill={K} opacity="0.08" />

      {/* ── Open Box ── */}
      {/* Back flap (standing up behind the opening) */}
      <path d="M76 70l6-16h58l-4 16z" fill={S} {...ink} />
      {/* Interior seen through the opening */}
      <path d="M60 84l16-14h60l-12 14z" fill={AS} fillOpacity="0.55" {...ink} />
      {/* Ghost item inside (dashed: nothing here yet) */}
      <rect
        x="84"
        y="66"
        width="24"
        height="14"
        rx="3"
        fill={S}
        fillOpacity="0.6"
        stroke={A}
        strokeWidth="1.8"
        strokeDasharray="3 2"
      />
      {/* Right side wall */}
      <path d="M124 84l12-14v42l-12 16z" fill={S} {...ink} />
      {/* Front face */}
      <path d="M60 84h64v44H60z" fill={S} {...ink} />
      {/* Left flap folded outward */}
      <path d="M60 84L44 74l14-10 18 6z" fill={S} {...ink} />
      {/* Front flap folded down */}
      <path d="M60 84l-6 12h64l6-12" fill={S} {...ink} />
      {/* Orange tape across the front */}
      <path d="M84 96h16v32H84z" fill={A} fillOpacity="0.9" />
      <path d="M60 128h64" {...ink} />
      {/* Shipping label lines */}
      <path d="M66 106h12M66 112h8" stroke={M} strokeWidth="2.5" strokeLinecap="round" />

      {/* ── Magnifying Glass ── */}
      {/* Handle: ink outline under an orange grip */}
      <path d="M150 112l15 15" stroke={K} strokeWidth="11" strokeLinecap="round" />
      <path d="M150 112l15 15" stroke={A} strokeWidth="6" strokeLinecap="round" />
      {/* Lens */}
      <circle cx="138" cy="98" r="19" fill={S} {...ink} />
      <circle cx="138" cy="98" r="13" fill={BG} fillOpacity="0.7" />
      {/* Lens glint */}
      <path d="M126 92a13 13 0 0 1 8-7" stroke={S} strokeWidth="2.5" strokeLinecap="round" />
      {/* Question mark */}
      <path
        d="M133.5 94a4.5 4.5 0 1 1 6.5 4c-1.6.8-2 1.6-2 3.2"
        stroke={A}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="138" cy="106.5" r="1.8" fill={A} />

      {/* ── Signature Sparkles & Dots ── */}
      <Sparkle x={40} y={40} s={5} />
      <Sparkle x={160} y={60} s={4} />
      <circle cx="152" cy="30" r="2.5" fill={A} opacity="0.6" />
      <circle cx="32" cy="108" r="2" fill={K} opacity="0.25" />
      <circle cx="176" cy="104" r="3" fill={AS} />
    </svg>
  );
};

export default EmptyProductsIllustration;
