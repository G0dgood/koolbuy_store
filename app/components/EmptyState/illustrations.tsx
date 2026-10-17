"use client";

import React from "react";

/**
 * Empty-state illustrations (DESIGN.md §7 & §10), same system as
 * EmptyCartIllustration / EmptyProductsIllustration:
 * - 200×160 canvas, warm peach backdrop disc + soft floor shadow
 * - chunky 2.5px ink outlines, white surfaces, Koolboks orange accents
 * - small orange sparkles and dots
 * Colours are theme tokens, so they follow the admin dark mode too.
 */

export type IllustrationName =
  | "payments"
  | "orders"
  | "products"
  | "customers"
  | "reviews"
  | "messages"
  | "notifications"
  | "search"
  | "refunds"
  | "invoices"
  | "loyalty"
  | "vendors"
  | "delivery"
  | "wishlist"
  | "promotions"
  | "documents"
  | "settings"
  | "chart";

const BG = "var(--brand-orange-soft)";
const S = "var(--accent-white)";
const K = "var(--text-primary)";
const A = "var(--brand-orange)";
const M = "var(--medium-gray)";

const ink = {
  stroke: K,
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const line = (w = 3) => ({ stroke: M, strokeWidth: w, strokeLinecap: "round" as const });

function Sparkle({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <path
      d={`M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s}Z`}
      fill={A}
    />
  );
}

/** Backdrop disc, floor shadow and the signature sparkles shared by every scene */
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <circle cx="100" cy="76" r="62" fill={BG} />
      <ellipse cx="100" cy="141" rx="56" ry="5" fill={K} opacity="0.08" />
      {children}
      <Sparkle x={36} y={38} s={5} />
      <Sparkle x={166} y={58} s={4} />
      <circle cx="156" cy="26" r="2.5" fill={A} opacity="0.6" />
      <circle cx="30" cy="108" r="2" fill={K} opacity="0.25" />
    </>
  );
}

/** Small round badge with an orange dash: "nothing here yet" */
function EmptyBadge({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="13" fill={S} {...ink} />
      <path d={`M${cx - 6} ${cy}h12`} stroke={A} strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

const scenes: Record<IllustrationName, React.ReactNode> = {
  payments: (
    <>
      {/* Card */}
      <rect x="46" y="52" width="92" height="58" rx="9" fill={S} {...ink} />
      <path d="M46 68h92" stroke={K} strokeWidth="7" />
      <rect x="58" y="84" width="18" height="12" rx="3" fill={A} />
      <path d="M86 92h30" {...line()} />
      {/* Coins */}
      <ellipse cx="146" cy="118" rx="16" ry="6" fill={S} {...ink} />
      <path d="M130 108v10M162 108v10" {...ink} />
      <ellipse cx="146" cy="108" rx="16" ry="6" fill={S} {...ink} />
      <path d="M140 108h12" stroke={A} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  orders: (
    <>
      {/* Clipboard */}
      <rect x="62" y="36" width="70" height="92" rx="8" fill={S} {...ink} />
      <rect x="80" y="30" width="34" height="14" rx="5" fill={A} {...ink} />
      <path d="M76 62h12M96 62h24M76 78h12M96 78h18M76 94h12M96 94h22" {...line()} />
      <rect
        x="76"
        y="104"
        width="42"
        height="14"
        rx="3"
        fill={BG}
        stroke={A}
        strokeWidth="1.8"
        strokeDasharray="3 2"
      />
      <EmptyBadge cx={146} cy={54} />
    </>
  ),
  products: (
    <>
      <path d="M76 70l6-16h58l-4 16z" fill={S} {...ink} />
      <path d="M60 84l16-14h60l-12 14z" fill={A} fillOpacity="0.25" {...ink} />
      <rect x="84" y="66" width="24" height="14" rx="3" fill={S} stroke={A} strokeWidth="1.8" strokeDasharray="3 2" />
      <path d="M124 84l12-14v42l-12 16z" fill={S} {...ink} />
      <path d="M60 84h64v44H60z" fill={S} {...ink} />
      <path d="M84 84h16v44H84z" fill={A} fillOpacity="0.9" />
      <path d="M60 128h64" {...ink} />
      <path d="M66 106h12M66 112h8" {...line(2.5)} />
    </>
  ),
  customers: (
    <>
      {/* Back person */}
      <circle cx="122" cy="62" r="14" fill={S} {...ink} />
      <path d="M98 116c2-18 12-28 24-28s22 10 24 28z" fill={S} {...ink} />
      {/* Front person */}
      <circle cx="86" cy="68" r="16" fill={S} {...ink} />
      <path d="M58 126c2-22 14-34 28-34s26 12 28 34z" fill={A} {...ink} />
      <circle cx="148" cy="96" r="11" fill={S} {...ink} />
      <path d="M143 96h10M148 91v10" stroke={A} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  reviews: (
    <>
      <path d="M50 44h100a8 8 0 0 1 8 8v46a8 8 0 0 1-8 8H96l-18 16v-16H50a8 8 0 0 1-8-8V52a8 8 0 0 1 8-8z" fill={S} {...ink} />
      {[72, 100, 128].map((x, i) => (
        <path
          key={x}
          d={`M${x} 64l4.5 9 10 1.4-7.2 7 1.7 9.9-9-4.7-9 4.7 1.7-9.9-7.2-7 10-1.4z`}
          fill={i === 0 ? A : BG}
          stroke={i === 0 ? A : M}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      ))}
    </>
  ),
  messages: (
    <>
      <path d="M44 46h72a8 8 0 0 1 8 8v34a8 8 0 0 1-8 8H72l-14 12V96H44a8 8 0 0 1-8-8V54a8 8 0 0 1 8-8z" fill={S} {...ink} />
      <path d="M52 64h48M52 78h32" {...line()} />
      <path d="M156 74H104a8 8 0 0 0-8 8v26a8 8 0 0 0 8 8h32l12 10v-10h8a8 8 0 0 0 8-8V82a8 8 0 0 0-8-8z" fill={A} {...ink} />
      <circle cx="116" cy="95" r="3" fill={S} />
      <circle cx="130" cy="95" r="3" fill={S} />
      <circle cx="144" cy="95" r="3" fill={S} />
    </>
  ),
  notifications: (
    <>
      <path d="M100 38c-20 0-32 15-32 34v20l-10 14h84l-10-14V72c0-19-12-34-32-34z" fill={S} {...ink} />
      <path d="M88 112a12 12 0 0 0 24 0" fill={A} {...ink} />
      <circle cx="100" cy="34" r="5" fill={A} {...ink} />
      <path d="M80 70c0-8 6-16 14-18" stroke={M} strokeWidth="3" strokeLinecap="round" />
      <path d="M150 50c6 6 8 14 6 22M156 40c10 9 13 22 10 34" stroke={A} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
    </>
  ),
  search: (
    <>
      <rect x="44" y="48" width="78" height="62" rx="8" fill={S} {...ink} />
      <path d="M56 66h40M56 80h28M56 94h34" {...line()} />
      <path d="M140 106l18 18" stroke={K} strokeWidth="11" strokeLinecap="round" />
      <path d="M140 106l18 18" stroke={A} strokeWidth="6" strokeLinecap="round" />
      <circle cx="126" cy="92" r="20" fill={S} {...ink} />
      <circle cx="126" cy="92" r="14" fill={BG} />
      <path d="M121.5 88a4.5 4.5 0 1 1 6.5 4c-1.6.8-2 1.6-2 3.2" stroke={A} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="126" cy="100.5" r="1.8" fill={A} />
    </>
  ),
  refunds: (
    <>
      <circle cx="100" cy="82" r="34" fill={S} {...ink} />
      {/* Naira sign */}
      <path d="M90 66v32M110 66v32M90 66l20 32M84 78h32M84 86h32" stroke={A} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M58 70a46 46 0 0 1 72-26" stroke={K} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M124 36l8 8-11 3" stroke={K} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M142 94a46 46 0 0 1-72 26" stroke={A} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M76 128l-8-8 11-3" stroke={A} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  invoices: (
    <>
      <path d="M64 34h72v96l-9-6-9 6-9-6-9 6-9-6-9 6-9-6-9 6z" fill={S} {...ink} />
      <path d="M78 54h44M78 68h30M78 82h44" {...line()} />
      <path d="M78 102h20" stroke={A} strokeWidth="3" strokeLinecap="round" />
      <path d="M108 102h14" stroke={K} strokeWidth="3" strokeLinecap="round" />
      <circle cx="146" cy="56" r="14" fill={A} {...ink} />
      <path d="M140 62l12-12M141 51h.01M151 61h.01" stroke={S} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  loyalty: (
    <>
      {/* Gift box */}
      <rect x="58" y="70" width="74" height="54" rx="5" fill={S} {...ink} />
      <rect x="52" y="56" width="86" height="18" rx="4" fill={S} {...ink} />
      <path d="M95 56v68" stroke={A} strokeWidth="9" />
      <path d="M95 56c-6-14-24-16-24-6 0 6 12 6 24 6zM95 56c6-14 24-16 24-6 0 6-12 6-24 6z" fill={A} {...ink} />
      {/* Star badge */}
      <circle cx="148" cy="98" r="16" fill={S} {...ink} />
      <path d="M148 88l3.5 7 7.6 1.1-5.5 5.4 1.3 7.6-6.9-3.6-6.9 3.6 1.3-7.6-5.5-5.4 7.6-1.1z" fill={A} />
    </>
  ),
  vendors: (
    <>
      <rect x="54" y="66" width="92" height="60" rx="4" fill={S} {...ink} />
      <path d="M50 66l10-26h80l10 26z" fill={S} {...ink} />
      {[50, 70, 90, 110, 130].map((x, i) => (
        <path key={x} d={`M${x} 66q10 14 20 0`} fill={i % 2 ? S : A} {...ink} />
      ))}
      <rect x="66" y="88" width="26" height="38" rx="3" fill={BG} {...ink} />
      <rect x="104" y="86" width="30" height="20" rx="3" fill={S} {...ink} />
      <path d="M110 96h18" {...line(2.5)} />
    </>
  ),
  delivery: (
    <>
      <path d="M40 60h70v52H40z" fill={S} {...ink} />
      <path d="M110 74h24l14 18v20h-38z" fill={A} {...ink} />
      <path d="M118 80h14l8 10h-22z" fill={S} stroke={K} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="64" cy="116" r="10" fill={S} {...ink} />
      <circle cx="64" cy="116" r="3.5" fill={A} />
      <circle cx="132" cy="116" r="10" fill={S} {...ink} />
      <circle cx="132" cy="116" r="3.5" fill={K} />
      <path d="M52 76h30M52 88h20" {...line()} />
      <path d="M24 74h10M20 86h14M26 98h8" stroke={A} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
    </>
  ),
  wishlist: (
    <>
      <path
        d="M100 124s-40-24-40-54c0-14 10-24 22-24 8 0 14 4 18 10 4-6 10-10 18-10 12 0 22 10 22 24 0 30-40 54-40 54z"
        fill={S}
        {...ink}
      />
      <path d="M100 108s-24-15-24-36c0-7 5-12 11-12" stroke={M} strokeWidth="3" strokeLinecap="round" fill="none" />
      <EmptyBadge cx={146} cy={56} />
    </>
  ),
  promotions: (
    <>
      <path d="M56 58h66l24 24-24 24H56a8 8 0 0 1-8-8V66a8 8 0 0 1 8-8z" fill={S} {...ink} />
      <circle cx="120" cy="82" r="6" fill={BG} {...ink} />
      <path d="M66 94l28-26" stroke={A} strokeWidth="3" strokeLinecap="round" />
      <circle cx="70" cy="72" r="5" fill={A} />
      <circle cx="90" cy="90" r="5" fill={A} />
      <path d="M48 112l8 8M152 50l-6 8" stroke={A} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
    </>
  ),
  documents: (
    <>
      <rect x="70" y="34" width="62" height="82" rx="6" fill={S} {...ink} transform="rotate(6 101 75)" />
      <rect x="60" y="40" width="62" height="86" rx="6" fill={S} {...ink} />
      <path d="M72 60h38M72 74h28M72 88h38M72 102h20" {...line()} />
      <circle cx="138" cy="106" r="16" fill={S} {...ink} />
      <path d="M138 96v10l7 5" stroke={A} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  settings: (
    <>
      <rect x="46" y="44" width="108" height="76" rx="8" fill={S} {...ink} />
      <path d="M46 60h108" stroke={K} strokeWidth="2.5" />
      <circle cx="56" cy="52" r="2.5" fill={A} />
      <circle cx="64" cy="52" r="2.5" fill={M} />
      <path d="M62 78h44M62 94h30M62 108h38" {...line()} />
      <rect x="120" y="74" width="22" height="10" rx="5" fill={A} />
      <circle cx="137" cy="79" r="4" fill={S} />
      <rect x="120" y="90" width="22" height="10" rx="5" fill={M} />
      <circle cx="125" cy="95" r="4" fill={S} />
    </>
  ),
  chart: (
    <>
      <rect x="44" y="40" width="112" height="84" rx="8" fill={S} {...ink} />
      <path d="M58 108h84" stroke={K} strokeWidth="2.5" strokeLinecap="round" />
      {[66, 88, 110, 132].map((x, i) => (
        <rect
          key={x}
          x={x - 6}
          y={108 - [18, 30, 22, 40][i]}
          width="12"
          height={[18, 30, 22, 40][i]}
          rx="3"
          fill={i === 3 ? A : BG}
          stroke={i === 3 ? A : M}
          strokeWidth="2"
          strokeDasharray={i === 3 ? undefined : "3 2"}
        />
      ))}
    </>
  ),
};

export const EmptyIllustration: React.FC<{ name: IllustrationName; className?: string; label?: string }> = ({
  name,
  className = "w-[180px] h-[144px]",
  label,
}) => (
  <svg
    viewBox="0 0 200 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role={label ? "img" : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
  >
    <Frame>{scenes[name]}</Frame>
  </svg>
);
