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
        className="flex flex-col items-center cursor-pointer group text-ink hover:text-brand-orange transition-colors outline-none"
      >
        <span className="w-10 h-10 rounded-full bg-cream border border-gray-200 flex items-center justify-center group-hover:bg-brand-orange-light group-hover:border-brand-orange/30 transition-colors">
          <Icon name="profile" size="md" />
        </span>
        <span className="text-[10px] font-bold mt-1 hidden md:block">
          Profile
        </span>
      </button>

      {/* My Cart */}
      <Link
        href="/cart"
        className={`relative flex flex-col items-center group transition-colors ${
          isActive("/cart")
            ? "text-brand-orange font-bold"
            : "text-ink hover:text-brand-orange"
        }`}
      >
        <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isActive("/cart") ? "bg-brand-orange-light border border-brand-orange/30" : "bg-cream border border-gray-200 group-hover:bg-brand-orange-light group-hover:border-brand-orange/30"}`}>
          <Icon name="My_cart" size="md" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-tomato text-white text-[10px] font-extrabold min-w-5 h-5 flex items-center justify-center rounded-full px-1 border-2 border-white shadow-xs">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold mt-1 hidden md:block">
          My cart
        </span>
      </Link>
    </div>
  );
};
