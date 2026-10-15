"use client";

import React from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import {
  HiXMark,
  HiClock,
  HiCurrencyDollar,
  HiScale,
  HiShieldCheck,
  HiArrowPath,
} from "react-icons/hi2";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/components/Button";

const CancelOrderPage = () => {
  const policies = [
    {
      title: "Pre-orchestration window",
      desc: "Cancellations are accepted within the first 6 hours of order placement, before our curators begin the artisanal selection and packaging process.",
      icon: <HiClock size={22} />,
    },
    {
      title: "Full refund integrity",
      desc: "Approved cancellations result in a 100% refund of the purchase price and shipping fees, credited back to your original payment method.",
      icon: <HiCurrencyDollar size={22} />,
    },
    {
      title: "Post-shipping protocol",
      desc: "If your order has already entered the regional logistics network, a cancellation is no longer possible. Please refer to our Refund Policy for returns.",
      icon: <HiArrowPath size={22} />,
      link: "/refund",
    },
  ];

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans text-brand-charcoal">
      <Header />

      <main className="flex-1 w-full bg-off-white">
        {/* Cancellation Hero */}
        <section className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-14 md:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto flex flex-col items-center text-center gap-3"
          >
            <span className="text-[13px] font-semibold text-brand-orange-text">
              Policy framework
            </span>
            <h1 className="text-[34px] md:text-[52px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.05]">
              Order cancellation.
            </h1>
            <p className="text-subtle max-w-2xl text-[17px] md:text-[19px] leading-snug">
              We understand that intentions change. Our cancellation framework
              is designed to provide maximum flexibility while respecting the
              artisanal nature of our fulfillment.
            </p>
          </motion.div>

          <div className="relative mt-12 md:mt-16 w-full aspect-[16/9] md:aspect-[12/5] rounded-tile md:rounded-hero overflow-hidden">
            <Image
              src="/brandImage/shipping_banner.png"
              alt="Cancellation Policy"
              fill
              sizes="(max-width: 1440px) 100vw, 1312px"
              // The photo has another site's carousel arrows baked into its edges; zoom past them.
              className="object-cover scale-[1.13]"
              priority
            />
          </div>
        </section>

        <section className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 md:py-20">
          {/* Policy Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
            {policies.map((policy, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white p-7 md:p-8 rounded-tile hover:shadow-lift transition-shadow duration-300 ease-apple flex flex-col"
              >
                <div className="w-11 h-11 bg-brand-orange-soft rounded-stage flex items-center justify-center text-brand-orange-text mb-5">
                  {policy.icon}
                </div>
                <h3 className="text-[19px] font-semibold text-brand-charcoal tracking-[-0.01em] mb-2">
                  {policy.title}
                </h3>
                <p className="text-subtle text-[15px] leading-relaxed">
                  {policy.desc}
                </p>
                {policy.link && (
                  <Link
                    href={policy.link}
                    className="mt-5 text-[14px] font-medium text-brand-orange-text hover:underline"
                  >
                    View returns ›
                  </Link>
                )}
              </motion.div>
            ))}
          </div>

          {/* Interactive Action Area */}
          <div className="mt-16 md:mt-28 bg-white rounded-tile md:rounded-hero p-7 md:p-14 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <span className="text-[13px] font-semibold text-brand-orange-text">
                    Immediate request
                  </span>
                  <h2 className="text-[28px] md:text-[40px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-[1.1]">
                    Materialize your <br />
                    cancellation.
                  </h2>
                </div>
                <p className="text-subtle text-[17px] leading-relaxed">
                  If your order is within the 6-hour pre-orchestration window,
                  please connect with our support concierge immediately to
                  process your request.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    onClick={() => (window.location.href = "/contact")}
                    variant="primary"
                    size="lg"
                    shape="pill"
                    className="h-11 px-6 text-[15px]!"
                  >
                    Request cancellation
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    shape="pill"
                    className="h-11 px-6 text-[15px]! bg-black/[0.04] hover:bg-black/[0.08] text-brand-charcoal"
                  >
                    View my orders
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-5 bg-off-white p-7 md:p-10 rounded-tile">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-stage bg-brand-orange-soft text-brand-orange-text flex items-center justify-center shrink-0">
                    <HiShieldCheck size={22} />
                  </div>
                  <h4 className="text-[19px] font-semibold text-brand-charcoal">
                    Our guarantee
                  </h4>
                </div>
                <p className="text-[16px] text-subtle leading-relaxed">
                  &ldquo;We prioritize your satisfaction above all. Our concierge team
                  is committed to resolving all cancellation requests with
                  precision and empathy, ensuring your Koolbuy Store experience
                  remains flawless even when plans change.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-orange-soft" />
                  <div className="flex flex-col">
                    <span className="text-[14px] font-semibold text-brand-charcoal">
                      Director of logistics
                    </span>
                    <span className="text-[13px] text-faint">
                      Koolbuy Store support suite
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CancelOrderPage;
