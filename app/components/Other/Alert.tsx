"use client";

import React from "react";
import { Icon } from "../Icon";

interface AlertProps {
  title: string;
  description?: string;
  variant?: "success" | "error" | "warning";
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  title,
  description,
  variant = "success",
  onClose,
  className = "",
}) => {
  const variants = {
    success: {
      bg: "bg-success-soft",
      border: "border-success/20",
      icon: "task_alt",
      iconColor: "text-success",
      titleColor: "text-brand-charcoal",
    },
    error: {
      bg: "bg-error-soft",
      border: "border-error/20",
      icon: "error",
      iconColor: "text-error",
      titleColor: "text-error",
    },
    warning: {
      bg: "bg-brand-orange-soft",
      border: "border-warning/20",
      icon: "warning",
      iconColor: "text-warning",
      titleColor: "text-brand-charcoal",
    },
  };

  const style = variants[variant];

  return (
    <div className={`
      flex items-start gap-3 p-4 rounded-lg border  transition-all animate-in fade-in slide-in-from-top-1
      ${style.bg} ${style.border} ${className}
    `}>
      <Icon name={style.icon} size="sm" className={`mt-0.5 ${style.iconColor}`} />

      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-semibold ${style.titleColor}`}>{title}</h4>
        {description && (
          <p className={`text-xs mt-0.5 font-medium opacity-80 ${style.titleColor}`}>
            {description}
          </p>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className={`p-1 hover:bg-black/5 rounded transition-colors ${style.iconColor}`}
        >
          <Icon name="clear" size="xs" />
        </button>
      )}
    </div>
  );
};

export { Alert };
