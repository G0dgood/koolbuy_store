"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

const images = [
  "/images/koolboks/items/3.webp",
  "/images/koolboks/items/5.webp",
  "/images/koolboks/items/6.webp",
  "/images/koolboks/items/2.webp",
  "/images/koolboks/items/1.webp",
  "/images/koolboks/items/4.webp",
  "/images/koolboks/KOOLBOKS+538L+PLUS+PANEL+1920x800.png",
];

export const ProductGallery: React.FC = () => {
  const [activeImage, setActiveImage] = useState(images[0]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollUp = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ top: -90, behavior: "smooth" });
    }
  };

  const scrollDown = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ top: 90, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row items-start gap-4 w-full lg:w-1/2">
      {/* Thumbnails (left on desktop, below on mobile) */}
      <div className="flex sm:flex-col items-center gap-2 shrink-0 w-full sm:w-20">
        {/* Scroll Up Button */}
        <button
          type="button"
          onClick={scrollUp}
          aria-label="Scroll thumbnails up"
          className="hidden sm:flex w-8 h-8 rounded-full bg-white/80 backdrop-blur-xl ring-1 ring-black/[0.06] items-center justify-center text-subtle hover:text-brand-charcoal hover:bg-white transition-colors cursor-pointer"
        >
          <FiChevronUp size={16} />
        </button>

        {/* Thumbnails Container */}
        <div
          ref={scrollRef}
          className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[440px] w-full p-1 scrollbar-none scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImage(img)}
              className={`
                relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-stage overflow-hidden bg-off-white p-1.5 transition-all duration-200 cursor-pointer
                ${
                  activeImage === img
                    ? "ring-2 ring-brand-orange"
                    : "ring-1 ring-black/[0.06] opacity-70 hover:opacity-100"
                }
              `}
            >
              <div className="relative w-full h-full">
                <Image
                  src={img}
                  alt={`Freezer view ${idx + 1}`}
                  fill sizes="64px"
                  className="object-contain mix-blend-multiply"
                />
              </div>
            </button>
          ))}
        </div>

        {/* Scroll Down Button */}
        <button
          type="button"
          onClick={scrollDown}
          aria-label="Scroll thumbnails down"
          className="hidden sm:flex w-8 h-8 rounded-full bg-white/80 backdrop-blur-xl ring-1 ring-black/[0.06] items-center justify-center text-subtle hover:text-brand-charcoal hover:bg-white transition-colors cursor-pointer"
        >
          <FiChevronDown size={16} />
        </button>
      </div>

      {/* Main image stage */}
      <div className="relative w-full aspect-square bg-off-white rounded-tile overflow-hidden flex items-center justify-center p-6 group">
        <Image
          src={activeImage}
          alt="Koolbuy Solar Freezer Unit"
          fill sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-8 md:p-12 mix-blend-multiply group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          priority
        />
      </div>
    </div>
  );
};
