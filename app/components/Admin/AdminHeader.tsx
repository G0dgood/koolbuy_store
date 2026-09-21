"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Icon } from "../Icon";
import { Input } from "../Form/Inputs";
import { AdminNotificationDropdown } from "./AdminNotificationDropdown";
import { AdminProfileDropdown } from "./AdminProfileDropdown";
import { AdminSearchDropdown } from "./AdminSearchDropdown";
import { useState, useRef, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { HiUser } from "react-icons/hi2";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import Modal from "../Modal/Modal";
import { NotificationList } from "./AdminNotificationDropdown";
import { motion } from "framer-motion";

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
    if (pathname.startsWith("/admin/orders")) return "Order Fulfilment";
    if (pathname.startsWith("/admin/vendors")) return "Vendors";
    if (pathname.startsWith("/admin/transactions")) return "Accounting";
    if (pathname.startsWith("/admin/customers")) return "Customers";
    if (pathname.startsWith("/admin/wishlist")) return "Wishlist Products";
    if (pathname.startsWith("/admin/reviews")) return "Products Reviews";
    if (pathname.startsWith("/admin/reports")) return "Reports";
    if (pathname.startsWith("/admin/service-area")) return "Admin Service Area";
    if (pathname.startsWith("/admin/profile")) return "Profile";
    if (pathname.startsWith("/admin/customize")) return "Customize";
    if (pathname.startsWith("/admin/app-styling")) return "App Styling";
    if (pathname.startsWith("/admin/web-styling")) return "Web Styling";
    if (pathname.startsWith("/admin/styling")) return "Styling";
    if (pathname.startsWith("/admin/advert")) return "CMS";
    if (pathname.startsWith("/admin/categories")) return "Catalog";
    if (pathname.startsWith("/admin/products")) return "Catalog";
    if (pathname.startsWith("/admin/brands")) return "Brands";
    if (pathname.startsWith("/admin/configurations")) return "Configurations";
    if (pathname.startsWith("/admin/tax")) return "Tax";
    if (pathname.startsWith("/admin/payment-options")) return "Payment Options";
    if (pathname.startsWith("/admin/delivery")) return "Manage Delivery";
    if (pathname.startsWith("/admin/roles")) return "Manage Roles";
    if (pathname.startsWith("/admin/permissions")) return "Permissions";
    if (pathname.startsWith("/admin/cache")) return "Cache Control";
    if (pathname.startsWith("/admin/banners")) return "Banners";
    if (pathname.startsWith("/admin/subscription-discounts"))
      return "Subscription Discount";
    if (pathname.startsWith("/admin/coupons")) return "Promocode";
    if (pathname.startsWith("/admin/loyalty-cards")) return "Loyalty Cards";
    if (pathname.startsWith("/admin/deals")) return "Campaigns";
    if (pathname.startsWith("/admin/health")) return "Errors & Health";
    if (pathname.startsWith("/admin/tools")) return "Tools";
    if (pathname.startsWith("/admin/logistics")) return "Kool Logistics";
    if (pathname.startsWith("/admin/audit-logs")) return "DB Audit Logs";
    if (pathname.startsWith("/admin/notifications")) return "Notifications";
    if (pathname.startsWith("/admin/faq")) return "FAQ";
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
      className={`  bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-12 sticky top-0 z-30 ${className}`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="sm:hidden text-neutral-900 relative flex items-center justify-center w-8 h-8"
          onClick={onOpenMenu}
        >
          <div
            className={`absolute inset-0 transition-all duration-300 ease-in-out flex items-center justify-center ${isOpen ? "opacity-0 rotate-180 scale-0" : "opacity-100 rotate-0 scale-100"}`}
          >
            <RxHamburgerMenu size={20} />
          </div>
          <div
            className={`absolute inset-0 transition-all duration-300 ease-in-out flex items-center justify-center ${isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-0"}`}
          >
            <IoMdClose size={20} />
          </div>
        </button>
      </div>
      <div className="shrink-0 mr-4 sm:mr-8 min-w-35 sm:min-w-50">
        <motion.h1
          key={pathname}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-[16px] sm:text-[20px] font-black text-[#1D3557] tracking-tight uppercase truncate xl:max-w-none"
        >
          {getPageTitle()}
        </motion.h1>
      </div>

      {/* Right Actions Area */}
      <div className="flex-1 flex items-center justify-end gap-6 h-full">
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
            className={`bg-white border-gray-100 placeholder:text-gray-400 text-xs font-medium transition-all
              ${isSearchOpen ? "ring-4 ring-blue-50 border-brand-blue/30 shadow-sm" : ""}
            `}
            suffixElement={
              <Icon
                name="search-01"
                folder="dashboardIcon"
                size="sm"
                className="text-gray-400"
              />
            }
          />

          {isSearchOpen && <AdminSearchDropdown query={searchQuery} />}
        </div>

        <div className="flex items-center gap-6">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              className={`relative p-2 transition-colors group rounded-lg
                ${isNotificationsOpen ? "bg-brand-blue-light text-brand-blue border border-[#1C1C1C1A]" : "text-gray-400 hover:text-brand-blue"}
              `}
              onClick={toggleNotifications}
            >
              <Icon
                name="Bell outline"
                folder="dashboardIcon"
                size="md"
                className={
                  isNotificationsOpen ? "text-brand-blue" : "text-[#1D3557]"
                }
              />
              <span className="absolute top-2 right-2 w-1.75 h-1.75 bg-red-500 rounded-full border border-white"></span>
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
            <button className="w-12 h-7 bg-brand-blue-light rounded-full p-1 flex items-center relative transition-colors cursor-pointer">
              <div className="w-5 h-5 bg-white rounded-full border border-[#1C1C1C1A] flex items-center justify-center transition-all transform">
                <Icon
                  name="Group"
                  folder="dashboardIcon"
                  size="xs"
                  className="text-gray-400 opacity-60"
                />
              </div>
            </button>
          </div>

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <div
              className={`w-11 h-11 rounded-full border border-[#1C1C1C1A] overflow-hidden cursor-pointer transition-all flex items-center justify-center bg-brand-blue-light
                ${isProfileOpen ? "border-brand-blue scale-105" : "hover:border-brand-blue/50"}
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
                <HiUser className="text-brand-blue w-6 h-6" />
              )}
            </div>

            {isProfileOpen && <AdminProfileDropdown />}
          </div>
        </div>
      </div>
    </header>
  );
};
