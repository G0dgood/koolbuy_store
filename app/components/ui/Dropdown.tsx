"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Search from "./Search";

export interface DropdownOption {
  value: string;
  label: string;
  status?: string;
  dotColor?: string;
}

export interface DropdownProps {
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  searchable?: boolean;
  options: DropdownOption[];
  value?: string | string[];
  onChange?: (value: any) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  inputClassName?: string;
  multiple?: boolean;
  isMulti?: boolean;
  rightElement?: React.ReactNode;
  renderOptionRight?: (option: DropdownOption) => React.ReactNode;
  /** Where the menu opens. 'auto' (default): below, or above when there isn't room below. */
  direction?: "up" | "down" | "auto";
  redirect?: string;
  onActionClick?: (open: boolean) => void;
  /** Lets the user add what they typed when it isn't an option ("Add “Lekki”"). */
  onCreate?: (text: string) => void;
  /** Label for the add row; gets the typed text. */
  createLabel?: (text: string) => string;
  /** Optional dot indicator color function */
  getOptionDotColor?: (option: DropdownOption) => string | undefined;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal";
}

/**
 * Dropdown component ported directly from koolboks_sales_crm_web (components/ui/Dropdown.tsx).
 * Features portal menu rendering, responsive positioning, keyboard support, search filtering,
 * single & multiple selection, and brand-consistent design.
 */
export const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder = "Select option",
  searchPlaceholder,
  searchable = true,
  options = [],
  redirect,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  className = "",
  inputClassName = "",
  multiple = false,
  isMulti = false,
  rightElement,
  renderOptionRight,
  direction = "auto",
  onActionClick,
  onCreate,
  createLabel = (text) => `Add “${text}”`,
  getOptionDotColor,
  size = "md",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, bottom: 0 });
  const [placeUp, setPlaceUp] = useState(false);
  const [maxListHeight, setMaxListHeight] = useState(224);
  const optionCount = useRef(options.length);
  optionCount.current = options.length;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateCoords = useCallback(() => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        bottom: rect.bottom,
      });
      // The menu's natural height: search box + up to ~6 rows (224px of list).
      const searchH = searchable ? 52 : 0;
      const listH = Math.min(224, Math.max(2, optionCount.current) * 36);
      const below = window.innerHeight - rect.bottom - 12;
      const above = rect.top - 12;
      const up =
        direction === "up" ||
        (direction === "auto" && below < searchH + listH && above > below);
      setPlaceUp(up);
      setMaxListHeight(Math.max(120, Math.min(224, (up ? above : below) - searchH - 8)));
    }
  }, [searchable, direction]);

  useEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener("resize", updateCoords);
      window.addEventListener("scroll", updateCoords, true);

      if (searchable) {
        const timer = setTimeout(() => {
          searchInputRef.current?.focus();
        }, 40);
        return () => {
          clearTimeout(timer);
          window.removeEventListener("resize", updateCoords);
          window.removeEventListener("scroll", updateCoords, true);
        };
      }
    } else {
      setSearchQuery("");
    }
    return () => {
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords, true);
    };
  }, [isOpen, updateCoords, searchable]);

  const isMultiple = Boolean(multiple || isMulti);
  const selectedValues: string[] = isMultiple
    ? Array.isArray(value)
      ? value
      : []
    : typeof value === "string" && value
    ? [value]
    : [];

  const selectedOption =
    !isMultiple && typeof value === "string"
      ? options.find((option) => option.value === value)
      : null;

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter(
      (option) =>
        (option.label && option.label.toLowerCase().includes(q)) ||
        (option.value && option.value.toLowerCase().includes(q))
    );
  }, [options, searchQuery]);

  const typed = searchQuery.trim();
  const canCreate =
    Boolean(onCreate) &&
    typed.length > 0 &&
    !options.some(
      (o) =>
        o.label.toLowerCase() === typed.toLowerCase() ||
        o.value.toLowerCase() === typed.toLowerCase()
    );

  const create = () => {
    onCreate?.(typed);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (!mounted) {
      return placeholder;
    }

    if (isMultiple) {
      if (selectedValues.length === 0) {
        return placeholder;
      }
      if (selectedValues.length === 1) {
        const option = options.find((opt) => opt.value === selectedValues[0]);
        return option ? option.label : placeholder;
      }
      return `${selectedValues.length} selected`;
    }
    return selectedOption ? selectedOption.label : placeholder;
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    if (isMultiple) {
      const currentValues: string[] = Array.isArray(value) ? value : [];
      const newValues: string[] = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      onChange?.(newValues);
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
    }
  };

  const isSelected = (optionValue: string): boolean => {
    if (isMultiple) {
      return selectedValues.includes(optionValue);
    }
    return typeof value === "string" && value === optionValue;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (!target.closest(".dropdown-menu")) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleOptionClick = () => {
    if (redirect) {
      router.push(`/${redirect}`);
    }
    if (onActionClick) {
      onActionClick(true);
      setIsOpen(false);
    }
  };

  const calculatedWidth = Math.max(coords.width, 220);
  const calculatedLeft =
    typeof window !== "undefined"
      ? Math.max(8, Math.min(coords.left, window.innerWidth - calculatedWidth - 8))
      : coords.left;

  const sizeClass = size === "sm" ? "!py-1.5 !px-3 !text-xs !min-h-9" : "";

  return (
    <div className={`dropdown-container ${className}`} ref={dropdownRef}>
      {label && (
        <label className="dropdown-label flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="required-asterisk text-red-500">*</span>}
        </label>
      )}

      <div
        className={`dropdown-wrapper ${isOpen ? "open" : ""} ${error ? "error" : ""} ${
          disabled ? "disabled" : ""
        }`}
      >
        <button
          type="button"
          className={`dropdown-trigger ${inputClassName} ${sizeClass} rounded-[var(--radius)]`}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="flex items-center justify-between w-full gap-2 min-w-0">
            <span
              className={`dropdown-text ${
                (isMultiple ? selectedValues.length === 0 : !selectedOption)
                  ? "placeholder"
                  : ""
              }`}
            >
              {getDisplayText()}
            </span>
            {rightElement && (
              <span className="flex items-center shrink-0">{rightElement}</span>
            )}
            <svg
              className={`dropdown-chevron ${isOpen ? "open" : ""}`}
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M3 4.5L6 7.5L9 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        {isOpen &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              className={`dropdown-menu ${
                placeUp ? "dropdown-menu-up" : ""
              } rounded-[var(--radius)] shadow-lg flex flex-col`}
              style={{
                position: "fixed",
                top: placeUp ? "auto" : `${coords.bottom + 4}px`,
                bottom: placeUp ? `${window.innerHeight - coords.top + 4}px` : "auto",
                left: `${calculatedLeft}px`,
                width: `${calculatedWidth}px`,
                maxWidth: "calc(100vw - 16px)",
                zIndex: 10000,
                backgroundColor: "var(--accent-white, #FFFFFF)",
                borderColor: "var(--light-gray, #E2E8F0)",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            >
              {searchable && (
                <div
                  className="p-2 border-b sticky top-0 z-10"
                  style={{
                    borderColor: "var(--light-gray, #E2E8F0)",
                    backgroundColor: "var(--off-white, #F8F9FA)",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Search
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onClear={() => setSearchQuery("")}
                    showClearButton
                    placeholder={searchPlaceholder || `Search ${label || "options"}...`}
                    className="!w-full !max-w-none !h-[34px] !px-2.5 !py-1"
                    maxWidth="!max-w-none"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === "Escape") {
                        setIsOpen(false);
                      } else if (e.key === "Enter" && filteredOptions.length > 0) {
                        e.preventDefault();
                        handleSelect(filteredOptions[0].value);
                      } else if (e.key === "Enter" && canCreate) {
                        e.preventDefault();
                        create();
                      }
                    }}
                  />
                </div>
              )}

              <div
                className="dropdown-options overflow-y-auto"
                style={{ maxHeight: maxListHeight }}
              >
                {canCreate && (
                  <button
                    type="button"
                    className="dropdown-option"
                    onClick={create}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontWeight: 600,
                      color: "var(--brand-orange-text)",
                    }}
                  >
                    <span aria-hidden>+</span>
                    <span style={{ flex: 1, textAlign: "left" }}>
                      {createLabel(typed)}
                    </span>
                  </button>
                )}
                {canCreate && filteredOptions.length === 0 ? null : options.length ===
                  0 ? (
                  <div className="dropdown-empty-state">
                    <div className="dropdown-empty-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="dropdown-empty-text">
                      <p className="dropdown-empty-title">No options available</p>
                      <div>
                        {redirect && (
                          <button
                            type="button"
                            className="mt-2 text-xs font-semibold text-brand-orange-text hover:underline cursor-pointer"
                            onClick={handleOptionClick}
                          >
                            click to add a new option
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : filteredOptions.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400">
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      No matching options
                    </p>
                    <p className="mt-0.5 text-[11px] text-gray-400">
                      No option matches &quot;{searchQuery}&quot;
                    </p>
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="mt-2 text-[11px] text-brand-orange-text hover:underline font-semibold cursor-pointer"
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`dropdown-option ${
                        isSelected(option.value) ? "selected" : ""
                      } ${isMultiple ? "dropdown-option-multiple" : ""}`}
                      onClick={() => handleSelect(option.value)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "8px",
                      }}
                    >
                      {isMultiple && (
                        <span
                          className="dropdown-checkbox"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flexShrink: 0,
                          }}
                        >
                          {isSelected(option.value) ? (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <rect
                                x="2"
                                y="2"
                                width="12"
                                height="12"
                                rx="2"
                                fill="var(--brand-orange, currentColor)"
                                stroke="var(--brand-orange, currentColor)"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M5 8L7 10L11 6"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <rect
                                x="2"
                                y="2"
                                width="12"
                                height="12"
                                rx="2"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                            </svg>
                          )}
                        </span>
                      )}
                      <div className="flex items-center gap-2 flex-1 text-left min-w-0">
                        {(option.dotColor ||
                          (getOptionDotColor && getOptionDotColor(option))) && (
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{
                              backgroundColor:
                                option.dotColor ||
                                (getOptionDotColor && getOptionDotColor(option)),
                            }}
                          />
                        )}
                        <span className="truncate">{option.label}</span>
                      </div>
                      {renderOptionRight && !isMultiple && (
                        <span
                          style={{
                            marginLeft: "8px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {renderOptionRight(option)}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>,
            document.body
          )}
      </div>

      {error && <span className="dropdown-error">{error}</span>}
    </div>
  );
};

export default Dropdown;
