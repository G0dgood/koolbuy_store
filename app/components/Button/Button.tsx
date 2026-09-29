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
    // Base styles (Apple grammar: 400 weight labels, press = scale 0.95, no shadows)
    const baseStyles =
      "inline-flex items-center justify-center font-normal tracking-[-0.01em] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2 disabled:opacity-40 cursor-pointer active:scale-95";

    // Variant styles
    const variants = {
      // Blue pill — the one "click me" signal
      primary:
        "bg-action text-white hover:bg-action-hover border border-transparent",
      // Ghost pill — second CTA next to a primary
      secondary:
        "bg-transparent text-action border border-action hover:bg-action hover:text-white",
      blue:
        "bg-action text-white hover:bg-action-hover border border-transparent",
      emerald:
        "bg-action text-white hover:bg-action-hover border border-transparent",
      rose: "bg-transparent text-[#e30000] border border-[#e30000]/30 hover:bg-[#e30000] hover:text-white",
      // Pearl capsule — quiet secondary on light surfaces
      outline:
        "bg-pearl text-gray-800 border border-black/[0.08] hover:bg-cream",
      ghost:
        "bg-transparent text-action hover:bg-action-light",
    };

    // Size styles (44px touch target at md+)
    const sizes = {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-[18px] py-2 text-sm gap-2",
      lg: "px-[22px] py-[11px] text-[17px] gap-2.5",
    };

    // Shape styles
    const shapes = {
      rounded: "rounded-lg",
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
