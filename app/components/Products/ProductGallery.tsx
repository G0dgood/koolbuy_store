"use client";

import React, { useState, useRef } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { ProductImage } from "./productDetailShared";

interface ProductGalleryProps {
  /** The product's photos (may be empty: a neutral stage is shown) */
  images: string[];
  name: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, name }) => {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeImage = images[active] ?? images[0] ?? null;
  const showThumbs = images.length > 1;
  const showArrows = images.length > 5;

  const scrollBy = (top: number) => scrollRef.current?.scrollBy({ top, behavior: "smooth" });

  return (
    <div className="flex flex-col-reverse sm:flex-row items-start gap-4 w-full lg:w-1/2">
      {/* Thumbnails (left on desktop, below on mobile), only when there is more than one photo */}
      {showThumbs && (
        <div className="flex sm:flex-col items-center gap-2 shrink-0 w-full sm:w-20">
          {showArrows && (
            <button
              type="button"
              onClick={() => scrollBy(-90)}
              aria-label="Scroll thumbnails up"
              className="hidden sm:flex w-8 h-8 rounded-full bg-white/80 backdrop-blur-xl ring-1 ring-black/[0.06] items-center justify-center text-subtle hover:text-brand-charcoal hover:bg-white transition-colors cursor-pointer"
            >
              <FiChevronUp size={16} />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[440px] w-full p-1 scrollbar-none scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {images.map((img, idx) => (
              <button
                key={img}
                type="button"
                onClick={() => setActive(idx)}
                aria-label={`Show photo ${idx + 1} of ${images.length}`}
                aria-pressed={active === idx}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-stage overflow-hidden bg-off-white p-1.5 transition-all duration-200 cursor-pointer ${
                  active === idx
                    ? "ring-2 ring-brand-orange"
                    : "ring-1 ring-black/[0.06] opacity-70 hover:opacity-100"
                }`}
              >
                <div className="relative w-full h-full">
                  <ProductImage src={img} alt={`${name}, photo ${idx + 1}`} sizes="64px" />
                </div>
              </button>
            ))}
          </div>

          {showArrows && (
            <button
              type="button"
              onClick={() => scrollBy(90)}
              aria-label="Scroll thumbnails down"
              className="hidden sm:flex w-8 h-8 rounded-full bg-white/80 backdrop-blur-xl ring-1 ring-black/[0.06] items-center justify-center text-subtle hover:text-brand-charcoal hover:bg-white transition-colors cursor-pointer"
            >
              <FiChevronDown size={16} />
            </button>
          )}
        </div>
      )}

      {/* Main image stage */}
      <div className="relative w-full aspect-square bg-off-white rounded-tile overflow-hidden flex items-center justify-center group">
        <ProductImage
          src={activeImage}
          alt={name}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="p-8 md:p-12 group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          priority
        />
      </div>
    </div>
  );
};
