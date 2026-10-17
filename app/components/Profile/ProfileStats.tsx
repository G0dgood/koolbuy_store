"use client";

import React from "react";
import Link from "next/link";
import { HiShoppingBag, HiClock, HiSparkles, HiBell } from "react-icons/hi2";
import { useGetOrdersQuery, type OrdersResponse, type Order } from "@/lib/store/api/orders-api";
import {
  useGetMyLoyaltyPointsQuery,
  useGetNotificationUnreadSummaryQuery,
} from "@/lib/store/api/storefront-pages-api";
import { useAuthModal } from "@/app/context/AuthModalContext";
import { EmptyState } from "@/app/components/EmptyState";

/** Orders still waiting on the buyer's payment */
const PENDING_STATUS = "pending_payment";

interface StatProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  href?: string;
  note?: string;
  loading?: boolean;
}

const StatCard: React.FC<StatProps> = ({ label, value, icon, href, note, loading }) => {
  const body = (
    <>
      <div className="w-11 h-11 rounded-full bg-brand-orange-soft text-brand-orange-text flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        {loading ? (
          <span className="h-7 w-12 my-0.5 rounded-full bg-black/[0.06] animate-pulse" aria-hidden />
        ) : (
          <span className="text-[24px] font-semibold text-brand-charcoal tracking-[-0.02em] leading-tight tabular-nums">
            {value}
          </span>
        )}
        <span className="text-[13px] text-subtle truncate">{label}</span>
        {note && !loading && <span className="text-[12px] text-faint truncate">{note}</span>}
      </div>
    </>
  );
  const cls = "bg-white p-5 rounded-tile flex items-center gap-4";
  return href ? (
    <Link href={href} className={`${cls} transition-shadow duration-300 hover:shadow-lift`}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
};

/** Total from the paginated orders response, else the items on this page */
function countOrders(data: OrdersResponse | Order[] | undefined): number | undefined {
  if (!data) return undefined;
  if (Array.isArray(data)) return data.length;
  if (data.pagination?.total !== undefined) return data.pagination.total;
  return (data.items ?? data.results ?? []).length;
}

const formatPoints = (raw: string | undefined) => {
  const n = Number(raw ?? 0);
  if (!Number.isFinite(n)) return "0";
  return new Intl.NumberFormat("en-NG", { notation: "compact", maximumFractionDigits: 1 }).format(n);
};

/** Account overview counts for the signed-in buyer. */
export const ProfileStats: React.FC<{ signedIn: boolean }> = ({ signedIn }) => {
  const { openLogin } = useAuthModal();
  const skip = !signedIn;

  const orders = useGetOrdersQuery(undefined, { skip });
  const pending = useGetOrdersQuery({ status: PENDING_STATUS }, { skip });
  const points = useGetMyLoyaltyPointsQuery(undefined, { skip });
  const notifications = useGetNotificationUnreadSummaryQuery(undefined, { skip });

  if (!signedIn) {
    return (
      <EmptyState
        variant="card"
        size="sm"
        illustration="customers"
        title="Sign in to see your account"
        description="Your orders, reward points and notifications will appear here once you sign in."
        action={{ label: "Sign in", onClick: openLogin }}
      />
    );
  }

  const unavailable = "—";
  const pointsEnabled = points.data?.enabled === true;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <StatCard
        label="Total orders"
        icon={<HiShoppingBag size={18} />}
        href="/orders"
        loading={orders.isLoading}
        value={orders.isError ? unavailable : countOrders(orders.data) ?? 0}
      />
      <StatCard
        label="Awaiting payment"
        icon={<HiClock size={18} />}
        href="/orders"
        loading={pending.isLoading}
        value={pending.isError ? unavailable : countOrders(pending.data) ?? 0}
      />
      <StatCard
        label="Reward points"
        icon={<HiSparkles size={18} />}
        loading={points.isLoading}
        value={
          points.isError || !pointsEnabled ? unavailable : formatPoints(points.data?.available_points)
        }
        note={!points.isLoading && !points.isError && !pointsEnabled ? "Rewards aren't on yet" : undefined}
      />
      <StatCard
        label="Unread notifications"
        icon={<HiBell size={18} />}
        loading={notifications.isLoading}
        value={notifications.isError ? unavailable : notifications.data?.unread_count ?? 0}
      />
    </div>
  );
};
