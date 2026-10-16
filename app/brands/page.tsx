"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import {
  HiChevronRight,
  HiStar,
  HiSparkles,
  HiBeaker,
  HiShoppingBag,
  HiShieldCheck,
} from "react-icons/hi2";
import { motion } from "framer-motion";

const BrandsPage = () => {
  const brands = [
    {
      title: "Koolbuy Store Signature",
      description:
        "Our flagship house, masterfully balancing midnight bloom with rare oud for an unforgettable sensory trajectory.",
      image: "/brandImage/signature_oud.webp",
      icon: <HiSparkles className="text-brand-orange-text" size={22} />,
      link: "/products?brand=Bloom+%26+Mist",
    },
    {
      title: "Prada",
      description:
        "Reinventing classic elegance through avant-garde scented sensations and timeless ambery signatures.",
      image: "/brandImage/product_2.png",
      icon: <HiStar className="text-brand-orange-text" size={22} />,
      link: "/products?brand=Prada",
    },
    {
      title: "Versace",
      description:
        "Powerful, passionate compositions that blend noble ingredients into vibrant, high-fidelity fragrances.",
      image: "/brandImage/product_4.png",
      icon: <HiShieldCheck className="text-brand-orange-text" size={22} />,
      link: "/products?brand=Versace",
    },
    {
      title: "Gucci",
      description:
        "Eclectic and contemporary structures that remain unchanged from the first application to the skin.",
      image: "/brandImage/gucci_guilty.png",
      icon: <HiBeaker className="text-brand-orange-text" size={22} />,
      link: "/products?brand=Gucci",
    },
    {
      title: "Dior",
      description:
        "Absolute luxury distilled into intense floral and woody orchestrations for the modern connoisseur.",
      image: "/brandImage/product_6.png",
      icon: <HiShoppingBag className="text-brand-orange-text" size={22} />,
      link: "/products?brand=Dior",
    },
    {
      title: "Lancôme",
      description:
        "Sophisticated beauty rituals designed to materialize absolute radiance and timeless femininity.",
      image: "/brandImage/product_13.png",
      icon: <HiSparkles className="text-brand-orange-text" size={22} />,
      link: "/products?brand=Lancôme",
    },
  ];

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans text-brand-charcoal">
      <Header />

      <main className="flex-1 w-full max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-10 md:pt-16 pb-16 md:pb-24 flex flex-col gap-12 md:gap-20">
        {/* Brands headline */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex flex-col items-center gap-3 max-w-3xl mx-auto"
          >
            <span className="text-[13px] font-semibold text-brand-orange-text">
              Artisanal houses
            </span>
            <h1 className="text-[28px] sm:text-[36px] md:text-[44px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.05]">
              The <span className="text-faint">brands.</span>
            </h1>
            <p className="text-subtle max-w-xl mx-auto text-[17px] md:text-[19px] mt-1 leading-snug">
              Explore our curated selection of luxury perfume houses and
              skincare curators, each bringing a unique signature to the
              Koolbuy Store ecosystem.
            </p>
          </motion.div>
        </section>

        {/* Brands grid: photo edge to edge, text below */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
          {brands.map((brand, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.08, ease }}
              className="bg-white rounded-tile md:rounded-hero overflow-hidden flex flex-col cursor-pointer group transition-shadow duration-300 hover:shadow-lift"
            >
              <div className="relative aspect-16/10 bg-off-white overflow-hidden">
                <Image
                  src={brand.image}
                  alt={brand.title}
                  fill sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-apple group-hover:scale-[1.03]"
                />
              </div>

              <div className="flex flex-col gap-4 px-6 pt-5 pb-6 md:px-8 md:pt-6 md:pb-8 flex-1">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 bg-brand-orange-soft rounded-stage flex items-center justify-center">
                    {brand.icon}
                  </div>
                  <span className="text-[13px] text-faint">
                    Signature house
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[24px] md:text-[28px] font-semibold text-brand-charcoal tracking-[-0.02em] leading-[1.1]">
                    {brand.title}
                  </h3>
                  <p className="text-[15px] text-subtle leading-normal max-w-md">
                    {brand.description}
                  </p>
                </div>
                <Link
                  href={brand.link}
                  className="mt-auto inline-flex items-center gap-0.5 w-fit text-[15px] font-medium text-brand-orange-text hover:underline"
                >
                  Discover collection <HiChevronRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Brands concierge: a charcoal band tile (dark band rules) */}
        <section className="bg-brand-charcoal rounded-tile md:rounded-hero py-16 md:py-24 relative overflow-hidden">
          <Image
            src="/brandImage/brand_banner.png"
            alt="Background"
            fill sizes="(max-width: 1440px) 100vw, 1440px"
            className="object-cover opacity-10 grayscale"
          />
          <div className="px-6 md:px-10 flex flex-col items-center text-center gap-5 relative z-10">
            <div className="flex flex-col gap-3">
              <span className="text-[13px] font-semibold text-brand-orange">
                Custom procurement
              </span>
              <h2 className="text-[24px] md:text-[38px] font-semibold text-white tracking-[-0.03em] leading-[1.05]">
                Looking for a specific{" "}
                <span className="text-white/60">creator?</span>
              </h2>
            </div>
            <p className="text-white/60 text-[17px] md:text-[19px] max-w-2xl leading-snug">
              Our artisans maintain connections with luxury houses globally. If
              you need a specific brand or collector&apos;s edition not shown here,
              our concierge sourcing team is at your disposal.
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-flex items-center justify-center px-7 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-full font-semibold text-[15px] transition-colors duration-200"
            >
              Consult a brand curator
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BrandsPage;
