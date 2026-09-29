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
      {/* Vertical Mini Picture View (Thumbnails on the Left) */}
      <div className="flex sm:flex-col items-center gap-2 shrink-0 w-full sm:w-18">
        {/* Scroll Up Button */}
        <button
          type="button"
          onClick={scrollUp}
          aria-label="Scroll thumbnails up"
          className="hidden sm:flex w-8 h-8 rounded-full bg-[rgba(210,210,215,0.64)] hover:bg-[rgba(210,210,215,0.85)] items-center justify-center text-gray-500 hover:text-gray-900 transition-colors cursor-pointer shadow-xs"
        >
          <FiChevronUp size={16} />
        </button>

        {/* Thumbnails Container */}
        <div
          ref={scrollRef}
          className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[420px] w-full py-1 px-0.5 scrollbar-none scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImage(img)}
              className={`
                relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-lg overflow-hidden bg-cream p-1.5 transition-colors cursor-pointer
                ${
                  activeImage === img
                    ? "border-2 border-[#0071e3]"
                    : "border border-transparent hover:border-gray-300"
                }
              `}
            >
              <div className="relative w-full h-full">
                <Image
                  src={img}
                  alt={`Freezer view ${idx + 1}`}
                  fill
                  className="object-contain"
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
          className="hidden sm:flex w-8 h-8 rounded-full bg-[rgba(210,210,215,0.64)] hover:bg-[rgba(210,210,215,0.85)] items-center justify-center text-gray-500 hover:text-gray-900 transition-colors cursor-pointer shadow-xs"
        >
          <FiChevronDown size={16} />
        </button>
      </div>

      {/* Main Big Product View */}
      <div className="relative w-full aspect-square bg-cream rounded-2xl overflow-hidden flex items-center justify-center p-10 group">
        <Image
          src={activeImage}
          alt="Koolbuy Solar Freezer Unit"
          fill
          className="object-contain p-8 kb-product-img group-hover:scale-[1.02] transition-transform duration-700 ease-out"
          priority
        />
      </div>
    </div>
  );
};
