"use client";

import React from "react";
import Image from "next/image";
import { FiImage } from "react-icons/fi";
import { Icon } from "../Icon";
import type { RichProductDetail, StoreProductDetail } from "@/lib/store/api/product-detail-api";

/* Shared bits for the product detail page (/products/detail?id=<uuid>). */

export interface ProductAttribute {
  label: string;
  value: string;
}

/** One product, merged from the storefront endpoint and (when visible) the richer detail endpoint. */
export interface ProductView {
  id: string;
  name: string;
  price: number;
  shippingFee: number;
  description: string;
  category: string;
  images: string[];
  rating: number;
  reviewCount: number | null;
  inStock: boolean;
  stockQuantity: number | null;
  unit: string;
  vendor: { id: string; name: string } | null;
  vendorImage: string | null;
  attributes: ProductAttribute[];
  tags: string[];
  productType: string;
  market: string;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (v: string | null | undefined): v is string => !!v && UUID_RE.test(v.trim());

export const toNumber = (v: unknown): number => {
  const n = typeof v === "number" ? v : Number(String(v ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

/** ₦4,500 or ₦4,500.50 */
export const formatNaira = (v: unknown): string =>
  `₦${toNumber(v).toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

/** "screen_size" → "Screen size" */
const humanize = (key: string) => {
  const s = key.replace(/[_-]+/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const attrValue = (v: unknown): string => {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.map(attrValue).filter(Boolean).join(", ");
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "object") return "";
  return String(v).trim();
};

export function toProductView(
  store: StoreProductDetail | undefined,
  rich: RichProductDetail | undefined
): ProductView | null {
  const base = store ?? rich;
  if (!base) return null;
  const images = [
    ...(rich?.images ?? []),
    ...(store?.image ? [store.image] : []),
  ].filter((src, i, all) => !!src && all.indexOf(src) === i);
  const attributes = Object.entries(rich?.attributes ?? {})
    .map(([k, v]) => ({ label: humanize(k), value: attrValue(v) }))
    .filter((a) => a.label && a.value);

  return {
    id: base.id,
    name: (store?.name || rich?.name || "").trim(),
    price: toNumber(store?.price ?? rich?.price),
    shippingFee: toNumber(store?.shipping_fee ?? rich?.shipping_fee),
    description: (store?.description || rich?.description || "").trim(),
    category: (store?.category || rich?.category?.label || "").trim(),
    images,
    rating: toNumber(store?.rating ?? rich?.rating),
    reviewCount: typeof rich?.review_count === "number" ? rich.review_count : null,
    inStock: (store?.in_stock ?? rich?.in_stock) !== false,
    stockQuantity: typeof rich?.stock_quantity === "number" ? rich.stock_quantity : null,
    unit: (store?.unit || rich?.unit || "").trim(),
    vendor: store?.vendor ?? rich?.vendor ?? null,
    vendorImage: rich?.vendor_image_url || null,
    attributes,
    tags: (rich?.tags ?? []).filter(Boolean),
    productType: rich?.product_type?.label || "",
    market: rich?.market || "",
  };
}

/* next/image only optimises hosts listed in next.config; anything else is shown as-is. */
const OPTIMISED_HOSTS = [
  "images.unsplash.com",
  "ui-avatars.com",
  "upload.wikimedia.org",
  "cdn-icons-png.flaticon.com",
  "koolbuystore.com",
];
const canOptimise = (src: string) => {
  if (src.startsWith("/")) return true;
  try {
    return OPTIMISED_HOSTS.includes(new URL(src).hostname);
  } catch {
    return false;
  }
};

/** A product photo that fills its (relative) parent; a neutral stage when there is no photo. */
export function ProductImage({
  src,
  alt,
  sizes,
  className = "",
  priority = false,
  fit = "contain",
}: {
  src?: string | null;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** contain (products on a stage, the default) or cover (avatars, logos) */
  fit?: "contain" | "cover";
}) {
  if (!src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-off-white text-faint" aria-label={`${alt}: no photo yet`} role="img">
        <FiImage className="w-1/5 h-1/5 max-w-10 max-h-10" aria-hidden />
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={!canOptimise(src)}
      className={`${fit === "cover" ? "object-cover" : "object-contain mix-blend-multiply"} ${className}`}
    />
  );
}

/** Five stars filled to `value` (0–5), in Koolboks orange. */
export function Stars({ value, size = "sm" }: { value: number; size?: "xs" | "sm" }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value.toFixed(1)} out of 5`} role="img">
      {[1, 2, 3, 4, 5].map((n) => {
        const name = n <= value ? "star" : n - 0.5 <= value ? "star_half" : "star_border";
        return (
          <Icon
            key={n}
            name={name}
            size={size}
            className={name === "star_border" ? "text-medium-gray" : "text-brand-orange"}
          />
        );
      })}
    </div>
  );
}

/** Soft grey pulse block for loading skeletons. */
export const Bone: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse rounded-stage bg-black/[0.06] ${className}`} />
);

/** A product in a list (related products, "You may like"). */
export interface ListedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  vendorName: string;
}

export const productHref = (id: string) => `/products/detail?id=${encodeURIComponent(id)}`;

/** Items from GET /koolbuy/products/ ({ items } or a bare array), minus the ids in `exclude`. */
export function toListedProducts(res: unknown, exclude: string[] = []): ListedProduct[] {
  const rows: unknown[] = Array.isArray(res)
    ? res
    : Array.isArray((res as { items?: unknown[] })?.items)
    ? (res as { items: unknown[] }).items
    : Array.isArray((res as { results?: unknown[] })?.results)
    ? (res as { results: unknown[] }).results
    : [];
  return rows
    .map((r) => r as { id?: string; name?: string; title?: string; price?: unknown; image?: string | null; vendor?: { name?: string } | null })
    .filter((r) => !!r.id && !exclude.includes(r.id))
    .map((r) => ({
      id: r.id!,
      name: (r.name || r.title || "").trim(),
      price: toNumber(r.price),
      image: r.image || "",
      vendorName: r.vendor?.name || "",
    }));
}
