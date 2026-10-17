"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Icon } from "../Icon";
import { useGetProfileQuery, useLogoutMutation, type UserProfile } from "@/lib/store/api/auth-api";
import {
  readStoredTokens,
  readStoredUser,
  clearStoredTokens,
  writeStoredUser,
  AUTH_CHANGED_EVENT,
} from "@/lib/api";
import { toast } from "sonner";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

export const ProfileSidebar: React.FC = () => {
  const pathname = usePathname();
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [cachedUser, setCachedUser] = useState<UserProfile | null>(null);

  const { data: profile } = useGetProfileQuery(undefined, {
    skip: !hasToken,
  });

  useEffect(() => {
    const syncSession = () => {
      const tokens = readStoredTokens();
      const tokenExists = Boolean(tokens?.access);
      setHasToken(tokenExists);
      setCachedUser(tokenExists ? readStoredUser<UserProfile>() : null);
    };
    syncSession();
    window.addEventListener(AUTH_CHANGED_EVENT, syncSession);
    window.addEventListener("storage", syncSession);
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, syncSession);
      window.removeEventListener("storage", syncSession);
    };
  }, []);

  const [logoutUser] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
    } catch {
      /* ignore */
    } finally {
      clearStoredTokens();
      writeStoredUser(null);
      toast.success("Logged out successfully");
      window.location.href = "/";
    }
  };

  const user = profile || cachedUser;
  const displayName =
    user?.name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email?.split("@")[0] ||
    "My Account";

  const displayRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : null;

  const initials =
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "?";
  const avatarUrl = user?.profile_image_url || user?.avatar_url;

  const navItems: NavItem[] = [
    { label: "Personal info", href: "/profile", icon: "profile" },
    { label: "My orders", href: "/orders", icon: "local_shipping" },
    { label: "My wishlist", href: "/wishlist", icon: "favorite" },
    { label: "Messages", href: "/messages", icon: "message_header" },
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 bg-white rounded-tile overflow-hidden lg:sticky lg:top-24">
      {/* User Header */}
      <div className="px-6 pt-8 pb-6 flex flex-col items-center text-center">
        <div className="mb-4 w-20 h-20 rounded-full overflow-hidden bg-brand-orange-soft flex items-center justify-center">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              width={96}
              height={96}
              unoptimized={/^https?:\/\//.test(avatarUrl)}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[24px] font-semibold text-brand-orange-text" aria-hidden>
              {initials}
            </span>
          )}
        </div>
        <h3 className="text-[19px] font-semibold text-brand-charcoal tracking-[-0.01em] leading-tight">
          {displayName}
        </h3>
        <p className="mt-0.5 text-[13px] text-subtle">
          {user?.email || "Account overview"}
        </p>
        {displayRole && (
          <span className="mt-3 px-2.5 py-0.5 bg-brand-orange-soft text-brand-charcoal text-[12px] font-medium rounded-full">
            {displayRole}
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 p-3 border-t border-black/[0.06]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 h-11 rounded-xl text-[15px] transition-colors duration-200 group
                ${
                  isActive
                    ? "bg-brand-orange-soft text-brand-charcoal font-medium"
                    : "text-brand-charcoal hover:bg-black/[0.04]"
                }`}
            >
              <Icon
                name={item.icon}
                size="sm"
                className={`transition-colors ${
                  isActive ? "text-brand-orange-text" : "text-faint"
                }`}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span
                  className={`min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center text-[11px] font-semibold tabular-nums
                  ${
                    isActive
                      ? "bg-brand-orange text-white"
                      : "bg-black/[0.06] text-subtle"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Action */}
      {hasToken && (
      <div className="p-3 border-t border-black/[0.06]">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 h-11 text-error transition-colors w-full rounded-xl text-[15px] hover:bg-error-soft cursor-pointer"
        >
          <Icon name="logout" size="sm" />
          Log out
        </button>
      </div>
      )}
    </aside>
  );
};
