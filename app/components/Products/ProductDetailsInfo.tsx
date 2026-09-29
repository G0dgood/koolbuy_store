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
    <div className="flex-1 flex flex-col gap-5 lg:w-1/2">
      {/* Title and Stock Row */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-[28px] sm:text-[40px] font-semibold text-ink leading-[1.1] tracking-[-0.02em]">
          219L THERMOCOOL INVERTER SOLAR FREEZER (MAXI (24V 60AH BATTERY + 40V
          PWM + 2 X 600W PANELS))
        </h1>
        <span className="shrink-0 kb-sticker">
          In Stock
        </span>
      </div>

      {/* Sold By */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
        <div className="w-5 h-5 rounded bg-action flex items-center justify-center text-white shrink-0 shadow-xs">
          <FiShoppingCart size={11} />
        </div>
        <span>
          Sold by:{" "}
          <Link
            href="/products?vendor=gworld"
            className="font-bold text-gray-900 hover:text-action transition-colors"
          >
            Koolbuy- GWORLD ELECTRONICS
          </Link>
        </span>
      </div>

      {/* Buy for as low as monthly BNPL Dropdown Card */}
      <div className="w-full border border-hairline rounded-2xl overflow-hidden bg-white">
        {/* Dropdown Header Trigger */}
        <button
          type="button"
          onClick={() => setIsBnplOpen((prev) => !prev)}
          className="w-full px-5 py-4 flex items-center justify-between cursor-pointer outline-none bg-cream hover:bg-cream-dark transition-colors text-left"
        >
          <span className="text-base sm:text-lg text-gray-800 font-bold">
            Buy for as low as{" "}
            <strong className="text-ink font-semibold text-lg sm:text-xl">
              ₦89,000
            </strong>{" "}
            monthly
          </span>
          {isBnplOpen ? (
            <FiChevronUp className="text-action text-xl shrink-0" />
          ) : (
            <FiChevronDown className="text-action text-xl shrink-0" />
          )}
        </button>

        {/* Dropdown Content */}
        <AnimatePresence>
          {isBnplOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="p-5 pt-4 flex flex-col gap-4 bg-white border-t border-orange-100">
                {/* Step 1: Select payment frequency */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-gray-800">
                    Select payment frequency to pay small small.
                  </span>
                  <div className="flex items-center gap-3 flex-wrap">
                    {["Easy 35", "Easy 25", "Easy 20"].map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => handleSelectFrequency(freq)}
                        className={`px-6 py-2 rounded-full font-bold text-xs sm:text-sm cursor-pointer transition-all outline-none ${
                          selectedFrequency === freq
                            ? "bg-action text-white shadow-xs"
                            : "border border-action text-action bg-white hover:bg-orange-50"
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Select number of installments */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-gray-800">
                    Select the number of installments
                  </span>
                  <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                    {[2, 5, 11, 17, 23, 29, 35].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleSelectInstallment(num)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center cursor-pointer transition-all outline-none ${
                          selectedInstallment === num
                            ? "bg-action text-white shadow-xs"
                            : "border border-action text-action bg-white hover:bg-orange-50"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Calculation Summary Box */}
                <div className="bg-cream rounded-xl py-3.5 px-4 text-center mt-1">
                  <p className="text-xs sm:text-sm text-gray-800 font-semibold leading-relaxed">
                    You will be paying{" "}
                    <strong className="text-action font-semibold">
                      ₦{currentMonthlyAmount}
                    </strong>{" "}
                    Monthly for{" "}
                    <strong className="text-action font-semibold">
                      {selectedInstallment}
                    </strong>{" "}
                    consecutive{" "}
                    <strong className="text-action font-semibold">
                      Months
                    </strong>
                    .
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price */}
      <div className="text-[24px] sm:text-[28px] font-normal text-ink tracking-[-0.01em]">
        ₦2,155,000.00
      </div>

      {/* Brand & Social Share Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-gray-600 pt-1 border-t border-gray-100">
        <div>
          <span className="font-semibold text-gray-900">Brand: </span>
          <Link
            href="/products?search=Koolbuy"
            className="text-gray-700 hover:text-action transition-colors"
          >
            Koolbuy- GWORLD ELECTRONICS
          </Link>
        </div>

        {/* Social Share */}
        <div className="flex items-center gap-2.5">
          <span className="font-medium text-gray-500">Share:</span>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-[#1877F2] transition-colors"
          >
            <FaFacebookF size={13} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-[#1DA1F2] transition-colors"
          >
            <FaTwitter size={13} />
          </a>
          <a
            href="https://whatsapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-[#25D366] transition-colors"
          >
            <FaWhatsapp size={14} />
          </a>
        </div>
      </div>

      {/* Description Text */}
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
        Thermocool 219L Inverter Solar Freezer with Maxi Solar Kit (24V 60Ah
        battery + 40V PWM + 2 &times; 600W Solar Panels) Smart Solar Freezing
        &ndash; Built for Off-Grid Performance. The Thermocool 219L Inverter
        Solar Freezer, combined with the Maxi Solar Kit, offers a continuous and
        reliable freezing experience for off-grid and unstable power situations.
      </p>

      {/* Quantity & Add to Cart Row */}
      <div className="flex flex-col gap-2 pt-2">
        <span className="text-xs sm:text-sm font-semibold text-gray-800">
          Quantity:
        </span>
        <div className="flex items-center gap-4">
          {/* Quantity Selector */}
          <div className="h-11 border border-[#d2d2d7] rounded-full px-5 flex items-center gap-4 bg-white">
            <button
              type="button"
              onClick={handleDecrease}
              disabled={quantity <= 1}
              className="text-gray-500 hover:text-gray-900 disabled:opacity-30 cursor-pointer outline-none"
            >
              <FiMinus size={14} />
            </button>
            <span className="text-sm font-bold text-gray-900 min-w-4 text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrease}
              className="text-gray-500 hover:text-gray-900 cursor-pointer outline-none"
            >
              <FiPlus size={14} />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 h-11 bg-action hover:bg-action-hover active:scale-95 text-white font-normal text-[17px] rounded-full flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <span>Add to cart</span>
            <FiShoppingCart size={16} />
          </button>
        </div>
      </div>

      {/* Category Row */}
      <div className="text-xs sm:text-sm text-gray-600 pt-2 border-t border-gray-100">
        <span className="font-semibold text-gray-900">Category: </span>
        <Link
          href="/products?category=Single+Door+Chest+Freezers"
          className="text-gray-700 hover:text-action transition-colors"
        >
          Single Door Chest Freezers
        </Link>
      </div>
    </div>
  );
};
