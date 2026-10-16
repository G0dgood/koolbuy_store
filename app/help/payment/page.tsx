"use client";

import React from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import {
  HiShieldCheck,
  HiCreditCard,
  HiGlobeAlt,
  HiBanknotes,
  HiCheckBadge,
  HiLockClosed,
} from "react-icons/hi2";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/components/Button";

const PaymentOptionsPage = () => {
  const paymentMethods = [
    {
      title: "Traditional orchestration",
      desc: "We accept all major high-fidelity cards including Visa, MasterCard, and American Express, processed with 256-bit encryption.",
      icon: <HiCreditCard size={22} />,
    },
    {
      title: "Digital currencies",
      desc: "For the modern collector, we support direct artisanal transfers via Bitcoin and Ethereum, materializing instant transaction finality.",
      icon: <HiGlobeAlt size={22} />,
    },
    {
      title: "Concierge billing",
      desc: "Patrons with custom procurement accounts may opt for wire orchestration or monthly boutique billing for high-volume acquisitions.",
      icon: <HiBanknotes size={22} />,
    },
  ];

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans text-brand-charcoal">
      <Header />

      <main className="flex-1 w-full bg-off-white">
        {/* Secure Orchestration Hero */}
        <section className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-14 md:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto flex flex-col items-center text-center gap-3"
          >
            <span className="text-[13px] font-semibold text-brand-orange-text">
              Security framework
            </span>
            <h1 className="text-[28px] md:text-[42px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.05]">
              Secure orchestration.
            </h1>
            <p className="text-subtle max-w-2xl text-[17px] md:text-[19px] leading-snug">
              Your transactional integrity is our highest priority. We employ
              high-fidelity encryption and artisanal fraud prevention to
              ensure every acquisition is flawless and protected.
            </p>
          </motion.div>

          <div className="relative mt-12 md:mt-16 w-full aspect-[16/9] md:aspect-[12/5] rounded-tile md:rounded-hero overflow-hidden">
            <Image
              src="/brandImage/shipping_banner.png"
              alt="Secure Payments"
              fill
              sizes="(max-width: 1440px) 100vw, 1312px"
              // The photo has another site's carousel arrows baked into its edges; zoom past them.
              className="object-cover scale-[1.13]"
              priority
            />
          </div>
        </section>

        <section className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 md:py-20">
          {/* Payment Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
            {paymentMethods.map((method, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white p-7 md:p-8 rounded-tile hover:shadow-lift transition-shadow duration-300 ease-apple"
              >
                <div className="w-11 h-11 bg-brand-orange-soft rounded-stage flex items-center justify-center text-brand-orange-text mb-5">
                  {method.icon}
                </div>
                <h3 className="text-[19px] font-semibold text-brand-charcoal tracking-[-0.01em] mb-2">
                  {method.title}
                </h3>
                <p className="text-subtle text-[15px] leading-relaxed">
                  {method.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Encryption Details Area */}
          <div className="mt-16 md:mt-28 bg-white rounded-tile md:rounded-hero p-7 md:p-14 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <span className="text-[13px] font-semibold text-brand-orange-text">
                    Technical integrity
                  </span>
                  <h2 className="text-[22px] md:text-[32px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-[1.1]">
                    Artisanal encryption <br />
                    standards.
                  </h2>
                </div>
                <p className="text-subtle text-[17px] leading-relaxed">
                  Every transaction within the Koolbuy Store ecosystem is
                  materialized through a 256-bit SSL encrypted tunnel. We do not
                  store raw payment credentials, utilizing high-fidelity
                  tokenization to ensure the absolute sanctity of your financial
                  data.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <div className="inline-flex items-center gap-2 h-9 px-4 rounded-full bg-black/[0.04] text-brand-charcoal">
                    <HiLockClosed className="text-brand-orange-text" size={16} />
                    <span className="text-[14px] font-medium">
                      SSL secure
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-2 h-9 px-4 rounded-full bg-black/[0.04] text-brand-charcoal">
                    <HiCheckBadge className="text-brand-orange-text" size={16} />
                    <span className="text-[14px] font-medium">
                      PCI compliant
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-5 bg-brand-charcoal p-7 md:p-10 rounded-tile">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-stage bg-white/10 text-brand-orange flex items-center justify-center shrink-0">
                    <HiShieldCheck size={22} />
                  </div>
                  <h4 className="text-[19px] font-semibold text-white">
                    Patron assurance
                  </h4>
                </div>
                <p className="text-[16px] text-white/60 leading-relaxed">
                  &ldquo;We understand that luxury discovery requires absolute peace
                  of mind. Our billing curators work tirelessly behind the
                  scenes to monitor transaction integrity, ensuring that your
                  journey from curation to acquisition is as secure as it is
                  seamless.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10" />
                  <div className="flex flex-col">
                    <span className="text-[14px] font-semibold text-white">
                      Chief security officer
                    </span>
                    <span className="text-[13px] text-white/60">
                      Boutique compliance suite
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

export default PaymentOptionsPage;
