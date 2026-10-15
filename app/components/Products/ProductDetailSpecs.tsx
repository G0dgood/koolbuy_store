"use client";

import React from "react";

interface PriceTier {
  price: string;
  range: string;
  isActive?: boolean;
}

export const PriceTiers: React.FC<{ tiers: PriceTier[] }> = ({ tiers }) => {
  return (
    <div className="bg-brand-orange-soft p-4 rounded-[18px] grid grid-cols-3 divide-x divide-black/[0.06]">
      {tiers.map((tier, idx) => (
        <div key={idx} className="flex flex-col gap-1 px-4 first:pl-0 last:pr-0">
          <span className={`text-[20px] font-semibold tracking-[-0.02em] tabular-nums ${tier.isActive ? "text-brand-orange-text" : "text-brand-charcoal"}`}>
            {tier.price}
          </span>
          <span className="text-[12px] text-subtle">{tier.range}</span>
        </div>
      ))}
    </div>
  );
};

interface SpecItem {
  label: string;
  value: string;
}

export const SpecsTable: React.FC<{ specs: SpecItem[] }> = ({ specs }) => {
  return (
    <div className="flex flex-col border-b border-black/[0.06]">
      {specs.map((spec, idx) => (
        <div key={idx} className="flex gap-4 py-3 text-[14px] border-t border-black/[0.06] first:border-t-0">
          <span className="w-28 text-subtle flex-shrink-0">{spec.label}</span>
          <span className="text-brand-charcoal">{spec.value}</span>
        </div>
      ))}
    </div>
  );
};

export const ProtectionWarranty: React.FC = () => {
  return (
    <div className="flex flex-col border-b border-black/[0.06] text-[14px] text-subtle [&>div]:py-3 [&>div]:gap-4 [&>div+div]:border-t [&>div+div]:border-black/[0.06]">
      <div className="flex">
        <span className="w-28 flex-shrink-0">Customization:</span>
        <span className="text-brand-charcoal">Customized logo and design custom packages</span>
      </div>
      <div className="flex">
        <span className="w-28 flex-shrink-0">Protection:</span>
        <span className="text-brand-charcoal">Refund Policy</span>
      </div>
      <div className="flex">
        <span className="w-28 flex-shrink-0">Warranty:</span>
        <span className="text-brand-charcoal">2 years full warranty</span>
      </div>
    </div>
  );
};
