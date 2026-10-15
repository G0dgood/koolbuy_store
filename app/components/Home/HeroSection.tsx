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
      aria-roledescription="carousel"
      aria-label="Featured products"
      className="w-full relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Full-width hero banner at 12:5 aspect ratio without outer padding */}
      <div className="group/hero relative w-full aspect-[12/5] min-h-[200px] sm:min-h-[280px] md:min-h-[400px] overflow-hidden bg-off-white">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            initial={{ opacity: 0, scale: 1.015 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={activeItem.image}
              alt={activeItem.title}
              fill sizes="100vw"
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
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

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
              aria-current={currentSlide === idx ? "true" : undefined}
              className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                currentSlide === idx
                  ? "w-6 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { HeroSection };
