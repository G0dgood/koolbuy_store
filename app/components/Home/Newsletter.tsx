"use client";

import React from "react";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";

const Newsletter = () => {
  return (
    <section className="w-full bg-cream px-4 sm:px-6 md:px-10 lg:px-16 pt-8 pb-16 md:pb-20">
      <div className="relative max-w-328 mx-auto overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-brand-orange px-6 py-10 sm:px-10 md:px-16 md:py-14 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-[var(--shadow-pop)]">
        {/* Decorative shapes */}
        <div aria-hidden className="absolute -top-20 -right-10 w-72 h-72 rounded-full bg-mustard/40 blur-2xl" />
        <div aria-hidden className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-tomato/40 blur-2xl" />
        <svg aria-hidden viewBox="0 0 120 40" className="absolute right-8 bottom-6 w-28 opacity-40 hidden md:block" fill="none">
          <path d="M3 22c10-14 17-14 27 0s17 14 27 0 17-14 27 0 17 14 27 0" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
        </svg>

        <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left gap-3 max-w-xl">
          <span className="kb-sticker kb-sticker-ink">Never miss a deal</span>
          <h3 className="text-3xl md:text-[2.5rem] font-extrabold text-white tracking-tight leading-[1.05]">
            Fresh offers, straight to your inbox.
          </h3>
          <p className="text-sm md:text-base text-white/85 font-medium leading-relaxed">
            Get daily news on upcoming offers from trusted suppliers all over the world.
          </p>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="relative z-10 w-full max-w-md flex flex-col sm:flex-row items-stretch gap-2 bg-white p-2 rounded-3xl sm:rounded-full shadow-[var(--shadow-lift)]"
        >
          <div className="flex-1 relative flex items-center group">
            <Icon
              name="email"
              size="sm"
              className="absolute left-4 text-gray-400 group-focus-within:text-brand-orange transition-colors"
            />
            <input
              type="email"
              placeholder="you@example.com"
              aria-label="Email address"
              className="w-full h-12 rounded-full pl-11 pr-3 outline-none bg-transparent text-ink font-medium placeholder-gray-400"
            />
          </div>
          <Button type="submit" variant="blue" className="h-12 px-7 w-full sm:w-fit">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
};

export { Newsletter };
