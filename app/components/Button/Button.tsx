import React from "react";
import { Icon } from "../Icon";
import { motion } from "framer-motion";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "blue"
  | "emerald"
  | "rose"
  | "outline"
  | "ghost";
type ButtonSize = "sm" | "md" | "lg";
type ButtonShape = "rounded" | "rounded-sm" | "pill";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  showChevron?: boolean;
  isLoading?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      shape = "pill",
      iconLeft,
      iconRight,
      showChevron,
      isLoading,
      href,
      target,
      rel,
      children,
      ...props
    },
    ref,
  ) => {
    // Base styles
    const baseStyles =
      "inline-flex items-center justify-center font-semibold transition-all duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] focus:outline-none focus-visible:ring-4 disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer active:translate-y-px";

    // Variant styles
    const variants = {
      primary:
        "bg-brand-orange text-white hover:bg-brand-orange-hover hover:-translate-y-px focus-visible:ring-brand-orange/25 border border-transparent shadow-[var(--shadow-pop)]",
      secondary:
        "bg-white text-ink border-[1.5px] border-ink/15 hover:border-ink/30 hover:bg-cream focus-visible:ring-ink/15",
      blue:
        "bg-ink text-white hover:bg-ink-soft hover:-translate-y-px focus-visible:ring-ink/20 border border-transparent shadow-[0_8px_20px_-10px_rgba(15,61,46,0.7)]",
      emerald:
        "bg-ink text-white hover:bg-ink-soft hover:-translate-y-px focus-visible:ring-ink/20 border border-transparent shadow-sm",
      rose: "bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white active:bg-rose-600 focus:ring-rose-500/50 border border-transparent shadow-sm transition-all",
      outline:
        "bg-white text-ink border-[1.5px] border-gray-200 hover:bg-cream hover:border-gray-300 focus-visible:ring-gray-200 shadow-xs",
      ghost:
        "bg-transparent text-ink hover:bg-cream focus-visible:ring-ink/15",
    };

    // Size styles
    const sizes = {
      sm: "px-2.5 py-1 text-xs gap-1.5",
      md: "px-4 py-2 text-sm gap-2 font-bold",
      lg: "px-6 py-3 text-base gap-3 font-extrabold",
    };

    // Shape styles
    const shapes = {
      rounded: "rounded-xl",
      "rounded-sm": "rounded-[6px]",
      pill: "rounded-full",
    };

    const combinedClassName = `
      ${baseStyles}
      ${variants[variant as keyof typeof variants] || variants.primary}
      ${sizes[size as keyof typeof sizes] || sizes.md}
      ${shapes[shape as keyof typeof shapes] || shapes.rounded}
      ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
      ${className}
    `
      .trim()
      .replace(/\s+/g, " ");

    const content = (
      <>
        {isLoading && (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
          />
        )}
        {!isLoading && iconLeft && (
          <span className="flex justify-center items-center shrink-0">
            {iconLeft}
          </span>
        )}
        {children && (
          <span className="flex items-center justify-center truncate">
            {children}
          </span>
        )}
        {!isLoading && iconRight && (
          <span className="flex justify-center items-center shrink-0">
            {iconRight}
          </span>
        )}
        {!isLoading && showChevron && (
          <Icon
            name="expand_more"
            size={size === "sm" ? "xs" : "sm"}
            className={`ml-1.5 shrink-0 transition-transform ${props["aria-expanded"] ? "rotate-180" : ""}`}
          />
        )}
      </>
    );

    if (href) {
      return (
        <a
          href={href}
          target={target}
          rel={target === "_blank" ? rel || "noopener noreferrer" : rel}
          className={combinedClassName}
          {...(props as any)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
