"use client";

import React from "react";

/* Form checkbox (takes normal <input> props), drawn as the Koolboks Sales CRM
   checkbox: the same classes as app/components/Checkbox (styles in
   app/globals.css), at the "medium" size used for options in a form. Supports
   `indeterminate` (a dash) for "some selected". */

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, indeterminate, className = "", ...props }, ref) => {
    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    React.useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = !!indeterminate;
    }, [indeterminate]);

    return (
      <label className={`checkbox-container checkbox-medium ${className}`}>
        <span className="checkbox-round">
          <input type="checkbox" ref={innerRef} className="checkbox-input" {...props} />
          <span className="checkbox-label" aria-hidden />
        </span>
        {label && <span className="checkbox-text-label">{label}</span>}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
export type { CheckboxProps };
