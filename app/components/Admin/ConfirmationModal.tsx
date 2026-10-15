"use client";

import React from "react";
import { Modal } from "@/app/components/ui/Modal";
import { Button } from "../Button";
import { Icon } from "../Icon";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "success" | "info";
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  isLoading = false,
}) => {
  const typeConfig = {
    danger: {
      icon: "Delete",
      iconFolder: "dashboardIcon" as const,
      iconBg: "bg-rose-50 border-rose-100 text-rose-600",
      buttonClass:
        "bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs focus:ring-rose-500",
    },
    warning: {
      icon: "warning_amber",
      iconFolder: "icon" as const,
      iconBg: "bg-amber-50 border-amber-100 text-amber-600",
      buttonClass:
        "bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs focus:ring-amber-500",
    },
    success: {
      icon: "verified",
      iconFolder: "icon" as const,
      iconBg: "bg-emerald-50 border-emerald-100 text-emerald-600",
      buttonClass:
        "bg-brand-charcoal hover:bg-brand-charcoal/90 text-white font-semibold shadow-xs",
    },
    info: {
      icon: "help_outline",
      iconFolder: "icon" as const,
      iconBg: "bg-sky-50 border-sky-100 text-sky-600",
      buttonClass:
        "bg-brand-charcoal hover:bg-brand-charcoal/90 text-white font-semibold shadow-xs",
    },
  };

  const config = typeConfig[type] || typeConfig.danger;

  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoading ? () => {} : onClose}
      size="sm"
      className="max-w-[440px]"
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div
            className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${config.iconBg}`}
          >
            <Icon
              name={config.icon}
              folder={config.iconFolder}
              size="md"
              className="text-current"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-gray-900 leading-tight">
              {title}
            </h2>
            <div className="mt-2 text-xs text-gray-500 leading-relaxed font-normal">
              {message}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            type="button"
            className="px-4 h-9 text-xs font-medium rounded-lg text-gray-600 hover:text-gray-900"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            className={`px-4 h-9 text-xs rounded-lg transition-all disabled:opacity-50 ${config.buttonClass}`}
            onClick={() => onConfirm()}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
