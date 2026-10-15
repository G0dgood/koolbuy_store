"use client";

import React from "react";

/**
 * Empty Category Illustration
 * Ported from the Koolboks Sales CRM illustration design system (DESIGN.md §7 & §10):
 * - Canvas: 200×160 (5:4 aspect ratio)
 * - Backdrop: warm peach disc (#FEF1E6) with floor shadow and signature sparkles
 * - Chunky 2.5px charcoal (#050711) outlines
 * - Surfaces: crisp white (#FFFFFF)
 * - Accents: Koolboks brand orange (#F57E16) focal points & soft tint fills (#FCD3AE)
 * - Ghost dashed lines (#CBD5E1) representing unstocked category items
 */

const palette = {
  "--ill-bg": "var(--koolbuy-ill-bg, #FEF1E6)",
  "--ill-surface": "var(--koolbuy-ill-surface, #FFFFFF)",
  "--ill-ink": "var(--koolbuy-ill-ink, #050711)",
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

function Flake({
  cx,
  cy,
  r,
  color = S,
  w = 2,
}: {
  cx: number;
  cy: number;
  r: number;
  color?: string;
  w?: number;
}) {
  return (
    <g stroke={color} strokeWidth={w} strokeLinecap="round">
      <path
        d={`M${cx} ${cy - r}v${r * 2}M${cx - r * 0.866} ${cy - r / 2}l${r * 1.732} ${r}M${cx - r * 0.866} ${cy + r / 2}l${r * 1.732} ${-r}`}
      />
    </g>
  );
}

export interface EmptyCategoryIllustrationProps {
  className?: string;
  size?: number;
}

export const EmptyCategoryIllustration: React.FC<EmptyCategoryIllustrationProps> = ({
  className = "w-52 h-40 sm:w-64 sm:h-48",
  size,
}) => {
  const glowId = React.useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 200 160"
      width={size}
      height={size ? (size * 160) / 200 : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={palette}
      role="img"
      aria-label="Empty category illustration"
    >
      <defs>
        <radialGradient id={`glow-${glowId}`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor={S} stopOpacity="0.55" />
          <stop offset="1" stopColor={S} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── Backdrop Disc & Glow ── */}
      <circle cx="100" cy="76" r="62" fill={BG} />
      <circle cx="100" cy="76" r="62" fill={`url(#glow-${glowId})`} />

      {/* ── Floor Shadow ── */}
      <ellipse cx="100" cy="142" rx="56" ry="5" fill={K} opacity="0.08" />

      {/* ── Commercial Upright Showcase (Koolboks Display Cooler) ── */}
      {/* Cabinet Body */}
      <rect x="64" y="24" width="72" height="110" rx="8" fill={S} {...ink} />

      {/* Top Compressor Hood (Brand Orange) */}
      <path
        d="M64 32a8 8 0 0 1 8-8h56a8 8 0 0 1 8 8v8H64z"
        fill={A}
        {...ink}
      />
      {/* Snowflake Logo on Canopy */}
      <Flake cx={100} cy={32} r={4.5} color={S} w={2} />

      {/* Glass Showcase Interior */}
      <rect x="72" y="48" width="56" height="70" rx="4" fill={S} stroke={M} strokeWidth="2" />

      {/* Wire Grid Shelves */}
      <path d="M74 66h52M74 84h52M74 102h52" stroke={M} strokeWidth="2" strokeDasharray="3 3" />

      {/* Glass Reflection Glare Lines */}
      <path
        d="M80 54l-5 10M92 54l-12 24"
        stroke={S}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Ghost Box / Staging Item on Shelf (Waiting for Category Inventory) */}
      <rect
        x="82"
        y="89"
        width="22"
        height="13"
        rx="2.5"
        fill={AS}
        fillOpacity="0.45"
        stroke={A}
        strokeWidth="1.8"
        strokeDasharray="3 2"
      />
      <circle cx="93" cy="95.5" r="2" fill={A} />

      {/* Handle */}
      <rect x="120" y="70" width="4" height="22" rx="2" fill={K} />

      {/* Bottom Vent Slats */}
      <path d="M76 125h26" stroke={M} strokeWidth="2.5" strokeDasharray="3 3" strokeLinecap="round" />

      {/* Showcase Feet */}
      <path d="M72 138v-4M128 138v-4" {...ink} />

      {/* ── Category Matrix Floating Badge (Top-Right) ── */}
      <g>
        <circle cx="152" cy="54" r="18" fill={S} {...ink} />
        {/* 2×2 Category Matrix Grid */}
        {/* Top-left: Orange active category */}
        <rect x="143" y="45" width="7" height="7" rx="1.5" fill={A} {...ink} strokeWidth="1.2" />
        {/* Top-right: Soft orange sub-category */}
        <rect x="154" y="45" width="7" height="7" rx="1.5" fill={AS} {...ink} strokeWidth="1.2" />
        {/* Bottom-left: White categorized product */}
        <rect x="143" y="56" width="7" height="7" rx="1.5" fill={S} {...ink} strokeWidth="1.2" />
        {/* Bottom-right: Dashed tile with + sign (Awaiting items) */}
        <rect
          x="154"
          y="56"
          width="7"
          height="7"
          rx="1.5"
          fill="none"
          stroke={M}
          strokeWidth="1.2"
          strokeDasharray="2 1.5"
        />
        <path d="M157.5 57.5v4M155.5 59.5h4" stroke={A} strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* ── Floating Category Tag (Top-Left) ── */}
      <g transform="rotate(-10 44 70)">
        <rect x="33" y="58" width="22" height="24" rx="4" fill={S} {...ink} strokeWidth="2" />
        <circle cx="44" cy="65" r="3" fill={A} />
        <path d="M38 74h12" stroke={M} strokeWidth="2" strokeDasharray="3 2" strokeLinecap="round" />
      </g>

      {/* ── Signature CRM Sparkles & Dots ── */}
      <Sparkle x={38} y={34} s={5} />
      <Sparkle x={166} y={52} s={4} />
      <circle cx="160" cy="24" r="2.5" fill={A} opacity="0.6" />
      <circle cx="30" cy="110" r="2" fill={K} opacity="0.25" />
      <circle cx="174" cy="118" r="3" fill={AS} />
    </svg>
  );
};

export default EmptyCategoryIllustration;
