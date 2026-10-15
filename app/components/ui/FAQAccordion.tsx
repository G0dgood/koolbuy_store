"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon } from "@radix-ui/react-icons";

/* Apple-style FAQ list (DESIGN.md §8): rows separated by hairlines, a 17px
   question, a plus that turns into a cross when open, and calm grey answers. */

interface FAQItemProps {
  question: string;
  answer: string | React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const FAQItem = ({ question, answer, isOpen, onToggle }: FAQItemProps) => {
  return (
    <div className="border-b border-black/[0.06]">
      <button
        onClick={onToggle}
        aria-expanded={isOpen ? true : false}
        className="group w-full flex items-center justify-between gap-6 py-5 md:py-6 text-left cursor-pointer"
      >
        <span className="text-[16px] md:text-[17px] font-semibold text-brand-charcoal leading-snug tracking-[-0.01em] group-hover:text-brand-orange-text transition-colors duration-200">
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
            isOpen ? "bg-brand-orange-soft text-brand-orange-text" : "bg-black/[0.04] text-subtle"
          }`}
        >
          <PlusIcon className="w-4 h-4" aria-hidden />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 pr-14 text-[15px] md:text-[16px] leading-relaxed text-subtle">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface FAQAccordionProps {
  items: Array<{ id: string | number; question: string; answer: string | React.ReactNode }>;
}

export const FAQAccordion = ({ items }: FAQAccordionProps) => {
  const [openId, setOpenId] = useState<string | number | null>(null);

  const handleToggle = (id: string | number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="flex flex-col border-t border-black/[0.06]">
      {items.map((item) => (
        <FAQItem
          key={item.id}
          question={item.question}
          answer={item.answer}
          isOpen={openId === item.id}
          onToggle={() => handleToggle(item.id)}
        />
      ))}
    </div>
  );
};
