"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConfirmationModal } from "./ConfirmationModal";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronRight, HiChevronDown, HiXMark } from "react-icons/hi2";

/* =========================================================
   CUSTOM SVGs MATCHING THE DESIGN IN THE SCREENSHOT
   ========================================================= */

// 1. Dashboard Window Icon
const DashboardIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <rect
      x="2.5"
      y="3.5"
      width="19"
      height="17"
      rx="3"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.8"
    />
    <path
      d="M2.5 8.5H21.5"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.8"
    />
    <rect
      x="5.5"
      y="11.5"
      width="5"
      height="6"
      rx="1"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.5"
    />
    <rect
      x="13.5"
      y="11.5"
      width="5"
      height="2.5"
      rx="0.8"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.5"
    />
    <rect
      x="13.5"
      y="15"
      width="5"
      height="2.5"
      rx="0.8"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.5"
    />
  </svg>
);

// 2. Order Fulfilment Shopping Bag Icon
const OrderFulfilmentIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M8.5 7.5V6a3.5 3.5 0 1 1 7 0v1.5"
      stroke={active ? "currentColor" : "#64748B"}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <rect
      x="4.5"
      y="7.5"
      width="15"
      height="13"
      rx="3"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.8"
    />
    <path
      d="M9.5 14L11.5 16L15 12"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 3. Vendors User / Merchant Icon
const VendorsIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <circle
      cx="12"
      cy="7.5"
      r="3.5"
      stroke={active ? "currentColor" : "#64748B"}
      strokeWidth="1.8"
    />
    <path
      d="M5.5 19.5C5.5 16.2 8.4 13.5 12 13.5C15.6 13.5 18.5 16.2 18.5 19.5"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M10.5 13.5L12 16.5L13.5 13.5"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M11.3 16.5H12.7L12 20.5L11.3 16.5Z"
      fill={active ? "currentColor" : "#00BCD4"}
    />
  </svg>
);

// 4. Accounting Ledger & Calculator Icon
const AccountingIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M4.5 4.5C4.5 3.4 5.4 2.5 6.5 2.5H13.5L18.5 7.5V17.5C18.5 18.6 17.6 19.5 16.5 19.5"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M8.5 6.5H12.5M8.5 9.5H11"
      stroke={active ? "currentColor" : "#64748B"}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <rect
      x="10"
      y="10"
      width="10.5"
      height="12"
      rx="2"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.6"
      fill={active ? "none" : "white"}
    />
    <rect
      x="12"
      y="11.8"
      width="6.5"
      height="2.5"
      rx="0.5"
      stroke={active ? "currentColor" : "#64748B"}
      strokeWidth="1.2"
    />
    <circle
      cx="12.5"
      cy="16.5"
      r="0.8"
      fill={active ? "currentColor" : "#94A3B8"}
    />
    <circle
      cx="15.2"
      cy="16.5"
      r="0.8"
      fill={active ? "currentColor" : "#94A3B8"}
    />
    <circle
      cx="18"
      cy="16.5"
      r="0.8"
      fill={active ? "currentColor" : "#94A3B8"}
    />
    <circle
      cx="12.5"
      cy="19.5"
      r="0.8"
      fill={active ? "currentColor" : "#94A3B8"}
    />
    <circle
      cx="15.2"
      cy="19.5"
      r="0.8"
      fill={active ? "currentColor" : "#94A3B8"}
    />
    <circle
      cx="18"
      cy="19.5"
      r="0.8"
      fill={active ? "currentColor" : "#00BCD4"}
    />
  </svg>
);

// 5. Customers (Multi-user) Icon
const CustomersIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <circle
      cx="9"
      cy="7.5"
      r="3"
      stroke={active ? "currentColor" : "#64748B"}
      strokeWidth="1.8"
    />
    <path
      d="M3.5 18.5C3.5 15.5 6 13.5 9 13.5C12 13.5 14.5 15.5 14.5 18.5"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle
      cx="16.5"
      cy="8"
      r="2.2"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.5"
    />
    <path
      d="M16 13.5C17.8 13.8 19.5 15.2 20 17.5"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// 5b. Wishlist Products Love / Heart Icon
const WishlistLoveIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.69C2 5.6 4.49 3.1 7.56 3.1C9.38 3.1 10.99 3.98 12 5.34C13.01 3.98 14.63 3.1 16.44 3.1C19.51 3.1 22 5.6 22 8.69C22 15.69 15.52 19.82 12.62 20.81Z"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={active ? "currentColor" : "none"}
    />
  </svg>
);

// 6. Reports (Analytics Chart / Document) Icon
const ReportsIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <rect
      x="3"
      y="3.5"
      width="18"
      height="17"
      rx="3"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.8"
    />
    <path
      d="M7 15L10.5 11.5L13.5 14.5L17 9.5"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="17"
      cy="9.5"
      r="1.2"
      fill={active ? "currentColor" : "#00BCD4"}
    />
  </svg>
);

// 7. Admin Service Area (Network / Org Hierarchy) Icon
const AdminServiceAreaIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <circle
      cx="12"
      cy="5"
      r="2.5"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.8"
    />
    <circle
      cx="6"
      cy="18"
      r="2.5"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.8"
    />
    <circle
      cx="18"
      cy="18"
      r="2.5"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.8"
    />
    <path
      d="M12 7.5V11.5M12 11.5H6V15.5M12 11.5H18V15.5"
      stroke={active ? "currentColor" : "#64748B"}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

// 8. Profile Avatar Icon
const ProfileIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.8"
    />
    <circle
      cx="12"
      cy="9"
      r="3"
      stroke={active ? "currentColor" : "#64748B"}
      strokeWidth="1.6"
    />
    <path
      d="M6.8 17.5C7.8 15 9.8 13.5 12 13.5C14.2 13.5 16.2 15 17.2 17.5"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

// 9. Customize (Crossed Tools / Ruler & Pencil) Icon
const CustomizeIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M14.5 4.5L19.5 9.5L8.5 20.5H3.5V15.5L14.5 4.5Z"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path
      d="M12.5 6.5L17.5 11.5"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.5"
    />
    <path
      d="M6.5 14.5L9.5 17.5"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// 10. Styling (Paint Roller / Brush) Icon
const StylingIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M14.5 3.5C13.5 2.5 11.5 2.5 10.5 3.5L4 10C3 11 3 12.5 4 13.5L10.5 20C11.5 21 13 21 14 20L20.5 13.5C21.5 12.5 21.5 11 20.5 10L14.5 3.5Z"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.7"
    />
    <circle
      cx="12"
      cy="12"
      r="3"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.6"
    />
  </svg>
);

// 11. CMS Desktop Monitor with Gear Icon
const CMSIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <rect
      x="3"
      y="3.5"
      width="18"
      height="13"
      rx="2.5"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.8"
    />
    <path
      d="M9.5 19.5H14.5M12 16.5V19.5"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle
      cx="12"
      cy="10"
      r="2"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.6"
    />
    <path
      d="M12 6.8V7.8M12 12.2V13.2M8.8 10H9.8M14.2 10H15.2M9.7 7.7L10.4 8.4M13.6 11.6L14.3 12.3M14.3 7.7L13.6 8.4M10.4 11.6L9.7 12.3"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

// 12. Catalog (Clipboard Checklist) Icon
const CatalogIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <rect
      x="5"
      y="4.5"
      width="14"
      height="16"
      rx="2"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.8"
    />
    <path
      d="M9 3H15V6H9V3Z"
      stroke={active ? "currentColor" : "#64748B"}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <line
      x1="8.5"
      y1="10"
      x2="15.5"
      y2="10"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="8.5"
      y1="13.5"
      x2="15.5"
      y2="13.5"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="8.5"
      y1="17"
      x2="12.5"
      y2="17"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// 13. Configurations (Interlocking Gears) Icon
const ConfigurationsIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <circle
      cx="9.5"
      cy="13.5"
      r="3.5"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.8"
    />
    <path
      d="M9.5 8V9.5M9.5 17.5V19M4 13.5H5.5M13.5 13.5H15M5.6 9.6L6.7 10.7M12.3 16.3L13.4 17.4M5.6 17.4L6.7 16.3M12.3 10.7L13.4 9.6"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle
      cx="16"
      cy="7.5"
      r="2.5"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.6"
    />
    <path
      d="M16 4V5M16 10V11M12.5 7.5H13.5M18.5 7.5H19.5"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

// 14. Tax Document Icon
const TaxIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M5.5 4C5.5 3.2 6.2 2.5 7 2.5H14.5L18.5 6.5V20C18.5 20.8 17.8 21.5 17 21.5H7C6.2 21.5 5.5 20.8 5.5 20V4Z"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.8"
    />
    <text
      x="7.2"
      y="11.5"
      fontSize="6"
      fontWeight="900"
      fontFamily="sans-serif"
      fill={active ? "currentColor" : "#64748B"}
      letterSpacing="0.4"
    >
      TAX
    </text>
    <circle
      cx="9.5"
      cy="15.5"
      r="1"
      fill={active ? "currentColor" : "#00BCD4"}
    />
    <path
      d="M8.5 18.5L14.5 13.5"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <circle
      cx="13.5"
      cy="16.5"
      r="1"
      fill={active ? "currentColor" : "#00BCD4"}
    />
  </svg>
);

// 15. Payment Options (POS / Card) Icon
const PaymentOptionsIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="2.5"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.8"
    />
    <path
      d="M3 9.5H21"
      stroke={active ? "currentColor" : "#64748B"}
      strokeWidth="1.6"
    />
    <circle
      cx="7.5"
      cy="14.5"
      r="1.5"
      fill={active ? "currentColor" : "#00BCD4"}
    />
    <line
      x1="12"
      y1="14.5"
      x2="17"
      y2="14.5"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

// 16. Manage Delivery (Truck) Icon
const ManageDeliveryIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M3 6.5C3 5.4 3.9 4.5 5 4.5H14V16.5H3V6.5Z"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.7"
    />
    <path
      d="M14 9.5H18L21 12.5V16.5H14V9.5Z"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <circle
      cx="7"
      cy="17"
      r="2"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.6"
    />
    <circle
      cx="17.5"
      cy="17"
      r="2"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.6"
    />
  </svg>
);

// 17. Manage Roles (User Shield / Profile) Icon
const ManageRolesIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.8"
    />
    <circle
      cx="12"
      cy="9.5"
      r="2.5"
      stroke={active ? "currentColor" : "#64748B"}
      strokeWidth="1.6"
    />
    <path
      d="M7.5 17.5C8.2 15 10 14 12 14C14 14 15.8 15 16.5 17.5"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

// 18. Cache Control (Speedometer / Clock Refresh) Icon
const CacheControlIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.8"
    />
    <path
      d="M12 7V12L15 13.5"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M16.5 7.5A6.5 6.5 0 0 0 7.5 7.5"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// 19. Banners (Megaphone / Announcement) Icon
const BannersIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M4 11V6C4 5.4 4.4 5 5 5H6.5L16 2.5V17.5L6.5 15H5C4.4 15 4 14.6 4 14V11Z"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 15V20"
      stroke={active ? "currentColor" : "#64748B"}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path
      d="M19 8.5C19.8 9.5 20.2 10.7 20.2 12C20.2 13.3 19.8 14.5 19 15.5"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

// 20. Promocode Voucher / Coupon Icon
const PromocodeIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M3.5 8C3.5 6.9 4.4 6 5.5 6H18.5C19.6 6 20.5 6.9 20.5 8C19.4 8 18.5 8.9 18.5 10C18.5 11.1 19.4 12 20.5 12C19.4 12 18.5 12.9 18.5 14C18.5 15.1 19.4 16 20.5 16C20.5 17.1 19.6 18 18.5 18H5.5C4.4 18 3.5 17.1 3.5 16C4.6 16 5.5 15.1 5.5 14C5.5 12.9 4.6 12 3.5 12C4.6 12 5.5 11.1 5.5 10C5.5 8.9 4.6 8 3.5 8Z"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.8"
    />
    <circle cx="9.5" cy="10" r="1" fill={active ? "currentColor" : "#00BCD4"} />
    <path
      d="M8.5 14L14.5 10"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle
      cx="13.5"
      cy="14"
      r="1"
      fill={active ? "currentColor" : "#00BCD4"}
    />
  </svg>
);

// 21. Loyalty Cards Icon
const LoyaltyCardsIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="2.5"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.8"
    />
    <path
      d="M7.5 14H16.5L15.5 11L13.5 12.5L12 9.5L10.5 12.5L8.5 11L7.5 14Z"
      stroke={active ? "currentColor" : "#FF7A00"}
      fill={active ? "currentColor" : "#FFF3E0"}
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <line
      x1="6"
      y1="16"
      x2="9"
      y2="16"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

// 22. Campaigns (Star Rosette) Icon
const CampaignsIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <circle
      cx="12"
      cy="9.5"
      r="6.5"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.8"
    />
    <polygon
      points="12,5.5 13.2,8 16,8.3 13.9,10.1 14.5,13 12,11.5 9.5,13 10.1,10.1 8,8.3 10.8,8"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.2"
      fill={active ? "currentColor" : "#00BCD4"}
      fillOpacity={active ? "1" : "0.2"}
      strokeLinejoin="round"
    />
    <path
      d="M8.5 15.5L7.5 21L12 18.5L16.5 21L15.5 15.5"
      stroke={active ? "currentColor" : "#64748B"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 23. Errors & Health (Circle Exclamation) Icon
const ErrorsHealthIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.8"
    />
    <line
      x1="12"
      y1="7.5"
      x2="12"
      y2="12.5"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle
      cx="12"
      cy="15.5"
      r="1"
      fill={active ? "currentColor" : "#00BCD4"}
    />
  </svg>
);

// 24. Tools (Wrench) Icon
const ToolsIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M14.7 4.3C15.5 5.1 15.5 6.4 14.7 7.2L13.8 8.1L15.9 10.2L16.8 9.3C17.6 8.5 18.9 8.5 19.7 9.3C20.5 10.1 20.5 11.4 19.7 12.2L18.2 13.7L15.4 10.9L16.3 10L14.2 7.9L13.3 8.8L10.5 6L12 4.5C12.8 3.7 14.1 3.7 14.7 4.3Z"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.6"
    />
    <path
      d="M10.5 13.5L4 20L3 21L4 20L10.5 13.5Z"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M6 16L8 18"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

// 25. Kool Logistics (Shipping Box) Icon
const KoolLogisticsIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M12 3L3.5 7.5V16.5L12 21L20.5 16.5V7.5L12 3Z"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path
      d="M12 12L20.5 7.5M12 12V21M12 12L3.5 7.5"
      stroke={active ? "currentColor" : "#64748B"}
      strokeWidth="1.6"
    />
    <path
      d="M7.5 5.5L16 10"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// 26. DB Audit Logs (Database Cylinder Stack) Icon
const DBAuditLogsIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <ellipse
      cx="12"
      cy="6"
      rx="7.5"
      ry="3"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.7"
    />
    <path
      d="M4.5 6V12C4.5 13.6 7.8 15 12 15C16.2 15 19.5 13.6 19.5 12V6"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.7"
    />
    <path
      d="M4.5 12V18C4.5 19.6 7.8 21 12 21C16.2 21 19.5 19.6 19.5 18V12"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.7"
    />
    <path
      d="M10.5 10.5H14.5M10.5 16.5H13.5"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);



// 28. Kool Logistics (Delivery Truck) Icon
const LogisticsTruckIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <rect
      x="2"
      y="5"
      width="13"
      height="11"
      rx="2"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.7"
    />
    <path
      d="M15 8H19.2C19.7 8 20.2 8.3 20.4 8.7L22 12V16H15V8Z"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <circle
      cx="6.5"
      cy="17.5"
      r="2"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.7"
    />
    <circle
      cx="17.5"
      cy="17.5"
      r="2"
      stroke={active ? "currentColor" : "#00BCD4"}
      strokeWidth="1.7"
    />
    <path
      d="M8.5 17.5H15.5"
      stroke={active ? "currentColor" : "#94A3B8"}
      strokeWidth="1.7"
    />
  </svg>
);

/* =========================================================
   TYPES & NAVIGATION CONFIGURATION
   ========================================================= */

interface SubMenuItem {
  name: string;
  href: string;
  noBullet?: boolean;
}

interface NavItemConfig {
  name: string;
  href: string;
  icon?: (props: { active?: boolean }) => React.ReactNode;
  hasChevron?: boolean;
  subItems?: SubMenuItem[];
}

interface NavGroupConfig {
  title: string;
  items: NavItemConfig[];
}

const navGroups: NavGroupConfig[] = [
  {
    title: "ORDERS",
    items: [
      {
        name: "Dashboard",
        href: "/admin",
        icon: DashboardIcon,
      },
      {
        name: "Order Fulfilment",
        href: "/admin/order-fulfilment",
        icon: OrderFulfilmentIcon,
      },
      {
        name: "Vendors",
        href: "/admin/vendors",
        icon: VendorsIcon,
      },
      {
        name: "Accounting",
        href: "/admin/transactions",
        hasChevron: true,
        icon: AccountingIcon,
        subItems: [
          {
            name: "Vendors Payment Report",
            href: "/admin/transactions?tab=vendors-payment",
          },
          { name: "BNPL Orders", href: "/admin/bnpl-orders" },
          { name: "Orders", href: "/admin/orders" },
          { name: "Loyalty Cards", href: "/admin/accounting-loyalty" },
          { name: "Promo Codes", href: "/admin/accounting-promos" },
          { name: "Taxes", href: "/admin/taxes" },
          { name: "Vendors", href: "/admin/vendor-accounting" },
          { name: "Payout Requests", href: "/admin/refunds" },
          {
            name: "Subscription Discount",
            href: "/admin/subscription-discounts",
          },
        ],
      },
      {
        name: "Customers",
        href: "/admin/customers",
        icon: CustomersIcon,
      },
      {
        name: "Wishlist Products",
        href: "/admin/wishlist",
        icon: WishlistLoveIcon,
      },
      {
        name: "Reports",
        href: "/admin/reviews",
        hasChevron: true,
        icon: ReportsIcon,
        subItems: [
          { name: "Products Reviews", href: "/admin/reviews" },
          {
            name: "Products Performance Report",
            href: "/admin/product-performance",
          },
        ],
      },
      {
        name: "Admin Service Area",
        href: "/admin/service-area",
        icon: AdminServiceAreaIcon,
      },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      {
        name: "Profile",
        href: "/admin/profile",
        icon: ProfileIcon,
      },
      {
        name: "Customize",
        href: "/admin/customize",
        icon: CustomizeIcon,
      },
      {
        name: "Styling",
        href: "/admin/app-styling",
        hasChevron: true,
        icon: StylingIcon,
        subItems: [
          {
            name: "App Styling",
            href: "/admin/app-styling",
          },
          {
            name: "Web Styling",
            href: "/admin/web-styling",
          },
        ],
      },
      {
        name: "CMS",
        href: "/admin/pages",
        hasChevron: true,
        icon: CMSIcon,
        subItems: [
          { name: "Pages", href: "/admin/pages" },
          { name: "BNPL Forms", href: "/admin/bnpl-forms" },
          { name: "Emails", href: "/admin/emails" },
          { name: "Notifications", href: "/admin/notifications" },
          { name: "SMS", href: "/admin/sms" },
          { name: "Reasons", href: "/admin/reasons" },
        ],
      },
      {
        name: "Catalog",
        href: "/admin/categories",
        icon: CatalogIcon,
      },
      {
        name: "Configurations",
        href: "/admin/configurations",
        icon: ConfigurationsIcon,
      },
      {
        name: "Tax",
        href: "/admin/tax",
        icon: TaxIcon,
      },
      {
        name: "Payment Options",
        href: "/admin/payment-options",
        icon: PaymentOptionsIcon,
      },
      {
        name: "Manage Delivery",
        href: "/admin/delivery-options",
        hasChevron: true,
        icon: ManageDeliveryIcon,
        subItems: [
          {
            name: "Delivery Options",
            href: "/admin/delivery-options",
          },
          { name: "Delivery Slots", href: "/admin/delivery-slots" },
        ],
      },
      {
        name: "Manage Roles",
        href: "/admin/roles",
        icon: ManageRolesIcon,
      },
      {
        name: "Cache Control",
        href: "/admin/cache",
        icon: CacheControlIcon,
      },
    ],
  },
  {
    title: "MARKETING",
    items: [
      {
        name: "Banners",
        href: "/admin/advert",
        hasChevron: true,
        icon: BannersIcon,
        subItems: [
          { name: "Web Banners", href: "/admin/advert?type=web" },
          { name: "Mobile Banners", href: "/admin/advert?type=mobile" },
        ],
      },
      {
        name: "Promocode",
        href: "/admin/coupons",
        icon: PromocodeIcon,
      },
      {
        name: "Loyalty Cards",
        href: "/admin/loyalty-cards",
        icon: LoyaltyCardsIcon,
      },
      {
        name: "Campaigns",
        href: "/admin/deals",
        icon: CampaignsIcon,
      },
    ],
  },
  {
    title: "EXTRA",
    items: [
      {
        name: "Errors & Health",
        href: "/admin/health",
        icon: ErrorsHealthIcon,
      },
      {
        name: "Tools",
        href: "/admin/tools",
        icon: ToolsIcon,
      },
      {
        name: "Kool Logistics",
        href: "/admin/logistics",
        icon: LogisticsTruckIcon,
      },
      {
        name: "DB Audit Logs",
        href: "/admin/audit-logs",
        icon: DBAuditLogsIcon,
      },
    ],
  },
];

interface SidenavProps {
  activeItem?: string;
  isOpen?: boolean;
  onClose?: () => void;
  role?: string;
}

export const AdminSidebar: React.FC<SidenavProps> = ({
  isOpen,
  onClose,
}: SidenavProps) => {
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Automatically expand parent if currently on a child route
  useEffect(() => {
    navGroups.forEach((group) => {
      group.items.forEach((item) => {
        if (
          item.hasChevron &&
          item.subItems?.some((sub) => {
            const cleanSub = sub.href.split("?")[0];
            return pathname === cleanSub || pathname.startsWith(cleanSub + "/");
          })
        ) {
          setExpandedMenus((prev) =>
            prev.includes(item.name) ? prev : [...prev, item.name],
          );
        }
      });
    });
  }, [pathname]);

  const toggleSubmenu = (menuName: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((m) => m !== menuName)
        : [...prev, menuName],
    );
  };

  const isItemActive = (item: NavItemConfig) => {
    if (item.href === "/admin") {
      return pathname === "/admin";
    }

    // When on /admin/configurations, strictly only Configurations should be active
    if (
      pathname === "/admin/configurations" ||
      pathname.startsWith("/admin/configurations/")
    ) {
      return item.name === "Configurations";
    }

    // If item has chevron and subitems, it is active if any subitem matches
    if (item.hasChevron && item.subItems && item.subItems.length > 0) {
      return item.subItems.some((sub) => {
        const cleanSub = sub.href.split("?")[0];
        return pathname === cleanSub || pathname.startsWith(cleanSub + "/");
      });
    }

    const cleanHref = item.href.split("?")[0];
    if (pathname === cleanHref || pathname.startsWith(cleanHref + "/")) {
      return true;
    }
    return false;
  };

  const isSubItemActive = (subHref: string) => {
    const cleanSub = subHref.split("?")[0];
    return pathname === cleanSub;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 sm:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        id="sidenav"
        className={`w-64 h-full shrink-0 flex flex-col justify-between bg-white border-r border-gray-100 transition-transform duration-300 ease-in-out sm:translate-x-0 ${
          isOpen
            ? "fixed inset-y-0 left-0 z-50 flex translate-x-0 shadow-2xl"
            : "hidden sm:flex"
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Centered Logo like in the design image */}
          <div className="pt-8 pb-6 px-4 flex flex-col items-center justify-center relative">
            <Link
              href="/admin"
              className="flex items-center justify-center group focus:outline-none"
            >
              <img
                src="/images/koolboks/koolbuy_logo.webp"
                alt="Kool Buy"
                className="h-16 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 sm:hidden"
              aria-label="Close menu"
            >
              <HiXMark size={22} />
            </button>
          </div>

          {/* Navigation Items List */}
          <nav className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-6 custom-scrollbar">
            {navGroups.map((group) => (
              <div key={group.title} className="flex flex-col">
                {/* Group Title */}
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#1E293B] px-3.5 mb-2.5">
                  {group.title}
                </h4>

                {/* Group Items */}
                <div className="flex flex-col gap-1">
                  {group.items.map((item) => {
                    const active = isItemActive(item);
                    const isExpanded = expandedMenus.includes(item.name);

                    return (
                      <div key={item.name} className="flex flex-col">
                        {item.hasChevron &&
                        item.subItems &&
                        item.subItems.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => toggleSubmenu(item.name)}
                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-[13.5px] font-medium w-full cursor-pointer ${
                              active
                                ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
                                : "text-[#64748B] hover:bg-brand-blue-light/70 hover:text-brand-blue"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {item.icon ? (
                                item.icon({ active })
                              ) : (
                                <span className="w-5 h-5 shrink-0" />
                              )}
                              <span>{item.name}</span>
                            </div>
                            <HiChevronDown
                              className={`text-xs transition-transform duration-200 ${
                                active ? "text-white" : "text-gray-400"
                              } ${isExpanded ? "rotate-0" : "-rotate-90"}`}
                            />
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-[13.5px] font-medium w-full ${
                              active
                                ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
                                : "text-[#64748B] hover:bg-brand-blue-light/70 hover:text-brand-blue"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {item.icon ? (
                                item.icon({ active })
                              ) : (
                                <span className="w-5 h-5 shrink-0" />
                              )}
                              <span>{item.name}</span>
                            </div>
                          </Link>
                        )}

                        {/* Expandable Sub-items with hollow bullet circle ○ */}
                        {item.hasChevron && item.subItems && (
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.2,
                                  ease: "easeInOut",
                                }}
                                className="overflow-hidden pl-7 pr-1 pt-1.5 flex flex-col gap-1"
                              >
                                {item.subItems.map((sub) => {
                                  const isSubActive = isSubItemActive(sub.href);

                                  return (
                                    <Link
                                      key={sub.name}
                                      href={sub.href}
                                      onClick={onClose}
                                      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors group ${
                                        isSubActive
                                          ? "text-brand-blue font-bold bg-brand-blue-light/50"
                                          : "text-[#64748B] hover:text-brand-blue hover:bg-brand-blue-light/40"
                                      }`}
                                    >
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full border shrink-0 transition-colors ${
                                          isSubActive
                                            ? "border-brand-blue bg-brand-blue"
                                            : "border-[#94A3B8] group-hover:border-brand-blue"
                                        }`}
                                      />
                                      <span className="truncate">
                                        {sub.name}
                                      </span>
                                    </Link>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}

                        {/* Static Sub-items (e.g., Wishlist Products under Customers) */}
                        {!item.hasChevron && item.subItems && (
                          <div className="pl-10 pr-2 pt-0.5 flex flex-col gap-0.5">
                            {item.subItems.map((sub) => {
                              const isSubActive = isSubItemActive(sub.href);

                              return (
                                <Link
                                  key={sub.name}
                                  href={sub.href}
                                  onClick={onClose}
                                  className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                                    isSubActive
                                      ? "text-brand-blue font-bold bg-brand-blue-light/50"
                                      : "text-[#64748B] hover:text-brand-blue hover:bg-brand-blue-light/40"
                                  }`}
                                >
                                  {sub.name}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Subtle Footer: Admin Profile & Logout */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <Link
            href="/admin/profile"
            className="flex items-center gap-2.5 min-w-0 group"
          >
            <div className="w-8 h-8 rounded-full border border-gray-200 overflow-hidden shrink-0 shadow-2xs">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop"
                alt="Admin"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-gray-800 truncate group-hover:text-brand-blue transition-colors">
                Koolbuy Admin
              </span>
              <span className="text-[10px] text-gray-400 truncate">
                Super Admin
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Logout"
            aria-label="Logout"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={() => {
            console.log("Admin logged out");
            setIsLogoutModalOpen(false);
          }}
          title="Logout Session"
          message="Are you sure you want to end your administrative session?"
          confirmText="Yes, Logout"
          cancelText="Cancel"
          type="danger"
        />
      </aside>
    </>
  );
};
