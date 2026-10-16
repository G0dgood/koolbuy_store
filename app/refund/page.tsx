"use client";

import React from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import {
  HiShieldCheck,
  HiArrowPath,
  HiClock,
  HiReceiptRefund,
  HiExclamationCircle,
  HiCheckCircle,
} from "react-icons/hi2";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/app/components/Button";

const RefundPage = () => {
  const steps = [
    {
      title: "Initiate request",
      desc: "Contact support or use the 'Initiate Return' button in your account dashboard.",
      icon: <HiReceiptRefund size={22} />,
    },
    {
      title: "Quality check",
      desc: "Ship the item back to our facility for a professional quality and condition inspection.",
      icon: <HiShieldCheck size={22} />,
    },
    {
      title: "Processing",
      desc: "Once approved, we initiate the refund process through your original payment method.",
      icon: <HiArrowPath size={22} />,
    },
    {
      title: "Refund received",
      desc: "Funds typically appear in your account within 5-10 business days.",
      icon: <HiCheckCircle size={22} />,
    },
  ];

  const eligibility = [
    {
      title: "30-day window",
      desc: "Refund requests must be submitted within 30 days of the delivery date.",
      icon: <HiClock size={22} />,
    },
    {
      title: "Original condition",
      desc: "Items must be unused, unwashed, and in their original packaging with all tags.",
      icon: <HiShieldCheck size={22} />,
    },
    {
      title: "Proof of purchase",
      desc: "A valid order number or digital receipt is required to process any refund.",
      icon: <HiReceiptRefund size={22} />,
    },
  ];

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans text-brand-charcoal">
      <Header />

      <main className="flex-1 w-full bg-off-white">
        {/* Trust Hero with policy branding */}
        <section className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-14 md:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto flex flex-col items-center text-center gap-3"
          >
            <div className="w-14 h-14 rounded-stage bg-brand-orange-soft flex items-center justify-center text-brand-orange-text mb-2">
              <HiShieldCheck size={28} />
            </div>
            <h1 className="text-[28px] md:text-[42px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.05]">
              Transparent refunds.
            </h1>
            <p className="text-subtle max-w-2xl text-[17px] md:text-[19px] leading-snug">
              At Koolbuy Store, we believe in blooming relationships built
              on trust. Our 30-day money-back guarantee is designed to give
              you peace of mind with every purchase.
            </p>
          </motion.div>

          <div className="relative mt-12 md:mt-16 w-full aspect-[16/9] md:aspect-[1280/544] rounded-tile md:rounded-hero overflow-hidden">
            <Image
              src="/brandImage/regional_visual.png"
              alt="Refund Banner"
              fill
              sizes="(max-width: 1440px) 100vw, 1312px"
              className="object-cover"
              priority
            />
          </div>
        </section>

        {/* Eligibility Grid and Rules section */}
        <section className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-16 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-1 flex flex-col gap-3">
              <span className="text-[13px] font-semibold text-brand-orange-text">
                Policy foundations
              </span>
              <h2 className="text-[22px] md:text-[28px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-[1.1]">
                Eligibility <br className="hidden lg:block" />
                criteria.
              </h2>
              <p className="text-subtle text-[16px] md:text-[17px] leading-relaxed">
                To ensure a fair process for all customers, we maintain
                standardized criteria for all refund requests. Please verify
                your item meets these conditions before initiating.
              </p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {eligibility.map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-7 rounded-tile"
                >
                  <div className="w-11 h-11 bg-brand-orange-soft rounded-stage flex items-center justify-center text-brand-orange-text mb-5">
                    {item.icon}
                  </div>
                  <h4 className="text-[17px] md:text-[19px] font-semibold text-brand-charcoal tracking-[-0.01em] mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-subtle text-[15px] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
              <div className="bg-brand-orange-soft p-7 rounded-tile flex items-center gap-4">
                <HiExclamationCircle
                  className="text-brand-orange-text shrink-0"
                  size={28}
                />
                <p className="text-brand-charcoal text-[15px] font-medium leading-relaxed">
                  Non-refundable items include clearance products, open personal
                  care items, and gift cards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Refund Process Timeline */}
        <section className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="bg-white rounded-tile md:rounded-hero px-6 py-12 md:px-12 md:py-20">
            <div className="text-center mb-12 md:mb-16 flex flex-col items-center gap-2">
              <h2 className="text-[22px] md:text-[32px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-[1.1]">
                How the process works.
              </h2>
              <p className="text-subtle text-[17px] md:text-[19px] leading-snug max-w-xl">
                A transparent, four-step journey from your request to the funds
                appearing in your account.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden lg:block absolute top-7 left-0 right-0 h-px bg-black/[0.06] z-0" />

              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left gap-5"
                >
                  <div className="w-14 h-14 rounded-full bg-brand-orange-soft ring-8 ring-white flex items-center justify-center text-brand-orange-text">
                    {step.icon}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-brand-orange-text font-semibold text-[13px]">
                      Step 0{i + 1}
                    </span>
                    <h4 className="text-[19px] font-semibold text-brand-charcoal tracking-[-0.01em]">
                      {step.title}
                    </h4>
                    <p className="text-subtle text-[15px] leading-relaxed px-4 lg:px-0">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 md:py-28">
          <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
            <div className="w-full bg-white rounded-tile md:rounded-hero p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex flex-col gap-2 text-center lg:text-left">
                <h2 className="text-[22px] md:text-[28px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-tight">
                  Need to start a refund?
                </h2>
                <p className="text-subtle text-[17px]">
                  Our support team is ready to guide you through the process.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  shape="pill"
                  className="h-9 px-6 text-[13px]!"
                >
                  Initiate now
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  shape="pill"
                  className="h-9 px-6 text-[13px]! bg-black/[0.04] hover:bg-black/[0.08] text-brand-charcoal"
                >
                  View orders
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RefundPage;
