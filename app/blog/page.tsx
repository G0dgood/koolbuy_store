"use client";

import React from "react";
import Image from "next/image";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import {
  HiCalendar,
  HiClock,
  HiChevronRight,
  HiArrowLongRight,
} from "react-icons/hi2";
import { motion } from "framer-motion";
import { Button } from "@/app/components/Button";

const BlogPage = () => {
  const posts = [
    {
      title: "The Art of Scent Layering: A Koolbuy Store Guide",
      excerpt:
        "Unlock the secrets of fragrance architecture. Learn how to combine Eau de Parfum and body oils for a signature bloom...",
      category: "Fragrance",
      date: "Oct 12, 2023",
      readTime: "5 min read",
      image: "/books/1.png",
    },
    {
      title: "Botanical Extracts: Nature's Skin Lab",
      excerpt:
        "Discover the therapeutic power of our sustainably sourced ingredients, from Bulgarian Rose to Wild Lavender...",
      category: "Skincare",
      date: "Oct 08, 2023",
      readTime: "8 min read",
      image: "/books/2.png",
    },
    {
      title: "The Gift of Thought: Curating the Perfect Set",
      excerpt:
        "Gifting is an art form. Our curators share insights on selecting products that resonate with beauty and soul...",
      category: "Gifts",
      date: "Sep 28, 2023",
      readTime: "6 min read",
      image: "/books/3.png",
    },
    {
      title: "Morning Rituals: Skin Health in 2024",
      excerpt:
        "Insights from our Clinical Skin Lab on the evolving morning routines that prioritize hydration and barrier protection...",
      category: "Skincare",
      date: "Sep 22, 2023",
      readTime: "10 min read",
      image: "/books/4.png",
    },
    {
      title: "Sourcing Oud: A Journey to the East",
      excerpt:
        "Behind the scenes of our fragrance sourcing. How we find the world's most rare and sustainable agarwood...",
      category: "Fragrance",
      date: "Sep 15, 2023",
      readTime: "4 min read",
      image: "/books/5.png",
    },
    {
      title: "Tactile Senses: The Feeling of Luxury Skin",
      excerpt:
        "Why the texture of a serum matters just as much as its ingredients. Exploring the tactile science of skincare...",
      category: "Innovation",
      date: "Sep 02, 2023",
      readTime: "7 min read",
      image: "/books/6.png",
    },
  ];

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

        {/* Featured story: a large photo tile (dark band rules) */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="w-full cursor-pointer group"
        >
          <div className="w-full aspect-4/5 sm:aspect-video md:aspect-21/9 rounded-tile md:rounded-hero bg-off-white overflow-hidden relative">
            <Image
              src="/books/7.png"
              alt="Featured Story"
              fill sizes="(max-width: 1440px) 100vw, 1440px"
              className="object-cover transition-transform duration-700 ease-apple group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-brand-charcoal/90 via-brand-charcoal/30 to-transparent flex items-end">
              <div className="p-6 sm:p-10 md:p-14 max-w-4xl flex flex-col gap-3">
                <span className="text-[13px] font-semibold text-brand-orange">
                  Featured story
                </span>
                <h2 className="text-[22px] md:text-[36px] font-semibold text-white tracking-[-0.03em] leading-[1.08]">
                  Beyond the interface: <span className="text-white/60">the humanity of high-fidelity design.</span>
                </h2>
                <p className="text-white/70 text-[15px] md:text-[17px] max-w-2xl leading-normal">
                  How we orchestrated a digital language that feels as tactile
                  as our physical products. An interview with our lead
                  architects.
                </p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-3">
                  <Button
                    variant="primary"
                    size="lg"
                    shape="pill"
                    className="px-6"
                    iconRight={<HiArrowLongRight size={18} />}
                  >
                    Read feature
                  </Button>
                  <div className="flex items-center gap-4 text-white/60 text-[13px]">
                    <span className="flex items-center gap-1.5">
                      <HiCalendar /> Oct 20, 2023
                    </span>
                    <span className="flex items-center gap-1.5">
                      <HiClock /> 12 min read
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Journal feed */}
        <section className="flex flex-col gap-6 md:gap-8">
          <div className="flex items-end justify-between gap-4">
            <h3 className="text-[26px] md:text-[34px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-tight">
              Recent journal entries
            </h3>
            <div className="shrink-0 flex items-center gap-0.5 text-brand-orange-text font-medium text-[14px] md:text-[15px] cursor-pointer hover:underline">
              <span>View all categories</span>
              <HiChevronRight />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {posts.map((post, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06, ease }}
                className="bg-white rounded-tile overflow-hidden flex flex-col cursor-pointer group transition-shadow duration-300 hover:shadow-lift"
              >
                <div className="relative aspect-4/3 bg-off-white overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-apple group-hover:scale-[1.04]"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 material-frosted rounded-full text-[12px] font-medium text-brand-charcoal">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 px-5 pt-4 pb-5 flex-1">
                  <div className="flex items-center gap-4 text-[12px] text-faint">
                    <span className="flex items-center gap-1">
                      <HiCalendar /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <HiClock /> {post.readTime}
                    </span>
                  </div>
                  <h4 className="text-[18px] font-semibold text-brand-charcoal tracking-[-0.01em] leading-snug line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-subtle text-[15px] leading-normal line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-2">
                    <div className="flex items-center gap-0.5 text-[14px] font-medium text-brand-orange-text group-hover:underline">
                      Read story{" "}
                      <HiChevronRight
                        size={14}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-6 md:mt-10 flex justify-center">
            <Button variant="secondary" size="lg" shape="pill" className="px-6">
              Load older stories
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;
