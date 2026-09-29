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
    default: "bg-gray-100 text-gray-400",
    success: "bg-brand-blue-light text-ink",
    warning: "bg-[#FFF7ED] text-[#b64400]",
    error: "bg-[#FEE2E2] text-[#e30000]",
    info: "bg-brand-blue-light text-brand-blue",
    neutral: "bg-gray-100 text-gray-400",
    dot: "bg-[#e30000] text-white",
  };

  return (
    <span className={`
      inline-flex items-center justify-center font-bold  
      ${isDot ? "w-5 h-5 rounded-full text-[11px] p-0" : "px-3 py-1 rounded-full text-[11px]"}
      ${variants[variant]} 
      ${className}
    `}>
      {children}
    </span>
  );
};

export { Badge };
