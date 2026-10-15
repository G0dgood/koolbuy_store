"use client";

import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";

/** 'YYYY-MM-DD' in local time (no UTC shift). */
export const toIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

export const fromIso = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (iso: string, n: number) => {
  const d = fromIso(iso);
  d.setDate(d.getDate() + n);
  return toIso(d);
};
export const addDaysIso = addDays;

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export const longDate = (iso: string) =>
  fromIso(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const formatDisplayDate = (iso: string) => {
  if (!iso) return "";
  const d = fromIso(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface DatePickerProps {
  label?: string;
  value?: string | Date;
  onChange: (v: any) => void;
  min?: string;
  max?: string;
  error?: string;
  /** Hint under the field. */
  description?: string;
  placeholder?: string;
  required?: boolean;
  /** Shortcut buttons, as [label, days from `min` or today]. */
  quickPicks?: [string, number][];
  /** Show the clear (X) button. Defaults to `!required`. */
  clearable?: boolean;
  /** Which edge of the field the calendar lines up with. */
  align?: "left" | "right";
  /** Keep the label for screen readers only (e.g. a date in a card header). */
  hideLabel?: boolean;
  className?: string;
  displayFormat?: "long" | "dd/mm/yyyy";
}

/**
 * A date field with the app's own calendar instead of the browser's: a button
 * styled like the other inputs opens a month grid with quick picks. Ported
 * directly from koolboks_sales_crm_web (components/ui/DatePicker.tsx).
 */
export function DatePicker({
  label = "Date",
  value,
  onChange,
  min,
  max,
  error,
  description,
  placeholder = "Pick a date",
  required,
  quickPicks,
  clearable,
  align = "right",
  hideLabel = false,
  className,
  displayFormat,
}: DatePickerProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const today = toIso(new Date());

  const isoValue = useMemo(() => {
    if (!value) return "";
    if (value instanceof Date) return toIso(value);
    return value;
  }, [value]);

  const [month, setMonth] = useState(() => fromIso(isoValue || min || today));
  const box = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<React.CSSProperties | null>(null);

  useEffect(() => {
    if (open) setMonth(fromIso(isoValue || min || today));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      if (!box.current?.contains(t) && !panel.current?.contains(t))
        setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", away);
    document.addEventListener("touchstart", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("touchstart", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  // The calendar is drawn on <body> (so a scrolling modal or card can't clip
  // it), under the field, or above it when there isn't room below.
  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const place = () => {
      const r = trigger.current?.getBoundingClientRect();
      if (!r) return;
      const width = Math.min(300, window.innerWidth - 32);
      const left = Math.max(
        16,
        Math.min(
          align === "left" ? r.left : r.right - width,
          window.innerWidth - width - 16
        )
      );
      const below = window.innerHeight - r.bottom;
      const height = panel.current?.offsetHeight ?? 380;
      setPos(
        below >= height + 16 || below >= r.top
          ? { top: r.bottom + 8, left, width }
          : { bottom: window.innerHeight - r.top + 8, left, width }
      );
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, align]);

  const allowed = (iso: string) =>
    (!min || iso >= min) && (!max || iso <= max);

  // Monday-first grid for the shown month, padded with blanks.
  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const lead = (first.getDay() + 6) % 7;
    const days = new Date(
      month.getFullYear(),
      month.getMonth() + 1,
      0
    ).getDate();
    return [
      ...Array(lead).fill(null),
      ...Array.from({ length: days }, (_, i) =>
        toIso(new Date(month.getFullYear(), month.getMonth(), i + 1))
      ),
    ];
  }, [month]);

  const shift = (n: number) =>
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + n, 1));

  const pick = (iso: string) => {
    if (value instanceof Date) {
      onChange(iso ? fromIso(iso) : undefined);
    } else {
      onChange(iso);
    }
    setOpen(false);
  };

  const handleClear = () => {
    if (value instanceof Date) {
      onChange(undefined);
    } else {
      onChange("");
    }
    setOpen(false);
  };

  const base = min && min > today ? min : today;

  const displayString = useMemo(() => {
    if (!isoValue) return "";
    if (displayFormat === "dd/mm/yyyy" || placeholder === "dd/mm/yyyy") {
      return formatDisplayDate(isoValue);
    }
    return longDate(isoValue);
  }, [isoValue, displayFormat, placeholder]);

  return (
    <div className={cn("input-container relative", className)} ref={box}>
      <label className={hideLabel ? "sr-only" : "input-label"} htmlFor={id}>
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>
      <div className="relative">
        <button
          ref={trigger}
          id={id}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={cn(
            "input-field w-full flex items-center gap-3 text-left cursor-pointer",
            error ? "error" : ""
          )}
        >
          <CalendarIcon
            className="w-4.5 h-4.5 shrink-0"
            style={{ color: "var(--brand-orange)" }}
            aria-hidden
          />
          <span
            className="flex-1 truncate"
            style={{
              color: isoValue ? "var(--text-primary)" : "var(--text-tertiary)",
              fontWeight: 400,
            }}
          >
            {isoValue ? displayString : placeholder}
          </span>
        </button>
        {isoValue && (clearable ?? !required) && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={`Clear ${label}`}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
            style={{ color: "var(--text-tertiary)" }}
          >
            <Cross2Icon className="w-4 h-4" aria-hidden />
          </button>
        )}
      </div>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={panel}
            role="dialog"
            aria-label={label}
            className="fixed z-[1000] p-3 rounded-[var(--radius)] border shadow-xl animate-in fade-in zoom-in-95 duration-100"
            style={{
              ...(pos ?? { top: -9999, left: -9999, width: 300 }),
              backgroundColor: "var(--accent-white)",
              borderColor: "var(--light-gray)",
            }}
          >
            {quickPicks && quickPicks.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {quickPicks.map(([text, days]) => {
                  const iso = addDays(base, days);
                  const on = isoValue === iso;
                  return (
                    <button
                      key={text}
                      type="button"
                      disabled={!allowed(iso)}
                      onClick={() => pick(iso)}
                      className="px-3 h-8 rounded-full border text-[12px] font-medium disabled:opacity-40 cursor-pointer transition-colors"
                      style={{
                        borderColor: on
                          ? "var(--brand-orange)"
                          : "var(--light-gray)",
                        backgroundColor: on
                          ? "var(--brand-orange-soft)"
                          : "transparent",
                        color: on
                          ? "var(--brand-orange-text)"
                          : "var(--text-primary)",
                      }}
                    >
                      {text}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => shift(-1)}
                aria-label="Previous month"
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--bg-primary)] cursor-pointer text-gray-700 transition-colors"
              >
                <ChevronLeftIcon className="w-4 h-4" aria-hidden />
              </button>
              <span
                className="text-[14px] font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {month.toLocaleDateString("en-GB", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <button
                type="button"
                onClick={() => shift(1)}
                aria-label="Next month"
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--bg-primary)] cursor-pointer text-gray-700 transition-colors"
              >
                <ChevronRightIcon className="w-4 h-4" aria-hidden />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS.map((d) => (
                <span
                  key={d}
                  className="text-[11px] font-medium py-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {d}
                </span>
              ))}
              {cells.map((iso, i) =>
                iso ? (
                  <button
                    key={iso}
                    type="button"
                    disabled={!allowed(iso)}
                    onClick={() => pick(iso)}
                    aria-label={longDate(iso)}
                    aria-pressed={iso === isoValue}
                    className="h-9 rounded-full text-[13px] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center"
                    style={{
                      backgroundColor:
                        iso === isoValue
                          ? "var(--brand-orange)"
                          : "transparent",
                      color: iso === isoValue ? "#fff" : "var(--text-primary)",
                      fontWeight:
                        iso === today || iso === isoValue ? 700 : 400,
                      boxShadow:
                        iso === today && iso !== isoValue
                          ? "inset 0 0 0 1px var(--brand-orange)"
                          : undefined,
                    }}
                  >
                    {Number(iso.slice(8))}
                  </button>
                ) : (
                  <span key={`blank-${i}`} />
                )
              )}
            </div>

            <div className="flex gap-2 mt-3 pt-2.5 border-t border-[var(--light-gray)]">
              <button
                type="button"
                onClick={handleClear}
                className="flex-1 py-1.5 text-xs font-semibold rounded-md border border-[var(--light-gray)] hover:bg-[var(--bg-primary)] transition-colors cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => pick(today)}
                className="flex-1 py-1.5 text-xs font-bold rounded-md border transition-colors cursor-pointer"
                style={{
                  borderColor: "var(--brand-orange)",
                  backgroundColor: "var(--brand-orange-soft)",
                  color: "var(--brand-orange-text)",
                }}
              >
                Today
              </button>
            </div>
          </div>,
          document.body
        )}

      {description && (
        <p
          className="-mt-1 text-[12px] leading-snug"
          style={{ color: "var(--text-tertiary)" }}
        >
          {description}
        </p>
      )}
      {error && <span className="input-error">{error}</span>}
    </div>
  );
}

export default DatePicker;
