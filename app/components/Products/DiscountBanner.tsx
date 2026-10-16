"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Button } from "../Button";

/* Animated promo band (DESIGN.md §8, dark band): eases in when scrolled into
   view, the headline words rise one after another, the item count counts up,
   a soft orange glow drifts behind the text and a light sheen sweeps across
   the button. Everything is still for people who prefer reduced motion. */

const EASE = [0.16, 1, 0.3, 1] as const;

const line: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const word: Variants = {
  hidden: { opacity: 0, y: "0.6em" },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Counts from 0 to `to` the first time it's on screen. */
function CountUp({ to, run }: { to: number; run: boolean }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run) return;
    const controls = animate(0, to, { duration: 1.4, ease: EASE, onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [run, to]);
  return <span className="tabular-nums">{value}</span>;
}

const DiscountBanner = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const words = ["Super", "discounts", "on", "more", "than"];

  return (
    <motion.section
      ref={ref}
      aria-label="Super discounts"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, ease: EASE }}
      className="w-full rounded-tile md:rounded-hero bg-brand-charcoal flex flex-col sm:flex-row sm:items-center justify-between gap-6 overflow-hidden relative px-6 py-9 md:px-12 md:py-12 isolate"
    >
      {/* Drifting orange glow behind the text */}
      {!reduce && (
        <>
          <motion.span
            aria-hidden
            className="absolute -z-10 w-[420px] h-[420px] rounded-full bg-brand-orange/25 blur-[90px] -top-40 -left-24"
            animate={{ x: [0, 260, 80, 0], y: [0, 60, 120, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.span
            aria-hidden
            className="absolute -z-10 w-[320px] h-[320px] rounded-full bg-brand-orange/15 blur-[80px] -bottom-40 right-10"
            animate={{ x: [0, -200, -60, 0], y: [0, -50, -20, 0] }}
            transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <div className="flex flex-col gap-2 relative">
        <motion.h3
          variants={line}
          initial={reduce ? false : "hidden"}
          animate={inView || reduce ? "visible" : "hidden"}
          className="text-[26px] md:text-[36px] font-semibold leading-[1.1] tracking-[-0.025em] text-white"
        >
          {words.map((w) => (
            <motion.span key={w} variants={word} className="inline-block mr-[0.25em]">
              {w}
            </motion.span>
          ))}
          <motion.span variants={word} className="inline-block text-brand-orange">
            {reduce ? 100 : <CountUp to={100} run={inView} />}+ items.
          </motion.span>
        </motion.h3>
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
          className="text-[15px] md:text-[17px] text-white/60"
        >
          Save on solar freezers, inverters and batteries while stocks last.
        </motion.p>
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        animate={inView ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
        className="relative self-start sm:self-auto"
      >
        <Button
          href="/products"
          variant="accent"
          shape="pill"
          size="lg"
          className="group/cta relative overflow-hidden h-10 px-6 text-[13px]"
          iconRight={<FiArrowRight className="transition-transform duration-300 group-hover/cta:translate-x-1" aria-hidden />}
        >
          Shop now
          {/* Light sheen sweeping across the button every few seconds */}
          {!reduce && (
            <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent lead-sheen" />
          )}
        </Button>
      </motion.div>
    </motion.section>
  );
};

export { DiscountBanner };
