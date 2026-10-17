"use client";

import React from "react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { Icon } from "../Icon";
import { apiErrorMessage } from "@/lib/store/base-api";
import { useGetProductVendorProfileQuery } from "@/lib/store/api/product-detail-api";
import { Bone, ProductImage, Stars } from "./productDetailShared";

interface SupplierCardProps {
  vendorId: string;
  /** Shown while the profile loads, or if it can't be loaded */
  vendorName: string;
  vendorImage?: string | null;
}

const titleCase = (s: string) => s.replace(/[_-]+/g, " ").replace(/^\w/, (c) => c.toUpperCase());

/** The seller of this product, from GET /koolbuy/vendors/:id/. */
const SupplierCard: React.FC<SupplierCardProps> = ({ vendorId, vendorName, vendorImage }) => {
  const { data: vendor, isLoading, isError, error, refetch } = useGetProductVendorProfileQuery(vendorId);
  const name = vendor?.name || vendorName;
  const image = vendor?.image_url || vendorImage || null;
  const whatsapp = (vendor?.whatsapp_number || "").replace(/[^0-9]/g, "");
  const productsHref = `/products?vendor=${encodeURIComponent(vendorId)}`;

  return (
    <div className="w-full bg-white rounded-tile border border-light-gray p-6 flex flex-col gap-5">
      {/* Vendor header */}
      <div className="flex gap-3 items-center">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-brand-orange-soft text-brand-orange-text flex items-center justify-center font-semibold text-[18px] shrink-0">
          {image ? (
            <ProductImage src={image} alt={name} sizes="48px" fit="cover" />
          ) : (
            (name.trim()[0] || "S").toUpperCase()
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[12px] text-faint">Sold by</span>
          <Link
            href={productsHref}
            className="text-[15px] font-semibold text-brand-charcoal hover:text-brand-orange-text transition-colors truncate"
          >
            {name}
          </Link>
          {vendor?.business_type && (
            <span className="text-[12px] text-subtle">{titleCase(vendor.business_type)}</span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2" aria-busy>
          <Bone className="h-4 w-2/3" />
          <Bone className="h-4 w-1/2" />
          <Bone className="h-12 w-full" />
        </div>
      ) : isError ? (
        (error as { status?: unknown })?.status === 404 ? null : (
          <div className="flex flex-col gap-2 text-[13px] text-subtle">
            <p>{apiErrorMessage(error, "We couldn't load this seller's details.")}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="self-start text-[13px] font-medium text-brand-orange-text hover:underline cursor-pointer"
            >
              Try again
            </button>
          </div>
        )
      ) : vendor ? (
        <>
          <div className="flex flex-col gap-2 text-[13px] text-subtle">
            {vendor.is_verified && (
              <div className="flex items-center gap-2">
                <Icon name="verified_user" size="sm" className="text-success" />
                <span>Verified seller</span>
              </div>
            )}
            {typeof vendor.is_open === "boolean" && (
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${vendor.is_open ? "bg-success" : "bg-medium-gray"}`}
                  aria-hidden
                />
                <span>{vendor.is_open ? "Open now" : "Closed now"}</span>
              </div>
            )}
            {!!vendor.review_count && vendor.review_count > 0 && !!vendor.rating && (
              <div className="flex items-center gap-2">
                <Stars value={vendor.rating} size="xs" />
                <span className="tabular-nums">
                  {vendor.rating.toFixed(1)} ({vendor.review_count.toLocaleString("en-NG")})
                </span>
              </div>
            )}
            {vendor.address && (
              <div className="flex items-start gap-2">
                <Icon name="location_on" size="sm" className="text-faint mt-0.5 shrink-0" />
                <span>{vendor.address}</span>
              </div>
            )}
            {(!!vendor.products_count || !!vendor.joined_year) && (
              <p className="text-faint">
                {vendor.products_count
                  ? `${vendor.products_count.toLocaleString("en-NG")} product${vendor.products_count === 1 ? "" : "s"}`
                  : ""}
                {vendor.products_count && vendor.joined_year ? " · " : ""}
                {vendor.joined_year ? `On KoolBuy since ${vendor.joined_year}` : ""}
              </p>
            )}
          </div>

          {vendor.description && (
            <p className="text-[13px] text-subtle leading-relaxed line-clamp-4">{vendor.description}</p>
          )}
        </>
      ) : null}

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <Link
          href={productsHref}
          className="inline-flex items-center justify-center h-9 px-4 rounded-full bg-black/[0.04] text-brand-charcoal text-[13px] font-medium hover:bg-black/[0.08] transition-colors"
        >
          See this seller&apos;s products
        </Link>
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-full text-brand-orange-text text-[13px] font-medium hover:bg-brand-orange-soft transition-colors"
          >
            <FaWhatsapp size={14} aria-hidden />
            Chat on WhatsApp
          </a>
        )}
      </div>
    </div>
  );
};

export { SupplierCard };
