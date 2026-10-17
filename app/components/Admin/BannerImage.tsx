"use client";

import React, { useState } from "react";

/**
 * A banner image that never shows the browser's broken-image icon. With no
 * URL, or when the image fails to load, it shows a soft KoolBuy wallpaper
 * (orange tint, faint dots and price tags) with a small label on top.
 */
export function BannerImage({
  src,
  positionY,
  emptyLabel = "No banner",
  brokenLabel = "Banner couldn't load",
  showLabel = true,
  className = "",
}: {
  src?: string | null;
  /** Vertical focus, 0–100 (object-position y) */
  positionY?: number | null;
  emptyLabel?: string;
  brokenLabel?: string;
  showLabel?: boolean;
  className?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = !!src && failedSrc === src;

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        loading="lazy"
        onError={() => setFailedSrc(src)}
        className={`w-full h-full object-cover ${className}`}
        style={positionY != null ? { objectPosition: `50% ${positionY}%` } : undefined}
      />
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden bg-brand-orange-soft ${className}`}>
      <BannerWallpaper />
      {showLabel && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-sm border border-black/[0.06] text-[11px] font-medium text-subtle">
            {failed ? brokenLabel : emptyLabel}
          </span>
        </span>
      )}
    </div>
  );
}

/** Decorative wallpaper: diagonal soft wash, dot grid and a few tag outlines */
function BannerWallpaper() {
  const id = React.useId().replace(/:/g, "");
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 480 180"
    >
      <defs>
        <linearGradient id={`wash-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--brand-orange)" stopOpacity="0.16" />
          <stop offset="0.55" stopColor="var(--brand-orange)" stopOpacity="0.04" />
          <stop offset="1" stopColor="var(--accent-white)" stopOpacity="0.6" />
        </linearGradient>
        <pattern id={`dots-${id}`} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="var(--brand-orange)" fillOpacity="0.22" />
        </pattern>
      </defs>
      <rect width="480" height="180" fill={`url(#wash-${id})`} />
      <rect width="480" height="180" fill={`url(#dots-${id})`} />
      {/* price-tag outlines, echoing the KoolBuy logo tag */}
      {[
        { x: 52, y: 118, r: -14, s: 1.1 },
        { x: 410, y: 48, r: 18, s: 1.3 },
        { x: 330, y: 132, r: -8, s: 0.8 },
        { x: 140, y: 40, r: 10, s: 0.7 },
      ].map((t, i) => (
        <g
          key={i}
          transform={`translate(${t.x} ${t.y}) rotate(${t.r}) scale(${t.s})`}
          fill="none"
          stroke="var(--brand-orange)"
          strokeOpacity="0.35"
          strokeWidth="2"
          strokeLinejoin="round"
        >
          <path d="M-22 -12h30l14 12-14 12h-30a4 4 0 0 1-4-4v-16a4 4 0 0 1 4-4z" />
          <circle cx="10" cy="0" r="2.5" />
        </g>
      ))}
    </svg>
  );
}
