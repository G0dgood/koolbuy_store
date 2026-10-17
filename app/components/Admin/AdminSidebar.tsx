"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  DashboardIcon,
  ArchiveIcon,
  IdCardIcon,
  ReaderIcon,
  PersonIcon,
  HeartIcon,
  BarChartIcon,
  SewingPinIcon,
  AvatarIcon,
  MixerHorizontalIcon,
  ColorWheelIcon,
  LayoutIcon,
  CubeIcon,
  GearIcon,
  FileTextIcon,
  CardStackIcon,
  PaperPlaneIcon,
  LockClosedIcon,
  ReloadIcon,
  ImageIcon,
  TokensIcon,
  StarIcon,
  RocketIcon,
  ActivityLogIcon,
  HobbyKnifeIcon,
  GlobeIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  Cross1Icon,
  FileIcon,
  ListBulletIcon,
  ChatBubbleIcon,
  EnvelopeClosedIcon,
  BellIcon,
  MobileIcon,
  DesktopIcon,
  QuestionMarkCircledIcon,
  CalendarIcon,
  StarFilledIcon,
  CountdownTimerIcon,
  BackpackIcon,
  ValueIcon,
  PieChartIcon,
} from "@radix-ui/react-icons";

/* Side nav, matching the Koolboks Sales CRM's components/ui/DashboardSideNav.tsx:
   white panel, one continuous list of Radix icons and 13px labels, a charcoal
   fill on the active item (the CRM's --primary), soft orange on hover, sub-items
   with their own icons under a left rule, and a 70px icon-only mode with
   tooltips that is remembered per browser. Thin rules separate the store's
   four sections (orders, settings, marketing, extra). */

type IconComponent = React.ComponentType<{ className?: string }>;

interface SubMenuItem {
  name: string;
  href: string;
  icon: IconComponent;
}

interface NavItemConfig {
  name: string;
  href: string;
  icon: IconComponent;
  subItems?: SubMenuItem[];
}

const navSections: NavItemConfig[][] = [
  [
    { name: "Dashboard", href: "/admin", icon: DashboardIcon },
    { name: "Order Fulfilment", href: "/admin/order-fulfilment", icon: ArchiveIcon },
    { name: "Vendors", href: "/admin/vendors", icon: IdCardIcon },
    {
      name: "Accounting",
      href: "/admin/transactions",
      icon: ReaderIcon,
      subItems: [
        { name: "Vendors Payment Report", href: "/admin/transactions?tab=vendors-payment", icon: FileTextIcon },
        { name: "BNPL Orders", href: "/admin/bnpl-orders", icon: CountdownTimerIcon },
        { name: "Orders", href: "/admin/orders", icon: ArchiveIcon },
        { name: "Loyalty Points", href: "/admin/accounting-loyalty", icon: StarIcon },
        { name: "Promo Codes", href: "/admin/accounting-promos", icon: TokensIcon },
        { name: "Taxes", href: "/admin/taxes", icon: FileIcon },
        { name: "Vendors", href: "/admin/vendor-accounting", icon: IdCardIcon },
        { name: "Refunds", href: "/admin/refunds", icon: ReloadIcon },
        { name: "Subscription Discount", href: "/admin/subscription-discounts", icon: ValueIcon },
      ],
    },
    { name: "Customers", href: "/admin/customers", icon: PersonIcon },
    { name: "Wishlist Products", href: "/admin/wishlist", icon: HeartIcon },
    {
      name: "Reports",
      href: "/admin/reviews",
      icon: BarChartIcon,
      subItems: [
        { name: "Products Reviews", href: "/admin/reviews", icon: StarFilledIcon },
        { name: "Products Performance Report", href: "/admin/product-performance", icon: PieChartIcon },
      ],
    },
    { name: "Admin Service Area", href: "/admin/service-area", icon: SewingPinIcon },
  ],
  [
    { name: "Customize", href: "/admin/customize", icon: MixerHorizontalIcon },
    {
      name: "Styling",
      href: "/admin/app-styling",
      icon: ColorWheelIcon,
      subItems: [
        { name: "App Styling", href: "/admin/app-styling", icon: MobileIcon },
        { name: "Web Styling", href: "/admin/web-styling", icon: DesktopIcon },
      ],
    },
    {
      name: "CMS",
      href: "/admin/pages",
      icon: LayoutIcon,
      subItems: [
        { name: "Pages", href: "/admin/pages", icon: FileIcon },
        { name: "BNPL Forms", href: "/admin/bnpl-forms", icon: ListBulletIcon },
        { name: "Emails", href: "/admin/emails", icon: EnvelopeClosedIcon },
        { name: "Notifications", href: "/admin/notifications", icon: BellIcon },
        { name: "SMS", href: "/admin/sms", icon: ChatBubbleIcon },
        { name: "Reasons", href: "/admin/reasons", icon: QuestionMarkCircledIcon },
      ],
    },
    { name: "Catalog", href: "/admin/categories", icon: CubeIcon },
    { name: "Configurations", href: "/admin/configurations", icon: GearIcon },
    { name: "Tax", href: "/admin/tax", icon: FileTextIcon },
    { name: "Payment Options", href: "/admin/payment-options", icon: CardStackIcon },
    {
      name: "Manage Delivery",
      href: "/admin/delivery-options",
      icon: PaperPlaneIcon,
      subItems: [
        { name: "Delivery Options", href: "/admin/delivery-options", icon: BackpackIcon },
        { name: "Delivery Slots", href: "/admin/delivery-slots", icon: CalendarIcon },
      ],
    },
    { name: "Manage Roles", href: "/admin/roles", icon: LockClosedIcon },
    { name: "Cache Control", href: "/admin/cache", icon: ReloadIcon },
  ],
  [
    {
      name: "Banners",
      href: "/admin/advert",
      icon: ImageIcon,
      subItems: [
        { name: "Homepage Banners", href: "/admin/advert?tab=homepage", icon: DesktopIcon },
        { name: "Store Banners", href: "/admin/advert?tab=store", icon: ImageIcon },
      ],
    },
    { name: "Promocode", href: "/admin/coupons", icon: TokensIcon },
    { name: "Loyalty Cards", href: "/admin/loyalty-cards", icon: StarIcon },
    { name: "Campaigns", href: "/admin/deals", icon: RocketIcon },
  ],
  [
    { name: "Errors & Health", href: "/admin/health", icon: ActivityLogIcon },
    { name: "Tools", href: "/admin/tools", icon: HobbyKnifeIcon },
    { name: "Kool Logistics", href: "/admin/logistics", icon: GlobeIcon },
    { name: "Profile", href: "/admin/profile", icon: AvatarIcon },
    { name: "Audit Logs", href: "/admin/audit-logs", icon: ClockIcon },
  ],
];

const COLLAPSED_KEY = "admin-sidenav-collapsed";

const matches = (pathname: string, href: string) => {
  const clean = href.split("?")[0];
  return pathname === clean || pathname.startsWith(clean + "/");
};

/**
 * Sub-items that share a page and differ only by query (e.g. ?tab=homepage /
 * ?tab=store) must not all light up together: a sub-item is active when the
 * path matches and every query param in its href matches the current URL. When
 * none of its siblings' queries match (no ?tab yet), the first sibling on that
 * path is the active one, as that's what the page shows by default.
 */
const isSubActive = (
  pathname: string,
  search: URLSearchParams,
  sub: { href: string },
  siblings: { href: string }[],
) => {
  const [path, query = ""] = sub.href.split("?");
  if (pathname !== path) return false;
  const queryMatches = (q: string) =>
    [...new URLSearchParams(q).entries()].every(([k, v]) => search.get(k) === v);
  if (!query) return true;
  if (queryMatches(query)) return true;
  const samePath = siblings.filter((s) => s.href.split("?")[0] === path);
  const anyMatches = samePath.some((s) => {
    const q = s.href.split("?")[1];
    return q ? queryMatches(q) : false;
  });
  return !anyMatches && samePath[0]?.href === sub.href;
};

const isItemActive = (pathname: string, item: NavItemConfig) => {
  if (item.href === "/admin") return pathname === "/admin";
  // On Configurations, only Configurations is active.
  if (matches(pathname, "/admin/configurations")) return item.name === "Configurations";
  if (item.subItems?.length) return item.subItems.some((sub) => matches(pathname, sub.href));
  return matches(pathname, item.href);
};

// Row looks from the CRM side nav: 13px medium labels in secondary grey, grey
// icons, soft orange hover, charcoal fill when active.
const rowBase =
  "group w-full flex items-center py-2 rounded-lg transition-all duration-200 cursor-pointer text-[13px] font-medium leading-5 tracking-[-0.2px]";
const rowIdle = "text-subtle hover:bg-brand-orange-soft hover:text-brand-charcoal";
const rowActive = "bg-brand-charcoal text-white";
const iconClass = (active: boolean) =>
  `w-5 h-5 shrink-0 transition-colors duration-200 ${active ? "text-white" : "text-faint group-hover:text-brand-charcoal"}`;

interface SidenavProps {
  activeItem?: string;
  isOpen?: boolean;
  onClose?: () => void;
  role?: string;
}

export const AdminSidebar: React.FC<SidenavProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Icon-only mode: label tooltip, and a floating menu for items with sub-items.
  const [tooltip, setTooltip] = useState<{ label: string; top: number; left: number } | null>(null);
  const [flyout, setFlyout] = useState<{ item: NavItemConfig; top: number; left: number } | null>(null);

  // The phone drawer always shows labels.
  const collapsed = isCollapsed && !isOpen;

  useEffect(() => {
    try {
      setIsCollapsed(localStorage.getItem(COLLAPSED_KEY) === "true");
    } catch {
      /* private mode: start expanded */
    }
  }, []);

  // Open the item that holds the current page; close the others (as the CRM does).
  useEffect(() => {
    const open = navSections
      .flat()
      .filter((item) => item.subItems?.some((sub) => matches(pathname, sub.href)))
      .map((item) => item.name);
    setExpandedMenus(open);
    setFlyout(null);
  }, [pathname]);

  // Close the floating menu on an outside click or Escape.
  useEffect(() => {
    if (!flyout) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;
      if (e instanceof MouseEvent && (e.target as HTMLElement).closest("[data-nav-flyout]")) return;
      setFlyout(null);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [flyout]);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    setTooltip(null);
    setFlyout(null);
    try {
      localStorage.setItem(COLLAPSED_KEY, String(next));
    } catch {
      /* not remembered, still works */
    }
  };

  // Like the CRM: opening a group also goes to its first page.
  const handleGroupClick = (item: NavItemConfig, el: HTMLElement) => {
    if (collapsed) {
      const r = el.getBoundingClientRect();
      setTooltip(null);
      setFlyout((f) => (f?.item.name === item.name ? null : { item, top: r.top, left: r.right + 8 }));
      return;
    }
    const isOpenNow = expandedMenus.includes(item.name);
    setExpandedMenus((prev) => (isOpenNow ? prev.filter((m) => m !== item.name) : [...prev, item.name]));
    if (!isOpenNow && !isItemActive(pathname, item)) {
      router.push(item.subItems![0].href);
      onClose?.();
    }
  };

  const showTooltip = (label: string, el: HTMLElement) => {
    if (!collapsed) return;
    const r = el.getBoundingClientRect();
    setTooltip({ label, top: r.top + r.height / 2, left: r.right + 10 });
  };

  return (
    <>
      {/* Phones: dims the page behind the drawer; a tap closes it. */}
      {isOpen && <div className="fixed inset-0 bg-black/40 z-40 sm:hidden" onClick={onClose} aria-hidden />}

      <aside
        id="sidenav"
        className={`${collapsed ? "w-[70px] min-w-[70px]" : "w-[250px] min-w-[250px] 2xl:w-[260px] 2xl:min-w-[260px]"} h-full shrink-0 flex flex-col bg-white border-r border-light-gray transition-all duration-300 ${
          isOpen ? "fixed inset-y-0 left-0 z-50 flex shadow-float" : "hidden sm:flex"
        }`}
      >
        {/* 70px logo bar, level with the header */}
        <div className={`h-[70px] px-4 shrink-0 flex items-center border-b border-light-gray ${collapsed ? "justify-center" : "justify-between gap-2"}`}>
          <Link href="/" className="flex items-center focus:outline-none" aria-label="Go to the KoolBuy store" title="Go to the store">
            <img src="/images/koolboks/koolbuy_logo.webp" alt="KoolBuy" className={`${collapsed ? "h-8" : "h-9"} w-auto object-contain`} />
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-subtle hover:bg-brand-orange-soft hover:text-brand-charcoal sm:hidden"
            aria-label="Close menu"
          >
            <Cross1Icon className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable items */}
        <nav className="flex-1 py-4 px-2 overflow-y-auto overflow-x-hidden custom-scrollbar" onScroll={() => setTooltip(null)}>
          {navSections.map((section, si) => (
            <div key={si}>
              {si > 0 && <div className="my-3 mx-2 border-t border-light-gray" aria-hidden />}
              <div className="space-y-1.5">
                {section.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(pathname, item);
                  const hasSub = !!item.subItems?.length;
                  const isExpanded = hasSub && expandedMenus.includes(item.name) && !collapsed;
                  const highlighted = active || isExpanded;
                  const rowClass = `${rowBase} ${collapsed ? "justify-center px-2" : "gap-3 px-3.5"} ${highlighted ? rowActive : rowIdle}`;
                  const hoverProps = {
                    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => showTooltip(item.name, e.currentTarget),
                    onMouseLeave: () => setTooltip(null),
                  };

                  return (
                    <div key={item.name}>
                      {hasSub ? (
                        <button
                          type="button"
                          className={rowClass}
                          aria-expanded={collapsed ? flyout?.item.name === item.name : isExpanded}
                          aria-label={collapsed ? item.name : undefined}
                          onClick={(e) => handleGroupClick(item, e.currentTarget)}
                          {...hoverProps}
                        >
                          <Icon className={iconClass(highlighted)} />
                          {!collapsed && (
                            <>
                              <span className="flex-1 text-left truncate">{item.name}</span>
                              {isExpanded ? (
                                <ChevronDownIcon className={`w-4 h-4 shrink-0 ${highlighted ? "text-white" : "text-faint"}`} />
                              ) : (
                                <ChevronRightIcon className={`w-4 h-4 shrink-0 ${highlighted ? "text-white" : "text-faint"}`} />
                              )}
                            </>
                          )}
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={rowClass}
                          aria-current={active ? "page" : undefined}
                          aria-label={collapsed ? item.name : undefined}
                          {...hoverProps}
                        >
                          <Icon className={iconClass(active)} />
                          {!collapsed && <span className="flex-1 truncate">{item.name}</span>}
                        </Link>
                      )}

                      {/* Sub-items under a left rule, each with its icon (CRM settings menu) */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="ml-4 mt-1 pl-2 border-l-2 border-light-gray space-y-1 overflow-hidden"
                          >
                            {item.subItems!.map((sub) => {
                              const SubIcon = sub.icon;
                              const subActive = isSubActive(pathname, searchParams, sub, item.subItems ?? []);
                              return (
                                <Link
                                  key={sub.name}
                                  href={sub.href}
                                  onClick={onClose}
                                  aria-current={subActive ? "page" : undefined}
                                  className={`group w-full flex items-center gap-3 px-3.5 py-2 rounded-lg transition-all duration-200 text-[12.5px] font-medium leading-5 tracking-[-0.2px] ${
                                    subActive ? "bg-brand-charcoal/90 text-white" : "text-faint hover:bg-brand-orange-soft hover:text-brand-charcoal"
                                  }`}
                                >
                                  <SubIcon className={iconClass(subActive)} />
                                  <span className="truncate">{sub.name}</span>
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="border-t border-light-gray my-4" aria-hidden />
        </nav>

        {/* Collapse toggle (hidden in the phone drawer) */}
        <div className={`p-4 border-t border-light-gray hidden sm:flex ${collapsed ? "justify-center" : "justify-end"}`}>
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-lg text-subtle hover:bg-brand-orange-soft hover:text-brand-charcoal transition-colors cursor-pointer"
            aria-label={collapsed ? "Expand menu" : "Collapse menu"}
          >
            {collapsed ? <DoubleArrowRightIcon className="w-5 h-5" /> : <DoubleArrowLeftIcon className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Icon-only mode: item label */}
      {collapsed && tooltip && (
        <div
          role="tooltip"
          className="fixed z-[60] -translate-y-1/2 px-2.5 py-1.5 rounded-md bg-brand-charcoal text-white text-xs font-medium shadow-float pointer-events-none whitespace-nowrap"
          style={{ top: tooltip.top, left: tooltip.left }}
        >
          {tooltip.label}
        </div>
      )}

      {/* Icon-only mode: sub-items of the clicked item (CRM floating menu) */}
      {collapsed && flyout && (
        <div
          data-nav-flyout
          className="fixed z-[60] w-56 py-1 bg-white border border-light-gray rounded-lg shadow-float"
          style={{ top: flyout.top, left: flyout.left }}
        >
          {flyout.item.subItems!.map((sub) => {
            const SubIcon = sub.icon;
            return (
              <Link
                key={sub.name}
                href={sub.href}
                onClick={() => setFlyout(null)}
                className="group flex items-center gap-3 px-4 py-2 rounded-lg text-[13px] font-medium text-subtle hover:bg-brand-orange-soft hover:text-brand-charcoal transition-colors"
              >
                <SubIcon className="w-5 h-5 shrink-0 text-faint group-hover:text-brand-charcoal" />
                {sub.name}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
};
