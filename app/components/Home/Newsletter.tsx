"use client";

import React from "react";
import { Button } from "@/app/components/Button";

/* Newsletter sign-up in an Apple-store style: centred headline, one line of
   copy, and a pill email field with a pill button. */
const Newsletter = () => {
  return (
    <section className="w-full bg-white py-16 md:py-20 px-6 text-center flex flex-col items-center gap-6">
      <div className="max-w-xl flex flex-col items-center gap-2">
        <h2 className="text-[28px] md:text-[36px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-tight">
          Stay in the loop.
        </h2>
        <p className="text-[16px] md:text-[17px] text-subtle leading-relaxed">
          Offers, new arrivals and tips from suppliers, straight to your inbox.
        </p>
      </div>

      <form
        className="flex flex-col sm:flex-row gap-2 w-full max-w-md"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder="Email address"
          className="flex-1 h-11 rounded-full bg-black/[0.04] border border-transparent px-5 text-[15px] outline-none focus:bg-white focus:border-light-gray focus:ring-4 focus:ring-black/[0.04] transition-all"
        />
        <Button type="submit" shape="pill" className="h-11 px-6 text-[14px]">
          Subscribe
        </Button>
      </form>
    </section>
  );
};

export { Newsletter };
