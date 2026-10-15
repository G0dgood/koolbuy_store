"use client";

import React, { useState } from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import {
  HiShieldCheck,
  HiFingerPrint,
  HiAdjustmentsHorizontal,
  HiChartBar,
  HiShoppingCart,
  HiLockClosed,
} from "react-icons/hi2";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/app/components/Button";

const CookiePreferencesPage = () => {
  const [preferences, setPreferences] = useState({
    essential: true, // Always true
    functional: true,
    analytics: false,
    marketing: false,
  });

  const togglePreference = (key: keyof typeof preferences) => {
    if (key === "essential") return;
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const cookieTypes = [
    {
      id: "essential",
      title: "Strictly essential",
      desc: "These cookies are vital for the core orchestration of the Koolbuy Store experience, including secure authentication and cart persistence.",
      icon: <HiLockClosed size={22} />,
      required: true,
    },
    {
      id: "functional",
      title: "Functional preference",
      desc: "Enables specialized features like sensory discovery history and regional language synchronization for a tailored boutique experience.",
      icon: <HiAdjustmentsHorizontal size={22} />,
      required: false,
    },
    {
      id: "analytics",
      title: "Performance discovery",
      desc: "Anonymous tracking that allows our curation team to understand platform trajectories and optimize high-fidelity visual performance.",
      icon: <HiChartBar size={22} />,
      required: false,
    },
    {
      id: "marketing",
      title: "Bespoke targeting",
      desc: "Allows us to present you with artisanal collections and designer offers that align with your unique sensory profile.",
      icon: <HiFingerPrint size={22} />,
      required: false,
    },
  ];

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans text-brand-charcoal">
      <Header />

      <main className="flex-1 w-full bg-off-white">
        {/* Privacy Hero */}
        <section className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-14 md:pt-24">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center md:items-start md:text-left gap-3"
            >
              <span className="text-[13px] font-semibold text-brand-orange-text">
                Privacy orchestration
              </span>
              <h1 className="text-[34px] md:text-[52px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.05]">
                Cookie preferences.
              </h1>
              <p className="text-subtle max-w-2xl text-[17px] md:text-[19px] leading-snug">
                Your digital footprint is as unique as your sensory profile. At
                Koolbuy Store, we prioritize your data sovereignty with
                artisanal precision.
              </p>
            </motion.div>

            <div className="relative mx-auto w-full max-w-55 md:max-w-60 aspect-[285/435] rounded-tile overflow-hidden">
              <Image
                src="/brandImage/cat_body.png"
                alt="Privacy Framework"
                fill
                sizes="240px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        <section className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 lg:gap-6 items-start">
            {/* Policy Narrative */}
            <div className="lg:col-span-5 flex flex-col gap-3 md:gap-4">
              <div className="flex flex-col gap-3 p-2 md:p-4">
                <h2 className="text-[26px] md:text-[34px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-tight">
                  Our integrity.
                </h2>
                <p className="text-subtle leading-relaxed text-[17px]">
                  We use cookies to ensure that your journey through the Koolbuy
                  Store ecosystem is seamless, secure, and personalized. You
                  have absolute control over which non-essential technologies
                  materialize during your visit.
                </p>
              </div>

              <div className="bg-white p-7 md:p-8 rounded-tile flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-stage bg-brand-orange-soft text-brand-orange-text flex items-center justify-center shrink-0">
                    <HiShieldCheck size={22} />
                  </div>
                  <h4 className="text-[19px] font-semibold text-brand-charcoal">
                    Data sovereignty
                  </h4>
                </div>
                <p className="text-[15px] text-subtle leading-relaxed">
                  All personal data is encrypted and handled in strict
                  accordance with global privacy frameworks, including GDPR and
                  CCPA.
                </p>
              </div>
            </div>

            {/* Interactive Preference Control */}
            <div className="lg:col-span-7 bg-white rounded-tile md:rounded-hero overflow-hidden">
              <div className="px-6 md:px-10 py-2 md:py-4 flex flex-col">
                {cookieTypes.map((cookie, i) => (
                  <div
                    key={cookie.id}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 py-6 border-b border-black/[0.06] last:border-0"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-11 h-11 bg-brand-orange-soft rounded-stage flex items-center justify-center text-brand-orange-text shrink-0">
                        {cookie.icon}
                      </div>
                      <div className="flex flex-col gap-1">
                        <h4 className="text-[17px] font-semibold text-brand-charcoal">
                          {cookie.title}
                        </h4>
                        <p className="text-[14px] text-subtle leading-relaxed max-w-md">
                          {cookie.desc}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pl-15 md:pl-0">
                      {cookie.required ? (
                        <span className="text-[12px] font-medium text-brand-orange-text bg-brand-orange-soft px-3 py-1 rounded-full">
                          Required
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            togglePreference(
                              cookie.id as keyof typeof preferences,
                            )
                          }
                          className={`relative w-14 h-8 rounded-full transition-colors duration-300 ease-apple cursor-pointer ${preferences[cookie.id as keyof typeof preferences] ? "bg-brand-orange" : "bg-gray-200"}`}
                        >
                          <motion.div
                            animate={{
                              x: preferences[
                                cookie.id as keyof typeof preferences
                              ]
                                ? 28
                                : 4,
                            }}
                            className="absolute top-1 left-0 w-6 h-6 bg-white rounded-full shadow-sm"
                          />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-off-white px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-black/[0.06]">
                <p className="text-[13px] text-faint">
                  Your preferences are synchronized in real-time.
                </p>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button
                    variant="ghost"
                    size="lg"
                    shape="pill"
                    className="flex-1 md:flex-none h-11 px-6 text-[15px]! bg-black/[0.04] hover:bg-black/[0.08] text-brand-charcoal"
                  >
                    Reject all
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    shape="pill"
                    className="flex-1 md:flex-none h-11 px-6 text-[15px]!"
                  >
                    Accept all
                  </Button>
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

export default CookiePreferencesPage;
