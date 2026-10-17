"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import ModalHeader from "./ModalHeader";
import ModalBody from "./ModalBody";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen?: boolean;
  open?: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "normal" | "large";
  footer?: React.ReactNode;
  className?: string;
  hideHeaderBorder?: boolean;
  header?: React.ReactNode;
}

export default function Modal({
  isOpen,
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  footer,
  className = "",
  hideHeaderBorder = false,
  header,
}: ModalProps) {
  const [mounted, setMounted] = React.useState(false);
  const show = Boolean(isOpen ?? open);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show, mounted]);

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, onClose]);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-7xl",
    normal: "max-w-lg",
    large: "max-w-2xl",
  };

  const hasBody = React.Children.toArray(children).some(
    (child: any) =>
      child?.type === ModalBody ||
      child?.type?.name === "ModalBody" ||
      child?.type?.displayName === "ModalBody"
  );

  const modalContent = (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-[2px] z-40"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className={`relative bg-white rounded-tile text-left overflow-hidden shadow-float border border-light-gray ${
              sizeClasses[size] || "max-w-lg"
            } w-full z-50 max-h-[90vh] flex flex-col ${className}`}
          >
            {header ? (
              header
            ) : title ? (
              <ModalHeader
                title={title}
                description={description}
                onClose={onClose}
                hideBorder={hideHeaderBorder}
              />
            ) : null}

            <div
              className={`overflow-y-auto flex-1 flex flex-col min-h-0 ${
                hasBody ? "" : "px-6 py-5"
              }`}
            >
              {children}
            </div>

            {footer && (
              <div className="px-6 py-4 bg-off-white/70 border-t border-light-gray flex items-center justify-end gap-2.5 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}

export { Modal };
