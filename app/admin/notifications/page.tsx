"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { HiOutlineArrowPath } from "react-icons/hi2";
import { StatCard } from "@/app/components/Admin/StatCard";
import { Pagination } from "@/app/components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import { Button } from "@/app/components/Button";
import Modal from "@/app/components/Modal/Modal";
import { EmptyTableRow } from "@/app/components/EmptyState";
import Search from "@/app/components/ui/Search";
import Dropdown from "@/app/components/ui/Dropdown";
import { DatePicker } from "@/app/components/Form/DatePicker";
import { apiErrorMessage } from "@/lib/store/base-api";
import { humanize } from "@/lib/store/api/accounting-api";
import {
  DELIVERY_CHANNELS,
  DELIVERY_STATUSES,
  useGetNotificationLogQuery,
  useGetNotificationStatsQuery,
  useRetryNotificationMutation,
  type NotificationDelivery,
} from "@/lib/store/api/catalogue-admin-api";

/* Notifications: the delivery log of every notification the platform sent
   (in-app, email, SMS, push) with its status, attempts and last error, from
   /admin/notifications/ and /stats/. Failed, dead and not-configured
   deliveries can be retried. Email bodies are never shown (some carry
   delivery codes). There is no editable template model on the backend, so the
   old sample templates were removed. */

const PAGE_SIZES = [20, 50, 100];
const COLS = 7;

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "problem", label: "Problems (failed, dead, not configured)" },
  ...DELIVERY_STATUSES.map((s) => ({
    value: s,
    label: s === "pending" ? "Waiting (pending, processing)" : statusLabel(s),
  })),
];

function statusLabel(s: string) {
  if (s === "skipped_unconfigured") return "Not configured";
  if (s === "skipped_preference") return "Skipped (opted out)";
  if (s === "skipped_no_address") return "Skipped (no address)";
  if (s === "dead") return "Gave up";
  return humanize(s);
}

const channelLabel = (c: string) => (c === "in_app" ? "In-app" : c === "sms" ? "SMS" : humanize(c));

function statusTone(s: string) {
  if (s === "sent" || s === "simulated") return "bg-success-soft text-success";
  if (s === "failed" || s === "dead" || s === "skipped_unconfigured") return "bg-error-soft text-error";
  if (s === "pending" || s === "processing") return "bg-brand-orange-soft text-brand-orange-text";
  return "bg-off-white text-subtle";
}

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${statusTone(status)}`}>
      {statusLabel(status)}
    </span>
  );
}

function formatDateTime(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function NotificationsLogPage() {
  const [status, setStatus] = useState("");
  const [channel, setChannel] = useState("");
  const [kind, setKind] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selected, setSelected] = useState<NotificationDelivery | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  const badRange = !!from && !!to && from > to;
  const stats = useGetNotificationStatsQuery();
  const { data, isLoading, isFetching, isError, error, refetch } = useGetNotificationLogQuery(
    {
      status: status || undefined,
      channel: channel || undefined,
      kind: kind || undefined,
      date_from: from || undefined,
      date_to: to || undefined,
      q: query || undefined,
      page,
      page_size: pageSize,
    },
    { skip: badRange },
  );
  const [retry] = useRetryNotificationMutation();

  const items = badRange ? [] : (data?.items ?? []);
  const kinds = data?.kinds ?? [];
  const total = data?.pagination.total ?? 0;
  const totalPages = total && !badRange ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const filtered = !!(status || channel || kind || from || to || query);

  const reset = () => {
    setStatus("");
    setChannel("");
    setKind("");
    setFrom("");
    setTo("");
    setSearch("");
    setQuery("");
    setPage(1);
  };

  const doRetry = async (d: NotificationDelivery) => {
    setRetryingId(d.id);
    try {
      const res = await retry(d.id).unwrap();
      toast.success(`Retried: now ${statusLabel(res.delivery.status).toLowerCase()}.`);
      if (selected?.id === d.id) setSelected(res.delivery);
    } catch (e) {
      toast.error(apiErrorMessage(e, "Couldn't retry this notification."));
    } finally {
      setRetryingId(null);
    }
  };

  const by = stats.data?.by_status ?? {};
  const stat = (v: number) =>
    stats.isLoading ? (
      <span className="inline-block h-7 w-16 rounded bg-black/[0.06] animate-pulse align-middle" />
    ) : stats.isError ? (
      "—"
    ) : (
      v.toLocaleString()
    );

  const filterChange = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-brand-charcoal">Notifications</h1>
          <p className="text-xs text-subtle mt-0.5">
            Every notification sent to buyers, sellers and staff, and whether it arrived.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" href="/admin/emails">
            Emails
          </Button>
          <Button variant="outline" size="sm" href="/admin/sms">
            SMS
          </Button>
        </div>
      </div>

      {stats.isError ? (
        <div className="bg-white border border-light-gray rounded-lg p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[13px] text-error">{apiErrorMessage(stats.error, "Couldn't load delivery counts.")}</p>
          <Button variant="outline" size="sm" onClick={() => stats.refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard size="sm" title="Sent" value={stat((by.sent ?? 0) + (by.simulated ?? 0))} periodLabel="Last 30 days" />
          <StatCard
            size="sm"
            title="Problems"
            value={stat(stats.data?.problems ?? 0)}
            periodLabel="Failed, gave up or not configured"
            onViewDetails={() => {
              setStatus("problem");
              setPage(1);
            }}
          />
          <StatCard
            size="sm"
            title="Waiting"
            value={stat((by.pending ?? 0) + (by.processing ?? 0))}
            periodLabel="Queued or sending"
          />
          <StatCard
            size="sm"
            title="Skipped"
            value={stat((by.skipped_preference ?? 0) + (by.skipped_no_address ?? 0))}
            periodLabel="Opted out or no address"
          />
        </div>
      )}

      <div className="bg-white border border-light-gray rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 sm:px-6 flex flex-col gap-3 border-b border-light-gray">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
            <Search
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
              placeholder="Search recipient, subject or user"
              maxWidth="max-w-none"
              className="w-full lg:w-80"
            />
            <RowsPerPage value={pageSize} options={PAGE_SIZES} onChange={filterChange(setPageSize)} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-48">
              <Dropdown
                options={STATUS_FILTERS.map((s) => ({ value: s.value, label: s.label }))}
                value={status}
                onChange={(val) => filterChange(setStatus)(String(val ?? ""))}
                placeholder="All statuses"
                searchable={false}
                size="sm"
              />
            </div>
            <div className="w-40">
              <Dropdown
                options={[
                  { value: "", label: "All channels" },
                  ...DELIVERY_CHANNELS.map((c) => ({ value: c, label: channelLabel(c) })),
                ]}
                value={channel}
                onChange={(val) => filterChange(setChannel)(String(val ?? ""))}
                placeholder="All channels"
                searchable={false}
                size="sm"
              />
            </div>
            <div className="w-52">
              <Dropdown
                options={[
                  { value: "", label: "All types" },
                  ...kinds.map((k) => ({ value: k.kind, label: k.label })),
                ]}
                value={kind}
                onChange={(val) => filterChange(setKind)(String(val ?? ""))}
                placeholder="All types"
                searchable={true}
                size="sm"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-medium text-subtle">From</span>
              <div className="w-36">
                <DatePicker
                  value={from}
                  onChange={(v) => filterChange(setFrom)(v ? String(v) : "")}
                  placeholder="Start date"
                  clearable
                  hideLabel
                  align="left"
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-medium text-subtle">To</span>
              <div className="w-36">
                <DatePicker
                  value={to}
                  onChange={(v) => filterChange(setTo)(v ? String(v) : "")}
                  placeholder="End date"
                  clearable
                  hideLabel
                  align="left"
                />
              </div>
            </div>
            {filtered && (
              <Button variant="outline" size="sm" onClick={reset}>
                Clear filters
              </Button>
            )}
          </div>
          {badRange && <p className="text-[12px] text-error">The start date is after the end date.</p>}
        </div>

        <div className={`admin-table-container transition-opacity ${isFetching && !isLoading ? "opacity-60" : ""}`}>
          <table>
            <thead>
              <tr>
                <th>Notification</th>
                <th>Recipient</th>
                <th>Channel</th>
                <th>Status</th>
                <th>Attempts</th>
                <th>Created</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {isLoading && !badRange ? (
                Array.from({ length: 8 }, (_, i) => (
                  <tr key={i} aria-hidden>
                    {Array.from({ length: COLS }, (_, j) => (
                      <td key={j}>
                        <span className="block h-3 w-20 rounded bg-black/[0.06] animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : isError && !badRange ? (
                <tr>
                  <td colSpan={COLS} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-1 max-w-md mx-auto">
                      <p className="text-[13px] text-error">{apiErrorMessage(error, "Couldn't load the notification log.")}</p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
                        Try again
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                filtered ? (
                  <EmptyTableRow
                    colSpan={COLS}
                    illustration="search"
                    title="No matches"
                    description="No notifications match these filters."
                    action={{ label: "Clear filters", onClick: reset }}
                  />
                ) : (
                  <EmptyTableRow
                    colSpan={COLS}
                    illustration="notifications"
                    title="No notifications yet"
                    description="Notifications will appear here as they're sent."
                  />
                )
              ) : (
                items.map((d) => (
                  <tr key={d.id} className="cursor-pointer" onClick={() => setSelected(d)}>
                    <td>
                      <div className="flex flex-col max-w-72">
                        <span className="text-xs font-semibold text-brand-charcoal truncate" title={d.subject || d.notification?.title || d.kind_label}>
                          {d.subject || d.notification?.title || d.kind_label}
                        </span>
                        <span className="text-[11px] text-faint">
                          {d.kind_label}
                          {d.critical ? " · critical" : ""}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col max-w-56">
                        <span className="text-xs text-brand-charcoal truncate">{d.user?.name || d.recipient || "—"}</span>
                        {d.recipient && d.user?.name && <span className="text-[11px] text-faint truncate">{d.recipient}</span>}
                      </div>
                    </td>
                    <td className="text-xs text-subtle whitespace-nowrap">{channelLabel(d.channel)}</td>
                    <td>
                      <StatusPill status={d.status} />
                    </td>
                    <td className="text-xs text-subtle tabular-nums">
                      {d.attempts}/{d.max_attempts}
                    </td>
                    <td className="text-xs text-subtle whitespace-nowrap">{formatDateTime(d.created_at)}</td>
                    <td className="text-right">
                      {d.retryable && (
                        <Button
                          variant="outline"
                          size="sm"
                          iconLeft={<HiOutlineArrowPath size={12} aria-hidden />}
                          disabled={retryingId === d.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            doRetry(d);
                          }}
                        >
                          {retryingId === d.id ? "Retrying…" : "Retry"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Notification details">
        {selected && (
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3 border-b border-light-gray pb-3">
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-brand-charcoal break-words">
                  {selected.subject || selected.notification?.title || selected.kind_label}
                </p>
                <p className="text-xs text-faint">
                  {selected.kind_label} · {channelLabel(selected.channel)}
                  {selected.provider ? ` via ${selected.provider}` : ""}
                </p>
              </div>
              <StatusPill status={selected.status} />
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <Detail label="Recipient">{selected.recipient || "—"}</Detail>
              <Detail label="User">
                {selected.user ? `${selected.user.name || selected.user.email || "—"} (${humanize(selected.user.role)})` : "—"}
              </Detail>
              <Detail label="Attempts">
                {selected.attempts} of {selected.max_attempts}
              </Detail>
              <Detail label="Queued">{formatDateTime(selected.queued_at)}</Detail>
              <Detail label="Sent">{formatDateTime(selected.sent_at)}</Detail>
              <Detail label={selected.failed_at ? "Failed" : "Next attempt"}>
                {formatDateTime(selected.failed_at ?? selected.next_attempt_at)}
              </Detail>
              {selected.notification && (
                <Detail label="In-app notice" wide>
                  {selected.notification.title}
                  {selected.notification.is_read ? ` · read ${formatDateTime(selected.notification.read_at)}` : " · unread"}
                </Detail>
              )}
              {selected.last_error && (
                <Detail label="Last error" wide tone="error">
                  {selected.last_error}
                </Detail>
              )}
            </dl>
            <p className="text-[11px] text-faint">Message bodies aren&apos;t shown because some carry delivery codes.</p>
            {selected.retryable && (
              <div className="flex justify-end">
                <Button
                  variant="accent"
                  iconLeft={<HiOutlineArrowPath size={14} aria-hidden />}
                  disabled={retryingId === selected.id}
                  onClick={() => doRetry(selected)}
                >
                  {retryingId === selected.id ? "Retrying…" : "Retry delivery"}
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function Detail({ label, children, wide, tone }: { label: string; children: React.ReactNode; wide?: boolean; tone?: "error" }) {
  return (
    <div
      className={`p-3 rounded-lg border ${tone === "error" ? "bg-error-soft border-error/20" : "bg-off-white border-light-gray"} ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      <dt className="text-faint">{label}</dt>
      <dd className={`mt-0.5 font-semibold break-words ${tone === "error" ? "text-error" : "text-brand-charcoal"}`}>{children}</dd>
    </div>
  );
}
