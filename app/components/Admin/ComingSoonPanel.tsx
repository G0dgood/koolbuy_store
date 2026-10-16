"use client";

import React from "react";
import Link from "next/link";
import { EmptyIllustration, type IllustrationName } from "@/app/components/EmptyState";

/**
 * Placeholder for an admin page whose backend doesn't exist yet. Says plainly
 * what's missing instead of showing sample numbers that look real.
 */
export const ComingSoonPanel: React.FC<{
  title: string;
  description: string;
  /** What has to exist on the backend before this page can show data */
  needs: string[];
  related?: { label: string; href: string }[];
  /** Empty-state illustration to show above the title */
  illustration?: IllustrationName;
}> = ({ title, description, needs, related = [], illustration = "documents" }) => (
  <div className="bg-white rounded-lg border border-light-gray p-8 md:p-12 flex flex-col items-center text-center gap-5">
    <EmptyIllustration name={illustration} className="w-40 h-32" label="Coming soon" />
    <div className="flex flex-col items-center gap-2 max-w-lg">
      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-brand-orange-soft text-brand-charcoal">
        Coming soon
      </span>
      <h1 className="text-[18px] md:text-[20px] font-semibold text-brand-charcoal tracking-[-0.02em]">{title}</h1>
      <p className="text-[13px] text-subtle leading-relaxed">{description}</p>
    </div>

    <div className="w-full max-w-md text-left bg-off-white rounded-stage p-4 flex flex-col gap-2">
      <span className="text-[12px] font-semibold text-brand-charcoal">Needed before this page can show data</span>
      <ul className="flex flex-col gap-1.5">
        {needs.map((n) => (
          <li key={n} className="flex items-start gap-2 text-[13px] text-subtle">
            <span aria-hidden="true" className="mt-[7px] w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" />
            {n}
          </li>
        ))}
      </ul>
    </div>

    {related.length > 0 && (
      <div className="flex flex-wrap items-center justify-center gap-2">
        {related.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            className="px-3.5 py-1.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[12px] font-medium text-brand-charcoal transition-colors"
          >
            {r.label} ›
          </Link>
        ))}
      </div>
    )}
  </div>
);
