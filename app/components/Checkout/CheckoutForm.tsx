import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Input, Radio } from "@/app/components/Form";
import { Button } from "@/app/components/Button";
import { Icon } from "@/app/components/Icon";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

/* Apple-store style form pieces (DESIGN.md §13). The ! keeps these ahead of the
   shared Input's own border/background/radius classes. */
const SECTION = "bg-white rounded-tile overflow-hidden";
const SECTION_TITLE = "text-[19px] md:text-[20px] font-semibold text-brand-charcoal tracking-[-0.01em] leading-tight";
const SECTION_SUB = "text-[13px] text-subtle mt-0.5";
const STEP = "w-8 h-8 rounded-full bg-brand-orange-soft text-brand-orange-text text-[14px] font-semibold flex items-center justify-center shrink-0";
const LABEL = "text-[13px] font-medium text-brand-charcoal";
const FIELD =
  "h-11! rounded-xl! bg-black/[0.04]! border! border-transparent! px-4! py-0! text-[15px]! text-brand-charcoal placeholder:text-faint! outline-none shadow-none transition-colors focus:bg-white! focus:border-brand-orange! focus:ring-4! focus:ring-brand-orange/15!";

export const CheckoutForm: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");

  return (
    <div className="flex-1 w-full flex flex-col gap-4 md:gap-6">
      {/* Step 1: Shipping Address */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={SECTION}
      >
        <div className="px-6 pt-6 md:px-8 md:pt-8 flex items-center gap-3">
          <div className={STEP}>1</div>
          <div>
            <h2 className={SECTION_TITLE}>Shipping details</h2>
            <p className={SECTION_SUB}>Where should we deliver?</p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>First name</label>
              <Input placeholder="John" className={FIELD} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>Last name</label>
              <Input placeholder="Doe" className={FIELD} />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className={LABEL}>Email address</label>
              <Input placeholder="john.doe@example.com" type="email" className={FIELD} />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className={LABEL}>Street address</label>
              <div className="relative flex items-center">
                <Input placeholder="123 Shopping Avenue, Suite 456" className={`${FIELD} pr-11! w-full`} />
                <Icon name="location_on" size="sm" className="absolute right-4 text-faint" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>City</label>
              <Input placeholder="San Francisco" className={FIELD} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>Country</label>
              <div className="flex items-center justify-between h-11 px-4 rounded-xl bg-black/[0.04] border border-transparent w-full cursor-pointer transition-colors hover:bg-black/[0.06] group">
                <span className="text-[15px] text-brand-charcoal">United States</span>
                <Icon name="expand_more" size="xs" className="text-faint group-hover:text-brand-charcoal transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Step 2: Payment Method */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={SECTION}
      >
        <div className="px-6 pt-6 md:px-8 md:pt-8 flex items-center gap-3">
          <div className={STEP}>2</div>
          <div>
            <h2 className={SECTION_TITLE}>Payment selection</h2>
            <p className={SECTION_SUB}>Secure transaction</p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`flex-1 flex flex-col items-start p-5 rounded-stage bg-white transition-shadow gap-4 text-left relative overflow-hidden
                ${paymentMethod === "card"
                  ? "ring-2 ring-brand-orange"
                  : "ring-1 ring-black/[0.08] hover:ring-black/[0.16]"}`}
            >
              <Radio
                name="paymentMethod"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
                activeColor="var(--brand-orange)"
                rightElement={
                  <div className="flex gap-2">
                    <Image src="/payment/visa.png" alt="Visa" width={32} height={20} className="object-contain" />
                    <Image src="/payment/mastercard.png" alt="Mastercard" width={32} height={20} className="object-contain" />
                  </div>
                }
              />
              <div className="relative z-10 pointer-events-none">
                <span className="text-[15px] font-semibold text-brand-charcoal block">Credit / Debit card</span>
                <span className="text-[13px] text-subtle mt-0.5 block">Instant confirmation</span>
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod("paypal")}
              className={`flex-1 flex flex-col items-start p-5 rounded-stage bg-white transition-shadow gap-4 text-left relative overflow-hidden
                ${paymentMethod === "paypal"
                  ? "ring-2 ring-brand-orange"
                  : "ring-1 ring-black/[0.08] hover:ring-black/[0.16]"}`}
            >
              <Radio
                name="paymentMethod"
                checked={paymentMethod === "paypal"}
                onChange={() => setPaymentMethod("paypal")}
                icon="paypal"
                activeColor="var(--brand-orange)"
              />
              <div className="relative z-10 pointer-events-none">
                <span className="text-[15px] font-semibold text-brand-charcoal block">PayPal Express</span>
                <span className="text-[13px] text-subtle mt-0.5 block">Redirect to PayPal</span>
              </div>
            </button>
          </div>

          {paymentMethod === "card" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5"
            >
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className={LABEL}>Card number</label>
                <div className="relative flex items-center">
                  <Input placeholder="0000 0000 0000 0000" className={`${FIELD} pl-11! tabular-nums`} />
                  <Icon name="security" size="sm" className="absolute left-4 text-faint" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className={LABEL}>Cardholder name</label>
                <Input placeholder="Full name as on card" className={FIELD} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={LABEL}>Expiry date</label>
                <div className="relative flex items-center">
                  <Input placeholder="MM / YY" className={`${FIELD} pl-11! tabular-nums`} />
                  <Icon name="calendar_today" size="sm" className="absolute left-4 text-faint" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={LABEL}>Security code</label>
                <div className="relative flex items-center">
                  <Input placeholder="CVV" type="password" className={`${FIELD} pr-11!`} />
                  <Icon name="help" size="sm" className="absolute right-4 text-faint" />
                </div>
              </div>
            </motion.div>
          )}

          {paymentMethod === "paypal" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 bg-off-white rounded-stage flex flex-col items-center text-center gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                <Icon name="paypal" size="lg" className="text-brand-charcoal" />
              </div>
              <div>
                <h3 className="text-[17px] font-semibold text-brand-charcoal">PayPal Express</h3>
                <p className="text-[14px] text-subtle max-w-[260px] mt-1">You will be redirected to PayPal to complete your purchase securely.</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  );
};
