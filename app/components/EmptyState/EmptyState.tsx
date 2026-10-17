"use client";

import React from "react";
import Link from "next/link";
import { EmptyIllustration, type IllustrationName } from "./illustrations";

type Action = { label: string; href?: string; onClick?: () => void };

interface EmptyStateProps {
  /** Which illustration to draw */
  illustration: IllustrationName;
  /** e.g. "No payments yet" */
  title: string;
  /** e.g. "Payments will appear here once they're made." */
  description?: React.ReactNode;
  action?: Action;
  secondaryAction?: Action;
  /**
   * card:   a bordered white panel (use on a page with nothing else to show)
   * inline: no panel (use inside a table cell, drawer or an existing card)
   */
  variant?: "card" | "inline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

function ActionButton({ action, primary }: { action: Action; primary: boolean }) {
  const cls = primary
    ? "inline-flex items-center justify-center h-9 px-4 rounded-full bg-brand-orange text-white text-[13px] font-semibold hover:bg-brand-orange-hover transition-colors duration-200 ease-apple focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50"
    : "inline-flex items-center justify-center h-9 px-4 rounded-full bg-black/[0.04] text-brand-charcoal text-[13px] font-medium hover:bg-black/[0.08] transition-colors duration-200 ease-apple focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50";
  if (action.href) {
    return (
      <Link href={action.href} className={cls}>
        {action.label}
      </Link>
    );
  }
  return (
    <button type="button" onClick={action.onClick} className={cls}>
      {action.label}
    </button>
  );
}

/**
 * Friendly empty state: a custom illustration, a short title and one line on
 * when content will appear. Use it wherever a list or page has nothing to show
 * yet, instead of sample data.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  illustration,
  title,
  description,
  action,
  secondaryAction,
  variant = "inline",
  size = "md",
  className = "",
}) => {
  const panel = variant === "card" ? "bg-white rounded-lg border border-light-gray" : "";
  const pad = size === "sm" ? "py-6 px-4 gap-2" : size === "lg" ? "py-12 px-8 gap-4" : "py-10 md:py-12 px-6 gap-3";
  const art = size === "sm" ? "w-[150px] h-[120px]" : size === "lg" ? "w-[220px] h-[176px]" : "w-[180px] h-[144px]";

  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center text-center ${panel} ${pad} ${className}`}
    >
      <EmptyIllustration name={illustration} className={art} />
      <div className="flex flex-col items-center gap-1 max-w-md">
        <h3 className={`${size === "sm" ? "text-[14px]" : "text-[15px] md:text-[16px]"} font-semibold text-brand-charcoal`}>
          {title}
        </h3>
        {description && (
          <p className={`${size === "sm" ? "text-[12px]" : "text-[13px]"} text-subtle leading-relaxed`}>{description}</p>
        )}
      </div>
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
          {action && <ActionButton action={action} primary />}
          {secondaryAction && <ActionButton action={secondaryAction} primary={false} />}
        </div>
      )}
    </div>
  );
};

/** Empty state as a full-width table row (keeps the table's header visible) */
export const EmptyTableRow: React.FC<EmptyStateProps & { colSpan: number }> = ({ colSpan, ...props }) => (
  <tr>
    <td colSpan={colSpan} className="p-0">
      <EmptyState {...props} variant="inline" />
    </td>
  </tr>
);

export type { IllustrationName };
