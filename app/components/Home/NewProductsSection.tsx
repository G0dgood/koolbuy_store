"use client";

import React, { useMemo } from "react";
import { StoreProductGrid, StoreSectionHeader, type StoreProduct } from "./StoreUi";
import { defaultCategories } from "./IntroducingProducts";
import { useGetPublicCategoriesQuery } from "@/lib/store/api/categories-api";
import { EmptyCategoryIllustration } from "./EmptyCategoryIllustration";
import Link from "next/link";

// Sample catalogue until the storefront is wired to real product data.
// `category` matches the chip ids in IntroducingProducts.
const newProductsList: (StoreProduct & { category: string })[] = [
  { id: "np1", category: "single-door", name: "Kool - Scanfrost 600L Inverter...", vendor: "Koolbuy - SOLA BEST ELECTRONICS", price: "₦1,406,000.00", image: "/images/koolboks/items/5.webp" },
  { id: "np2", category: "pedestal", name: "Kool Scanfrost 60ah Pedestal...", vendor: "Koolbuy - DESTINY ELECTRONICS", price: "₦1,287,600.00", image: "/images/koolboks/items/1.webp" },
  { id: "np3", category: "pedestal", name: "Kool Bruhm 60ah Pedestal ...", vendor: "Koolbuy - MKK Electronics", price: "₦1,287,600.00", image: "/images/koolboks/items/4.webp" },
  { id: "np4", category: "single-door", name: "200L AC Inverter Freezers (...", vendor: "Koolbuy - Cash / Carry V.I", price: "₦2,420,000.00", image: "/images/koolboks/items/3.webp" },
  { id: "np5", category: "double-door", name: "Koolboks 600L AC Inverter ...", vendor: "Koolbuy - Wugobest", price: "₦1,468,000.00", image: "/images/koolboks/items/6.webp" },
  { id: "np6", category: "double-door", name: "Koolboks 538L Refurbished", vendor: "Koolbuy - MATT C VENTURES", price: "₦1,538,000.00", image: "/images/koolboks/items/2.webp" },
  { id: "np7", category: "single-door", name: "Koolboks 208L DC Freezer", vendor: "Koolbuy - SOLA BEST ELECTRONICS", price: "₦1,950,000.00", image: "/images/koolboks/items/3.webp" },
  { id: "np8", category: "pedestal", name: "Koolboks 100Ah AC Battery", vendor: "Koolbuy - DESTINY ELECTRONICS", price: "₦1,662,370.00", image: "/images/koolboks/items/1.webp" },
  { id: "np9", category: "chiller", name: "Koolboks 300L Display Chiller", vendor: "Koolbuy - Wugobest", price: "₦1,120,000.00", image: "/images/koolboks/items/6.webp" },
  { id: "np10", category: "chiller", name: "Koolboks 450L Glass Door Chiller", vendor: "Koolbuy - MKK Electronics", price: "₦1,385,000.00", image: "/images/koolboks/items/2.webp" },
  { id: "np11", category: "upright", name: "Koolboks 250L Upright Freezer", vendor: "Koolbuy - Cash / Carry V.I", price: "₦1,245,000.00", image: "/images/koolboks/items/4.webp" },
  { id: "np12", category: "upright", name: "Koolboks 400L Upright Freezer", vendor: "Koolbuy - MATT C VENTURES", price: "₦1,690,000.00", image: "/images/koolboks/items/5.webp" },
  { id: "np13", category: "cold-room", name: "Koolboks Solar Cold Room 10ft", vendor: "Koolbuy - SOLA BEST ELECTRONICS", price: "₦8,950,000.00", image: "/images/koolboks/items/6.webp" },
  { id: "np14", category: "cold-room", name: "Koolboks Solar Cold Room 20ft", vendor: "Koolbuy - Wugobest", price: "₦14,500,000.00", image: "/images/koolboks/items/2.webp" },
  { id: "np15", category: "power-station", name: "Koolboks 2kWh Power Station", vendor: "Koolbuy - DESTINY ELECTRONICS", price: "₦980,000.00", image: "/images/koolboks/items/1.webp" },
  { id: "np16", category: "power-station", name: "Koolboks 5kWh Power Station", vendor: "Koolbuy - MKK Electronics", price: "₦2,150,000.00", image: "/images/koolboks/items/4.webp" },
  { id: "np17", category: "ac", name: "Koolboks 1.5HP Solar Air Conditioner", vendor: "Koolbuy - Cash / Carry V.I", price: "₦1,050,000.00", image: "/images/koolboks/items/3.webp" },
  { id: "np18", category: "ac", name: "Koolboks 2HP Inverter Air Conditioner", vendor: "Koolbuy - MATT C VENTURES", price: "₦1,320,000.00", image: "/images/koolboks/items/5.webp" },
  { id: "np19", category: "ice-makers", name: "Koolboks 195L DC Ice Maker", vendor: "Koolbuy - SOLA BEST ELECTRONICS", price: "₦3,235,000.00", image: "/images/koolboks/items/6.webp" },
  { id: "np20", category: "ice-makers", name: "Koolboks 300L DC Ice Maker", vendor: "Koolbuy - Wugobest", price: "₦3,890,000.00", image: "/images/koolboks/items/2.webp" },
];

export const NewProductsSection: React.FC<{ category?: string }> = ({ category = "all" }) => {
  const { data: categoriesData } = useGetPublicCategoriesQuery();

  const isAll = category === "all";

  const categoryMeta = useMemo(() => {
    if (isAll) {
      return { title: "New products", link: "/products" };
    }
    const apiMatch = categoriesData?.items?.find((c) => c.value === category);
    if (apiMatch) {
      return {
        title: apiMatch.label,
        link: `/products?category=${encodeURIComponent(apiMatch.value)}`,
      };
    }
    const defaultMatch = defaultCategories.find((c) => c.id === category);
    if (defaultMatch) {
      return {
        title: defaultMatch.name.replace(/\n/g, " "),
        link: defaultMatch.link,
      };
    }
    return {
      title: category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      link: `/products?category=${encodeURIComponent(category)}`,
    };
  }, [category, isAll, categoriesData]);

  const products = useMemo(() => {
    if (isAll) return newProductsList;
    return newProductsList.filter(
      (p) =>
        p.category === category ||
        p.category === category.replace(/_/g, "-") ||
        category.replace(/_/g, "-") === p.category
    );
  }, [category, isAll]);

  return (
    <section className="w-full flex flex-col gap-6">
      <StoreSectionHeader
        title={categoryMeta.title}
        subtitle={isAll ? "Just arrived on KoolBuy." : "Fresh picks in this category."}
        href={categoryMeta.link}
      />
      {products.length > 0 ? (
        // key restarts the ease-in each time the category changes
        <StoreProductGrid key={category} products={products} twoRows />
      ) : (
        <div className="py-14 px-4 flex flex-col items-center justify-center text-center bg-gray-50/40 rounded-2xl border border-dashed border-gray-200/90 my-2">
          <EmptyCategoryIllustration className="w-52 h-40 sm:w-64 sm:h-48 mb-2" />
          <h3 className="text-base sm:text-lg font-semibold text-brand-charcoal mt-2">
            No products in {categoryMeta.title} yet.
          </h3>
          <p className="text-xs sm:text-[13px] text-gray-500 max-w-md mt-1.5 leading-relaxed">
            Verified suppliers are actively staging new inventory for {categoryMeta.title}. Check back shortly or browse other cooling classifications.
          </p>
          <div className="mt-5 flex items-center gap-2.5">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold bg-brand-charcoal text-white hover:bg-brand-charcoal/90 transition-colors shadow-2xs"
            >
              Browse all products
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};
