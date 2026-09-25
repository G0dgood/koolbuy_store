"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { DropdownMenu, DropdownItem } from "../Dropdown/DropdownMenu";
import { Button } from "../Button/Button";
import { Icon } from "../Icon";

export const HeaderNavMenu: React.FC = () => {
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const currencyRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (currencyRef.current && !currencyRef.current.contains(target)) {
        setIsCurrencyOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(target)) {
        setIsLanguageOpen(false);
      }
      if (helpRef.current && !helpRef.current.contains(target)) {
        setIsHelpOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currencies = [
    { code: "USD", symbol: "$", label: "USD - US Dollar" },
    { code: "EUR", symbol: "€", label: "EUR - Euro" },
    { code: "GBP", symbol: "£", label: "GBP - British Pound" },
    { code: "NGN", symbol: "₦", label: "NGN - Nigerian Naira" },
    { code: "AED", symbol: "د.إ", label: "AED - UAE Dirham" },
    { code: "CAD", symbol: "$", label: "CAD - Canadian Dollar" },
  ];

  const languages = [
    { code: "EN", name: "English", subtext: "United States" },
    { code: "FR", name: "Français", subtext: "France" },
    { code: "ES", name: "Español", subtext: "Spain" },
    { code: "AR", name: "العربية", subtext: "Arabic" },
    { code: "DE", name: "Deutsch", subtext: "Germany" },
  ];

  const helpLinks = [
    { label: "Help Center", href: "/help" },
    { label: "Place an order", href: "/help/order" },
    { label: "Payment options", href: "/help/payment" },
    { label: "Track an order", href: "/help/tracking" },
    { label: "Cancel an order", href: "/help/cancel" },
    { label: "Returns & Refunds", href: "/refund" },
    { label: "Cookie Preferences", href: "/help/cookies" },
  ];

  return (
    <div className="flex items-center gap-4 xl:gap-6 text-xs md:text-sm font-medium text-gray-700">
      {/* Language Dropdown */}
      <div className="relative flex items-center" ref={languageRef}>
        <button
          type="button"
          onClick={() => {
            setIsLanguageOpen((prev) => !prev);
            setIsCurrencyOpen(false);
            setIsHelpOpen(false);
          }}
          className={`flex items-center gap-1 cursor-pointer transition-colors py-1.5 outline-none ${
            isLanguageOpen
              ? "text-[#FF7A00] font-bold"
              : "text-gray-700 hover:text-[#FF7A00]"
          }`}
          aria-expanded={isLanguageOpen}
        >
          <span>Language</span>
          <FiChevronDown
            className={`text-xs text-gray-400 transition-transform duration-200 ${
              isLanguageOpen ? "rotate-180 text-[#FF7A00]" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {isLanguageOpen && (
            <div className="absolute top-full right-0 pt-2 w-48 z-100">
              <DropdownMenu
                width="100%"
                className="shadow-2xl border border-gray-100 rounded-xl overflow-hidden py-1"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  Select Language
                </div>
                {languages.map((lang) => (
                  <DropdownItem
                    key={lang.code}
                    label={lang.name}
                    subtext={lang.subtext}
                    isActive={selectedLanguage === lang.name}
                    onSelect={() => {
                      setSelectedLanguage(lang.name);
                      setIsLanguageOpen(false);
                    }}
                  />
                ))}
              </DropdownMenu>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Help Dropdown */}
      <div className="relative flex items-center" ref={helpRef}>
        <button
          type="button"
          onClick={() => {
            setIsHelpOpen((prev) => !prev);
            setIsCurrencyOpen(false);
            setIsLanguageOpen(false);
          }}
          className={`flex items-center gap-1 cursor-pointer transition-colors py-1.5 outline-none ${
            isHelpOpen
              ? "text-[#FF7A00] font-bold"
              : "text-gray-700 hover:text-[#FF7A00]"
          }`}
          aria-expanded={isHelpOpen}
        >
          <span>Help</span>
          <FiChevronDown
            className={`text-xs text-gray-400 transition-transform duration-200 ${
              isHelpOpen ? "rotate-180 text-[#FF7A00]" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {isHelpOpen && (
            <div className="absolute top-full right-0 pt-2 w-64 z-100">
              <DropdownMenu
                width="100%"
                className="shadow-2xl border border-gray-100 rounded-xl overflow-hidden"
              >
                <div className="flex flex-col py-2">
                  {helpLinks.map((link) => (
                    <DropdownItem
                      key={link.label}
                      label={link.label}
                      href={link.href}
                      onSelect={() => setIsHelpOpen(false)}
                      className="text-gray-700 hover:text-[#FF7A00] font-medium"
                    />
                  ))}
                </div>

                {/* Contact Section */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-2.5">
                  <Button
                    className="w-full text-white h-10 shadow-sm active:scale-95 transition-all hover:opacity-90 text-xs"
                    style={{ backgroundColor: "#2196F3" }}
                    iconLeft={<Icon name="chat" size="sm" />}
                  >
                    Live Chat
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full h-10 border font-bold active:scale-95 transition-all text-xs"
                    style={{ borderColor: "#00B517", color: "#00B517" }}
                    iconLeft={<Icon name="social/whatsapp" size="sm" />}
                  >
                    WhatsApp
                  </Button>
                </div>
              </DropdownMenu>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Currency Dropdown */}
      <div className="relative flex items-center" ref={currencyRef}>
        <button
          type="button"
          onClick={() => {
            setIsCurrencyOpen((prev) => !prev);
            setIsLanguageOpen(false);
            setIsHelpOpen(false);
          }}
          className={`flex items-center gap-1 cursor-pointer transition-colors py-1.5 outline-none ${
            isCurrencyOpen
              ? "text-[#FF7A00] font-bold"
              : "text-gray-700 hover:text-[#FF7A00]"
          }`}
          aria-expanded={isCurrencyOpen}
        >
          <span>Currency</span>
          <FiChevronDown
            className={`text-xs text-gray-400 transition-transform duration-200 ${
              isCurrencyOpen ? "rotate-180 text-[#FF7A00]" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {isCurrencyOpen && (
            <div className="absolute top-full right-0 pt-2 w-52 z-100">
              <DropdownMenu
                width="100%"
                className="shadow-2xl border border-gray-100 rounded-xl overflow-hidden py-1"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  Select Currency
                </div>
                {currencies.map((curr) => (
                  <DropdownItem
                    key={curr.code}
                    label={`${curr.symbol} ${curr.code}`}
                    subtext={curr.label}
                    isActive={selectedCurrency === curr.code}
                    onSelect={() => {
                      setSelectedCurrency(curr.code);
                      setIsCurrencyOpen(false);
                    }}
                  />
                ))}
              </DropdownMenu>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
