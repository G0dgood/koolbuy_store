import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ children, className = "", ...props }) => (
  <label
    className={`block text-sm font-semibold text-brand-charcoal mb-1.5 ${className}`}
    {...props}
  >
    {children}
  </label>
);

interface HintProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  variant?: "default" | "error" | "warning";
}

const Hint: React.FC<HintProps> = ({ children, variant = "default", className = "", ...props }) => {
  const variants = {
    default: "text-brand-orange-text", // Matching the design's orange hint text
    error: "text-error",
    warning: "text-warning",
  };

  return (
    <p
      className={`mt-1.5 text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

export { Label, Hint };
