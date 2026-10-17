"use client";

import React, { useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { StatCard } from "@/app/components/Admin/StatCard";
import { TabFilter } from "@/app/components/Admin/TabFilter";
import { Pagination } from "@/app/components/Admin/Pagination";
import { StatusBadge } from "@/app/components/Admin/Orders/StatusBadge";
import { RowsPerPage } from "@/app/components/rows-per-page";
import { Input } from "@/app/components/Form/Inputs";
import { Button } from "@/app/components/Button";
import { Icon } from "@/app/components/Icon";
import { EmptyTableRow, type IllustrationName } from "@/app/components/EmptyState";
import {
  apiErrorMessage,
  formatDate,
  formatMoney,
  humanize,
  useGetLoyaltyAccountsQuery,
  useGetLoyaltyLedgerQuery,
  useGetLoyaltyRedemptionsQuery,
  useGetLoyaltySummaryQuery,
  type LoyaltySummaryResponse,
  type LoyaltyUser,
} from "@/lib/store";

/* Loyalty points (backend points programme, read-only).
   - Earning: once per accrual period, a buyer's qualifying (invoiced) spend is
     matched against the spend bands set for each piece of equipment; the band
     decides how many points are credited (earnings ledger).
   - policy.point_value: what one point is worth when redeemed, in the policy
     market's currency (points × point_value, capped at the equipment price).
   - Redemption: buyers spend points toward equipment; when the policy says so
     each request waits for staff approval. There is no approve/reject
     endpoint in the admin API yet, so statuses are shown read-only. */

type Policy = NonNullable<LoyaltySummaryResponse["policy"]>;

const PAGE_SIZES = [10, 20, 50, 100];
const MAIN_TABS = ["Members", "Earnings ledger", "Redemptions"] as const;
type MainTab = (typeof MAIN_TABS)[number];

const REDEMPTION_STATUSES = ["all", "pending", "approved", "rejected"] as const;
type RedemptionStatus = (typeof REDEMPTION_STATUSES)[number];

/** Currency of a market's points policy (backend platform/markets). */
const MARKET_CURRENCY: Record<string, string> = { NG: "NGN", KE: "KES" };

const formatPoints = (n: number | null | undefined) =>
  n === null || n === undefined ? "—" : n.toLocaleString("en-NG", { maximumFractionDigits: 2 });

const periodWord = (period: string | undefined) => (period ? humanize(period).toLowerCase() : "each period");

const userName = (u: LoyaltyUser) => u.name || u.email || "Unknown buyer";

/* ───────────────────────── Shared table bits ───────────────────────── */

function SkeletonRows({ rows, cols }: { rows: number; cols: number }) {
  return (
    <>
      {Array.from({ length: Math.min(rows, 8) }, (_, i) => (
        <tr key={`sk-${i}`} aria-hidden>
          {Array.from({ length: cols }, (_, j) => (
            <td key={j}>
              <span className="block h-3 w-20 rounded bg-black/[0.06] animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function MessageRow({ cols, children }: { cols: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={cols} className="py-16 text-center">
        <div className="flex flex-col items-center gap-1 max-w-md mx-auto">{children}</div>
      </td>
    </tr>
  );
}

function ErrorRow({ cols, error, fallback, onRetry }: { cols: number; error: unknown; fallback: string; onRetry: () => void }) {
  return (
    <MessageRow cols={cols}>
      <p className="text-[13px] text-error">{apiErrorMessage(error, fallback)}</p>
      <Button variant="outline" size="sm" className="mt-2" onClick={onRetry}>
        Try again
      </Button>
    </MessageRow>
  );
}

function EmptyRow({
  cols,
  illustration,
  title,
  hint,
  action,
}: {
  cols: number;
  illustration: IllustrationName;
  title: string;
  hint: React.ReactNode;
  action?: { label: string; onClick: () => void };
}) {
  return <EmptyTableRow colSpan={cols} illustration={illustration} title={title} description={hint} action={action} />;
}

function UserCell({ user }: { user: LoyaltyUser }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-medium text-brand-charcoal">{userName(user)}</span>
      {user.email && user.name && <span className="text-[11px] text-faint">{user.email}</span>}
    </div>
  );
}

function totalPagesOf(total: number | undefined, pageSize: number) {
  return total ? Math.max(1, Math.ceil(total / pageSize)) : 1;
}

/** "How points are earned" sentence, from the live policy. */
function earningHint(policy: Policy | null | undefined) {
  if (!policy) return "No points policy is set up yet, so no points are being credited.";
  if (!policy.enabled) return `The points programme is switched off for ${policy.market}, so no points are being credited.`;
  return `Points are credited ${periodWord(policy.accrual_period)} from each buyer's qualifying spend, using the spend bands set for each piece of equipment.`;
}

/* ───────────────────────── Page ───────────────────────── */

export default function LoyaltyPointsPage() {
  const { data: summary, isLoading, isError, error, refetch } = useGetLoyaltySummaryQuery();
  const [activeTab, setActiveTab] = useState<MainTab>("Members");
  const [memberFilter, setMemberFilter] = useState<LoyaltyUser | null>(null);

  const policy = summary?.policy ?? null;
  const totals = summary?.totals;
  const policyCurrency = policy ? MARKET_CURRENCY[policy.market] : undefined;

  const stat = (v: React.ReactNode) =>
    isLoading ? <span className="inline-block h-7 w-20 rounded bg-black/[0.06] animate-pulse align-middle" /> : isError ? "—" : v;

  const openMemberLedger = (user: LoyaltyUser) => {
    setMemberFilter(user);
    setActiveTab("Earnings ledger");
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-brand-charcoal">Loyalty points</h1>
        <p className="text-xs text-subtle mt-0.5">
          Points buyers earn from qualifying spend and redeem toward equipment.
        </p>
      </div>

      {/* Policy */}
      <PolicyStrip
        policy={policy}
        currency={policyCurrency}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
      />

      {/* Totals (all markets) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard size="sm" title="Members" value={stat((totals?.accounts ?? 0).toLocaleString())} periodLabel="Buyers with a points account" />
        <StatCard size="sm" title="Points earned" value={stat(formatPoints(totals?.points_earned ?? 0))} periodLabel="All time" />
        <StatCard size="sm" title="Points redeemed" value={stat(formatPoints(totals?.points_redeemed ?? 0))} periodLabel="Spent toward equipment" />
        <StatCard size="sm" title="Points balance" value={stat(formatPoints(totals?.points_balance ?? 0))} periodLabel="Available to redeem" />
        <StatCard
          size="sm"
          title="Pending redemptions"
          value={stat((totals?.redemptions_pending ?? 0).toLocaleString())}
          periodLabel={`${(totals?.redemptions_approved ?? 0).toLocaleString()} approved so far`}
        />
      </div>

      {!!totals?.redemption_value_by_currency.length && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {totals.redemption_value_by_currency.map((row) => (
            <StatCard
              key={row.currency}
              size="sm"
              title={`Redeemed value (${row.currency})`}
              value={formatMoney(row.total, row.currency)}
              periodLabel="Approved redemptions"
            />
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border border-light-gray rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-light-gray">
          <TabFilter tabs={[...MAIN_TABS]} activeTab={activeTab} onChange={(t) => setActiveTab(t as MainTab)} />
        </div>

        {activeTab === "Members" && <MembersTab policy={policy} onOpenMember={openMemberLedger} />}
        {activeTab === "Earnings ledger" && (
          <LedgerTab policy={policy} member={memberFilter} onClearMember={() => setMemberFilter(null)} />
        )}
        {activeTab === "Redemptions" && <RedemptionsTab policy={policy} />}
      </div>
    </div>
  );
}

/* ───────────────────────── Policy strip ───────────────────────── */

function PolicyStrip({
  policy,
  currency,
  isLoading,
  isError,
  error,
  onRetry,
}: {
  policy: Policy | null;
  currency: string | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
}) {
  const box = "bg-white border border-light-gray rounded-lg p-4 sm:px-6";

  if (isLoading) {
    return (
      <div className={`${box} grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4`} aria-hidden>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <span className="block h-2.5 w-16 rounded bg-black/[0.06] animate-pulse" />
            <span className="block h-3.5 w-24 rounded bg-black/[0.06] animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`${box} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
        <p className="text-[13px] text-error">{apiErrorMessage(error, "Couldn't load the points policy.")}</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className={box}>
        <p className="text-[13px] font-medium text-brand-charcoal">No points policy is set up</p>
        <p className="text-[12px] text-faint mt-0.5">
          Buyers won&apos;t earn points until an active points policy exists for the market.
        </p>
      </div>
    );
  }

  const pointValue = currency
    ? formatMoney(policy.point_value, currency)
    : `${policy.point_value.toLocaleString()} (${policy.market} currency)`;

  const items: { label: string; value: React.ReactNode; hint?: string }[] = [
    {
      label: "Programme",
      value: (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
            policy.enabled ? "bg-success-soft text-success" : "bg-off-white text-subtle"
          }`}
        >
          {policy.enabled ? "On" : "Off"}
        </span>
      ),
    },
    { label: "Market", value: policy.market },
    {
      label: "How points are earned",
      value: "Spend bands per equipment",
      hint: "Qualifying spend in each period sets the points credited",
    },
    { label: "Credited", value: humanize(policy.accrual_period) },
    { label: "Point value", value: `${pointValue} per point`, hint: "When redeemed, capped at the equipment price" },
    {
      label: "Redemptions",
      value: policy.redemption_requires_approval ? "Need approval" : "Approved automatically",
      hint: `Policy version ${policy.version}`,
    },
  ];

  return (
    <div className={`${box} grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4`}>
      {items.map((it) => (
        <div key={it.label} className="flex flex-col gap-1 min-w-0">
          <span className="text-[11px] text-faint">{it.label}</span>
          <span className="text-[13px] font-semibold text-brand-charcoal">{it.value}</span>
          {it.hint && <span className="text-[11px] text-faint">{it.hint}</span>}
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────── Members ───────────────────────── */

function MembersTab({ policy, onOpenMember }: { policy: Policy | null; onOpenMember: (u: LoyaltyUser) => void }) {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const id = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetLoyaltyAccountsQuery({
    q: query || undefined,
    page,
    page_size: pageSize,
  });
  const items = data?.items ?? [];
  const COLS = 5;

  return (
    <>
      <div className="p-4 sm:px-6 flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-light-gray">
        <Input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search name or email"
          aria-label="Search members"
          containerClassName="w-full sm:w-80"
          className="bg-white border-light-gray placeholder:text-faint text-xs font-medium"
          suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-faint" />}
        />
        <RowsPerPage
          value={pageSize}
          options={PAGE_SIZES}
          onChange={(n) => {
            setPageSize(n);
            setPage(1);
          }}
        />
      </div>

      <div className={`admin-table-container transition-opacity ${isFetching && !isLoading ? "opacity-60" : ""}`}>
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Total points</th>
              <th>Redeemed</th>
              <th>Balance</th>
              <th>Last earned</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <SkeletonRows rows={pageSize} cols={COLS} />
            ) : isError ? (
              <ErrorRow cols={COLS} error={error} fallback="Couldn't load members." onRetry={refetch} />
            ) : items.length === 0 ? (
              query ? (
                <EmptyRow
                  cols={COLS}
                  illustration="search"
                  title="No matches"
                  hint={`No members match "${query}". Try a different name or email.`}
                  action={{
                    label: "Clear search",
                    onClick: () => {
                      setSearch("");
                      setQuery("");
                      setPage(1);
                    },
                  }}
                />
              ) : (
                <EmptyRow
                  cols={COLS}
                  illustration="customers"
                  title="No members yet"
                  hint={`Members will appear here once buyers earn their first points. ${earningHint(policy)}`}
                />
              )
            ) : (
              items.map((acc) => (
                <tr
                  key={acc.id}
                  className="cursor-pointer"
                  onClick={() => onOpenMember(acc.user)}
                  title="See this member's earnings"
                >
                  <td>
                    <button
                      type="button"
                      className="text-left cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenMember(acc.user);
                      }}
                      aria-label={`See earnings for ${userName(acc.user)}`}
                    >
                      <UserCell user={acc.user} />
                    </button>
                  </td>
                  <td className="text-xs text-brand-charcoal tabular-nums">{formatPoints(acc.total_points)}</td>
                  <td className="text-xs text-subtle tabular-nums">{formatPoints(acc.points_redeemed)}</td>
                  <td className="text-xs font-semibold text-brand-charcoal tabular-nums">{formatPoints(acc.balance)}</td>
                  <td className="text-xs text-subtle whitespace-nowrap">{formatDate(acc.last_earned_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={page} totalPages={totalPagesOf(data?.pagination.total, pageSize)} onPageChange={setPage} />
    </>
  );
}

/* ───────────────────────── Earnings ledger ───────────────────────── */

function LedgerTab({
  policy,
  member,
  onClearMember,
}: {
  policy: Policy | null;
  member: LoyaltyUser | null;
  onClearMember: () => void;
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [seenMemberId, setSeenMemberId] = useState(member?.id);

  // A new member filter starts from page 1.
  if (member?.id !== seenMemberId) {
    setSeenMemberId(member?.id);
    setPage(1);
  }

  const badRange = !!from && !!to && from > to;
  const { data, isLoading, isFetching, isError, error, refetch } = useGetLoyaltyLedgerQuery(
    {
      user_id: member?.id,
      from: from || undefined,
      to: to || undefined,
      page,
      page_size: pageSize,
    },
    { skip: badRange },
  );
  const items = badRange ? [] : (data?.items ?? []);
  const filtered = !!member || !!from || !!to;
  const COLS = 5;

  const dateInput = (label: string, value: string, set: (v: string) => void) => (
    <label className="flex items-center gap-2 text-[12px] text-subtle">
      {label}
      <Input
        type="date"
        value={value}
        onChange={(e) => {
          set(e.target.value);
          setPage(1);
        }}
        aria-label={`Period starting ${label.toLowerCase()}`}
        containerClassName="w-40"
        className="bg-white border-light-gray text-xs font-medium"
      />
    </label>
  );

  return (
    <>
      <div className="p-4 sm:px-6 flex flex-col lg:flex-row gap-3 lg:items-center justify-between border-b border-light-gray">
        <div className="flex flex-wrap items-center gap-3">
          {dateInput("From", from, setFrom)}
          {dateInput("To", to, setTo)}
          {(from || to) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFrom("");
                setTo("");
                setPage(1);
              }}
            >
              Clear dates
            </Button>
          )}
          {member && (
            <span className="inline-flex items-center gap-1.5 h-8 pl-3 pr-1.5 rounded-full bg-brand-orange-soft text-[12px] font-medium text-brand-charcoal">
              Member: {userName(member)}
              <button
                type="button"
                onClick={onClearMember}
                aria-label="Remove member filter"
                className="p-1 rounded-full text-subtle hover:text-brand-charcoal cursor-pointer"
              >
                <HiOutlineXMark size={14} />
              </button>
            </span>
          )}
        </div>
        <RowsPerPage
          value={pageSize}
          options={PAGE_SIZES}
          onChange={(n) => {
            setPageSize(n);
            setPage(1);
          }}
        />
      </div>
      {badRange && <p className="px-4 sm:px-6 pt-3 text-[12px] text-error">The start date is after the end date.</p>}

      <div className={`admin-table-container transition-opacity ${isFetching && !isLoading ? "opacity-60" : ""}`}>
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Period</th>
              <th title="Invoiced spend in the period, in the buyer's market currency">Qualifying spend</th>
              <th>Points earned</th>
              <th>Credited</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && !badRange ? (
              <SkeletonRows rows={pageSize} cols={COLS} />
            ) : isError && !badRange ? (
              <ErrorRow cols={COLS} error={error} fallback="Couldn't load the earnings ledger." onRetry={refetch} />
            ) : items.length === 0 ? (
              filtered ? (
                <EmptyRow
                  cols={COLS}
                  illustration="search"
                  title="No matches"
                  hint={member ? `${userName(member)} has no points credited in this range.` : "No points were credited in this date range."}
                  action={{
                    label: "Clear filters",
                    onClick: () => {
                      setFrom("");
                      setTo("");
                      setPage(1);
                      if (member) onClearMember();
                    },
                  }}
                />
              ) : (
                <EmptyRow
                  cols={COLS}
                  illustration="loyalty"
                  title="No points credited yet"
                  hint={`Earnings will appear here once buyers earn points on paid orders. ${earningHint(policy)}`}
                />
              )
            ) : (
              items.map((e) => (
                <tr key={e.id}>
                  <td>
                    <UserCell user={e.user} />
                  </td>
                  <td className="text-xs text-subtle whitespace-nowrap">
                    {formatDate(e.period_start)} – {formatDate(e.period_end)}
                  </td>
                  <td className="text-xs text-brand-charcoal tabular-nums whitespace-nowrap">
                    {e.qualifying_value.toLocaleString("en-NG", { maximumFractionDigits: 2 })}
                  </td>
                  <td className="text-xs font-semibold text-success tabular-nums">+{formatPoints(e.points_earned)}</td>
                  <td className="text-xs text-subtle whitespace-nowrap">{formatDate(e.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="px-4 sm:px-6 pt-3 text-[11px] text-faint">
        Qualifying spend is shown in each buyer&apos;s market currency. Dates filter on the start of the period.
      </p>

      <Pagination
        currentPage={page}
        totalPages={badRange ? 1 : totalPagesOf(data?.pagination.total, pageSize)}
        onPageChange={setPage}
      />
    </>
  );
}

/* ───────────────────────── Redemptions ───────────────────────── */

function RedemptionsTab({ policy }: { policy: Policy | null }) {
  const [status, setStatus] = useState<RedemptionStatus>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetLoyaltyRedemptionsQuery({
    status: status === "all" ? undefined : status,
    page,
    page_size: pageSize,
  });
  const items = data?.items ?? [];
  const counts = data?.counts;
  const countOf = (s: RedemptionStatus) =>
    s === "all" ? Object.values(counts ?? {}).reduce((a, b) => a + b, 0) : (counts?.[s] ?? 0);
  const label = (s: RedemptionStatus) => `${s === "all" ? "All" : humanize(s)}${counts ? ` (${countOf(s)})` : ""}`;
  const COLS = 7;

  const emptyHint = policy?.redemption_requires_approval
    ? "Redemptions will appear here once buyers spend points on equipment. Each request waits for staff approval."
    : "Redemptions will appear here once buyers spend points on equipment from their account.";

  return (
    <>
      <div className="p-4 sm:px-6 flex flex-col md:flex-row gap-3 md:items-center justify-between border-b border-light-gray">
        <TabFilter
          tabs={REDEMPTION_STATUSES.map(label)}
          activeTab={label(status)}
          onChange={(t) => {
            const next = REDEMPTION_STATUSES.find((s) => label(s) === t);
            if (next) {
              setStatus(next);
              setPage(1);
            }
          }}
        />
        <RowsPerPage
          value={pageSize}
          options={PAGE_SIZES}
          onChange={(n) => {
            setPageSize(n);
            setPage(1);
          }}
        />
      </div>

      <div className={`admin-table-container transition-opacity ${isFetching && !isLoading ? "opacity-60" : ""}`}>
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Points spent</th>
              <th>Value</th>
              <th>Equipment price</th>
              <th>Status</th>
              <th>Decided</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <SkeletonRows rows={pageSize} cols={COLS} />
            ) : isError ? (
              <ErrorRow cols={COLS} error={error} fallback="Couldn't load redemptions." onRetry={refetch} />
            ) : items.length === 0 ? (
              status === "all" ? (
                <EmptyRow cols={COLS} illustration="loyalty" title="No redemptions yet" hint={emptyHint} />
              ) : (
                <EmptyRow
                  cols={COLS}
                  illustration="loyalty"
                  title={`No ${humanize(status).toLowerCase()} redemptions`}
                  hint="Redemptions with this status will appear here."
                  action={{
                    label: "Show all redemptions",
                    onClick: () => {
                      setStatus("all");
                      setPage(1);
                    },
                  }}
                />
              )
            ) : (
              items.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="flex flex-col">
                      <UserCell user={r.user} />
                      <span className="text-[11px] text-faint">Requested {formatDate(r.created_at)}</span>
                    </div>
                  </td>
                  <td className="text-xs font-semibold text-brand-charcoal tabular-nums">{formatPoints(r.points_spent)}</td>
                  <td className="whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-brand-charcoal tabular-nums">
                        {formatMoney(r.currency_value, r.currency)}
                      </span>
                      <span className="text-[11px] text-faint">{formatMoney(r.point_value, r.currency)} per point</span>
                    </div>
                  </td>
                  <td className="text-xs text-subtle tabular-nums whitespace-nowrap">
                    {formatMoney(r.equipment_price, r.currency)}
                  </td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="text-xs text-subtle whitespace-nowrap">{formatDate(r.decided_at)}</td>
                  <td className="text-xs text-subtle max-w-56 truncate" title={r.notes || undefined}>
                    {r.notes || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={page} totalPages={totalPagesOf(data?.pagination.total, pageSize)} onPageChange={setPage} />
    </>
  );
}
