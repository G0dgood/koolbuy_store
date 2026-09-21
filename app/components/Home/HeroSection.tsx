"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/Button";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const carouselSlides = [
  {
    id: 1,
    image: "/images/koolboks/KOOLBOKS+538L+PLUS+PANEL+1920x800.png",
    subtitle: "Latest trending",
    title: "Koolboks 538L Solar Freezers",
    highlight: "Solar Powered Cooling & Ice Storage",
    link: "/products",
    // buttonText: "Learn more",
  },
  {
    id: 2,
    image: "/images/koolboks/SCANFROST+-+600L+ALONE+1920+X+800.png",
    subtitle: "Latest trending",
    title: "Scanfrost 600L Commercial",
    highlight: "Heavy-Duty Preservation & Coolers",
    link: "/products",
    // buttonText: "Learn more",
  },
  {
    id: 3,
    image: "/images/koolboks/THERMOCOOL+-+519L+ALONE+1920+x+800.png",
    subtitle: "Latest trending",
    title: "Thermocool 519L Deep Freezers",
    highlight: "Instant Freeze & Energy Efficient",
    link: "/products",
    // buttonText: "Learn more",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide(
      (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length,
    );
  }, []);

  const goToSlide = (idx: number) => {
    setDirection(idx > currentSlide ? 1 : -1);
    setCurrentSlide(idx);
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const activeItem = carouselSlides[currentSlide];

  return (
    <section
      className="w-full bg-white overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full h-95 sm:h-115 md:h-145 lg:h-165 xl:h-180 2xl:h-200 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={activeItem.image}
              alt={activeItem.title}
              fill
              className="object-cover object-center"
              priority
            />

            {/* Gradient Overlay for text contrast */}
            <div className="absolute inset-0 bg-linear-to-r flex flex-col justify-center px-6 sm:px-10 md:px-14">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="max-w-xl flex flex-col gap-2 md:gap-3 text-white bg-linear-to-r to-transparent p-5 sm:p-7"
              >
                {/* <div className="inline-flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary text-white uppercase tracking-wider shadow-sm">
                    {activeItem.subtitle}
                  </span>
                </div> */}

                {/* <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md leading-tight">
                  {activeItem.title}
                </h1>

                <div className="flex items-center gap-4">
                  <p className="text-sm sm:text-base text-gray-200 font-medium drop-shadow-sm line-clamp-2">
                    {activeItem.highlight}
                  </p>
                </div> */}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 z-20 cursor-pointer shadow-md active:scale-90"
        >
          <FiChevronLeft size={22} />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 z-20 cursor-pointer shadow-md active:scale-90"
        >
          <FiChevronRight size={22} />
        </button>

        {/* Bottom Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
          {carouselSlides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx
                  ? "w-7 bg-primary shadow-sm"
                  : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { HeroSection };
