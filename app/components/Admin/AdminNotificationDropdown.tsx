"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BellIcon } from "@radix-ui/react-icons";
import { DropdownMenu } from "../Dropdown/DropdownMenu";
import { EmptyState } from "../EmptyState";
import { Button } from "../Button";
import { apiErrorMessage } from "@/lib/store/base-api";
import {
  useGetHeaderNotificationsQuery,
  useMarkAllHeaderNotificationsReadMutation,
  useMarkHeaderNotificationReadMutation,
  type AppNotification,
} from "@/lib/store/api/dashboard-api";
import { timeAgo } from "./dashboardData";

/* The header bell's list: the signed-in admin's in-app notifications
   (GET /users/notifications/), newest first. Opening one marks it read and
   follows its link; "Mark all as read" clears the badge. */

const PAGE_SIZE = 8;
/** The badge refreshes once a minute. */
const POLL_MS = 60_000;

/** Unread notifications, for the header bell's badge (0 while loading or signed out). */
export function useUnreadNotificationCount(): number {
  const { data } = useGetHeaderNotificationsQuery({ page_size: PAGE_SIZE }, { pollingInterval: POLL_MS });
  return data?.unread_count ?? 0;
}

const isUrgent = (n: AppNotification) => n.priority === "high" || n.priority === "urgent";

export const NotificationList: React.FC<{ onAction?: () => void }> = ({ onAction }) => {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useGetHeaderNotificationsQuery(
    { page_size: PAGE_SIZE },
    { pollingInterval: POLL_MS },
  );
  const [markRead] = useMarkHeaderNotificationReadMutation();
  const [markAll, markAllState] = useMarkAllHeaderNotificationsReadMutation();
  const items = data?.items ?? [];
  const unread = data?.unread_count ?? 0;

  const open = (n: AppNotification) => {
    if (!n.is_read) markRead(n.id);
    // Only follow links inside this app.
    if (n.link && n.link.startsWith("/")) {
      onAction?.();
      router.push(n.link);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="px-5 py-4 border-b border-light-gray flex justify-between items-center gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-brand-charcoal text-[14px]">Notifications</span>
          <span className="text-[12px] text-faint">{unread ? `${unread} unread` : "No unread notifications"}</span>
        </div>
        {unread > 0 && (
          <Button variant="link" onClick={() => markAll()} disabled={markAllState.isLoading}>
            Mark all as read
          </Button>
        )}
      </div>

      <div className="flex flex-col max-h-[400px] sm:max-h-[480px] overflow-y-auto custom-scrollbar bg-white">
        {isLoading ? (
          <ul aria-hidden className="divide-y divide-light-gray">
            {Array.from({ length: 3 }, (_, i) => (
              <li key={i} className="px-5 py-4 flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-off-white animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/3 rounded bg-off-white animate-pulse" />
                  <div className="h-3 w-full rounded bg-off-white animate-pulse" />
                </div>
              </li>
            ))}
          </ul>
        ) : isError ? (
          <div role="alert" className="py-8 px-5 flex flex-col items-center gap-3 text-center">
            <p className="text-[13px] text-subtle">{apiErrorMessage(error, "We couldn't load your notifications.")}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        ) : !items.length ? (
          <EmptyState illustration="notifications" size="sm" title="You're all caught up" description="New notifications will appear here." />
        ) : (
          <ul className="divide-y divide-light-gray">
            {items.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => open(n)}
                  className={`w-full text-left px-5 py-4 flex gap-3 transition-colors cursor-pointer hover:bg-off-white relative ${
                    n.is_read ? "" : "bg-brand-orange-soft/40"
                  }`}
                >
                  <span
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isUrgent(n) ? "bg-error-soft text-error" : "bg-brand-orange-soft text-brand-orange-text"
                    }`}
                    aria-hidden
                  >
                    <BellIcon className="w-4 h-4" />
                  </span>
                  <span className="flex-1 min-w-0 pr-4">
                    <span className="flex justify-between items-start gap-2">
                      <span className={`text-[13px] truncate text-brand-charcoal ${n.is_read ? "font-medium" : "font-semibold"}`}>
                        {n.title}
                      </span>
                      <span className="text-[11px] text-faint whitespace-nowrap pt-0.5">{timeAgo(n.created_at)}</span>
                    </span>
                    <span className={`block text-[12px] leading-relaxed line-clamp-2 mt-0.5 ${n.is_read ? "text-faint" : "text-subtle"}`}>
                      {n.message}
                    </span>
                  </span>
                  {!n.is_read && (
                    <span className="w-2 h-2 rounded-full bg-brand-orange absolute top-1/2 -translate-y-1/2 right-4" aria-label="Unread" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export const AdminNotificationDropdown: React.FC<{ onAction?: () => void }> = ({ onAction }) => {
  return (
    <div className="absolute top-full right-[-80px] pt-4 z-50 cursor-default">
      <DropdownMenu width={360} className="border-light-gray p-0 shadow-none">
        <NotificationList onAction={onAction} />
      </DropdownMenu>
    </div>
  );
};
