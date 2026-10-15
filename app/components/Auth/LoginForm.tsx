"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "../Form/Inputs";
import { Button } from "../Button";
import { Checkbox } from "../Form/Checkbox";

/* Apple-store style fields (DESIGN.md §7), as in CheckoutForm. The ! keeps these
   ahead of the shared Input's own border/background/radius classes. */
const LABEL = "text-[13px] font-medium text-brand-charcoal";
const FIELD =
  "h-11! rounded-xl! bg-black/[0.04]! border! border-transparent! px-4! py-0! text-[15px]! text-brand-charcoal placeholder:text-faint! outline-none shadow-none transition-colors focus:bg-white! focus:border-brand-orange! focus:ring-4! focus:ring-brand-orange/15!";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full max-w-[400px] bg-white rounded-[22px] overflow-hidden"
    >
      <div className="p-8 sm:p-10 flex flex-col gap-8">
        {/* Form Logo & Header */}
        <div className="flex flex-col gap-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-11 h-11 rounded-xl bg-brand-charcoal flex items-center justify-center p-2"
          >
            <img src="/dashboardIcon/dashboardLogo.svg" alt="Logo" className="brightness-0 invert w-full h-full object-contain" />
          </motion.div>

          <div className="flex flex-col gap-1">
            <h2 className="text-[32px] md:text-[34px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-tight">Admin portal.</h2>
            <p className="text-[15px] text-subtle">Control authority access</p>
          </div>
        </div>

        {/* Login Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className={LABEL}>Administrative email</label>
            <Input
              type="email"
              placeholder="mark@dealport.com"
              className={FIELD}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className={LABEL}>Access key</label>
              <Link href="#" className="text-[13px] font-medium text-brand-orange-text hover:underline">Recovery</Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••••••"
              className={FIELD}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <Checkbox
              label={<span className="text-[13px] text-subtle">Remember for 30 days</span>}
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
          </div>

          <Button
            type="submit"
            variant="accent"
            shape="pill"
            fullWidth
            className="h-12 text-[16px]! mt-1"
            isLoading={isLoading}
          >
            Initialize command
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-[14px] text-subtle">
          Don&apos;t have an administrative account? <br />
          <Link href="#" className="text-brand-orange-text font-medium hover:underline">Contact system admin</Link>
        </p>
      </div>
    </motion.div>
  );
};
