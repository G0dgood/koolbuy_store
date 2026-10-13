"use client";

import React, { useState } from "react";
import Drawer from "../Drawer/Drawer";
import { Button } from "../Button";
import { BRAND, ChartKind, ChartTypePicker, SERIES, SmartChart, naira } from "./DashboardUi";

/* Insights drawer for the admin dashboard, in the CRM dashboard style: plain
   sections with a 15px title, CRM charts (SmartChart) and Naira amounts.
   The section the drawer was opened for comes first. Sample data until the
   analytics API exists. */

type Section = "revenue" | "funnel" | "traffic";

interface DashboardInsightsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection?: Section | null;
}

const TITLES: Record<Section, string> = {
  revenue: "Revenue Insights",
  funnel: "Conversion Breakdown",
  traffic: "Market Intelligence",
};

const MONTHS = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
const ACTUAL = [182_000_000, 214_000_000, 238_000_000, 251_000_000, 266_000_000, 284_800_000];
const PROJECTED = [175_000_000, 205_000_000, 230_000_000, 258_000_000, 279_000_000, 301_000_000];

const FUNNEL = [
  { label: "Store visits", value: 64_800 },
  { label: "Product views", value: 41_200 },
  { label: "Added to cart", value: 9_640 },
  { label: "Checkout started", value: 4_310 },
  { label: "Orders placed", value: 2_160 },
];

const SOURCES = [
  { label: "Direct", value: 38 },
  { label: "Social", value: 27 },
  { label: "Search", value: 21 },
  { label: "WhatsApp", value: 9 },
  { label: "Referral", value: 5 },
];

const REGIONS = [
  { label: "Lagos", value: 168_400_000 },
  { label: "Ogun", value: 46_900_000 },
  { label: "Abuja (FCT)", value: 31_200_000 },
  { label: "Rivers", value: 21_800_000 },
  { label: "Oyo", value: 16_500_000 },
];

/** One block in the drawer: title, optional subtitle and controls, then content. */
function Block({ title, subtitle, aside, children }: { title: string; subtitle?: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section aria-label={title} className="bg-white border border-light-gray rounded-lg p-4 md:p-5">
      <header className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-[15px] font-semibold text-brand-charcoal">{title}</h3>
          {subtitle && <p className="text-[12px] text-faint">{subtitle}</p>}
        </div>
        {aside}
      </header>
      {children}
    </section>
  );
}

function Figure({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="p-3 rounded-lg bg-off-white">
      <p className="text-[12px] text-faint">{label}</p>
      <p className="mt-0.5 text-[18px] font-semibold text-brand-charcoal tabular-nums">{value}</p>
      {hint && <p className="text-[11px] text-faint">{hint}</p>}
    </div>
  );
}

function RevenueSection() {
  const [kind, setKind] = useState<ChartKind>("area");
  const latest = ACTUAL[ACTUAL.length - 1];
  const target = PROJECTED[PROJECTED.length - 1];
  const vsTarget = Math.round((latest / target) * 1000) / 10;
  const growth = Math.round(((latest - ACTUAL[0]) / ACTUAL[0]) * 1000) / 10;

  return (
    <Block
      title="Revenue: actual vs. projected"
      subtitle="The last six months"
      aside={<ChartTypePicker kinds={["area", "line", "bar"]} value={kind} onChange={setKind} />}
    >
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Figure label="This month" value={naira(latest, true)} hint="Actual" />
        <Figure label="Target" value={naira(target, true)} hint={`${vsTarget}% reached`} />
        <Figure label="6-month growth" value={`${growth}%`} hint="Since May" />
      </div>
      <SmartChart
        kind={kind}
        height={240}
        labels={MONTHS}
        series={[
          { label: "Actual", values: ACTUAL, color: BRAND },
          { label: "Projected", values: PROJECTED, color: SERIES[0] },
        ]}
        format={(v) => naira(v, true)}
      />
    </Block>
  );
}

function FunnelSection() {
  const top = FUNNEL[0].value;
  return (
    <Block title="Conversion funnel" subtitle={`${((FUNNEL[FUNNEL.length - 1].value / top) * 100).toFixed(1)}% of visits became orders this month`}>
      <ol className="space-y-2.5">
        {FUNNEL.map((step, i) => {
          const share = (step.value / top) * 100;
          const fromPrev = i === 0 ? null : Math.round((step.value / FUNNEL[i - 1].value) * 100);
          return (
            <li key={step.label}>
              <div className="flex items-center justify-between text-[13px] mb-1">
                <span className="font-medium text-brand-charcoal">{step.label}</span>
                <span className="tabular-nums text-subtle">
                  {step.value.toLocaleString("en-NG")}
                  {fromPrev !== null && <span className="text-faint"> · {fromPrev}% of previous</span>}
                </span>
              </div>
              <div className="h-2 rounded-full bg-off-white overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${Math.max(2, share)}%`, backgroundColor: SERIES[i % SERIES.length] }} />
              </div>
            </li>
          );
        })}
      </ol>
    </Block>
  );
}

function TrafficSection() {
  const [regionKind, setRegionKind] = useState<ChartKind>("bar");
  return (
    <>
      <Block title="Where shoppers come from" subtitle="Share of store visits this month">
        <SmartChart
          kind="donut"
          height={200}
          labels={SOURCES.map((s) => s.label)}
          series={[{ label: "Visits", values: SOURCES.map((s) => s.value) }]}
          format={(v) => `${v}%`}
          centerLabel={{ value: `${SOURCES[0].value}%`, caption: "direct" }}
        />
      </Block>
      <Block
        title="Top regions"
        subtitle="Revenue by state this month"
        aside={<ChartTypePicker kinds={["bar", "donut"]} value={regionKind} onChange={setRegionKind} />}
      >
        <SmartChart
          kind={regionKind}
          height={220}
          labels={REGIONS.map((r) => r.label)}
          series={[{ label: "Revenue", values: REGIONS.map((r) => r.value) }]}
          sliceColors={SERIES}
          horizontal
          format={(v) => naira(v, true)}
          centerLabel={{ value: naira(REGIONS.reduce((a, r) => a + r.value, 0), true), caption: "top 5 states" }}
        />
      </Block>
    </>
  );
}

const SECTIONS: Record<Section, () => React.ReactElement> = {
  revenue: RevenueSection,
  funnel: FunnelSection,
  traffic: TrafficSection,
};

export function DashboardInsightsDrawer({ isOpen, onClose, activeSection }: DashboardInsightsDrawerProps) {
  const first: Section = activeSection ?? "revenue";
  const order: Section[] = [first, ...(["revenue", "funnel", "traffic"] as Section[]).filter((s) => s !== first)];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={activeSection ? TITLES[activeSection] : "Store insights"} width="max-w-xl">
      <div className="flex flex-col gap-4 pb-8">
        <span className="self-start px-2.5 py-1 rounded-full bg-off-white border border-light-gray text-[12px] text-faint">Sample data</span>

        {order.map((s) => {
          const Content = SECTIONS[s];
          return <Content key={s} />;
        })}

        <section className="border border-light-gray rounded-lg p-4 md:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-semibold text-brand-charcoal">Full audit report</h3>
            <p className="text-[12px] text-faint">Every transaction, customer and fulfilment step in one export.</p>
          </div>
          <Button variant="outline" disabled title="Available once the reporting API is connected">
            Generate report
          </Button>
        </section>
      </div>
    </Drawer>
  );
}
