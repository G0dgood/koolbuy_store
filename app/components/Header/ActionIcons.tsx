"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "../Icon";

import { useAuthModal } from "@/app/context/AuthModalContext";
import { useCart } from "@/app/context/CartContext";

export const ActionIcons: React.FC = () => {
  const { openLogin } = useAuthModal();
  const { cartItems } = useCart();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  const cartCount = cartItems.length;

  return (
    <div className="flex items-center gap-4 md:gap-5 shrink-0">
      {/* Profile */}
      <button
        type="button"
        onClick={openLogin}
        className="flex flex-col items-center cursor-pointer group text-ink hover:text-black/60 transition-colors outline-none"
      >
        <Icon name="profile" size="md" />
        <span className="text-[10px] mt-1 hidden md:block">
          Profile
        </span>
      </button>

      {/* My Cart */}
      <Link
        href="/cart"
        className={`relative flex flex-col items-center group transition-colors ${
          isActive("/cart")
            ? "text-ink"
            : "text-ink hover:text-black/60"
        }`}
      >
        <div className="relative">
          <Icon name="My_cart" size="md" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-ink text-white text-[10px] font-semibold min-w-4.5 h-4.5 flex items-center justify-center rounded-full px-1 border-2 border-white shadow-xs">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-1 hidden md:block">
          Bag
        </span>
      </Link>
    </div>
  );
};
