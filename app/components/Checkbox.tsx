"use client";

import React, { useId } from "react";

/* Checkbox, the same as the Koolboks Sales CRM's components/ui/Checkbox.tsx
   (styles in app/globals.css: .checkbox-container …). A real <input> sits
   invisibly over a drawn box, so clicks, the keyboard and screen readers all
   work; checked is charcoal (black) with a white tick.
   Sizes: "small" (18px) for table rows, filters, lists and checklists (the
   default here, as most of this app's checkboxes are in tables), "medium"
   (22px) for an option in a form. The older "sm" / "md" / "lg" names still work. */

interface CheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: "small" | "medium" | "default" | "sm" | "md" | "lg";
  /** Kept for older callers; has no effect. */
  variant?: "default" | "error";
  className?: string;
  /** Label content, when it's more than plain text. */
  children?: React.ReactNode;
  /** The accessible name when there's no visible label (e.g. a table's row checkbox). */
  ariaLabel?: string;
}

const SIZE_CLASS: Record<NonNullable<CheckboxProps["size"]>, string> = {
  small: "checkbox-small",
  sm: "checkbox-small",
  md: "checkbox-small",
  medium: "checkbox-medium",
  lg: "checkbox-medium",
  default: "",
};

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked,
  onChange,
  label,
  disabled = false,
  size = "small",
  className = "",
  children,
  ariaLabel,
}) => {
  const generatedId = useId();
  const checkboxId = id || generatedId;
  const text = children ?? label;

  return (
    <div className={`checkbox-container ${SIZE_CLASS[size]} ${className}`}>
      <div className="checkbox-round">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          aria-label={text ? undefined : ariaLabel}
          className="checkbox-input"
        />
        {/* The drawn box. A span, not a label, so the checkbox can sit inside a caller's <label>; the invisible input on top takes the clicks. */}
        <span className="checkbox-label" aria-hidden />
      </div>
      {text && (
        <label htmlFor={checkboxId} className="checkbox-text-label">
          {text}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
