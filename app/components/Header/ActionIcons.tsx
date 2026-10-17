"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "../Icon";

import { ProfileDropdown } from "./ProfileDropdown";
import { useCart } from "@/app/context/CartContext";

interface ActionIconsProps {
  onOpenDropdown?: () => void;
}

export const ActionIcons: React.FC<ActionIconsProps> = ({ onOpenDropdown }) => {
  const { cartItems } = useCart();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  const cartCount = cartItems.length;

  return (
    <div className="flex items-center gap-1 md:gap-2 shrink-0">
      {/* Profile & Dropdown */}
      <ProfileDropdown onOpenDropdown={onOpenDropdown} />

      {/* My Cart */}
      <Link
        href="/cart"
        aria-label={cartCount ? `Cart, ${cartCount} items` : "Cart"}
        title="Cart"
        className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
          isActive("/cart")
            ? "text-brand-charcoal bg-black/[0.05]"
            : "text-subtle hover:text-brand-charcoal hover:bg-black/[0.05]"
        }`}
      >
        <div className="relative">
          <Icon name="My_cart" size="md" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-brand-orange text-white text-[11px] font-semibold min-w-4 h-4 flex items-center justify-center rounded-full px-1 ring-2 ring-white">
              {cartCount}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};
