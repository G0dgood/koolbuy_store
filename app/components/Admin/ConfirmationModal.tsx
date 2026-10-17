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
      iconBg: "bg-error-soft border-error/20 text-error",
      buttonClass:
        "bg-error hover:bg-error/90 text-white font-semibold focus:ring-error",
    },
    warning: {
      icon: "warning_amber",
      iconFolder: "icon" as const,
      iconBg: "bg-warning/10 border-warning/20 text-warning",
      buttonClass:
        "bg-warning hover:bg-warning/90 text-white font-semibold focus:ring-warning",
    },
    success: {
      icon: "verified",
      iconFolder: "icon" as const,
      iconBg: "bg-success-soft border-success/20 text-success",
      buttonClass:
        "bg-brand-charcoal hover:bg-brand-charcoal/90 text-white font-semibold",
    },
    info: {
      icon: "help_outline",
      iconFolder: "icon" as const,
      iconBg: "bg-off-white border-light-gray text-faint",
      buttonClass:
        "bg-brand-charcoal hover:bg-brand-charcoal/90 text-white font-semibold",
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
            className={`w-11 h-11 rounded-lg border flex items-center justify-center shrink-0 ${config.iconBg}`}
          >
            <Icon
              name={config.icon}
              folder={config.iconFolder}
              size="md"
              className="text-current"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-brand-charcoal leading-tight">
              {title}
            </h2>
            <div className="mt-2 text-xs text-faint leading-relaxed font-normal">
              {message}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-light-gray">
          <Button
            variant="outline"
            type="button"
            className="px-4 h-9 text-xs font-medium rounded-lg text-subtle hover:text-brand-charcoal"
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
