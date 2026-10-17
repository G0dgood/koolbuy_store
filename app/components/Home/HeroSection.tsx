"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useGetHeroBannersQuery } from "@/lib/store/api/storefront-api";

interface Slide {
  id: string | number;
  image: string;
  title: string;
  link: string;
  /** ms before moving on */
  duration: number;
}

/* Brand marketing banners (no prices or records), shown only when the
   backend has no active hero banners or can't be reached. */
const FALLBACK_SLIDES: Slide[] = [
  { id: 1, image: "/images/koolboks/KOOLBOKS+538L+PLUS+PANEL+1920x800.png", title: "Koolboks 538L Solar Freezers", link: "/products", duration: 5000 },
  { id: 2, image: "/images/koolboks/SCANFROST+-+600L+ALONE+1920+X+800.png", title: "Scanfrost 600L Commercial", link: "/products", duration: 5000 },
  { id: 3, image: "/images/koolboks/THERMOCOOL+-+519L+ALONE+1920+x+800.png", title: "Thermocool 519L Deep Freezers", link: "/products", duration: 5000 },
];

const HeroSection = () => {
  const { data: banners, isLoading } = useGetHeroBannersQuery();
  const carouselSlides: Slide[] =
    banners && banners.length > 0
      ? banners.map((b) => ({
          id: b.id,
          image: b.image_url,
          title: b.title || "KoolBuy",
          link: b.link_url || "",
          duration: b.duration > 0 ? b.duration : 5000,
        }))
      : FALLBACK_SLIDES;
  const slideCount = carouselSlides.length;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  // Keep the index valid if the slide list changes size
  const activeIndex = currentSlide < slideCount ? currentSlide : 0;
  const activeItem = carouselSlides[activeIndex];

  const goToSlide = (idx: number) => {
    setDirection(idx > activeIndex ? 1 : -1);
    setCurrentSlide(idx);
  };

  useEffect(() => {
    if (isPaused || isLoading || slideCount < 2) return;
    const timer = setTimeout(nextSlide, activeItem.duration);
    return () => clearTimeout(timer);
  }, [isPaused, isLoading, slideCount, nextSlide, activeItem.duration, activeIndex]);

  const slideImage = (
    <Image
      src={activeItem.image}
      alt={activeItem.title}
      fill
      sizes="100vw"
      unoptimized={/^https?:\/\//.test(activeItem.image)}
      className="object-cover object-center"
      priority
    />
  );

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured products"
      className="w-full relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Full-width hero banner at 12:5 aspect ratio without outer padding */}
      <div className="group/hero relative w-full aspect-[12/5] min-h-[200px] sm:min-h-[280px] md:min-h-[400px] overflow-hidden bg-off-white">
        {isLoading ? (
          <div aria-hidden="true" className="absolute inset-0 bg-black/[0.04] animate-pulse" />
        ) : (
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={`${activeItem.id}-${activeIndex}`}
            custom={direction}
            initial={{ opacity: 0, scale: 1.015 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            {activeItem.link ? (
              <Link href={activeItem.link} aria-label={activeItem.title} className="absolute inset-0 block">
                {slideImage}
              </Link>
            ) : (
              slideImage
            )}
          </motion.div>
        </AnimatePresence>
        )}

        {slideCount > 1 && !isLoading && (
        <>
        {/* Carousel Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-3 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/70 hover:bg-white text-brand-charcoal backdrop-blur-xl flex items-center justify-center transition-all duration-300 z-20 cursor-pointer opacity-0 group-hover/hero:opacity-100 focus-visible:opacity-100"
        >
          <FiChevronLeft size={22} />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 sm:right-6 md:right-10 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/70 hover:bg-white text-brand-charcoal backdrop-blur-xl flex items-center justify-center transition-all duration-300 z-20 cursor-pointer opacity-0 group-hover/hero:opacity-100 focus-visible:opacity-100"
        >
          <FiChevronRight size={22} />
        </button>

        {/* Slim dots overlaid on the banner */}
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-full">
          {carouselSlides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={activeIndex === idx ? "true" : undefined}
              className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                activeIndex === idx
                  ? "w-6 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
        </>
        )}
      </div>
    </section>
  );
};

export { HeroSection };
