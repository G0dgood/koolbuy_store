"use client";

import React, { useRef } from "react";
import Link from "next/link";

/* Tab rows in the Koolboks Sales CRM style (Segmented in the CRM's
   components/features/activity/ActivityUi.tsx): tabs joined in one
   light-bordered strip; the selected tab is orange-soft with an orange
   underline. Scrolls sideways on narrow screens instead of squashing.
   Every tab row in the app, storefront and admin, uses TabFilter (buttons
   that switch state) or LinkTabs (links that change the URL). */

/* Shared classes, so TabFilter and LinkTabs can never drift apart. */
export const TAB_SCROLLER = "max-w-full overflow-x-auto no-scrollbar";
export const TAB_STRIP = "rounded-lg border border-light-gray overflow-hidden bg-white";
export const TAB_ITEM =
  "h-9 px-3.5 min-w-16 shrink-0 inline-flex items-center justify-center gap-1.5 text-[13px] font-medium whitespace-nowrap border-r border-light-gray last:border-r-0 transition-colors cursor-pointer outline-none focus-visible:relative focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-orange/50 disabled:cursor-not-allowed disabled:opacity-40";
export const TAB_SELECTED = "bg-brand-orange-soft text-brand-charcoal shadow-[inset_0_-3px_0_var(--brand-orange)]";
export const TAB_IDLE = "bg-white text-subtle hover:text-brand-charcoal";
const COUNT = "min-w-5 h-5 px-1.5 rounded-full inline-flex items-center justify-center text-[11px] font-semibold tabular-nums";
const COUNT_SELECTED = "bg-white text-brand-charcoal";
const COUNT_IDLE = "bg-off-white text-subtle";

export interface TabOption<T extends string = string> {
  value: T;
  label: string;
  count?: number | string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

function TabContent({ label, count, icon, selected }: { label: string; count?: number | string; icon?: React.ReactNode; selected: boolean }) {
  return (
    <>
      {icon && (
        <span className="shrink-0 inline-flex [&>svg]:w-4 [&>svg]:h-4" aria-hidden>
          {icon}
        </span>
      )}
      <span>{label}</span>
      {count !== undefined && count !== null && count !== "" && (
        <span className={`${COUNT} ${selected ? COUNT_SELECTED : COUNT_IDLE}`}>{count}</span>
      )}
    </>
  );
}

interface TabFilterProps<T extends string = string> {
  id?: string;
  /** Simple form: each string is both the value and the label. */
  tabs?: readonly string[];
  /** Full form: distinct value and label, with an optional count and icon. Wins over `tabs`. */
  options?: readonly TabOption<T>[];
  activeTab: string;
  onChange: (value: T) => void;
  ariaLabel?: string;
  containerClassName?: string;
  fullWidth?: boolean;
}

/** A row of tabs that switch state (role="tablist"; arrow keys, Home and End move between tabs). */
export function TabFilter<T extends string = string>({
  id,
  tabs = [],
  options,
  activeTab,
  onChange,
  ariaLabel,
  containerClassName = "",
  fullWidth = false,
}: TabFilterProps<T>) {
  const items: readonly TabOption<T>[] = options ?? tabs.map((t) => ({ value: t as T, label: t }));
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIndex = items.findIndex((o) => o.value === activeTab);
  const focusIndex = selectedIndex >= 0 ? selectedIndex : items.findIndex((o) => !o.disabled);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const enabled = items.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
    if (enabled.length === 0) return;
    const current = refs.current.findIndex((el) => el === document.activeElement);
    const pos = enabled.indexOf(current >= 0 ? current : focusIndex);
    let next: number | undefined;
    if (e.key === "ArrowRight") next = enabled[(pos + 1) % enabled.length];
    else if (e.key === "ArrowLeft") next = enabled[(pos - 1 + enabled.length) % enabled.length];
    else if (e.key === "Home") next = enabled[0];
    else if (e.key === "End") next = enabled[enabled.length - 1];
    if (next === undefined) return;
    e.preventDefault();
    refs.current[next]?.focus();
    onChange(items[next].value);
  };

  return (
    <div className={`${TAB_SCROLLER} ${fullWidth ? "w-full" : "w-fit"} ${containerClassName}`}>
      <div
        id={id}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className={`${fullWidth ? "flex w-full" : "inline-flex"} ${TAB_STRIP}`}
      >
        {items.map((o, i) => {
          const selected = o.value === activeTab;
          return (
            <button
              key={o.value}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              aria-selected={selected}
              tabIndex={i === focusIndex ? 0 : -1}
              disabled={o.disabled}
              onClick={() => onChange(o.value)}
              className={`${TAB_ITEM} ${fullWidth ? "flex-1" : ""} ${selected ? TAB_SELECTED : TAB_IDLE}`}
            >
              <TabContent label={o.label} count={o.count} icon={o.icon} selected={selected} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export interface LinkTab {
  href: string;
  label: string;
  count?: number | string;
  icon?: React.ReactNode;
  /** Overrides the `activeHref` match for this tab. */
  active?: boolean;
}

interface LinkTabsProps {
  links: readonly LinkTab[];
  /** The tab whose href equals this is marked aria-current="page". */
  activeHref?: string;
  ariaLabel?: string;
  /** Replace the history entry instead of pushing one (good for filter tabs). */
  replace?: boolean;
  scroll?: boolean;
  containerClassName?: string;
  fullWidth?: boolean;
}

/** The same tab row where each tab is a link (the active one has aria-current="page"). */
export function LinkTabs({
  links,
  activeHref,
  ariaLabel,
  replace,
  scroll,
  containerClassName = "",
  fullWidth = false,
}: LinkTabsProps) {
  return (
    <nav aria-label={ariaLabel} className={`${TAB_SCROLLER} ${fullWidth ? "w-full" : "w-fit"} ${containerClassName}`}>
      <div className={`${fullWidth ? "flex w-full" : "inline-flex"} ${TAB_STRIP}`}>
        {links.map((l) => {
          const selected = l.active ?? l.href === activeHref;
          return (
            <Link
              key={l.href}
              href={l.href}
              replace={replace}
              scroll={scroll}
              aria-current={selected ? "page" : undefined}
              className={`${TAB_ITEM} ${fullWidth ? "flex-1" : ""} ${selected ? TAB_SELECTED : TAB_IDLE}`}
            >
              <TabContent label={l.label} count={l.count} icon={l.icon} selected={selected} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default TabFilter;
