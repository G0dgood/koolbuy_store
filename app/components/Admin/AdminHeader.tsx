"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Input } from "../Form/Inputs";
import { AdminNotificationDropdown, unreadNotificationCount } from "./AdminNotificationDropdown";
import { getAdminTheme, onAdminThemeChange, setAdminTheme, type AdminTheme } from "./adminTheme";
import { AdminProfileDropdown } from "./AdminProfileDropdown";
import { AdminSearchDropdown } from "./AdminSearchDropdown";
import { useState, useRef, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import {
  HamburgerMenuIcon,
  Cross1Icon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import Modal from "../Modal/Modal";
import { NotificationList } from "./AdminNotificationDropdown";
import { motion } from "framer-motion";

/** The Sales CRM's notification bell (public/Icon/Bell_light.svg there), drawn in currentColor. */
const BellLightIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
    <path
      d="M5.3732 7.47443C5.63516 5.11685 7.62791 3.33325 10 3.33325C12.3721 3.33325 14.3648 5.11685 14.6268 7.47443L14.8366 9.36295C14.9443 10.3317 15.2596 11.2659 15.7611 12.1018L16.2428 12.9046C16.5455 13.4091 16.6969 13.6614 16.7246 13.8647C16.7854 14.3105 16.5412 14.7419 16.1277 14.9191C15.939 14.9999 15.6448 14.9999 15.0565 14.9999H4.94353C4.35515 14.9999 4.06097 14.9999 3.87233 14.9191C3.45885 14.7419 3.21456 14.3105 3.27537 13.8647C3.30311 13.6614 3.45447 13.4091 3.75718 12.9046L4.23888 12.1018C4.74039 11.2659 5.05572 10.3317 5.16337 9.36295L5.3732 7.47443Z"
      stroke="currentColor"
    />
    <path
      d="M7.58519 15.3382C7.72762 15.9584 8.04149 16.5064 8.4781 16.8973C8.91471 17.2881 9.44966 17.5 10 17.5C10.5503 17.5 11.0853 17.2881 11.5219 16.8973C11.9585 16.5064 12.2724 15.9584 12.4148 15.3382"
      stroke="currentColor"
      strokeLinecap="round"
    />
  </svg>
);

type HeaderProps = {
  onOpenMenu?: () => void;
  className?: string;
  isOpen?: boolean;
  role?: string;
};

export const AdminHeader: React.FC<HeaderProps> = ({
  onOpenMenu,
  className,
  isOpen,
  role,
}) => {
  const { userImage } = useUser();
  const pathname = usePathname();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  // Light / dark (saved per browser; see adminTheme.ts).
  const [theme, setTheme] = useState<AdminTheme>("light");
  useEffect(() => {
    setTheme(getAdminTheme());
    return onAdminThemeChange(setTheme);
  }, []);
  const isDark = theme === "dark";

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setIsNotificationsOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleNotifications = () => {
    setIsNotificationsOpen((prev) => !prev);
    setIsProfileOpen(false);
    setIsSearchOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
    setIsNotificationsOpen(false);
    setIsSearchOpen(false);
  };

  const handleSearchFocus = () => {
    setIsSearchOpen(true);
    setIsNotificationsOpen(false);
    setIsProfileOpen(false);
  };

  // Dynamic title based on pathname
  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard";
    if (pathname.startsWith("/admin/bnpl-orders")) return "BNPL Orders";
    if (pathname.startsWith("/admin/order-fulfilment")) return "Order Fulfilment";
    if (pathname.startsWith("/admin/orders")) return "Orders";
    if (pathname.startsWith("/admin/vendor-accounting")) return "Vendors Accounting";
    if (pathname.startsWith("/admin/vendors")) return "Vendors";
    if (pathname.startsWith("/admin/transactions")) return "Accounting";
    if (pathname.startsWith("/admin/customers")) return "Customers";
    if (pathname.startsWith("/admin/wishlist")) return "Wishlist Products";
    if (pathname.startsWith("/admin/reviews")) return "Products Reviews";
    if (pathname.startsWith("/admin/product-performance"))
      return "Products Performance Report";
    if (pathname.startsWith("/admin/reports")) return "Reports";
    if (pathname.startsWith("/admin/service-area")) return "Admin Service Area";
    if (pathname.startsWith("/admin/profile")) return "Profile";
    if (pathname.startsWith("/admin/customize")) return "Customize";
    if (pathname.startsWith("/admin/app-styling")) return "App Styling";
    if (pathname.startsWith("/admin/web-styling")) return "Web Styling";
    if (pathname.startsWith("/admin/styling")) return "Styling";
    if (pathname.startsWith("/admin/pages")) return "CMS Pages";
    if (pathname.startsWith("/admin/bnpl-forms")) return "BNPL Forms";
    if (pathname.startsWith("/admin/emails")) return "Emails";
    if (pathname.startsWith("/admin/sms")) return "SMS Templates";
    if (pathname.startsWith("/admin/reasons")) return "Reasons";
    if (pathname.startsWith("/admin/advert")) return "CMS";
    if (pathname.startsWith("/admin/categories")) return "Catalog";
    if (pathname.startsWith("/admin/products")) return "Catalog";
    if (pathname.startsWith("/admin/brands")) return "Brands";
    if (pathname.startsWith("/admin/configurations")) return "Configurations";
    if (pathname.startsWith("/admin/taxes")) return "Taxes";
    if (pathname.startsWith("/admin/tax")) return "Tax";
    if (pathname.startsWith("/admin/payment-options")) return "Payment Options";
    if (pathname.startsWith("/admin/delivery-options")) return "Delivery Options";
    if (pathname.startsWith("/admin/delivery-slots")) return "Delivery Slots";
    if (pathname.startsWith("/admin/delivery")) return "Manage Delivery";
    if (pathname.startsWith("/admin/roles")) return "Manage Roles";
    if (pathname.startsWith("/admin/permissions")) return "Permissions";
    if (pathname.startsWith("/admin/cache")) return "Cache Control";
    if (pathname.startsWith("/admin/banners")) return "Banners";
    if (pathname.startsWith("/admin/subscription-discounts"))
      return "Subscription Discount";
    if (pathname.startsWith("/admin/accounting-promos")) return "Promo Codes";
    if (pathname.startsWith("/admin/accounting-loyalty")) return "Loyalty Points";
    if (pathname.startsWith("/admin/coupons")) return "Promocode";
    if (pathname.startsWith("/admin/promocodes")) return "Promocode";
    if (pathname.startsWith("/admin/loyalty-cards")) return "Loyalty Cards";
    if (pathname.startsWith("/admin/deals")) return "Campaigns";
    if (pathname.startsWith("/admin/campaigns")) return "Campaigns";
    if (pathname.startsWith("/admin/health")) return "Errors & Health";
    if (pathname.startsWith("/admin/tools")) return "Tools";
    if (pathname.startsWith("/admin/logistics")) return "Kool Logistics";
    if (pathname.startsWith("/admin/audit-logs")) return "Audit Logs";
    if (pathname.startsWith("/admin/notifications")) return "Notifications";
    if (pathname.startsWith("/admin/faq")) return "FAQ";
    if (pathname.startsWith("/admin/payout-requests")) return "Payout Requests";
    if (pathname.startsWith("/admin/refunds")) return "Refunds";
    if (pathname.startsWith("/admin/support")) return "Support";
    if (pathname.startsWith("/admin/users")) return "Users";

    // Clean fallback from path segment if unknown route
    const segment = pathname.replace(/^\/admin\/?/, "").split("/")[0];
    if (segment) {
      return segment
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }
    return "Dashboard";
  };

  return (
    <header
      id="header"
      className={`bg-white border-b border-light-gray flex items-center justify-between gap-4 px-4 sm:px-8 sticky top-0 z-30 ${className ?? ""}`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="sm:hidden text-brand-charcoal relative flex items-center justify-center w-8 h-8 rounded-lg hover:bg-brand-orange-soft"
          onClick={onOpenMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <div
            className={`absolute inset-0 transition-all duration-300 ease-in-out flex items-center justify-center ${isOpen ? "opacity-0 rotate-180 scale-0" : "opacity-100 rotate-0 scale-100"}`}
          >
            <HamburgerMenuIcon className="w-5 h-5" />
          </div>
          <div
            className={`absolute inset-0 transition-all duration-300 ease-in-out flex items-center justify-center ${isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-0"}`}
          >
            <Cross1Icon className="w-5 h-5" />
          </div>
        </button>
      </div>
      <div className="shrink-0 min-w-0 sm:min-w-50">
        <motion.h1
          key={pathname}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-[16px] sm:text-[20px] font-semibold text-brand-charcoal tracking-tight truncate"
        >
          {getPageTitle()}
        </motion.h1>
      </div>

      {/* Right Actions Area */}
      <div className="flex-1 flex items-center justify-end gap-5 h-full">
        {/* Search Pill */}
        <div
          className="relative hidden lg:flex w-full max-w-120"
          ref={searchRef}
        >
          <Input
            type="text"
            placeholder="Search data, users, or reports"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleSearchFocus}
            containerClassName="w-full"
            className={`bg-off-white border-light-gray placeholder:text-faint text-[13px] transition-all
              ${isSearchOpen ? "bg-white border-brand-orange ring-2 ring-brand-orange/15" : ""}
            `}
            suffixElement={<MagnifyingGlassIcon className="w-4 h-4 text-faint" />}
          />

          {isSearchOpen && <AdminSearchDropdown query={searchQuery} />}
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            {/* Same bell, button and badge as the Sales CRM header (components/ui/NotificationBell.tsx) */}
            <button
              className={`relative w-8 h-8 p-1 flex items-center justify-center rounded-lg transition-colors cursor-pointer
                ${isNotificationsOpen ? "bg-gray-100 text-gray-800" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"}
              `}
              onClick={toggleNotifications}
              aria-label={unreadNotificationCount ? `Notifications, ${unreadNotificationCount} unread` : "Notifications"}
              title="Notifications"
            >
              <BellLightIcon />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-1 ring-white">
                  {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && !isMobile && <AdminNotificationDropdown />}

            {isMobile && (
              <Modal
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                hideHeaderBorder={true}
                className="p-0"
                size="md"
              >
                <NotificationList
                  onAction={() => setIsNotificationsOpen(false)}
                />
              </Modal>
            )}
          </div>

          {/* Theme Toggle Switch */}
          <div className="flex items-center">
            {/* Light / dark switch: the knob slides, sun for light, moon for dark */}
            <button
              type="button"
              role="switch"
              aria-checked={isDark}
              onClick={() => setAdminTheme(isDark ? "light" : "dark")}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Dark mode"
              className={`relative w-12 h-7 rounded-full border transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50 ${
                isDark ? "bg-[#334155] border-[#475569]" : "bg-off-white border-light-gray"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-[22px] h-[22px] rounded-full flex items-center justify-center transition-transform duration-200 ${
                  isDark ? "translate-x-5 bg-[#0F172A]" : "translate-x-0 bg-white shadow-sm"
                }`}
              >
                {isDark ? (
                  <MoonIcon className="w-3.5 h-3.5 text-[#F1F5F9]" />
                ) : (
                  <SunIcon className="w-3.5 h-3.5 text-brand-orange" />
                )}
              </span>
            </button>
          </div>

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <div
              className={`w-10 h-10 rounded-full border overflow-hidden cursor-pointer transition-all flex items-center justify-center bg-brand-orange-soft
                ${isProfileOpen ? "border-brand-orange ring-2 ring-brand-orange/20" : "border-light-gray hover:border-brand-orange/50"}
              `}
              onClick={toggleProfile}
            >
              {userImage ? (
                <img
                  src={userImage}
                  alt="Admin"
                  className="w-full h-full object-cover"
                />
              ) : (
                <PersonIcon className="text-brand-orange-text w-5 h-5" />
              )}
            </div>

            {isProfileOpen && <AdminProfileDropdown />}
          </div>
        </div>
      </div>
    </header>
  );
};
