"use client";

import React from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import {
  HiTruck,
  HiGlobeAlt,
  HiPaperAirplane,
  HiCube,
  HiMapPin,
  HiCheckCircle,
  HiClock,
} from "react-icons/hi2";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/app/components/Button";

const ShippingPage = () => {
  const methods = [
    {
      title: "Standard home delivery",
      time: "3 - 5 business days",
      cost: "Calculated at checkout",
      desc: "Reliable and cost-effective delivery for your everyday Koolbuy Store essentials.",
      icon: <HiTruck size={22} />,
    },
    {
      title: "Priority express",
      time: "1 - 2 business days",
      cost: "Premium distance-based",
      desc: "When timing is tight. Accelerated fulfillment and direct-to-door priority handling.",
      icon: <HiPaperAirplane size={22} />,
    },
    {
      title: "Global Bloom shipping",
      time: "7 - 14 business days",
      cost: "International flat-rates",
      desc: "Delivering the Mist experience to 50+ countries with full customs orchestration.",
      icon: <HiGlobeAlt size={22} />,
    },
  ];

  const regionalEstimates = [
    { region: "Local (mainland)", days: "1-2 days" },
    { region: "Regional central", days: "3-4 days" },
    { region: "Remote territories", days: "5-7 days" },
    { region: "International", days: "7-14 days" },
  ];

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans text-brand-charcoal">
      <Header />

      <main className="flex-1 w-full bg-off-white">
        {/* Global Logistics Hero section */}
        <section className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-14 md:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto flex flex-col items-center text-center gap-3"
          >
            <span className="text-[13px] font-semibold text-brand-orange-text">
              Global logistics
            </span>
            <h1 className="text-[28px] md:text-[42px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.05]">
              Delivering excellence <br className="hidden sm:block" />
              to your doorstep.
            </h1>
            <p className="text-subtle max-w-2xl text-[17px] md:text-[19px] leading-snug">
              Koolbuy Store partners with top-tier global carriers to ensure
              your products arrive in pristine condition, no matter where you
              are in the world.
            </p>
          </motion.div>

          <div className="relative mt-12 md:mt-16 w-full aspect-[16/9] md:aspect-[12/5] rounded-tile md:rounded-hero overflow-hidden">
            <Image
              src="/brandImage/shipping_banner.png"
              alt="Shipping Banner"
              fill
              sizes="(max-width: 1440px) 100vw, 1312px"
              // The photo has another site's carousel arrows baked into its edges; zoom past them.
              className="object-cover scale-[1.13]"
              priority
            />
          </div>
        </section>

        {/* Shipping Methods and Timeline grid */}
        <section className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
            {methods.map((method, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white p-7 md:p-8 rounded-tile hover:shadow-lift transition-shadow duration-300 ease-apple flex flex-col h-full"
              >
                <div className="w-11 h-11 bg-brand-orange-soft rounded-stage flex items-center justify-center text-brand-orange-text mb-5">
                  {method.icon}
                </div>
                <h3 className="text-[19px] font-semibold text-brand-charcoal tracking-[-0.01em] mb-2">
                  {method.title}
                </h3>
                <div className="flex flex-col gap-0.5 mb-4">
                  <div className="flex items-center gap-1.5 text-brand-orange-text">
                    <HiClock size={15} />
                    <span className="text-[14px] font-medium">
                      {method.time}
                    </span>
                  </div>
                  <span className="text-[13px] text-faint">
                    {method.cost}
                  </span>
                </div>
                <p className="text-subtle text-[15px] leading-relaxed mb-6 flex-grow">
                  {method.desc}
                </p>
                <div className="pt-5 border-t border-black/[0.06] mt-auto">
                  <ul className="flex flex-col gap-2.5">
                    <li className="flex items-center gap-2 text-[14px] text-subtle">
                      <HiCheckCircle className="text-success shrink-0" size={16} /> Doorstep
                      delivery
                    </li>
                    <li className="flex items-center gap-2 text-[14px] text-subtle">
                      <HiCheckCircle className="text-success shrink-0" size={16} /> Real-time
                      tracking
                    </li>
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-3 md:mt-4 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center bg-white rounded-tile md:rounded-hero p-7 md:p-12">
            <div className="flex-1 flex flex-col gap-4">
              <h2 className="text-[20px] md:text-[28px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-tight">
                Regional estimates.
              </h2>
              <p className="text-subtle text-[16px] md:text-[17px] leading-relaxed">
                While we strive for maximum speed, delivery times may vary based
                on seasonal demand and local logistics orchestration in your
                specific territory.
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 pt-4 mt-2 border-t border-black/[0.06]">
                {regionalEstimates.map((region, i) => (
                  <div key={i} className="flex flex-col gap-0.5">
                    <span className="text-[13px] text-faint">
                      {region.region}
                    </span>
                    <span className="font-semibold text-brand-charcoal text-[20px] tabular-nums tracking-[-0.01em]">
                      {region.days}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-100 aspect-square relative rounded-stage md:rounded-tile overflow-hidden">
              <Image
                src="/brandImage/regional_visual.png"
                alt="Distribution Center"
                fill sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Tracking Journey and Packaging commitments */}
        <section className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="bg-brand-charcoal rounded-tile md:rounded-hero px-7 py-12 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <span className="text-brand-orange font-semibold text-[13px]">
                  Stay connected
                </span>
                <h2 className="text-[22px] md:text-[32px] font-semibold text-white tracking-[-0.025em] leading-[1.1]">
                  Follow your Bloom <br />
                  <span className="text-white/60">every step of the way.</span>
                </h2>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-stage bg-white/10 flex items-center justify-center text-brand-orange shrink-0">
                    <HiMapPin size={22} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-semibold text-white text-[17px]">
                      Intelligent notifications
                    </h4>
                    <p className="text-white/60 text-[15px] leading-relaxed">
                      Receive SMS and email updates the moment your package
                      reaches a new milestone.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-stage bg-white/10 flex items-center justify-center text-brand-orange shrink-0">
                    <HiCube size={22} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-semibold text-white text-[17px]">
                      Secure packaging
                    </h4>
                    <p className="text-white/60 text-[15px] leading-relaxed">
                      All products are shipped in eco-friendly, reinforced
                      Koolbuy Store packaging for maximum protection.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  shape="pill"
                  className="h-9 px-6 text-[13px]!"
                >
                  Track my order
                </Button>
              </div>
            </div>

            <div className="relative rounded-tile overflow-hidden aspect-video">
              <Image
                src="/web_images/Mask group copy 3.png"
                alt="Tracking Visual"
                fill sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 to-transparent flex items-end p-6 md:p-8">
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] font-semibold text-brand-orange">
                    Real-time dashboard
                  </span>
                  <p className="text-white text-[15px]">
                    Precision tracking available for all shipments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Anchor CTA */}
        <section className="py-16 md:py-28">
          <div className="max-w-360 mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
            <h2 className="text-[22px] md:text-[28px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-tight mb-2">
              Still have shipping questions?
            </h2>
            <p className="text-subtle text-[17px] leading-relaxed mb-8 max-w-xl">
              Learn more about customs, local duties, and carrier-specific
              policies in our Help Center.
            </p>
            <Button
              onClick={() => (window.location.href = "/faq")}
              variant="ghost"
              size="lg"
              shape="pill"
              className="h-9 px-6 text-[13px]! bg-black/[0.06] hover:bg-black/[0.1] text-brand-charcoal"
            >
              Visit help center
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ShippingPage;
