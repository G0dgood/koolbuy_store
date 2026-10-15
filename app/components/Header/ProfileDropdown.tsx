"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "../Icon";
import { useAuthModal } from "@/app/context/AuthModalContext";
import {
  useGetProfileQuery,
  useLogoutMutation,
  type UserProfile,
} from "@/lib/store/api/auth-api";
import { readStoredTokens, readStoredUser } from "@/lib/api";
import { toast } from "sonner";
import {
  FiShield,
  FiUser,
  FiPackage,
  FiLogOut,
  FiArrowRight,
  FiChevronDown,
} from "react-icons/fi";

function getInitials(name?: string, email?: string): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email && email.trim()) {
    return email.slice(0, 2).toUpperCase();
  }
  return "U";
}

interface ProfileDropdownProps {
  onOpenDropdown?: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  onOpenDropdown,
}) => {
  const router = useRouter();
  const { openLogin } = useAuthModal();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check stored tokens first (synchronous on client)
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [cachedUser, setCachedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const tokens = readStoredTokens();
    const tokenExists = Boolean(tokens?.access);
    setHasToken(tokenExists);
    if (tokenExists) {
      setCachedUser(readStoredUser<UserProfile>());
    }
  }, [isOpen]);

  // Query server profile when token exists
  const { data: profile, isLoading } = useGetProfileQuery(undefined, {
    skip: !hasToken,
  });

  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutMutation();

  const user = profile || cachedUser;
  const isAuthenticated = Boolean(hasToken && (user || !isLoading));

  const isSuperAdmin = Boolean(
    user?.role === "admin" ||
      user?.is_superuser === true ||
      user?.staff?.is_super_admin === true
  );
  const isStaff = Boolean(isSuperAdmin || user?.is_staff === true);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      setIsOpen(false);
      setHasToken(false);
      setCachedUser(null);
      toast.success("Logged out successfully");
      router.push("/");
    } catch {
      toast.error("Failed to log out. Please try again.");
    }
  };

  // If not logged in, render the standard "Sign in" trigger
  if (!isAuthenticated) {
    return (
      <button
        type="button"
        onClick={() => {
          onOpenDropdown?.();
          openLogin();
        }}
        aria-label="Sign in"
        title="Sign in"
        className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer text-gray-700 hover:text-brand-charcoal hover:bg-black/[0.05] transition-colors outline-none"
      >
        <Icon name="profile" size="md" />
      </button>
    );
  }

  const displayName =
    user?.name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email?.split("@")[0] ||
    "My Account";
  const initials = getInitials(displayName, user?.email);

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => {
            const next = !prev;
            if (next) onOpenDropdown?.();
            return next;
          });
        }}
        aria-label="User Account Menu"
        aria-expanded={isOpen}
        title={displayName}
        className={`flex items-center gap-1.5 p-1 rounded-full cursor-pointer transition-all outline-none ${
          isOpen
            ? "ring-2 ring-brand-orange bg-brand-orange/5"
            : "hover:bg-black/[0.05]"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white shadow-xs transition-transform ${
            isSuperAdmin
              ? "bg-gradient-to-tr from-brand-orange to-amber-500 ring-2 ring-brand-orange/40"
              : "bg-brand-charcoal"
          }`}
        >
          {user?.avatar_url || user?.profile_image_url ? (
            <img
              src={user.avatar_url || user.profile_image_url}
              alt={displayName}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <FiChevronDown
          className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 hidden md:block ${
            isOpen ? "rotate-180 text-brand-orange" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-black/[0.08] p-2 z-120 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
          {/* User Details Header */}
          <div className="p-3 bg-gray-50/80 rounded-xl mb-2 flex items-center gap-3 border border-black/[0.03]">
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center text-[14px] font-bold text-white shrink-0 shadow-xs ${
                isSuperAdmin
                  ? "bg-gradient-to-tr from-brand-orange to-amber-500 ring-2 ring-brand-orange/30"
                  : "bg-brand-charcoal"
              }`}
            >
              {user?.avatar_url || user?.profile_image_url ? (
                <img
                  src={user.avatar_url || user.profile_image_url}
                  alt={displayName}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[14px] font-bold text-brand-charcoal truncate">
                {displayName}
              </span>
              <span className="text-[12px] text-gray-500 truncate">
                {user?.email || "No email available"}
              </span>
              <div className="mt-1">
                {isSuperAdmin ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-brand-orange text-white">
                    <FiShield className="w-2.5 h-2.5" />
                    Super Admin
                  </span>
                ) : isStaff ? (
                  <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-amber-100 text-amber-800">
                    Staff Member
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-gray-200 text-gray-700">
                    {user?.role || "Customer"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Super Admin Quick Link */}
          {isStaff && (
            <div className="mb-2">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-brand-orange/[0.12] to-amber-500/[0.08] hover:from-brand-orange/[0.18] hover:to-amber-500/[0.14] border border-brand-orange/20 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-orange text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <FiShield className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[13px] font-bold text-brand-charcoal group-hover:text-brand-orange-text transition-colors">
                      {isSuperAdmin ? "Super Admin Portal" : "Admin Dashboard"}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Access management console
                    </span>
                  </div>
                </div>
                <FiArrowRight className="w-4 h-4 text-brand-orange transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          )}

          {/* Standard Navigation Items */}
          <div className="flex flex-col gap-0.5 py-1">
            <Link
              href="/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-700 hover:text-brand-charcoal hover:bg-gray-100 transition-colors"
            >
              <FiPackage className="w-4 h-4 text-gray-400" />
              <span>My Orders</span>
            </Link>

            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-700 hover:text-brand-charcoal hover:bg-gray-100 transition-colors"
            >
              <FiUser className="w-4 h-4 text-gray-400" />
              <span>Account Settings</span>
            </Link>
          </div>

          <div className="h-px bg-black/[0.06] my-1" />

          {/* Logout Action */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
          >
            <FiLogOut className="w-4 h-4 text-rose-500" />
            <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
          </button>
        </div>
      )}
    </div>
  );
};
