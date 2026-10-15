"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export interface ModalProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  labelledBy?: string;
  describedBy?: string;
  showClose?: boolean;
  closeOnBackdrop?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "normal" | "large";
  className?: string;
  children: React.ReactNode;
}

const sizeClasses: Record<string, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  "2xl": "max-w-7xl",
  normal: "max-w-lg",
  large: "max-w-2xl",
};

/**
 * Custom accessible CRM Modal:
 * Portalled to <body>, dimmed backdrop, closes on Escape / backdrop click,
 * locks page scroll and moves focus into dialog while open.
 */
export function Modal({
  open,
  isOpen,
  onClose,
  title,
  description,
  header,
  footer,
  labelledBy,
  describedBy,
  showClose = true,
  closeOnBackdrop = true,
  size = "md",
  className = "",
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const isVisible = Boolean(open ?? isOpen);

  useEffect(() => {
    if (!isVisible) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !e.defaultPrevented) onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [isVisible]);

  if (!isVisible || typeof document === "undefined") return null;

  const widthClass = sizeClasses[size] || "max-w-lg";

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#050711]/40 backdrop-blur-[2px] transition-opacity"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden
      />

      {/* Modal Surface */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={`relative w-full rounded-2xl bg-white shadow-2xl outline-none flex flex-col max-h-[90vh] overflow-hidden border border-gray-200 z-10 ${widthClass} ${className}`}
      >
        {header ? (
          header
        ) : title ? (
          <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-semibold text-gray-900">{title}</h2>
              {description && (
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">{description}</p>
              )}
            </div>
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="cursor-pointer ml-3 -mr-1 -mt-1 flex size-7 items-center justify-center rounded-lg bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
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
        ) : showClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex size-7 items-center justify-center rounded-lg bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
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
        ) : null}

        <div className="overflow-y-auto flex-1">{children}</div>

        {footer && (
          <div className="px-6 py-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export function ModalHeader({
  title,
  description,
  onClose,
  className = "",
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}) {
  return (
    <div className={`flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100 ${className}`}>
      <div>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {description && <p className="mt-1 text-xs text-gray-500 leading-relaxed">{description}</p>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="cursor-pointer ml-3 -mr-1 -mt-1 flex size-7 items-center justify-center rounded-lg bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
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

export function ModalBody({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
}

export function ModalFooter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-6 py-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-end gap-2 ${className}`}>
      {children}
    </div>
  );
}

export default Modal;
