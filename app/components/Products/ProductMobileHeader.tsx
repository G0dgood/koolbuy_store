"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "../Icon";
import { useRouter } from "next/navigation";

interface ProductMobileHeaderProps {
  title: string;
}

export const ProductMobileHeader: React.FC<ProductMobileHeaderProps> = ({ title }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
  };

  return (
    <div className="flex flex-col gap-3 bg-white px-4 py-3 md:hidden">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="w-9 h-9 flex items-center justify-center text-brand-charcoal hover:bg-black/[0.04] rounded-full transition-colors"
          >
            <Icon name="arrow_back" size="md" />
          </button>
          <h1 className="text-[16px] font-semibold text-brand-charcoal tracking-[-0.02em] truncate">{title}</h1>
        </div>
        <div className="flex items-center gap-1">
          <Link
            href="/cart"
            aria-label="Cart"
            className="w-9 h-9 flex items-center justify-center text-brand-charcoal hover:bg-black/[0.04] rounded-full transition-colors"
          >
            <Icon name="shopping_cart" size="md" />
          </Link>
          <Link
            href="/profile"
            aria-label="Your account"
            className="w-9 h-9 flex items-center justify-center text-brand-charcoal hover:bg-black/[0.04] rounded-full transition-colors"
          >
            <Icon name="person" size="md" />
          </Link>
        </div>
      </div>

      {/* Search row */}
      <form role="search" onSubmit={handleSearch} className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Icon name="search" size="sm" className="text-faint" />
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          aria-label="Search products"
          className="w-full h-10 bg-black/[0.04] border border-transparent rounded-full pl-10 pr-4 text-[14px] text-brand-charcoal placeholder:text-faint outline-none focus:border-light-gray focus:bg-white transition-colors"
        />
      </form>
    </div>
  );
};
