"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/app/components/Button";
import { Icon } from "@/app/components/Icon";
import { Input } from "@/app/components/Form/Inputs";
import Search from "@/app/components/ui/Search";
import Dropdown from "@/app/components/ui/Dropdown";
import { TabFilter } from "@/app/components/Admin/TabFilter";
import { EmptyTableRow } from "@/app/components/EmptyState";
import { apiErrorMessage } from "@/lib/store/base-api";
import { useGetTaxesQuery, humanize, type TaxesResponse } from "@/lib/store/api/accounting-api";
import {
  useGetAdminCategoriesQuery,
  useUpdateCategoryMutation,
  type CategoryItem,
  type VatTreatment,
} from "@/lib/store/api/categories-api";

/* Tax settings.
   - VAT policy (rate, what it applies to, whether delivery is VAT-able) comes
     from the finance policy on the backend; it is read-only here.
   - Each product category carries a VAT treatment (standard, zero-rated or
     exempt). It is the one tax setting staff can change here
     (PATCH /admin/categories/:slug/). Financing invoices don't read it yet;
     they apply the policy rate.
   There are no withholding-tax or custom tax-rate tables in the backend, so
   the old sample rates were removed. VAT collected is on Accounting → Taxes. */

const TREATMENTS: { value: VatTreatment; label: string; hint: string }[] = [
  { value: "standard", label: "Standard", hint: "Taxed at the standard VAT rate" },
  { value: "zero_rated", label: "Zero-rated", hint: "Taxable, at 0%" },
  { value: "exempt", label: "Exempt", hint: "Not subject to VAT" },
];
const FILTERS = ["All", "Standard", "Zero-rated", "Exempt"] as const;
type Filter = (typeof FILTERS)[number];
const COLS = 5;

const treatmentOf = (c: CategoryItem): VatTreatment =>
  (TREATMENTS.some((t) => t.value === c.vat_treatment) ? c.vat_treatment : "standard") as VatTreatment;

const selectClass =
  "h-8 px-2 rounded-lg border border-light-gray bg-white text-[12px] text-brand-charcoal focus:outline-none focus:border-brand-orange disabled:opacity-50";

export default function TaxSettingsPage() {
  const policyQuery = useGetTaxesQuery({ page: 1, page_size: 1 });
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [savingSlug, setSavingSlug] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetAdminCategoriesQuery({ q: query || undefined });
  const [updateCategory] = useUpdateCategoryMutation();

  const all = data?.items ?? [];
  const countOf = (f: Filter) =>
    f === "All" ? all.length : all.filter((c) => TREATMENTS.find((t) => t.value === treatmentOf(c))?.label === f).length;
  const label = (f: Filter) => (data ? `${f} (${countOf(f)})` : f);
  const items = filter === "All" ? all : all.filter((c) => TREATMENTS.find((t) => t.value === treatmentOf(c))?.label === filter);

  const change = async (c: CategoryItem, next: VatTreatment) => {
    if (next === treatmentOf(c)) return;
    setSavingSlug(c.slug);
    try {
      await updateCategory({ slug: c.slug, vat_treatment: next }).unwrap();
      toast.success(`${c.label} is now ${TREATMENTS.find((t) => t.value === next)?.label.toLowerCase()} for VAT.`);
    } catch (e) {
      toast.error(apiErrorMessage(e, "Couldn't change the VAT treatment."));
    } finally {
      setSavingSlug(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-brand-charcoal">Tax</h1>
          <p className="text-xs text-subtle mt-0.5">The VAT policy and how VAT applies to each product category.</p>
        </div>
        <Link href="/admin/taxes" className="text-xs font-semibold text-brand-orange-text hover:underline whitespace-nowrap">
          VAT collected
        </Link>
      </div>

      <PolicyStrip
        policy={policyQuery.data?.policy ?? null}
        isLoading={policyQuery.isLoading}
        isError={policyQuery.isError}
        error={policyQuery.error}
        onRetry={policyQuery.refetch}
      />

      <div className="bg-white border border-light-gray rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 sm:px-6 flex flex-col gap-1 border-b border-light-gray">
          <h2 className="text-[14px] font-semibold text-brand-charcoal">VAT by category</h2>
          <p className="text-[12px] text-subtle">
            How each category is classed for VAT. Invoices currently work out VAT from the policy above.
          </p>
        </div>
        <div className="p-4 sm:px-6 flex flex-col lg:flex-row gap-3 lg:items-center justify-between border-b border-light-gray">
          <TabFilter
            tabs={FILTERS.map(label)}
            activeTab={label(filter)}
            onChange={(t) => {
              const next = FILTERS.find((f) => label(f) === t);
              if (next) setFilter(next);
            }}
          />
          <Search
            value={search}
            onChange={(val) => setSearch(typeof val === "string" ? val : (val as any).target?.value ?? "")}
            placeholder="Search categories"
            className="w-full lg:!w-72"
            maxWidth="max-w-none"
          />
        </div>

        <div className={`admin-table-container transition-opacity ${isFetching && !isLoading ? "opacity-60" : ""}`}>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Status</th>
                <th>Products</th>
                <th>VAT treatment</th>
                <th>What it means</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }, (_, i) => (
                  <tr key={i} aria-hidden>
                    {Array.from({ length: COLS }, (_, j) => (
                      <td key={j}>
                        <span className="block h-3 w-20 rounded bg-black/[0.06] animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={COLS} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-1 max-w-md mx-auto">
                      <p className="text-[13px] text-error">{apiErrorMessage(error, "Couldn't load categories.")}</p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
                        Try again
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                query || filter !== "All" ? (
                  <EmptyTableRow
                    colSpan={COLS}
                    illustration="search"
                    title="No matches"
                    description="No categories match this search or filter."
                    action={{
                      label: "Clear filters",
                      onClick: () => {
                        setSearch("");
                        setQuery("");
                        setFilter("All");
                      },
                    }}
                  />
                ) : (
                  <EmptyTableRow
                    colSpan={COLS}
                    illustration="invoices"
                    title="No categories yet"
                    description="Categories you add will appear here with their VAT treatment."
                    action={{ label: "Go to categories", href: "/admin/categories" }}
                  />
                )
              ) : (
                items.map((c) => {
                  const t = treatmentOf(c);
                  return (
                    <tr key={c.slug}>
                      <td>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-brand-charcoal">{c.label}</span>
                          <span className="text-[11px] text-faint">{c.slug}</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            c.is_active ? "bg-success-soft text-success" : "bg-off-white text-subtle"
                          }`}
                        >
                          {c.is_active ? "Active" : "Hidden"}
                        </span>
                      </td>
                      <td className="text-xs text-subtle tabular-nums">{c.usage_count.toLocaleString()}</td>
                      <td className="w-48">
                        <Dropdown
                          options={TREATMENTS.map((o) => ({ value: o.value, label: o.label }))}
                          value={t}
                          onChange={(val) => change(c, val as VatTreatment)}
                          disabled={savingSlug === c.slug}
                          searchable={false}
                          size="sm"
                          className="w-36"
                        />
                      </td>
                      <td className="text-xs text-subtle">{TREATMENTS.find((o) => o.value === t)?.hint}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PolicyStrip({
  policy,
  isLoading,
  isError,
  error,
  onRetry,
}: {
  policy: TaxesResponse["policy"];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
}) {
  const box = "bg-white border border-light-gray rounded-lg p-4 sm:px-6";
  if (isLoading) {
    return (
      <div className={`${box} grid grid-cols-2 md:grid-cols-4 gap-4`} aria-hidden>
        {Array.from({ length: 4 }, (_, i) => (
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
        <p className="text-[13px] text-error">{apiErrorMessage(error, "Couldn't load the VAT policy.")}</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      </div>
    );
  }
  if (!policy) {
    return (
      <div className={box}>
        <p className="text-[13px] font-medium text-brand-charcoal">No VAT policy is set up</p>
        <p className="text-[12px] text-faint mt-0.5">VAT isn&apos;t charged until a finance policy with a VAT rate exists.</p>
      </div>
    );
  }
  const items = [
    { label: "VAT rate", value: `${Math.round(policy.vat_rate * 10000) / 100}%` },
    { label: "Applies to", value: humanize(policy.vat_applies_to) },
    { label: "Delivery fee", value: policy.delivery_fee_vatable ? "VAT-able" : "Not VAT-able" },
    { label: "Market", value: policy.market, hint: `Policy version ${policy.version}` },
  ];
  return (
    <div className={`${box} grid grid-cols-2 md:grid-cols-4 gap-4`}>
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
