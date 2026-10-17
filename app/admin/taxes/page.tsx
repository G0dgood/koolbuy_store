"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiOutlineArrowDownTray, HiOutlineInformationCircle } from "react-icons/hi2";
import { StatCard } from "@/app/components/Admin/StatCard";
import { Pagination } from "@/app/components/Admin/Pagination";
import { StatusBadge } from "@/app/components/Admin/Orders/StatusBadge";
import { RowsPerPage } from "@/app/components/rows-per-page";
import { Input } from "@/app/components/Form/Inputs";
import Search from "@/app/components/ui/Search";
import { DatePicker } from "@/app/components/Form/DatePicker";
import { Button } from "@/app/components/Button";
import { Icon } from "@/app/components/Icon";
import Dropdown from "@/app/components/Form/Dropdown";
import { EmptyTableRow } from "@/app/components/EmptyState";
import {
  apiErrorMessage,
  formatDate,
  formatMoney,
  humanize,
  useGetTaxesQuery,
  type TaxInvoiceRow,
  type TaxesResponse,
} from "@/lib/store";

/* VAT report. Tax in the backend exists only as VAT on BNPL financing
   invoices (GET /admin/accounting/taxes/), set by the active financing policy.
   Regular orders and payments carry no VAT, and there is no withholding tax.
   Rates come back as fractions (0.075 = 7.5%). Totals are per currency and are
   never summed across currencies. Totals skip invoices never issued or voided
   (pending approval, declined, cancelled); those still appear in the list. */

const COLUMNS = 8;

type Policy = NonNullable<TaxesResponse["policy"]>;

const pct = (fraction: number | null | undefined) =>
  fraction === null || fraction === undefined
    ? "—"
    : `${(fraction * 100).toLocaleString("en-NG", { maximumFractionDigits: 3 })}%`;

const vatIsOn = (p: Policy | null | undefined) => !!p && p.vat_rate > 0 && p.vat_applies_to !== "none";

const retailerName = (r: TaxInvoiceRow["retailer"]) => r?.business_name || r?.name || "—";

/* Client-side CSV of the rows currently on screen (there's no export endpoint). */
function downloadPageCsv(rows: TaxInvoiceRow[]) {
  const header = [
    "Invoice number",
    "Issued",
    "Retailer",
    "Contact name",
    "Email",
    "Currency",
    "Taxable subtotal",
    "VAT rate (%)",
    "VAT amount",
    "Total payable",
    "Status",
  ];
  const cell = (v: string | number | null | undefined) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = rows.map((r) =>
    [
      r.invoice_number,
      r.issued_at ? r.issued_at.slice(0, 10) : "",
      r.retailer?.business_name ?? "",
      r.retailer?.name ?? "",
      r.retailer?.email ?? "",
      r.currency,
      r.taxable_subtotal,
      Math.round(r.vat_rate * 100000) / 1000,
      r.vat_amount,
      r.total_payable,
      r.status,
    ]
      .map(cell)
      .join(","),
  );
  const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `vat-invoices-page-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function TaxesReportPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [vatOnly, setVatOnly] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce the search box into the query sent to the server.
  useEffect(() => {
    const id = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  const rangeInvalid = !!from && !!to && from > to;

  const { data, isLoading, isFetching, isError, error, refetch } = useGetTaxesQuery(
    {
      q: query || undefined,
      vat_only: vatOnly || undefined,
      from: from || undefined,
      to: to || undefined,
      page: currentPage,
      page_size: rowsPerPage,
    },
    { skip: rangeInvalid },
  );

  const items = data?.items ?? [];
  const totals = data?.totals ?? [];
  const policy = data?.policy ?? null;
  const totalPages = data?.pagination ? Math.max(1, Math.ceil(data.pagination.total / rowsPerPage)) : 1;
  const filtered = !!(query || vatOnly || from || to);
  const on = vatIsOn(policy);

  const statValue = (render: (t: TaxesResponse["totals"][number]) => string, empty: string) => {
    if (isLoading) return <span className="inline-block h-7 w-20 rounded bg-black/[0.06] animate-pulse align-middle" />;
    if (totals.length === 0) return empty;
    return (
      <span className="flex flex-col gap-0.5">
        {totals.map((t) => (
          <span key={t.currency}>{render(t)}</span>
        ))}
      </span>
    );
  };

  const resetPage = () => setCurrentPage(1);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Financing policy (read-only: VAT can't be changed through the API) */}
      <div className="bg-white rounded-lg border border-light-gray p-4 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-brand-charcoal">VAT policy</h2>
            <p className="text-[12px] text-faint">From the active BNPL financing policy</p>
          </div>
          {policy && (
            <span
              className={`self-start sm:self-auto inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                on ? "bg-success-soft text-success" : "bg-off-white text-subtle"
              }`}
            >
              {on ? `VAT on at ${pct(policy.vat_rate)}` : "VAT off"}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4" aria-hidden>
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className="block h-9 rounded bg-black/[0.06] animate-pulse" />
            ))}
          </div>
        ) : policy ? (
          <dl className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
            {[
              ["VAT", on ? `On at ${pct(policy.vat_rate)}` : "Off"],
              ["Applies to", humanize(policy.vat_applies_to)],
              ["Delivery fee VAT-able", policy.delivery_fee_vatable ? "Yes" : "No"],
              ["Market", policy.market],
              ["Policy version", `v${policy.version}`],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-0.5">
                <dt className="text-faint">{label}</dt>
                <dd className="font-semibold text-brand-charcoal">{value}</dd>
              </div>
            ))}
          </dl>
        ) : !isError ? (
          <p className="text-xs text-subtle">No active financing policy was found.</p>
        ) : null}

        {!isLoading && !on && (
          <div className="flex items-start gap-2 rounded-md bg-off-white p-3 text-xs text-subtle">
            <HiOutlineInformationCircle size={16} className="shrink-0 mt-px text-faint" />
            <p>
              VAT is currently off in the financing policy, so no VAT has been charged. Only BNPL financing invoices
              can carry VAT; regular orders don&apos;t.
            </p>
          </div>
        )}
      </div>

      {/* Totals for the current filters, per currency */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="VAT collected"
          value={statValue((t) => formatMoney(t.vat_total, t.currency), formatMoney(0))}
          periodLabel={filtered ? "Matching filters" : "All issued invoices"}
        />
        <StatCard
          title="Taxable amount"
          value={statValue((t) => formatMoney(t.taxable_total, t.currency), formatMoney(0))}
          periodLabel="Base VAT was charged on"
        />
        <StatCard
          title="Invoices"
          value={statValue(
            (t) => (totals.length > 1 ? `${t.invoices_count.toLocaleString()} ${t.currency}` : t.invoices_count.toLocaleString()),
            "0",
          )}
          periodLabel="Issued, not voided"
        />
        <StatCard
          title="Current VAT rate"
          value={
            isLoading ? (
              <span className="inline-block h-7 w-20 rounded bg-black/[0.06] animate-pulse align-middle" />
            ) : on ? (
              pct(policy?.vat_rate)
            ) : (
              "0%"
            )
          }
          periodLabel={on ? `On ${humanize(policy?.vat_applies_to).toLowerCase()}` : "VAT is off"}
        />
      </div>

      {/* Invoices */}
      <div className="bg-white rounded-lg overflow-hidden flex flex-col border border-light-gray">
        <div className="p-4 sm:p-6 flex flex-col xl:flex-row gap-4 xl:items-end justify-between border-b border-light-gray">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Dropdown
              options={[
                { value: "all", label: "All invoices" },
                { value: "vat_only", label: "VAT-charged only" },
              ]}
              value={vatOnly ? "vat_only" : "all"}
              onChange={(val) => {
                setVatOnly(val === "vat_only");
                resetPage();
              }}
              searchable={false}
              size="sm"
              className="w-full sm:w-44"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-auto sm:min-w-[320px]">
              <DatePicker
                label="From"
                hideLabel
                placeholder="From date"
                value={from}
                max={to || undefined}
                onChange={(v: string) => {
                  setFrom(v);
                  resetPage();
                }}
                align="left"
                clearable
              />
              <DatePicker
                label="To"
                hideLabel
                placeholder="To date"
                value={to}
                min={from || undefined}
                onChange={(v: string) => {
                  setTo(v);
                  resetPage();
                }}
                align="left"
                clearable
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
            <Search
              value={search}
              onChange={(val) => {
                const s = typeof val === "string" ? val : (val as any).target?.value ?? "";
                setSearch(s);
                resetPage();
              }}
              placeholder="Search invoice number or retailer"
              className="w-full xl:!w-80"
              maxWidth="max-w-none"
            />
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <RowsPerPage
                value={rowsPerPage}
                options={[10, 20, 50, 100]}
                onChange={(n) => {
                  setRowsPerPage(n);
                  resetPage();
                }}
              />
              <Button
                variant="outline"
                shape="rounded-sm"
                className="ml-auto sm:ml-0 whitespace-nowrap"
                onClick={() => downloadPageCsv(items)}
                disabled={items.length === 0}
                iconLeft={<HiOutlineArrowDownTray size={14} />}
                title="Download the rows shown on this page as CSV"
              >
                Export this page
              </Button>
            </div>
          </div>
        </div>

        <div className={`admin-table-container transition-opacity ${isFetching && !isLoading ? "opacity-60" : ""}`}>
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Issued</th>
                <th>Retailer</th>
                <th>Taxable subtotal</th>
                <th>VAT rate</th>
                <th>VAT amount</th>
                <th>Total payable</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rangeInvalid ? (
                <tr>
                  <td colSpan={COLUMNS} className="py-16 text-center text-[13px] text-error">
                    The start date is after the end date.
                  </td>
                </tr>
              ) : isLoading ? (
                Array.from({ length: Math.min(rowsPerPage, 8) }, (_, i) => (
                  <tr key={`sk-${i}`} aria-hidden>
                    {Array.from({ length: COLUMNS }, (_, j) => (
                      <td key={j}>
                        <span className="block h-3 w-20 rounded bg-black/[0.06] animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : isError ? (
                <EmptyTableRow
                  colSpan={COLUMNS}
                  illustration="server"
                  title="Couldn't load VAT invoices"
                  description={apiErrorMessage(error, "Couldn't load VAT invoices.")}
                  action={{ label: "Try again", onClick: () => refetch() }}
                />
              ) : items.length === 0 ? (
                vatOnly && !on ? (
                  <EmptyTableRow
                    colSpan={COLUMNS}
                    illustration="invoices"
                    title="No VAT charged"
                    description="No invoice has VAT charged, because VAT is off in the financing policy."
                    action={{
                      label: "Show all invoices",
                      onClick: () => {
                        setVatOnly(false);
                        resetPage();
                      },
                    }}
                  />
                ) : filtered ? (
                  <EmptyTableRow
                    colSpan={COLUMNS}
                    illustration="search"
                    title="No matches"
                    description="No invoices match these filters."
                    action={{
                      label: "Clear filters",
                      onClick: () => {
                        setSearch("");
                        setQuery("");
                        setVatOnly(false);
                        setFrom("");
                        setTo("");
                        resetPage();
                      },
                    }}
                  />
                ) : (
                  <EmptyTableRow
                    colSpan={COLUMNS}
                    illustration="invoices"
                    title="No VAT yet"
                    description="VAT will appear here once invoices are issued with VAT. Only BNPL financing invoices carry it."
                  />
                )
              ) : (
                items.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => router.push(`/admin/bnpl-orders/${row.id}`)}
                    className="cursor-pointer"
                  >
                    <td className="whitespace-nowrap">
                      <Link
                        href={`/admin/bnpl-orders/${row.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-semibold text-brand-orange-text hover:underline"
                      >
                        {row.invoice_number}
                      </Link>
                    </td>
                    <td className="text-xs text-subtle whitespace-nowrap">{formatDate(row.issued_at)}</td>
                    <td>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-brand-charcoal">{retailerName(row.retailer)}</span>
                        {row.retailer?.business_name && row.retailer?.name && (
                          <span className="text-[11px] text-subtle">{row.retailer.name}</span>
                        )}
                        {row.retailer?.email && <span className="text-[11px] text-faint">{row.retailer.email}</span>}
                      </div>
                    </td>
                    <td className="text-xs text-brand-charcoal tabular-nums whitespace-nowrap">
                      {formatMoney(row.taxable_subtotal, row.currency)}
                    </td>
                    <td className="text-xs text-subtle tabular-nums whitespace-nowrap">{pct(row.vat_rate)}</td>
                    <td className="text-xs font-semibold text-brand-charcoal tabular-nums whitespace-nowrap">
                      {formatMoney(row.vat_amount, row.currency)}
                    </td>
                    <td className="text-xs text-brand-charcoal tabular-nums whitespace-nowrap">
                      {formatMoney(row.total_payable, row.currency)}
                    </td>
                    <td>
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}
