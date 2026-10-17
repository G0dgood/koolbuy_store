"use client";

import React from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { motion } from "framer-motion";
import { EmptyState } from "@/app/components/EmptyState";

const BlogPage = () => {
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans text-brand-charcoal">
      <Header />

      <main className="flex-1 w-full max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-10 md:pt-16 pb-16 md:pb-24 flex flex-col gap-12 md:gap-20">
        {/* Editorial headline */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex flex-col items-center gap-3 max-w-3xl mx-auto"
          >
            <span className="text-[13px] font-semibold text-brand-orange-text">
              Koolbuy Store journal
            </span>
            <h1 className="text-[28px] sm:text-[36px] md:text-[44px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.05]">
              Insights <span className="text-faint">&amp;</span> inspiration.
            </h1>
            <p className="text-subtle max-w-2xl text-[17px] md:text-[19px] mt-1 leading-snug">
              Exploring the intersection of high-fidelity craftsmanship,
              sustainable innovation, and modern lifestyle orchestration.
            </p>
          </motion.div>
        </section>

        {/* Journal: no store articles published yet */}
        <EmptyState
          variant="card"
          illustration="documents"
          title="No articles yet"
          description="Articles will appear here once we publish them."
          action={{ label: "Browse products", href: "/products" }}
        />
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;
