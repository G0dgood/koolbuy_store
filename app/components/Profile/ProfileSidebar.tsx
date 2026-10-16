import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Icon } from "../Icon";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

export const ProfileSidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { label: "Personal info", href: "/profile", icon: "profile" },
    // { label: "My orders", href: "/orders", icon: "favorite" },
    // { label: "Messages", href: "/messages", icon: "message_header", badge: 2 },
    { label: "My wishlist", href: "/wishlist", icon: "favorite" },
    { label: "Settings", href: "/settings", icon: "Settings" },
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 bg-white rounded-tile overflow-hidden lg:sticky lg:top-24">
      {/* User Header */}
      <div className="px-6 pt-8 pb-6 flex flex-col items-center text-center">
        <div className="relative group cursor-pointer mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-off-white">
            <Image
              src="/avatars/avatar=pic1.jpg"
              alt="User Avatar"
              width={96}
              height={96}
              className="w-full h-full object-cover transition-transform duration-500 ease-apple group-hover:scale-[1.04]"
            />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-white ring-1 ring-black/[0.08] text-brand-charcoal flex items-center justify-center transition-colors group-hover:text-brand-orange-text">
            <Icon name="edit" size="xs" />
          </div>
        </div>
        <h3 className="text-[19px] font-semibold text-brand-charcoal tracking-[-0.01em] leading-tight">Alex John</h3>
        <p className="mt-0.5 text-[13px] text-subtle">Premium member</p>
        <span className="mt-3 px-2.5 py-0.5 bg-brand-orange-soft text-brand-charcoal text-[12px] font-medium rounded-full">
          Verified buyer
        </span>
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
                ${isActive
                  ? "bg-brand-orange-soft text-brand-charcoal font-medium"
                  : "text-brand-charcoal hover:bg-black/[0.04]"}`}
            >
              <Icon
                name={item.icon}
                size="sm"
                className={`transition-colors ${isActive ? "text-brand-orange-text" : "text-faint"}`}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={`min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center text-[11px] font-semibold tabular-nums
                  ${isActive ? "bg-brand-orange text-white" : "bg-black/[0.06] text-subtle"}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Action */}
      <div className="p-3 border-t border-black/[0.06]">
        <button className="flex items-center gap-3 px-4 h-11 text-error transition-colors w-full rounded-xl text-[15px] hover:bg-error-soft cursor-pointer">
          <Icon name="logout" size="sm" />
          Log out
        </button>
      </div>
    </aside>
  );
};
