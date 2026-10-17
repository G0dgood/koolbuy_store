import React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";

/* Button in the Koolboks Sales CRM style (components/ui/Button.tsx in
   koolboks_sales_crm_web, DESIGN.md §7):
   - primary: charcoal fill, white text (the default button)
   - accent: Koolboks orange, for the one key call-to-action on a screen
   - outline: charcoal border and text; fills charcoal on hover
   - secondary: light grey fill
   - ghost: text only; light grey on hover
   - danger: red fill
   - link: orange text link
   Sizes: md (14×6px padding, 12px text, ≈30px tall) is the standard; sm for
   tight rows; lg only for hero banners. */

type ButtonVariant =
  | "primary"
  | "accent"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "link"
  // Legacy names, kept so older screens keep working.
  | "blue"
  | "emerald"
  | "rose";
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
  fullWidth?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

const base =
  "inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-charcoal text-white hover:bg-brand-charcoal/90 active:bg-brand-charcoal/80 border border-transparent",
  accent: "bg-brand-orange text-white hover:bg-brand-orange-hover active:bg-brand-orange-hover border border-transparent",
  secondary: "bg-black/[0.04] text-brand-charcoal hover:bg-black/[0.07] active:bg-black/[0.1] border border-transparent",
  outline: "bg-transparent text-brand-charcoal border border-brand-charcoal hover:bg-brand-charcoal hover:text-white active:bg-brand-charcoal/90",
  ghost: "bg-transparent text-brand-charcoal hover:bg-black/[0.04] active:bg-light-gray border border-transparent",
  danger: "bg-error text-white hover:bg-error/90 active:bg-error/80 border border-transparent",
  link: "bg-transparent text-brand-orange-text hover:underline !p-0 !h-auto border-0",
  blue: "bg-brand-charcoal text-white hover:bg-brand-charcoal/90 active:bg-brand-charcoal/80 border border-transparent",
  emerald: "bg-brand-charcoal text-white hover:bg-brand-charcoal/90 active:bg-brand-charcoal/80 border border-transparent",
  rose: "bg-error-soft text-error hover:bg-error hover:text-white active:bg-error/90 border border-transparent",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1 text-[11px] md:text-[12px]",
  md: "px-3.5 py-1.5 text-[11px] md:text-[12px]",
  lg: "px-5 py-2.5 text-sm",
};

const shapes: Record<ButtonShape, string> = {
  rounded: "rounded-lg",
  "rounded-sm": "rounded-lg",
  pill: "rounded-full",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      shape = "rounded",
      iconLeft,
      iconRight,
      showChevron,
      isLoading,
      fullWidth,
      href,
      target,
      rel,
      children,
      ...props
    },
    ref,
  ) => {
    // A bg-/text- colour passed in className replaces the variant's, instead of
    // racing it in the stylesheet.
    const overrides = ["bg", "text"].filter((p) =>
      new RegExp(`(^|\\s)${p}-(?!xs|sm|base|lg|xl|\\d|\\[\\d|left|center|right)`).test(className),
    );
    const variantClasses = (variants[variant] ?? variants.primary)
      .split(/\s+/)
      .filter((c) => !overrides.some((p) => new RegExp(`^([a-z-]+:)?${p}-`).test(c)))
      .join(" ");

    const combinedClassName = [
      base,
      variantClasses,
      sizes[size] ?? sizes.md,
      shapes[shape] ?? shapes.rounded,
      fullWidth ? "w-full" : "",
      isLoading ? "cursor-wait" : "",
      // Buttons are flat, as in the CRM: shadow classes passed in are dropped.
      className.replace(/(^|\s)(?:[a-z0-9-]+:)*!?shadow(?:-\S+)?(?=\s|$)/g, " "),
    ]
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    const content = (
      <>
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin shrink-0" aria-hidden />
        ) : (
          iconLeft && <span className="flex items-center justify-center shrink-0">{iconLeft}</span>
        )}
        {/* gap: an icon passed inside the children keeps its distance from the text */}
        {children && <span className="flex items-center justify-center gap-2 truncate">{children}</span>}
        {!isLoading && iconRight && <span className="flex items-center justify-center shrink-0">{iconRight}</span>}
        {!isLoading && showChevron && (
          <ChevronDownIcon
            className={`w-4 h-4 shrink-0 transition-transform ${props["aria-expanded"] ? "rotate-180" : ""}`}
            aria-hidden
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
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
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
        aria-busy={isLoading || undefined}
        {...props}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
