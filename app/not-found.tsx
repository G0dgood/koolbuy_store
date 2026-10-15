"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiHome, HiSparkles, HiChatBubbleLeftRight, HiChevronRight } from "react-icons/hi2";

const EASE = [0.16, 1, 0.3, 1] as const;

const RECOVERY_LINK =
  "group flex flex-col items-center gap-2.5 px-4 py-5 rounded-tile bg-white hover:shadow-lift transition-shadow duration-300 ease-apple";
const RECOVERY_ICON =
  "w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-200";
const RECOVERY_LABEL =
  "text-[14px] font-medium text-subtle group-hover:text-brand-charcoal transition-colors duration-200";

export default function NotFound() {
  return (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center bg-off-white text-brand-charcoal px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="w-full max-w-[560px] flex flex-col items-center text-center gap-8 md:gap-10"
      >
        {/* Error header */}
        <div className="flex flex-col items-center gap-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
            aria-hidden="true"
            className="text-[96px] md:text-[140px] font-semibold leading-none tracking-[-0.05em] text-black/[0.06] select-none"
          >
            404
          </motion.div>
          <span className="text-[13px] font-semibold text-brand-orange-text">Environment alert</span>
          <h1 className="text-[34px] md:text-[52px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.05]">
            Lost in the <br />
            <span className="text-subtle">Mist.</span>
          </h1>
          <p className="mt-1 text-[17px] md:text-[19px] text-subtle max-w-md leading-normal">
            The discovery path you were following has vanished into the atmosphere. Our curators are tracking the anomaly.
          </p>
        </div>

        {/* Primary action */}
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 h-12 px-7 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white text-[15px] font-semibold transition-colors duration-200"
        >
          Teleport to safety
          <HiChevronRight className="opacity-80 group-hover:translate-x-0.5 transition-transform duration-200 ease-apple" size={16} />
        </Link>

        {/* Recovery nav paths */}
        <div className="grid grid-cols-3 gap-3 w-full">
          <Link href="/" className={RECOVERY_LINK}>
            <div className={`${RECOVERY_ICON} bg-black/[0.04] text-brand-charcoal group-hover:bg-black/[0.07]`}>
              <HiHome size={20} />
            </div>
            <span className={RECOVERY_LABEL}>Home</span>
          </Link>

          <Link href="/brands" className={RECOVERY_LINK}>
            <div className={`${RECOVERY_ICON} bg-brand-orange-soft text-brand-orange-text`}>
              <HiSparkles size={20} />
            </div>
            <span className={RECOVERY_LABEL}>Brands</span>
          </Link>

          <Link href="/contact" className={RECOVERY_LINK}>
            <div className={`${RECOVERY_ICON} bg-black/[0.04] text-brand-charcoal group-hover:bg-black/[0.07]`}>
              <HiChatBubbleLeftRight size={20} />
            </div>
            <span className={RECOVERY_LABEL}>Support</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
