import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info" | "neutral" | "dot";
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = "default", 
  className = "" 
}) => {
  const isDot = variant === "dot";

  const variants = {
    default: "bg-black/[0.04] text-faint",
    success: "bg-success-soft text-success",
    warning: "bg-brand-orange-soft text-warning",
    error: "bg-error-soft text-error",
    info: "bg-brand-orange-soft text-brand-orange-text",
    neutral: "bg-black/[0.04] text-faint",
    dot: "bg-error text-white",
  };

  return (
    <span className={`
      inline-flex items-center justify-center font-semibold
      ${isDot ? "w-5 h-5 rounded-full text-[11px] p-0" : "px-3 py-1 rounded-full text-[11px]"}
      ${variants[variant]} 
      ${className}
    `}>
      {children}
    </span>
  );
};

export { Badge };
