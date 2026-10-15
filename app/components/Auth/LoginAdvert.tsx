"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAdvertConfig, AdvertConfig, AdvertItem } from "../../utils/advertState";

export const LoginAdvert = () => {
  const [config, setConfig] = useState<AdvertConfig | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [slideSpecificItems, setSlideSpecificItems] = useState<AdvertItem[] | undefined>(undefined);
  const [activeLayoutOverride, setActiveLayoutOverride] = useState<"list" | "grid" | "strip" | undefined>(undefined);
  const [overrides, setOverrides] = useState<{
    title?: string;
    titleHighlight?: string;
    description?: string;
    stats?: string;
  }>({});

  useEffect(() => {
    setConfig(getAdvertConfig());

    const handleUpdate = () => {
      setConfig(getAdvertConfig());
    };

    const handleSlideChange = (e: any) => {
      setActiveCategory(e.detail.category);
      setSlideSpecificItems(e.detail.featuredItems);
      setActiveLayoutOverride(e.detail.inventoryLayout);
      setOverrides({
        title: e.detail.title,
        titleHighlight: e.detail.titleHighlight,
        description: e.detail.description,
        stats: e.detail.stats
      });
    };

    window.addEventListener("advertConfigUpdated", handleUpdate);
    window.addEventListener("advertSlideChanged", handleSlideChange);
    return () => {
      window.removeEventListener("advertConfigUpdated", handleUpdate);
      window.removeEventListener("advertSlideChanged", handleSlideChange);
    };
  }, []);

  if (!config) return null;

  const filteredItems = slideSpecificItems && slideSpecificItems.length > 0
    ? slideSpecificItems
    : (activeCategory
      ? config.featuredItems.filter(item => item.category === activeCategory)
      : config.featuredItems);

  const activeLayout = activeLayoutOverride || config.inventoryLayout;

  const displayCopy = {
    title: overrides.title || config.title,
    titleHighlight: overrides.titleHighlight || config.titleHighlight,
    description: overrides.description || config.description,
    stats: overrides.stats || config.stats
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 hidden lg:flex flex-col gap-8 max-w-[600px] text-right items-end pb-6"
    >
      {(config.showTitle || config.showHighlight || config.showDescription) && (
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="wait">
            {(config.showTitle || config.showHighlight) && (
              <motion.div
                key={displayCopy.title + displayCopy.titleHighlight}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="text-[44px] xl:text-[52px] font-semibold text-white tracking-[-0.03em] leading-[1.05]">
                  {config.showTitle && <span>{displayCopy.title} <br /></span>}
                  {config.showHighlight && <span className="text-white/60">{displayCopy.titleHighlight}</span>}
                </h1>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {config.showDescription && (
              <motion.p
                key={displayCopy.description}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-white/80 text-[17px] xl:text-[19px] max-w-lg ml-auto leading-relaxed"
              >
                {displayCopy.description}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Dynamic Feature List (Featured Products) */}
      <div className="w-full ml-auto">
        {activeLayout === "list" && (
          <div className="flex flex-col gap-4 max-w-md ml-auto">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-4 justify-end group/item cursor-pointer"
                >
                  <div className="flex flex-col items-end text-right">
                    <span className="text-[13px] font-medium text-white/60">
                      {item.category}
                    </span>
                    <span className="text-[17px] font-semibold text-white leading-snug">
                      {item.name}
                    </span>
                    <span className="text-[13px] text-white/60 tabular-nums group-hover/item:text-white/80 transition-colors">
                      Featured selection • {item.price}
                    </span>
                  </div>

                  <div className="w-16 h-16 rounded-stage bg-white/10 backdrop-blur-xl flex items-center justify-center group-hover/item:bg-white/20 transition-colors overflow-hidden p-2">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain transition-transform duration-500 ease-apple group-hover/item:scale-[1.04]" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {activeLayout === "grid" && (
          <div className="grid grid-cols-3 gap-3 max-w-2xl ml-auto">
            <AnimatePresence mode="popLayout">
              {filteredItems.slice(0, 8).map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="p-3 rounded-stage bg-white/10 backdrop-blur-md hover:bg-white/15 transition-colors flex flex-col gap-2 group/item cursor-pointer"
                >
                  <div className="aspect-[4/3] bg-white/10 rounded-xl p-2 flex items-center justify-center overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover/item:scale-[1.04] transition-transform duration-500 ease-apple" />
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[11px] font-medium text-white/60 truncate">{item.category}</span>
                    <span className="text-[13px] font-semibold text-white truncate">{item.name}</span>
                    <span className="text-[12px] text-white/70 tabular-nums">{item.price}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {activeLayout === "strip" && (
          <div className="flex justify-end">
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-lg p-1.5 rounded-full overflow-hidden max-w-full">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer shrink-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 p-1 flex items-center justify-center overflow-hidden text-center">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[13px] font-medium text-white whitespace-nowrap">{item.name}</span>
                      <span className="text-[12px] text-white/60 tabular-nums">{item.price}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {filteredItems.length === 0 && (
          <p className="text-white/60 text-[13px] pt-6 text-right">
            No items in {activeCategory} category
          </p>
        )}
      </div>

      <AnimatePresence mode="wait">
        {config.showStats && (
          <motion.div
            key={displayCopy.stats}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="px-5 py-4 rounded-stage bg-white/10 backdrop-blur-md text-right max-w-sm"
          >
            <p className="text-[13px] text-white/75 leading-relaxed">
              {displayCopy.stats}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
