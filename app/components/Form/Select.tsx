"use client";

import React from "react";
import Dropdown, { DropdownOption } from "../ui/Dropdown";

export interface Option {
  value: string;
  label: string;
  status?: string;
}

export interface SelectProps<T extends boolean = false> {
  options: Option[];
  value?: T extends true ? string[] : string;
  onChange?: (value: T extends true ? string[] : string) => void;
  placeholder?: string;
  isMulti?: T;
  multiple?: boolean;
  className?: string;
  label?: string;
  searchable?: boolean;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * Select component powered by the CRM Dropdown component.
 * Maintains full backward compatibility with SelectProps while adopting
 * the exact styling, collision detection, search filtering, and portal behavior from koolboks_sales_crm_web.
 */
export const Select = <T extends boolean = false>({
  options,
  value,
  onChange,
  placeholder = "Select option",
  isMulti = false as T,
  multiple,
  className = "",
  label,
  searchable,
  disabled,
  error,
  required,
  size,
  ...rest
}: SelectProps<T>) => {
  return (
    <Dropdown
      options={options}
      value={value as any}
      onChange={(val) => onChange?.(val as any)}
      placeholder={placeholder}
      multiple={Boolean(isMulti || multiple)}
      className={className}
      label={label}
      searchable={searchable !== undefined ? searchable : true}
      disabled={disabled}
      error={error}
      required={required}
      size={size}
      {...rest}
    />
  );
};

export default Select;
