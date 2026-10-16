"use client";

import React, { useState } from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import {
  HiMapPin,
  HiClock,
  HiCheckCircle,
  HiMagnifyingGlass,
  HiCubeTransparent,
  HiTruck,
} from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Input } from "@/app/components/Form/Inputs";
import { Button } from "@/app/components/Button";

/* Soft grey inputs as in the checkout form (DESIGN.md §8). The ! keeps these
   ahead of the shared Input's own border/background/radius classes. */
const LABEL = "text-[13px] font-medium text-brand-charcoal";
const FIELD =
  "h-11! rounded-xl! bg-black/[0.04]! border! border-transparent! px-4! py-0! text-[15px]! text-brand-charcoal placeholder:text-faint! outline-none shadow-none transition-colors focus:bg-white! focus:border-brand-orange! focus:ring-4! focus:ring-brand-orange/15!";

const TrackingPage = () => {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [isTracking, setIsTracking] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);
  };

  const trackingSteps = [
    {
      status: "Order placed",
      time: "Oct 24, 10:30 AM",
      active: true,
      done: true,
    },
    {
      status: "Processing",
      time: "Oct 24, 02:45 PM",
      active: true,
      done: true,
    },
    { status: "Shipped", time: "Oct 25, 09:00 AM", active: true, done: false },
    { status: "In transit", time: "Est. Oct 27", active: false, done: false },
    {
      status: "Out for delivery",
      time: "Est. Oct 28",
      active: false,
      done: false,
    },
  ];

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans text-brand-charcoal">
      <Header />

      <main className="flex-1 w-full bg-off-white">
        {/* Tracking Hero Section */}
        <section className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-14 md:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto flex flex-col items-center text-center gap-3"
          >
            <span className="text-[13px] font-semibold text-brand-orange-text">
              Real-time logistics
            </span>
            <h1 className="text-[28px] md:text-[42px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.05]">
              Follow your journey.
            </h1>
            <p className="text-subtle max-w-xl text-[17px] md:text-[19px] leading-snug">
              Enter your order credentials to visualize the trajectory of your
              Koolbuy Store essentials from our curators to your door.
            </p>
          </motion.div>

          <div className="relative mt-12 md:mt-16 w-full aspect-[16/9] md:aspect-[1280/544] rounded-tile md:rounded-hero overflow-hidden">
            <Image
              src="/brandImage/regional_visual.png"
              alt="Logistics Network"
              fill
              sizes="(max-width: 1440px) 100vw, 1312px"
              className="object-cover"
              priority
            />
          </div>
        </section>

        <section className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 lg:gap-6 items-start">
            {/* Tracking Input Form */}
            <div className="lg:col-span-4 flex flex-col gap-3 md:gap-4">
              <form
                onSubmit={handleTrack}
                className="flex flex-col gap-5 bg-white p-6 md:p-8 rounded-tile"
              >
                <div className="flex flex-col gap-1.5">
                  <label className={LABEL}>
                    Order ID
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. #BM-123456"
                    className={FIELD}
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={LABEL}>
                    Account email
                  </label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className={FIELD}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  shape="pill"
                  className="w-full h-10 text-[13px]! mt-1"
                >
                  Visualize journey
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setOrderId("#BM-882910");
                    setEmail("guest@bloomandmist.com");
                    setIsTracking(true);
                  }}
                  className="text-[14px] font-medium text-brand-orange-text hover:underline transition-colors text-center w-full"
                >
                  Try with demo ID
                </button>
              </form>

              <div className="flex flex-col gap-3 bg-white p-6 md:p-8 rounded-tile">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-stage bg-brand-orange-soft text-brand-orange-text flex items-center justify-center shrink-0">
                    <HiCubeTransparent size={22} />
                  </div>
                  <span className="text-[17px] font-semibold text-brand-charcoal">Packaging note</span>
                </div>
                <p className="text-[15px] text-subtle leading-relaxed">
                  All Koolbuy Store orders are fortified in eco-friendly,
                  artisan-textured packaging to ensure sensory preservation
                  during transit.
                </p>
              </div>
            </div>

            {/* Visualization Result Area */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {isTracking ? (
                  <motion.div
                    key="tracking-results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-3 md:gap-4"
                  >
                    <div className="bg-white rounded-tile md:rounded-hero p-6 md:p-10 flex flex-col gap-10">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black/[0.06] pb-8">
                        <div className="flex flex-col gap-1">
                          <h3 className="text-[26px] md:text-[32px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-tight">
                            Status: Shipped
                          </h3>
                          <p className="text-[15px] text-subtle">
                            Estimated arrival:{" "}
                            <span className="text-brand-orange-text font-medium">
                              October 28, 2026
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-stage bg-brand-orange-soft flex items-center justify-center text-brand-orange-text">
                            <HiTruck size={22} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[12px] text-faint">
                              Courier
                            </span>
                            <span className="text-[15px] font-semibold text-brand-charcoal">
                              Global Express
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4 relative">
                        {/* Progress Line */}
                        <div className="absolute top-5 left-[10%] right-[10%] h-0.5 rounded-full bg-black/[0.06] hidden md:block" />
                        <div className="absolute top-5 left-[10%] w-[40%] h-0.5 rounded-full bg-brand-orange hidden md:block" />

                        {trackingSteps.map((step, i) => (
                          <div
                            key={i}
                            className={`flex md:flex-col items-center gap-4 md:gap-3 relative z-10 ${!step.active ? "opacity-50" : ""}`}
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-semibold ring-4 ring-white transition-colors overflow-hidden ${step.done ? "bg-success-soft text-success" : step.active ? "bg-brand-orange-soft text-brand-orange-text" : "bg-off-white text-faint"}`}
                            >
                              {step.done ? <HiCheckCircle size={22} /> : i + 1}
                            </div>
                            <div className="flex flex-col md:items-center md:text-center gap-0.5">
                              <span className="text-[14px] font-semibold text-brand-charcoal">
                                {step.status}
                              </span>
                              <span className="text-[12px] text-faint">
                                {step.time}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-brand-charcoal rounded-tile md:rounded-hero p-7 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex flex-col gap-1 text-center md:text-left">
                        <h4 className="text-[22px] md:text-[26px] font-semibold text-white tracking-[-0.02em]">
                          Need a custom update?
                        </h4>
                        <p className="text-[16px] text-white/60">
                          Connect with our logistics concierge for precise
                          orchestration.
                        </p>
                      </div>
                      <Button
                        variant="primary"
                        size="lg"
                        shape="pill"
                        className="h-9 px-6 text-[13px]! shrink-0"
                      >
                        Request detail
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="tracking-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="min-h-100 md:h-125 bg-white rounded-tile md:rounded-hero flex flex-col items-center justify-center text-center p-10 md:p-12 gap-5"
                  >
                    <div className="w-16 h-16 rounded-full bg-black/[0.04] flex items-center justify-center text-faint">
                      <HiMagnifyingGlass size={28} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-[22px] md:text-[26px] font-semibold text-brand-charcoal tracking-[-0.02em]">
                        Visualization awaiting
                      </h3>
                      <p className="text-[16px] text-subtle max-w-sm leading-relaxed">
                        Enter your order ID and email to materialize the
                        trajectory of your artisanal shipment.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TrackingPage;
