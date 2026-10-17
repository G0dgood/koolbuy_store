"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  FiChevronDown,
  FiChevronUp,
  FiShoppingCart,
  FiMinus,
  FiPlus,
} from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
import { useAuthModal } from "@/app/context/AuthModalContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/Button";
import { FavoriteButton } from "@/app/components/Other";
import { AUTH_CHANGED_EVENT, readStoredTokens } from "@/lib/api";
import { apiErrorMessage } from "@/lib/store/base-api";
import { useGetProductFinancingOptionsQuery } from "@/lib/store/api/product-detail-api";
import { formatNaira, Stars, type ProductView } from "./productDetailShared";

/* Signed-in state from the stored tokens, kept in sync with login / logout. */
const subscribeAuth = (cb: () => void) => {
  window.addEventListener(AUTH_CHANGED_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(AUTH_CHANGED_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
};
const hasAccessToken = () => {
  const access = readStoredTokens()?.access;
  return !!access && access !== "undefined" && access !== "null";
};
const useSignedIn = () => useSyncExternalStore(subscribeAuth, hasAccessToken, () => false);

const chip = (selected: boolean) =>
  `px-4 py-2 rounded-full font-medium text-[13px] tabular-nums cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50 disabled:cursor-not-allowed disabled:opacity-40 ${
    selected
      ? "bg-brand-orange text-white"
      : "bg-white text-brand-charcoal ring-1 ring-black/[0.08] hover:ring-black/20"
  }`;

/** "Buy now, pay later": real quotes from /financing/options/ for signed-in buyers. */
function FinancingPanel({ amount, market }: { amount: number; market?: string }) {
  const signedIn = useSignedIn();
  const { openLogin } = useAuthModal();
  const [open, setOpen] = useState(false);
  const [tenor, setTenor] = useState<number | null>(null);

  const { data, isFetching, isError, error, refetch } = useGetProductFinancingOptionsQuery(
    { amount, market: market || undefined },
    { skip: !signedIn || amount <= 0 }
  );

  const quotes = data?.quotes ?? [];
  const usable = quotes.filter((q) => q.within_limit);
  const offered = !!data?.eligible && usable.length > 0;
  const longest = usable.reduce((m, q) => Math.max(m, q.tenor_days), 0);
  const selected =
    quotes.find((q) => q.tenor_days === tenor && q.within_limit) ??
    usable[usable.length - 1] ??
    null;

  let headline: React.ReactNode = "Buy now, pay later";
  if (signedIn && isFetching && !data) headline = "Checking pay-later options…";
  else if (signedIn && offered)
    headline = (
      <>
        Buy now, pay later for up to
        <strong className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-brand-orange text-white font-semibold tabular-nums">
          {longest} days
        </strong>
      </>
    );

  return (
    <div className="w-full rounded-stage overflow-hidden bg-brand-orange-soft ring-1 ring-brand-orange/25">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="w-full px-5 py-4 flex items-center justify-between gap-3 cursor-pointer outline-none hover:bg-brand-orange/[0.06] focus-visible:ring-2 focus-visible:ring-brand-orange/50 transition-colors duration-200 ease-apple text-left"
      >
        <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[15px] md:text-[16px] text-brand-charcoal">
          {headline}
        </span>
        {open ? (
          <FiChevronUp className="text-brand-charcoal text-lg shrink-0" />
        ) : (
          <FiChevronDown className="text-brand-charcoal text-lg shrink-0" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 flex flex-col gap-4">
              {!signedIn ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-[14px] text-brand-charcoal leading-relaxed">
                    Sign in to see financing options for this product.
                  </p>
                  <button
                    type="button"
                    onClick={openLogin}
                    className="self-start sm:self-auto shrink-0 h-9 px-4 rounded-full bg-brand-orange text-white text-[13px] font-semibold hover:bg-brand-orange-hover transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50"
                  >
                    Sign in
                  </button>
                </div>
              ) : isFetching && !data ? (
                <div className="flex flex-col gap-2" aria-busy>
                  <div className="h-4 w-2/3 rounded-full bg-black/[0.06] animate-pulse" />
                  <div className="h-9 w-full rounded-full bg-black/[0.06] animate-pulse" />
                </div>
              ) : isError ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-[14px] text-brand-charcoal">
                    {apiErrorMessage(error, "We couldn't load pay-later options.")}
                  </p>
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="self-start sm:self-auto shrink-0 h-9 px-4 rounded-full bg-white text-brand-charcoal text-[13px] font-medium ring-1 ring-black/[0.08] hover:ring-black/20 transition-colors cursor-pointer"
                  >
                    Try again
                  </button>
                </div>
              ) : !offered ? (
                <div className="flex flex-col gap-1.5 text-[14px] text-brand-charcoal leading-relaxed">
                  <p>Pay later isn&apos;t available for this purchase right now.</p>
                  {(data?.reasons ?? []).length > 0 && (
                    <ul className="list-disc pl-5 text-[13px] text-subtle">
                      {data!.reasons.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[13px] font-medium text-subtle">
                      Choose how long you need to pay.
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {quotes.map((q) => (
                        <button
                          key={q.tenor_days}
                          type="button"
                          disabled={!q.within_limit}
                          title={q.within_limit ? undefined : "Above your available credit"}
                          onClick={() => setTenor(q.tenor_days)}
                          className={chip(selected?.tenor_days === q.tenor_days)}
                        >
                          {q.tenor_days} days
                        </button>
                      ))}
                    </div>
                  </div>

                  {selected && (
                    <div className="bg-white rounded-stage py-3.5 px-4 text-center">
                      <p className="text-[14px] text-brand-charcoal leading-relaxed">
                        You will pay{" "}
                        <strong className="text-brand-orange-text font-semibold tabular-nums">
                          {formatNaira(selected.total_payable)}
                        </strong>{" "}
                        within{" "}
                        <strong className="text-brand-orange-text font-semibold tabular-nums">
                          {selected.tenor_days} days
                        </strong>
                        , including a{" "}
                        <span className="tabular-nums">{formatNaira(selected.fee_amount)}</span> fee (
                        <span className="tabular-nums">
                          {(selected.fee_rate * 100).toLocaleString("en-NG", { maximumFractionDigits: 2 })}%
                        </span>
                        ).
                      </p>
                      <p className="mt-1 text-[12px] text-faint">Choose pay later at checkout.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const shareBtn =
  "w-8 h-8 rounded-full flex items-center justify-center text-subtle hover:text-brand-charcoal hover:bg-black/[0.04] transition-colors cursor-pointer";

export const ProductDetailsInfo: React.FC<{ product: ProductView }> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const maxQty = product.stockQuantity !== null && product.stockQuantity > 0 ? product.stockQuantity : Infinity;
  const price = formatNaira(product.price);
  const cartItem = {
    id: product.id,
    title: product.name,
    price,
    image: product.images[0] ?? "",
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({ ...cartItem, meta: product.vendor ? { seller: product.vendor.name } : undefined });
    }
    toast.success(quantity > 1 ? `Added ${quantity} to your cart.` : "Added to cart.");
  };

  const share = (network: "facebook" | "twitter" | "whatsapp") => {
    const url = window.location.href;
    const text = `${product.name} on KoolBuy`;
    const target =
      network === "facebook"
        ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        : network === "twitter"
        ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
        : `https://wa.me/?text=${encodeURIComponent(`${text}: ${url}`)}`;
    window.open(target, "_blank", "noopener,noreferrer");
  };

  const categoryHref = `/products?category=${encodeURIComponent(product.category)}`;

  return (
    <div className="flex-1 flex flex-col gap-6 lg:w-1/2 lg:py-2">
      {/* Title and stock */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {product.inStock ? (
            <span className="inline-flex items-center gap-1.5 bg-success-soft text-success font-medium text-[12px] px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden />
              In stock
              {product.stockQuantity !== null && product.stockQuantity > 0 && (
                <span className="tabular-nums">· {product.stockQuantity.toLocaleString("en-NG")} left</span>
              )}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-error-soft text-error font-medium text-[12px] px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-error" aria-hidden />
              Out of stock
            </span>
          )}
          {product.rating > 0 && (
            <span className="inline-flex items-center gap-1.5 text-[12px] text-subtle">
              <Stars value={product.rating} size="xs" />
              <span className="tabular-nums">{product.rating.toFixed(1)}</span>
              {product.reviewCount !== null && product.reviewCount > 0 && (
                <span className="tabular-nums">
                  ({product.reviewCount.toLocaleString("en-NG")} review{product.reviewCount === 1 ? "" : "s"})
                </span>
              )}
            </span>
          )}
        </div>
        <h1 className="text-[18px] md:text-[22px] font-semibold text-brand-charcoal leading-snug tracking-[-0.02em]">
          {product.name}
        </h1>

        {/* Sold by */}
        {product.vendor && (
          <div className="flex items-center gap-2 text-[13px] text-subtle">
            <div className="w-5 h-5 rounded-full bg-brand-orange-soft flex items-center justify-center text-brand-orange-text shrink-0">
              <FiShoppingCart size={10} />
            </div>
            <span>
              Sold by:{" "}
              <Link
                href={`/products?vendor=${encodeURIComponent(product.vendor.id)}`}
                className="font-medium text-brand-charcoal hover:text-brand-orange-text transition-colors"
              >
                {product.vendor.name}
              </Link>
            </span>
          </div>
        )}
      </div>

      {/* Price, unit and shipping */}
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="text-[24px] md:text-[28px] font-semibold text-brand-charcoal tracking-[-0.02em] tabular-nums">
            {price}
          </span>
          {product.unit && <span className="text-[14px] text-subtle">per {product.unit}</span>}
        </div>
        <p className="text-[13px] text-subtle">
          {product.shippingFee > 0 ? (
            <>
              Shipping fee: <span className="text-brand-charcoal tabular-nums">{formatNaira(product.shippingFee)}</span>
            </>
          ) : (
            "No shipping fee from the seller."
          )}
        </p>
      </div>

      {/* Buy now, pay later */}
      <FinancingPanel amount={product.price * quantity} market={product.market} />

      {/* Short description */}
      {product.description && (
        <p className="text-[15px] md:text-[16px] text-subtle leading-relaxed line-clamp-4 whitespace-pre-line">
          {product.description}
        </p>
      )}

      {/* Quantity and add to cart */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[13px] font-medium text-subtle">Quantity</span>
        <div className="flex items-center gap-3">
          <div className="h-12 rounded-full px-2 flex items-center gap-1 bg-black/[0.04]">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="w-8 h-8 rounded-full flex items-center justify-center text-brand-charcoal hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer outline-none"
            >
              <FiMinus size={14} />
            </button>
            <span className="text-[15px] font-medium text-brand-charcoal min-w-6 text-center tabular-nums" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
              disabled={quantity >= maxQty || !product.inStock}
              aria-label="Increase quantity"
              className="w-8 h-8 rounded-full flex items-center justify-center text-brand-charcoal hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer outline-none"
            >
              <FiPlus size={14} />
            </button>
          </div>

          <Button
            type="button"
            variant="accent"
            shape="pill"
            size="lg"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            iconRight={<FiShoppingCart size={16} />}
            className="flex-1 h-10 text-[13px]"
          >
            {product.inStock ? "Add to cart" : "Out of stock"}
          </Button>

          <FavoriteButton
            item={{ ...cartItem, rating: product.rating || undefined, category: product.category || undefined }}
            className="w-10 h-10 shrink-0"
            onToggle={(saved) => toast.success(saved ? "Saved to your wishlist." : "Removed from your wishlist.")}
          />
        </div>
      </div>

      {/* Category and share */}
      <div className="flex flex-col gap-2 pt-5 border-t border-black/[0.06] text-[13px] text-subtle">
        {product.category && (
          <div>
            <span>Category: </span>
            <Link href={categoryHref} className="text-brand-charcoal hover:text-brand-orange-text transition-colors">
              {product.category}
            </Link>
          </div>
        )}
        {product.productType && (
          <div>
            <span>Type: </span>
            <span className="text-brand-charcoal">{product.productType}</span>
          </div>
        )}

        <div className="flex items-center gap-1 pt-1">
          <span className="mr-1">Share:</span>
          <button type="button" onClick={() => share("facebook")} aria-label="Share on Facebook" className={shareBtn}>
            <FaFacebookF size={13} />
          </button>
          <button type="button" onClick={() => share("twitter")} aria-label="Share on X (Twitter)" className={shareBtn}>
            <FaTwitter size={13} />
          </button>
          <button type="button" onClick={() => share("whatsapp")} aria-label="Share on WhatsApp" className={shareBtn}>
            <FaWhatsapp size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
