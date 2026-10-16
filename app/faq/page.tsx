"use client";

import React, { useState, useMemo } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FAQAccordion } from "../components/ui/FAQAccordion";
import { HiOutlineChatBubbleLeftRight, HiOutlineEnvelope } from "react-icons/hi2";
import { motion } from "framer-motion";
import { HiOutlineSearch } from "react-icons/hi";

const faqData = [
  {
    category: "Orders & tracking",
    items: [
      { id: 1, question: "How can I track my order?", answer: "Once your order is shipped, you will receive an email with a tracking number and a link to track your package on our carrier's website. You can also track it directly from your 'My Orders' section in your account." },
      { id: 2, question: "Can I modify my order after placing it?", answer: "We process orders quickly, but you can request modifications within 1 hour of placing the order. Please contact our support team immediately with your order ID." },
      { id: 3, question: "What should I do if my order is delayed?", answer: "Shipping times vary by location. If your order hasn't arrived within the estimated delivery window, please check the tracking link or contact our support team for assistance." },
    ]
  },
  {
    category: "Shipping & delivery",
    items: [
      { id: 4, question: "What are the shipping rates?", answer: "Shipping rates are calculated based on the weight of your order and the delivery destination. You can view the exact shipping cost at the checkout page before completing your purchase." },
      { id: 5, question: "Do you offer international shipping?", answer: "Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by country." },
      { id: 6, question: "How long does delivery take?", answer: "Standard local delivery typically takes 3-5 business days. Express shipping takes 1-2 business days. International orders can take 7-14 business days." },
    ]
  },
  {
    category: "Payments & refunds",
    items: [
      { id: 7, question: "What payment methods do you accept?", answer: "We accept all major credit/debit cards, PayPal, and local bank transfers. All transactions are secure and encrypted." },
      { id: 8, question: "How long does a refund take?", answer: "Once we process your refund, it typically takes 5-10 business days for the funds to appear in your account, depending on your bank's processing time." },
      { id: 9, question: "Is my payment information secure?", answer: "Yes, we use industry-standard SSL encryption and secure payment gateways to ensure your sensitive information is always protected." },
    ]
  },
  {
    category: "Returns & exchanges",
    items: [
      { id: 10, question: "What is your return policy?", answer: "We offer a 30-day return policy for most items. Products must be in their original packaging and unused. Some items like personal care products are non-returnable." },
      { id: 11, question: "How do I initiate a return?", answer: "Go to your 'My Orders' section, select the item you wish to return, and click 'Initiate Return'. Follow the instructions to print your return label." },
      { id: 12, question: "Can I exchange an item for a different size?", answer: "Yes, you can initiate an exchange through the 'My Orders' page. Once we receive your return, we will process the new item shipment." },
    ]
  }
];

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState("Orders & tracking");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = faqData.map(d => d.category);

  const filteredFAQs = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();

    // If searching, show all matching across categories
    if (searchQuery) {
      return faqData.flatMap(cat => cat.items).filter(item =>
        item.question.toLowerCase().includes(searchLower) ||
        item.answer.toString().toLowerCase().includes(searchLower)
      );
    }

    // Otherwise show by category
    return faqData.find(cat => cat.category === activeTab)?.items || [];
  }, [activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-14 pb-12 md:pt-24 md:pb-20 bg-off-white">
        <div className="max-w-200 mx-auto px-4 sm:px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-brand-orange-text font-semibold text-[13px] mb-3"
          >
            Help center
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[34px] md:text-[52px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.05] mb-8"
          >
            How can we help you?
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-xl mx-auto group"
          >
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-faint group-focus-within:text-brand-orange-text transition-colors">
              <HiOutlineSearch size={20} />
            </div>
            <input
              type="text"
              placeholder="Search common questions, articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 md:h-14 pl-13 pr-6 rounded-full border border-light-gray bg-white text-[16px] text-brand-charcoal placeholder:text-faint outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15 transition-all"
            />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-250 mx-auto px-4 sm:px-6 py-12 md:py-20">
        {!searchQuery && (
          <div className="mb-10 md:mb-12 max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div role="tablist" className="flex items-center justify-start md:justify-center min-w-max mx-auto gap-2 py-1">
              {categories.map((tab) => {
                const selected = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                      selected
                        ? "bg-brand-orange text-white"
                        : "bg-black/[0.04] text-subtle hover:bg-black/[0.08] hover:text-brand-charcoal"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {searchQuery && (
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] md:text-[20px] font-semibold text-brand-charcoal tracking-[-0.02em]">Search results</h2>
              <button
                onClick={() => setSearchQuery("")}
                className="text-[14px] font-medium text-brand-orange-text hover:underline"
              >
                Clear search
              </button>
            </div>
          )}

          {filteredFAQs.length > 0 ? (
            <FAQAccordion items={filteredFAQs} />
          ) : (
            <div className="py-16 md:py-20 text-center flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-stage bg-black/[0.04] flex items-center justify-center text-faint mb-1">
                <HiOutlineSearch size={26} />
              </div>
              <p className="text-[17px] font-semibold text-brand-charcoal">No results found for &quot;{searchQuery}&quot;</p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-[15px] font-medium text-brand-orange-text hover:underline"
              >
                Try searching something else
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-off-white py-16 md:py-24">
        <div className="max-w-360 mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
          <h2 className="text-[22px] md:text-[28px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-tight mb-2">Still have questions?</h2>
          <p className="text-subtle text-[17px] md:text-[19px] leading-snug mb-10 max-w-xl">
            Contact our dedicated support team. We&apos;re here to help you solve any issues as quickly as possible.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full max-w-2xl">
            <div className="bg-white rounded-tile p-7 flex flex-col items-center gap-4 hover:shadow-lift transition-shadow duration-300 ease-apple cursor-pointer group">
              <div className="w-11 h-11 rounded-stage bg-brand-orange-soft flex items-center justify-center text-brand-orange-text">
                <HiOutlineChatBubbleLeftRight size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-brand-charcoal font-semibold text-[17px]">Live chat</span>
                <span className="text-faint text-[13px] mt-0.5">Average wait: 2 mins</span>
              </div>
            </div>

            <div className="bg-white rounded-tile p-7 flex flex-col items-center gap-4 hover:shadow-lift transition-shadow duration-300 ease-apple cursor-pointer group">
              <div className="w-11 h-11 rounded-stage bg-brand-orange-soft flex items-center justify-center text-brand-orange-text">
                <HiOutlineEnvelope size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-brand-charcoal font-semibold text-[17px]">Email support</span>
                <span className="text-faint text-[13px] mt-0.5">Response within 24h</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
