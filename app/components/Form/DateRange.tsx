"use client";

import React from "react";
import { DatePicker } from "./DatePicker";

export interface DateRangeProps {
  dateFrom: string;
  dateTo: string;
  onChangeDateFrom: (v: string) => void;
  onChangeDateTo: (v: string) => void;
  label?: string;
  className?: string;
}

export const DateRange: React.FC<DateRangeProps> = ({
  dateFrom,
  dateTo,
  onChangeDateFrom,
  onChangeDateTo,
  className = "",
}) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full sm:max-w-xl ${className}`}
    >
      <DatePicker
        label="From"
        placeholder="Pick a date"
        value={dateFrom}
        max={dateTo || undefined}
        onChange={onChangeDateFrom}
        align="left"
        clearable
      />
      <DatePicker
        label="To"
        placeholder="Pick a date"
        value={dateTo}
        min={dateFrom || undefined}
        onChange={onChangeDateTo}
        align="left"
        clearable
      />
    </div>
  );
};

export default DateRange;
