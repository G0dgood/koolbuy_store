"use client";

import React from "react";
import Link from "next/link";
import { StatCard } from "@/app/components/Admin/StatCard";
import { Button } from "@/app/components/Button";
import { EmptyState } from "@/app/components/EmptyState";
import { apiErrorMessage } from "@/lib/store/base-api";
import { formatMoney, humanize, useGetLoyaltySummaryQuery } from "@/lib/store/api/accounting-api";

/* Loyalty. The backend has no card tiers or paid plans (no Gold / Silver
   cards): loyalty is a single points programme. Buyers earn points from
   qualifying spend each accrual period and redeem them toward equipment.
   This page shows that live policy and links to the full points ledger. */

const MARKET_CURRENCY: Record<string, string> = { NG: "NGN", KE: "KES" };

export default function LoyaltyPage() {
  const { data, isLoading, isError, error, refetch } = useGetLoyaltySummaryQuery();
  const policy = data?.policy ?? null;
  const totals = data?.totals;
  const currency = policy ? MARKET_CURRENCY[policy.market] : undefined;

  const stat = (v: React.ReactNode) =>
    isLoading ? <span className="inline-block h-7 w-20 rounded bg-black/[0.06] animate-pulse align-middle" /> : isError ? "—" : v;

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-brand-charcoal">Loyalty</h1>
          <p className="text-xs text-subtle mt-0.5">
            One points programme for every buyer: points from qualifying spend, redeemed toward equipment.
          </p>
        </div>
        <Button variant="primary" href="/admin/accounting-loyalty">
          Open points ledger
        </Button>
      </div>

      {isError ? (
        <div className="bg-white border border-light-gray rounded-lg p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[13px] text-error">{apiErrorMessage(error, "Couldn't load the loyalty programme.")}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : !isLoading && !policy ? (
        <EmptyState
          variant="card"
          illustration="loyalty"
          title="No points programme yet"
          description="Buyers will earn points once a points policy is set up for their market."
        />
      ) : (
        <div className="bg-white border border-light-gray rounded-lg p-4 sm:p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[14px] font-semibold text-brand-charcoal">How it works</h2>
            {policy && (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  policy.enabled ? "bg-success-soft text-success" : "bg-off-white text-subtle"
                }`}
              >
                {policy.enabled ? "On" : "Off"} · {policy.market}
              </span>
            )}
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-hidden>
              {Array.from({ length: 3 }, (_, i) => (
                <span key={i} className="block h-20 rounded-lg bg-black/[0.06] animate-pulse" />
              ))}
            </div>
          ) : (
            policy && (
              <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Step n={1} title="Earn">
                  {`Points are credited ${humanize(policy.accrual_period).toLowerCase()} from each buyer's qualifying (invoiced) spend, using the spend bands set for each piece of equipment.`}
                </Step>
                <Step n={2} title="Value">
                  {`One point is worth ${
                    currency ? formatMoney(policy.point_value, currency) : `${policy.point_value} (${policy.market} currency)`
                  } when redeemed, capped at the equipment price.`}
                </Step>
                <Step n={3} title="Redeem">
                  {policy.redemption_requires_approval
                    ? "Buyers spend points toward equipment. Each redemption waits for staff approval."
                    : "Buyers spend points toward equipment. Redemptions are approved automatically."}
                </Step>
              </ol>
            )
          )}
          {policy && <p className="text-[11px] text-faint">Policy version {policy.version}. Changes to the policy are made by finance.</p>}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard size="sm" title="Members" value={stat((totals?.accounts ?? 0).toLocaleString())} periodLabel="Buyers with a points account" />
        <StatCard size="sm" title="Points earned" value={stat((totals?.points_earned ?? 0).toLocaleString())} periodLabel="All time" />
        <StatCard size="sm" title="Points balance" value={stat((totals?.points_balance ?? 0).toLocaleString())} periodLabel="Available to redeem" />
        <StatCard
          size="sm"
          title="Pending redemptions"
          value={stat((totals?.redemptions_pending ?? 0).toLocaleString())}
          periodLabel={`${(totals?.redemptions_approved ?? 0).toLocaleString()} approved so far`}
        />
      </div>

      <p className="text-[12px] text-subtle">
        See every member, the earnings ledger and redemptions on{" "}
        <Link href="/admin/accounting-loyalty" className="font-semibold text-brand-orange-text hover:underline">
          Loyalty points
        </Link>
        .
      </p>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex flex-col gap-1.5 p-4 rounded-lg bg-off-white">
      <span className="text-[11px] font-semibold text-brand-orange-text">Step {n}</span>
      <span className="text-[13px] font-semibold text-brand-charcoal">{title}</span>
      <span className="text-xs text-subtle leading-relaxed">{children}</span>
    </li>
  );
}
