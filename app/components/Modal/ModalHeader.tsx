"use client";

import React from "react";
import { Icon } from "../Icon";

interface ModalHeaderProps {
  title: React.ReactNode;
  onClose?: () => void;
  description?: React.ReactNode;
  className?: string;
  hideBorder?: boolean;
  icon?: string;
}

export default function ModalHeader({
  title,
  onClose,
  description,
  className = "",
  hideBorder = false,
  icon,
}: ModalHeaderProps) {
  return (
    <div
      className={`flex items-start justify-between bg-white px-6 py-4.5 ${
        hideBorder ? "" : "border-b border-light-gray"
      } ${className}`}
    >
      <div className="flex items-start gap-3 min-w-0">
        {icon && (
          <div className="mt-0.5 shrink-0 text-brand-charcoal">
            <Icon name={icon} size="sm" className="text-inherit" />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-brand-charcoal leading-snug">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 text-xs text-faint leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="cursor-pointer ml-3 -mr-1 -mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-off-white text-faint transition-colors hover:bg-black/[0.06] hover:text-brand-charcoal"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
