"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Cross2Icon, EnvelopeClosedIcon, MobileIcon, HomeIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { Button } from "../Button";
import { EmptyState } from "@/app/components/EmptyState";
import { apiErrorMessage } from "@/lib/store/base-api";
import { formatNaira } from "@/lib/store/api/storefront-api";
import { useGetPeopleCustomerQuery, type PeopleCustomer } from "@/lib/store/api/people-api";

interface CustomerSideCardProps {
  customer: PeopleCustomer;
  onClose: () => void;
  /** Activate or deactivate this customer (the page owns the confirmation). */
  onToggleActive: (customer: PeopleCustomer) => void;
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "?";

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export function CustomerSideCard({ customer, onClose, onToggleActive }: CustomerSideCardProps) {
  const { data: detail, isLoading, isError, error, refetch } = useGetPeopleCustomerQuery(customer.id);
  const c = detail ?? customer;
  const defaultAddress = detail?.addresses?.find((a) => a.is_default) ?? detail?.addresses?.[0];
  const addressLine = defaultAddress
    ? [defaultAddress.address, defaultAddress.city, defaultAddress.state].filter(Boolean).join(", ")
    : c.address;

  return (
    <motion.aside
      key="customer-details"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="w-full lg:w-[380px] shrink-0 bg-white rounded-lg border border-light-gray p-5 flex flex-col gap-6 lg:sticky lg:top-6"
      aria-label={`${c.name} details`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-full bg-brand-orange-soft text-brand-charcoal flex items-center justify-center text-[15px] font-semibold overflow-hidden shrink-0">
            {c.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              initials(c.name)
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-[15px] font-semibold text-brand-charcoal truncate">{c.name}</h4>
            <p className="text-[12px] text-faint">
              {c.customer_code} · <span className={c.is_active ? "text-success" : "text-error"}>{c.is_active ? "Active" : "Inactive"}</span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="w-8 h-8 rounded-lg border border-light-gray flex items-center justify-center text-faint hover:text-brand-charcoal hover:bg-brand-orange-soft transition-colors"
        >
          <Cross2Icon className="w-4 h-4" />
        </button>
      </div>

      <section className="flex flex-col gap-2">
        <h5 className="text-[12px] font-semibold text-faint">Contact</h5>
        <div className="flex items-center gap-2.5 text-[13px] text-brand-charcoal">
          <EnvelopeClosedIcon className="w-4 h-4 text-faint shrink-0" />
          {c.email ? (
            <a href={`mailto:${c.email}`} className="truncate hover:underline">
              {c.email}
            </a>
          ) : (
            <span className="text-faint">No email</span>
          )}
        </div>
        <div className="flex items-center gap-2.5 text-[13px] text-brand-charcoal">
          <MobileIcon className="w-4 h-4 text-faint shrink-0" />
          {c.phone ? <span>{c.phone}</span> : <span className="text-faint">No phone number</span>}
        </div>
        <div className="flex items-start gap-2.5 text-[13px] text-brand-charcoal">
          <HomeIcon className="w-4 h-4 text-faint shrink-0 mt-0.5" />
          {isLoading ? (
            <span className="h-4 w-40 rounded bg-light-gray animate-pulse" />
          ) : addressLine ? (
            <span>{addressLine}</span>
          ) : (
            <span className="text-faint">No address saved</span>
          )}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-off-white p-3">
          <p className="text-[12px] text-faint">Signed up</p>
          <p className="text-[13px] font-medium text-brand-charcoal">{shortDate(c.date_joined)}</p>
        </div>
        <div className="rounded-lg bg-off-white p-3">
          <p className="text-[12px] text-faint">Last purchase</p>
          <p className="text-[13px] font-medium text-brand-charcoal">
            {c.last_purchase_raw ? shortDate(c.last_purchase_raw) : "No orders yet"}
          </p>
        </div>
        <div className="rounded-lg bg-off-white p-3 col-span-2">
          <p className="text-[12px] text-faint">Total spend</p>
          <p className="text-[15px] font-semibold text-brand-charcoal tabular-nums">{formatNaira(c.total_spend)}</p>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h5 className="text-[12px] font-semibold text-faint">Orders</h5>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Total", value: c.orders_summary?.total ?? c.order_count, cls: "text-brand-charcoal" },
            { label: "Completed", value: c.orders_summary?.completed ?? 0, cls: "text-success" },
            { label: "Cancelled", value: c.orders_summary?.cancelled ?? 0, cls: "text-error" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-light-gray p-2.5 text-center">
              <p className={`text-[15px] font-semibold tabular-nums ${s.cls}`}>{s.value}</p>
              <p className="text-[11px] text-faint">{s.label}</p>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-2 mt-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 rounded-lg bg-light-gray animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-lg bg-error-soft p-3 text-[12px] text-error flex items-center justify-between gap-2">
            <span>{apiErrorMessage(error, "Couldn't load this customer's orders.")}</span>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : detail && detail.orders.length > 0 ? (
          <ul className="flex flex-col divide-y divide-light-gray mt-1">
            {detail.orders.slice(0, 5).map((o) => (
              <li key={o.id}>
                <Link
                  href={`/admin/orders/${encodeURIComponent(o.order_number)}`}
                  className="flex items-center justify-between gap-2 py-2 text-[13px] hover:bg-off-white rounded-md px-1 transition-colors"
                >
                  <span className="min-w-0">
                    <span className="block font-medium text-brand-charcoal truncate">{o.order_number}</span>
                    <span className="block text-[11px] text-faint capitalize">
                      {o.status.replace(/_/g, " ")} · {shortDate(o.created_at)}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 shrink-0 tabular-nums text-brand-charcoal">
                    {formatNaira(o.total_amount)}
                    <ArrowRightIcon className="w-3.5 h-3.5 text-faint" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            illustration="orders"
            size="sm"
            title="No orders yet"
            description="Orders will appear here once this customer buys something."
          />
        )}
      </section>

      <Button
        variant={c.is_active ? "outline" : "primary"}
        className="w-full"
        onClick={() => onToggleActive(c)}
      >
        {c.is_active ? "Deactivate customer" : "Reactivate customer"}
      </Button>
    </motion.aside>
  );
}
