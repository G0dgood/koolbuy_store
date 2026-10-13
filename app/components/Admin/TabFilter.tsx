"use client";

import React from "react";

/* Tab switcher in the Koolboks Sales CRM style (Segmented in the CRM's
   components/features/activity/ActivityUi.tsx): tabs joined in one
   light-bordered strip; the selected tab is orange-soft with an orange
   underline. Scrolls sideways on narrow screens instead of squashing. */

interface TabFilterProps {
  id?: string;
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
  containerClassName?: string;
  fullWidth?: boolean;
}

export const TabFilter: React.FC<TabFilterProps> = ({
  id,
  tabs,
  activeTab,
  onChange,
  containerClassName = "",
  fullWidth = false,
}) => (
  <div className={`max-w-full overflow-x-auto no-scrollbar ${fullWidth ? "w-full" : "w-fit"} ${containerClassName}`}>
    <div
      id={id}
      role="tablist"
      className={`${fullWidth ? "flex w-full" : "inline-flex"} rounded-lg border border-light-gray overflow-hidden bg-white`}
    >
      {tabs.map((tab) => {
        const selected = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab)}
            className={`h-9 px-3.5 min-w-16 shrink-0 text-[13px] font-medium whitespace-nowrap border-r border-light-gray last:border-r-0 transition-colors cursor-pointer ${
              fullWidth ? "flex-1" : ""
            } ${
              selected
                ? "bg-brand-orange-soft text-brand-charcoal shadow-[inset_0_-3px_0_var(--brand-orange)]"
                : "bg-white text-subtle hover:text-brand-charcoal"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  </div>
);
