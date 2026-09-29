"use client";

import React from "react";
import { Button } from "@/app/components/Button";

// Apple-style parchment tile: centered headline, one-line tagline, pill input + blue pill CTA.
const Newsletter = () => {
  return (
    <section className="w-full bg-white px-6 py-16 md:py-20">
      <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-3">
        <h3 className="text-[32px] md:text-[48px] font-semibold text-ink tracking-[-0.025em] leading-[1.07]">
          Never miss a deal.
        </h3>
        <p className="text-[19px] md:text-[21px] text-gray-600 leading-snug">
          Upcoming offers from trusted suppliers, straight to your inbox.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-6 w-full max-w-md flex flex-col sm:flex-row items-stretch gap-3"
        >
          <input
            type="email"
            placeholder="Email address"
            aria-label="Email address"
            className="flex-1 h-11 rounded-full px-5 bg-white border border-black/[0.08] outline-none text-[17px] text-ink placeholder-gray-500 focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition-colors"
          />
          <Button type="submit" variant="primary" className="h-11 px-[22px] text-[17px]">
            Subscribe
          </Button>
        </form>
        <p className="text-[12px] text-gray-500 mt-1">
          You can unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};

export { Newsletter };
