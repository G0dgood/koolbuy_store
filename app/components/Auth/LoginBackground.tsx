"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getAdvertConfig, BackgroundAsset } from "../../utils/advertState";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

export const LoginBackground = () => {
  const [images, setImages] = useState<BackgroundAsset[]>([{ url: "/images/login-hero.png", positionX: 50, positionY: 50 }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [duration, setDuration] = useState(8);

  useEffect(() => {
    const config = getAdvertConfig();
    if (config.backgroundImages?.length > 0) {
      setImages(config.backgroundImages);
    }
    setDuration(config.cycleDuration || 8);

    const handleUpdate = () => {
      const newConfig = getAdvertConfig();
      if (newConfig.backgroundImages?.length > 0) {
        setImages(newConfig.backgroundImages);
        if (currentIndex >= newConfig.backgroundImages.length) {
          setCurrentIndex(0);
        }
      }
      setDuration(newConfig.cycleDuration || 8);
    };

    window.addEventListener("advertConfigUpdated", handleUpdate);
    return () => window.removeEventListener("advertConfigUpdated", handleUpdate);
  }, [currentIndex]);

  // Auto-cycle based on dynamic per-slide duration
  useEffect(() => {
    if (images.length <= 1) return;
    
    const currentSlide = images[currentIndex];
    const slideDuration = currentSlide?.duration || duration;
    
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, slideDuration * 1000);
    
    return () => clearTimeout(timer);
  }, [currentIndex, images, duration]);

  // Broadcast current slide payload for synchronization
  useEffect(() => {
    if (images[currentIndex]) {
      const event = new CustomEvent("advertSlideChanged", {
        detail: {
          index: currentIndex,
          category: images[currentIndex].linkedCategory,
          // Narrative Overrides
          title: images[currentIndex].title,
          titleHighlight: images[currentIndex].titleHighlight,
          description: images[currentIndex].description,
          stats: images[currentIndex].stats,
          featuredItems: images[currentIndex].featuredItems,
          inventoryLayout: images[currentIndex].inventoryLayout
        }
      });
      window.dispatchEvent(event);
    }
  }, [currentIndex, images]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <>
      {/* Immersive Background Advert with Cross-Fade */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={images[currentIndex]?.url}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentIndex]?.url || "/images/login-hero.png"}
              alt="Premium Workspace"
              fill sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
              style={{ 
                objectPosition: `${images[currentIndex]?.positionX || 50}% ${images[currentIndex]?.positionY || 50}%` 
              }}
              priority
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Ambient Overlay: keeps the white advert copy legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/5" />
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 flex justify-between px-4 lg:px-6 pointer-events-none">
           <button
             onClick={handlePrev}
             aria-label="Previous slide"
             className="w-10 h-10 rounded-full material-frosted shadow-float flex items-center justify-center text-brand-charcoal pointer-events-auto cursor-pointer opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-300 ease-apple"
           >
             <HiChevronLeft size={20} />
           </button>
           
           <button
             onClick={handleNext}
             aria-label="Next slide"
             className="w-10 h-10 rounded-full material-frosted shadow-float flex items-center justify-center text-brand-charcoal pointer-events-auto cursor-pointer opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-300 ease-apple"
           >
             <HiChevronRight size={20} />
           </button>
        </div>
      )}

      {/* Bottom Indicators (Dashes) */}
      {images.length > 1 && (
        <div className="absolute bottom-4 lg:bottom-6 inset-x-0 z-20 flex justify-center gap-1.5 pointer-events-none">
           {images.map((_, i) => (
             <button
               key={i}
               onMouseEnter={() => setCurrentIndex(i)}
               onClick={() => setCurrentIndex(i)}
               aria-label={`Slide ${i + 1}`}
               className={`h-1.5 rounded-full transition-all duration-300 ease-apple pointer-events-auto cursor-pointer
                 ${currentIndex === i ? "w-6 bg-brand-orange" : "w-1.5 bg-white/50 hover:bg-white/80"}
               `}
             />
           ))}
        </div>
      )}
    </>
  );
};
