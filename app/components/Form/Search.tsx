"use client";

import React, { forwardRef, useRef, useState } from "react";

export interface SearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  maxWidth?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  active?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  showClearButton?: boolean;
}

/**
 * Search input component directly ported from koolboks_sales_crm_web (components/ui/Search.tsx).
 * Features focus state highlighting, the CRM search-refraction icon, and optional clear button.
 */
const Search = forwardRef<HTMLInputElement, SearchProps>(
  (
    {
      placeholder = "Search",
      value = "",
      onChange,
      className = "",
      maxWidth = "max-w-md",
      disabled = false,
      autoFocus = false,
      active = false,
      inputRef,
      onSearch,
      onClear,
      onKeyDown,
      onFocus,
      onBlur,
      onClick,
      showClearButton = true,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const innerRef = useRef<HTMLInputElement | null>(null);

    const isActive = Boolean(active || isFocused);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (e.key === "Enter" && onSearch) {
        onSearch(value);
      }
    };

    const handleClear = () => {
      if (onChange) {
        try {
          const fnStr = onChange.toString();
          if (fnStr.includes(".target")) {
            (onChange as any)({ target: { value: "" } });
          } else {
            (onChange as any)("");
          }
        } catch {
          (onChange as any)("");
        }
      }
      onClear?.();
      innerRef.current?.focus();
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
      if (
        !disabled &&
        innerRef.current &&
        document.activeElement !== innerRef.current
      ) {
        innerRef.current.focus();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!onChange) return;
      try {
        const fnStr = onChange.toString();
        if (fnStr.includes(".target")) {
          (onChange as any)(e);
          return;
        }
      } catch {}
      (onChange as any)(e.target.value);
    };

    const hasExplicitWidth =
      className.includes("w-") || className.includes("!w-");
    const defaultWidth = hasExplicitWidth
      ? ""
      : "w-full sm:w-[320px] md:w-[300px] lg:w-[400px]";
    const hasExplicitHeight =
      className.includes("h-") || className.includes("!h-");
    const defaultHeight = hasExplicitHeight ? "" : "h-[42px]";

    return (
      <div
        onClick={handleClick}
        className={`search-container box-border flex flex-row items-center px-[12px] py-[8px] gap-2.5 ${defaultWidth} ${defaultHeight} border relative ${maxWidth} rounded-[var(--radius)] transition-[border-color,box-shadow,background-color] duration-200 cursor-text ${
          isActive ? "active search-active is-active" : ""
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
        style={{
          backgroundColor: "var(--accent-white)",
          borderColor: isActive
            ? "var(--input-focus-border, var(--brand-orange))"
            : "var(--light-gray)",
          boxShadow: isActive ? "0 0 0 3px var(--shadow-light)" : "none",
        }}
      >
        <div
          className="flex items-center shrink-0 transition-colors duration-200"
          style={{
            color: isActive ? "var(--brand-orange)" : "var(--text-tertiary)",
          }}
        >
          {/* CRM search-refraction icon */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
            aria-hidden="true"
          >
            <path
              d="M17.5 17.5L13.875 13.875M9.16667 5C11.4679 5 13.3333 6.86548 13.3333 9.16667M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
              stroke="currentColor"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <input
          ref={(node) => {
            innerRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref)
              (
                ref as React.MutableRefObject<HTMLInputElement | null>
              ).current = node;
            if (typeof inputRef === "function") inputRef(node);
            else if (inputRef)
              (
                inputRef as React.MutableRefObject<HTMLInputElement | null>
              ).current = node;
          }}
          autoFocus={autoFocus}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          disabled={disabled}
          className={`search-input flex-1 text-[13px] font-normal leading-[150%] dark:text-gray-300 bg-transparent dark:placeholder:text-faint focus:outline-none ${
            showClearButton && value ? "pr-1" : ""
          }`}
          style={{
            color: "var(--text-primary)",
          }}
          suppressHydrationWarning
        />
        {showClearButton && Boolean(value) && (
          <button
            onClick={handleClear}
            className="flex items-center text-faint hover:text-subtle dark:text-gray-500 dark:hover:text-faint transition-colors p-1 rounded-full cursor-pointer hover:bg-black/[0.06] dark:hover:bg-gray-800"
            type="button"
            title="Clear Search"
            aria-label="Clear Search"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 5L15 15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Search.displayName = "Search";

export { Search };
export default Search;
