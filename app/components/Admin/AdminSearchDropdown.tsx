"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArchiveIcon, CubeIcon, HomeIcon, PersonIcon } from "@radix-ui/react-icons";
import { DropdownMenu } from "../Dropdown/DropdownMenu";
import { EmptyState } from "../EmptyState";
import { StatusBadge } from "./Orders/StatusBadge";
import { apiErrorMessage } from "@/lib/store/base-api";
import { formatMoney, humanize, useGetAdminOrdersQuery } from "@/lib/store/api/accounting-api";
import { useGetAdminSellersQuery } from "@/lib/store/api/vendors-api";
import { useSearchAdminUsersQuery, useSearchCatalogProductsQuery } from "@/lib/store/api/dashboard-api";

/* Header search. There is no global search endpoint, so the typed text is
   sent (debounced) to four lists at once and the first few matches of each are
   shown in groups: orders (order number), people (name, email, phone),
   products (name, description) and vendors (business name). */

const PER_GROUP = 4;
const MIN_CHARS = 2;
const DEBOUNCE_MS = 300;

interface Row {
  id: string;
  href: string;
  title: string;
  subtitle: string;
  meta?: React.ReactNode;
  image?: string | null;
}

interface Group {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  rows: Row[];
  loading: boolean;
  error?: unknown;
}

function useDebounced(value: string, ms: number) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return v;
}

export const AdminSearchDropdown: React.FC<{ query: string; onNavigate?: () => void }> = ({ query, onNavigate }) => {
  const q = useDebounced(query.trim(), DEBOUNCE_MS);
  const skip = q.length < MIN_CHARS;
  const typing = query.trim() !== q;

  const orders = useGetAdminOrdersQuery({ q, page_size: PER_GROUP }, { skip });
  const people = useSearchAdminUsersQuery({ q, page_size: PER_GROUP }, { skip });
  const products = useSearchCatalogProductsQuery({ search: q, page_size: PER_GROUP }, { skip });
  const vendors = useGetAdminSellersQuery({ q, page_size: PER_GROUP }, { skip });

  const groups: Group[] = [
    {
      key: "orders",
      label: "Orders",
      icon: ArchiveIcon,
      loading: orders.isFetching,
      error: orders.error,
      rows: (orders.currentData?.items ?? []).slice(0, PER_GROUP).map((o) => ({
        id: o.id,
        href: `/admin/orders/${encodeURIComponent(o.id)}`,
        title: `Order ${o.order_number}`,
        subtitle: [o.buyer_name, formatMoney(o.total_amount)].filter(Boolean).join(" · "),
        meta: <StatusBadge status={o.status} className="!px-2 !py-0.5" />,
      })),
    },
    {
      key: "people",
      label: "Customers and users",
      icon: PersonIcon,
      loading: people.isFetching,
      error: people.error,
      rows: (people.currentData?.items ?? []).slice(0, PER_GROUP).map((u) => {
        const name = u.name || `${u.first_name} ${u.last_name}`.trim() || u.email || u.phone_number;
        return {
          id: u.id,
          href: `/admin/customers?search=${encodeURIComponent(u.email || u.phone_number || name)}`,
          title: name,
          subtitle: [u.email, u.phone_number].filter(Boolean).join(" · "),
          meta: <span className="text-[11px] text-faint">{u.is_staff ? "Staff" : humanize(u.role)}</span>,
        };
      }),
    },
    {
      key: "products",
      label: "Products",
      icon: CubeIcon,
      loading: products.isFetching,
      error: products.error,
      rows: (products.currentData?.items ?? []).slice(0, PER_GROUP).map((p) => ({
        id: p.id,
        href: `/products/detail?id=${encodeURIComponent(p.id)}`,
        title: p.name,
        subtitle: [p.category, p.vendor?.name].filter(Boolean).join(" · "),
        image: p.image,
        meta: <span className="text-[12px] font-semibold text-brand-charcoal tabular-nums">{formatMoney(p.price)}</span>,
      })),
    },
    {
      key: "vendors",
      label: "Vendors",
      icon: HomeIcon,
      loading: vendors.isFetching,
      error: vendors.error,
      rows: (vendors.currentData?.items ?? []).slice(0, PER_GROUP).map((v) => ({
        id: v.id,
        href: `/admin/vendors?q=${encodeURIComponent(v.business_name)}`,
        title: v.business_name,
        subtitle: [humanize(v.role), v.email].filter(Boolean).join(" · "),
        meta: (
          <span className={`text-[11px] font-semibold ${v.is_verified ? "text-success" : "text-faint"}`}>
            {v.suspended_at ? "Suspended" : v.is_verified ? "Verified" : "Unverified"}
          </span>
        ),
      })),
    },
  ];

  const loading = typing || groups.some((g) => g.loading);
  const found = groups.reduce((s, g) => s + g.rows.length, 0);
  const shown = groups.filter((g) => g.rows.length || g.error);

  return (
    <div className="absolute top-full left-0 pt-4 z-50 cursor-default">
      <DropdownMenu width={480} className="shadow-float border-light-gray p-0 overflow-hidden max-h-150 flex flex-col">
        <div className="px-5 py-3 border-b border-light-gray">
          <span className="block font-semibold text-brand-charcoal text-[14px] truncate">
            {skip ? "Search the store" : `Results for "${q}"`}
          </span>
          <span className="text-[12px] text-faint">
            {skip
              ? "Type at least two letters to search orders, customers, products and vendors."
              : loading
                ? "Searching…"
                : `${found} ${found === 1 ? "match" : "matches"}`}
          </span>
        </div>

        {!skip && (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {shown.length > 0 ? (
              shown.map((g) => (
                <div key={g.key} className="mb-3 last:mb-0">
                  <h4 className="px-3 py-2 text-[12px] font-semibold text-faint">{g.label}</h4>
                  {g.error && !g.rows.length ? (
                    <p className="px-3 pb-2 text-[12px] text-faint">{apiErrorMessage(g.error, `Couldn't search ${g.label.toLowerCase()}.`)}</p>
                  ) : (
                    <ul className="flex flex-col gap-0.5">
                      {g.rows.map((r) => (
                        <li key={r.id}>
                          <Link
                            href={r.href}
                            onClick={onNavigate}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-orange-soft group transition-colors"
                          >
                            <span className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center border border-light-gray bg-off-white overflow-hidden text-faint">
                              {r.image ? <img src={r.image} alt="" className="w-full h-full object-contain bg-white" /> : <g.icon className="w-4 h-4" />}
                            </span>
                            <span className="flex flex-col flex-1 min-w-0">
                              <span className="text-[13px] font-medium text-brand-charcoal truncate">{r.title}</span>
                              {r.subtitle && <span className="text-[12px] text-faint truncate">{r.subtitle}</span>}
                            </span>
                            {r.meta && <span className="shrink-0">{r.meta}</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            ) : loading ? (
              <ul aria-hidden className="p-1 space-y-2">
                {Array.from({ length: 4 }, (_, i) => (
                  <li key={i} className="flex items-center gap-3 px-2 py-1.5">
                    <div className="w-9 h-9 rounded-lg bg-off-white animate-pulse" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-1/2 rounded bg-off-white animate-pulse" />
                      <div className="h-3 w-1/3 rounded bg-off-white animate-pulse" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState illustration="search" size="sm" title="No matches" description="Try an order number, a name, an email or a product." />
            )}
          </div>
        )}
      </DropdownMenu>
    </div>
  );
};
