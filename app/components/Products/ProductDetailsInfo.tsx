"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiChevronDown,
  FiChevronUp,
  FiShoppingCart,
  FiMinus,
  FiPlus,
} from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/Button";

const installmentMap: Record<number, string> = {
  2: "1,180,000.00",
  5: "495,000.00",
  11: "240,000.00",
  17: "165,000.00",
  23: "128,000.00",
  29: "105,000.00",
  35: "89,000.00",
};

export const ProductDetailsInfo: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [isBnplOpen, setIsBnplOpen] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState("Easy 35");
  const [selectedInstallment, setSelectedInstallment] = useState(35);

  const { addToCart } = useCart();

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleSelectFrequency = (freq: string) => {
    setSelectedFrequency(freq);
    if (freq === "Easy 35") setSelectedInstallment(35);
    else if (freq === "Easy 25") setSelectedInstallment(23);
    else if (freq === "Easy 20") setSelectedInstallment(17);
  };

  const handleSelectInstallment = (num: number) => {
    setSelectedInstallment(num);
    if (num >= 35) setSelectedFrequency("Easy 35");
    else if (num >= 23) setSelectedFrequency("Easy 25");
    else setSelectedFrequency("Easy 20");
  };

  const handleAddToCart = () => {
    addToCart({
      id: "thermocool-219l-solar",
      title:
        "219L THERMOCOOL INVERTER SOLAR FREEZER (MAXI (24V 60AH BATTERY + 40V PWM + 2 X 600W PANELS))",
      price: "₦2,155,000.00",
      image: "/images/koolboks/items/3.webp",
      meta: {
        seller: "Koolbuy- GWORLD ELECTRONICS",
      },
    });
    toast.success("Added to cart successfully!");
  };

  const currentMonthlyAmount =
    installmentMap[selectedInstallment] || "89,000.00";

  return (
    <div className="flex-1 flex flex-col gap-6 lg:w-1/2 lg:py-2">
      {/* Title and stock */}
      <div className="flex flex-col gap-3">
        <span className="self-start inline-flex items-center gap-1.5 bg-success-soft text-success font-medium text-[12px] px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden />
          In stock
        </span>
        <h1 className="text-[28px] md:text-[36px] font-semibold text-brand-charcoal leading-tight tracking-[-0.025em]">
          219L Thermocool Inverter Solar Freezer (Maxi (24V 60Ah battery + 40V
          PWM + 2 x 600W panels))
        </h1>

        {/* Sold by */}
        <div className="flex items-center gap-2 text-[13px] text-subtle">
          <div className="w-5 h-5 rounded-full bg-brand-orange-soft flex items-center justify-center text-brand-orange-text shrink-0">
            <FiShoppingCart size={10} />
          </div>
          <span>
            Sold by:{" "}
            <Link
              href="/products?vendor=gworld"
              className="font-medium text-brand-charcoal hover:text-brand-orange-text transition-colors"
            >
              Koolbuy- GWORLD ELECTRONICS
            </Link>
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="flex flex-col gap-1">
        <div className="text-[24px] md:text-[28px] font-semibold text-brand-charcoal tracking-[-0.02em] tabular-nums">
          ₦2,155,000.00
        </div>
      </div>

      {/* Buy for as low as monthly (BNPL) */}
      <div className="w-full rounded-[18px] overflow-hidden bg-off-white">
        <button
          type="button"
          onClick={() => setIsBnplOpen((prev) => !prev)}
          className="w-full px-5 py-4 flex items-center justify-between gap-3 cursor-pointer outline-none hover:bg-black/[0.02] transition-colors text-left"
        >
          <span className="text-[15px] md:text-[16px] text-brand-charcoal">
            Buy for as low as{" "}
            <strong className="text-brand-orange-text font-semibold">
              ₦89,000
            </strong>{" "}
            monthly
          </span>
          {isBnplOpen ? (
            <FiChevronUp className="text-subtle text-lg shrink-0" />
          ) : (
            <FiChevronDown className="text-subtle text-lg shrink-0" />
          )}
        </button>

        <AnimatePresence>
          {isBnplOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-1 flex flex-col gap-5">
                {/* Step 1: payment frequency */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-[13px] font-medium text-subtle">
                    Select payment frequency to pay small small.
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {["Easy 35", "Easy 25", "Easy 20"].map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => handleSelectFrequency(freq)}
                        className={`px-5 py-2 rounded-full font-medium text-[13px] cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50 ${
                          selectedFrequency === freq
                            ? "bg-brand-charcoal text-white"
                            : "bg-white text-brand-charcoal ring-1 ring-black/[0.08] hover:ring-black/20"
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: number of installments */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-[13px] font-medium text-subtle">
                    Select the number of installments
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[2, 5, 11, 17, 23, 29, 35].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleSelectInstallment(num)}
                        className={`w-10 h-10 rounded-full font-medium text-[13px] tabular-nums flex items-center justify-center cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50 ${
                          selectedInstallment === num
                            ? "bg-brand-charcoal text-white"
                            : "bg-white text-brand-charcoal ring-1 ring-black/[0.08] hover:ring-black/20"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: summary */}
                <div className="bg-white rounded-[14px] py-3.5 px-4 text-center">
                  <p className="text-[14px] text-brand-charcoal leading-relaxed">
                    You will be paying{" "}
                    <strong className="text-brand-orange-text font-semibold">
                      ₦{currentMonthlyAmount}
                    </strong>{" "}
                    monthly for{" "}
                    <strong className="text-brand-orange-text font-semibold">
                      {selectedInstallment}
                    </strong>{" "}
                    consecutive{" "}
                    <strong className="text-brand-orange-text font-semibold">
                      months
                    </strong>
                    .
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Description */}
      <p className="text-[15px] md:text-[16px] text-subtle leading-relaxed">
        Thermocool 219L Inverter Solar Freezer with Maxi Solar Kit (24V 60Ah
        battery + 40V PWM + 2 &times; 600W Solar Panels) Smart Solar Freezing
        &ndash; Built for Off-Grid Performance. The Thermocool 219L Inverter
        Solar Freezer, combined with the Maxi Solar Kit, offers a continuous and
        reliable freezing experience for off-grid and unstable power situations.
      </p>

      {/* Quantity and add to cart */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[13px] font-medium text-subtle">
          Quantity
        </span>
        <div className="flex items-center gap-3">
          {/* Quantity stepper */}
          <div className="h-12 rounded-full px-2 flex items-center gap-1 bg-black/[0.04]">
            <button
              type="button"
              onClick={handleDecrease}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-full flex items-center justify-center text-brand-charcoal hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer outline-none"
            >
              <FiMinus size={14} />
            </button>
            <span className="text-[15px] font-medium text-brand-charcoal min-w-6 text-center tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrease}
              className="w-8 h-8 rounded-full flex items-center justify-center text-brand-charcoal hover:bg-white transition-colors cursor-pointer outline-none"
            >
              <FiPlus size={14} />
            </button>
          </div>

          {/* Add to cart */}
          <Button
            type="button"
            variant="accent"
            shape="pill"
            size="lg"
            onClick={handleAddToCart}
            iconRight={<FiShoppingCart size={16} />}
            className="flex-1 h-12 text-[15px]"
          >
            Add to cart
          </Button>
        </div>
      </div>

      {/* Brand, category and share */}
      <div className="flex flex-col gap-2 pt-5 border-t border-black/[0.06] text-[13px] text-subtle">
        <div>
          <span>Brand: </span>
          <Link
            href="/products?search=Koolbuy"
            className="text-brand-charcoal hover:text-brand-orange-text transition-colors"
          >
            Koolbuy- GWORLD ELECTRONICS
          </Link>
        </div>
        <div>
          <span>Category: </span>
          <Link
            href="/products?category=Single+Door+Chest+Freezers"
            className="text-brand-charcoal hover:text-brand-orange-text transition-colors"
          >
            Single Door Chest Freezers
          </Link>
        </div>

        <div className="flex items-center gap-1 pt-1">
          <span className="mr-1">Share:</span>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full flex items-center justify-center text-subtle hover:text-brand-charcoal hover:bg-black/[0.04] transition-colors"
          >
            <FaFacebookF size={13} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full flex items-center justify-center text-subtle hover:text-brand-charcoal hover:bg-black/[0.04] transition-colors"
          >
            <FaTwitter size={13} />
          </a>
          <a
            href="https://whatsapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full flex items-center justify-center text-subtle hover:text-brand-charcoal hover:bg-black/[0.04] transition-colors"
          >
            <FaWhatsapp size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};
