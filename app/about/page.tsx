"use client";

import React from "react";
import Image from "next/image";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import {
  HiHeart,
  HiLightBulb,
  HiUserGroup,
  HiStar,
  HiRocketLaunch,
} from "react-icons/hi2";
import { motion } from "framer-motion";

const AboutPage = () => {
  const team = [
    {
      name: "Sarah Bloom",
      role: "Creative Director",
      image: "/avatars/avatar=pic1.jpg",
    },
    {
      name: "Michael Mist",
      role: "Master Perfumer",
      image: "/avatars/avatar=pic2.png",
    },
    {
      name: "Elena Rivers",
      role: "Skin Lab Director",
      image: "/avatars/avatar=pic3.png",
    },
    {
      name: "David Stone",
      role: "Botanical Sourcing",
      image: "/avatars/avatar=pic4.png",
    },
    {
      name: "Aria Chen",
      role: "Client Relations",
      image: "/avatars/avatar=pic5.png",
    },
  ];

  const values = [
    {
      title: "Uncompromising quality",
      desc: "We believe that excellence is found in the details. Every product undergoes a rigorous curation process.",
      icon: <HiStar className="text-brand-orange-text" size={22} />,
    },
    {
      title: "Sustainable innovation",
      desc: "Blooming without harming. We prioritize ethical sourcing and eco-friendly practices in everything we do.",
      icon: <HiLightBulb className="text-brand-orange-text" size={22} />,
    },
    {
      title: "Community growth",
      desc: "We don't just sell products; we cultivate a community of individuals who appreciate fine artistry.",
      icon: <HiUserGroup className="text-brand-orange-text" size={22} />,
    },
  ];

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans text-brand-charcoal">
      <Header />

      <main className="flex-1 w-full max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-4 md:pt-8 pb-16 md:pb-24 flex flex-col gap-16 md:gap-28">
        {/* Hero: a large photo tile with a dark overlay (dark band rules) */}
        <section className="relative w-full h-105 md:h-130 rounded-tile md:rounded-hero overflow-hidden flex items-center justify-center text-center">
          <motion.div
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease }}
            className="absolute inset-0"
          >
            <Image
              src="/brandImage/brand_banner.png"
              alt="Koolbuy Store Background"
              fill sizes="(max-width: 1440px) 100vw, 1440px"
              className="object-cover"
              priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-brand-charcoal/60" />
          <div className="relative z-10 max-w-3xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="flex flex-col items-center gap-3"
            >
              <span className="text-[13px] font-semibold text-brand-orange">
                Established 2015
              </span>
              <h1 className="text-[28px] sm:text-[36px] md:text-[44px] font-semibold text-white tracking-[-0.03em] leading-[1.05]">
                Cultivating <span className="text-white/60">pure</span>{" "}
                excellence.
              </h1>
              <p className="text-white/70 max-w-xl text-[17px] md:text-[19px] mt-1 leading-snug">
                Koolbuy Store was founded on a simple philosophy: beauty should
                be accessible, sustainable, and high-fidelity.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Brand narrative: alternating text and photo */}
        <section className="flex flex-col gap-16 md:gap-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
              className="flex flex-col gap-5"
            >
              <h2 className="text-[24px] md:text-[36px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.08]">
                The intersection <br />
                of scent and skin.
              </h2>
              <div className="w-10 h-1 bg-brand-orange rounded-full" />
              <p className="text-subtle text-[17px] md:text-[19px] leading-normal">
                In a world of mass-produced beauty, we chose the path of the
                artisan. Our journey began with a single botanical extract and a
                vision to merge the alchemy of scent with the science of skin
                wellness.
              </p>
              <p className="text-faint text-[15px] leading-normal">
                Every Koolbuy Store creation is a sensory experience designed to
                nourish the skin while elevating the spirit.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
              className="relative aspect-square rounded-tile md:rounded-hero overflow-hidden bg-off-white"
            >
              <Image
                src="/brandImage/serene_story.png"
                alt="Aesthetic"
                fill sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
              className="relative aspect-square rounded-tile md:rounded-hero overflow-hidden bg-off-white order-2 lg:order-1"
            >
              <Image
                src="/brandImage/product_2.png"
                alt="Quality"
                fill sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
              className="flex flex-col gap-5 order-1 lg:order-2"
            >
              <h2 className="text-[24px] md:text-[36px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.08]">
                Sourced with soul, <br />
                crafted for life.
              </h2>
              <div className="w-10 h-1 bg-brand-orange rounded-full" />
              <p className="text-subtle text-[17px] md:text-[19px] leading-normal">
                We travel the globe, not just for materials, but for stories.
                Our sourcing team partners with local communities to ensure that
                every raw material is harvested with respect for the earth.
              </p>
              <div className="flex items-center gap-6 mt-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[28px] font-semibold text-brand-charcoal tracking-[-0.02em] tabular-nums">
                    50+
                  </span>
                  <span className="text-[13px] text-faint">
                    Global partners
                  </span>
                </div>
                <div className="h-10 w-px bg-light-gray" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[28px] font-semibold text-brand-charcoal tracking-[-0.02em] tabular-nums">
                    100%
                  </span>
                  <span className="text-[13px] text-faint">
                    Ethical choice
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Core values */}
        <section className="flex flex-col gap-8 md:gap-10">
          <div className="flex flex-col items-center gap-2 text-center max-w-2xl mx-auto">
            <span className="text-[13px] font-semibold text-brand-orange-text">
              Our foundations
            </span>
            <h2 className="text-[24px] md:text-[36px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.08]">
              The Mist &amp; Bloom values.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease }}
                className="bg-white p-8 md:p-10 rounded-tile text-left flex flex-col gap-5"
              >
                <div className="w-12 h-12 bg-brand-orange-soft rounded-stage flex items-center justify-center">
                  {v.icon}
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-[20px] font-semibold text-brand-charcoal tracking-[-0.01em]">
                    {v.title}
                  </h4>
                  <p className="text-subtle text-[15px] leading-normal">
                    {v.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Meet the team */}
        <section className="flex flex-col gap-8 md:gap-10">
          <div className="flex flex-col items-start gap-2">
            <h2 className="text-[24px] md:text-[36px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.08]">
              Meet the architects.
            </h2>
            <p className="text-subtle text-[17px] md:text-[19px] max-w-xl leading-snug">
              The passionate individuals behind the scenes who make Bloom &amp;
              Mist happen every single day.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06, ease }}
                className="bg-white rounded-tile overflow-hidden flex flex-col group transition-shadow duration-300 hover:shadow-lift"
              >
                <div className="relative aspect-3/4 bg-off-white overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover transition-transform duration-500 ease-apple group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-brand-charcoal/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <div className="flex gap-2 text-brand-charcoal">
                      <button className="w-9 h-9 rounded-full material-frosted flex items-center justify-center hover:bg-white transition-colors">
                        <HiStar size={16} />
                      </button>
                      <button className="w-9 h-9 rounded-full material-frosted flex items-center justify-center hover:bg-white transition-colors">
                        <HiHeart size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 px-4 pt-3 pb-4">
                  <h5 className="text-[15px] font-semibold text-brand-charcoal leading-snug">
                    {member.name}
                  </h5>
                  <span className="text-[13px] text-faint">
                    {member.role}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Trust / stats: a charcoal band tile (dark band rules) */}
        <section className="bg-brand-charcoal rounded-tile md:rounded-hero px-6 sm:px-10 md:px-16 py-12 md:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
            <div className="flex flex-col items-center lg:items-start gap-1">
              <span className="text-[40px] md:text-[56px] font-semibold text-white tracking-[-0.03em] leading-none tabular-nums">
                10<span className="text-brand-orange">+</span>
              </span>
              <span className="text-[15px] text-white/60">
                Years of pursuit
              </span>
            </div>
            <div className="flex flex-col items-center lg:items-start gap-1">
              <span className="text-[40px] md:text-[56px] font-semibold text-white tracking-[-0.03em] leading-none tabular-nums">
                5M<span className="text-brand-orange">+</span>
              </span>
              <span className="text-[15px] text-white/60">
                Global shipments
              </span>
            </div>
            <div className="flex flex-col items-center lg:items-start gap-1">
              <span className="text-[40px] md:text-[56px] font-semibold text-white tracking-[-0.03em] leading-none tabular-nums">
                24<span className="text-brand-orange">/</span>7
              </span>
              <span className="text-[15px] text-white/60">
                Expert support
              </span>
            </div>
            <div className="flex flex-col items-center lg:items-start gap-1">
              <span className="text-[40px] md:text-[56px] font-semibold text-white tracking-[-0.03em] leading-none tabular-nums">
                98<span className="text-brand-orange">%</span>
              </span>
              <span className="text-[15px] text-white/60">
                Customer trust
              </span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
