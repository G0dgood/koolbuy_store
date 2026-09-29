import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefixElement?: React.ReactNode;
  suffixElement?: React.ReactNode;
  containerClassName?: string;
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ prefixElement, suffixElement, containerClassName = "", className = "", error, ...props }, ref) => {
    return (
      <div className={`relative flex items-center w-full ${containerClassName}`}>
        {prefixElement && (
          <div className="absolute left-3 flex items-center pointer-events-none">
            {prefixElement}
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-white border border-[#d2d2d7] rounded-xl py-3 px-4 text-[15px] text-ink 
            placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-[#0071e3]/15 focus:border-[#0071e3]
            transition-all duration-200
            ${prefixElement ? "pl-10" : ""}
            ${suffixElement ? "pr-10" : ""}
            ${error ? "border-[#e30000] focus:ring-[#e30000]/15 focus:border-[#e30000]" : ""}
            ${className}
          `}
          {...props}
        />
        {suffixElement && (
          <div className="absolute right-3 flex items-center">
            {suffixElement}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`
          w-full bg-white border border-[#d2d2d7] rounded-xl py-3 px-4 text-[15px] text-ink 
          placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-[#0071e3]/15 focus:border-[#0071e3]
          transition-all duration-200 min-h-[100px] resize-y
          ${error ? "border-[#e30000] focus:ring-[#e30000]/15 focus:border-[#e30000]" : ""}
          ${className}
        `}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Input, Textarea };
