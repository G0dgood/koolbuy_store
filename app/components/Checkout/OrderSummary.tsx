import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/app/components/Button";
import { Icon } from "@/app/components/Icon";
import { useCart } from "@/app/context/CartContext";

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 }
};

export const OrderSummary: React.FC = () => {
  const { cartItems } = useCart();

  const parsePrice = (priceStr: string) => {
    return parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
  };

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + parsePrice(item.price) * item.quantity;
  }, 0);

  const estimatedTax = subtotal * 0.05; // 5% tax
  const total = subtotal + estimatedTax;

  return (
    <div className="w-full lg:w-[400px] xl:w-[420px] shrink-0 sticky top-28">
      <section className="bg-white rounded-tile overflow-hidden">
        <div className="px-6 pt-6 md:px-8 md:pt-8">
          <h2 className="text-[19px] md:text-[16px] font-semibold text-brand-charcoal tracking-[-0.01em] leading-tight">Order summary</h2>
          <p className="text-[13px] text-subtle mt-0.5">Review items</p>
        </div>

        <div className="p-6 md:p-8">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.1 }}
            className="flex flex-col mb-6 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar"
          >
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <motion.div key={item.id} variants={itemVariants} className="flex gap-4 py-4 first:pt-0 border-b border-black/[0.06] last:border-0 group">
                  <div className="w-16 h-16 bg-off-white rounded-stage flex-shrink-0 relative overflow-hidden">
                    <Image src={item.image} alt={item.title} fill sizes="64px" className="object-contain p-2 mix-blend-multiply" />
                  </div>
                  <div className="flex-1 min-w-0 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link href="/products/detail">
                        <h4 className="text-[15px] font-semibold text-brand-charcoal line-clamp-2 leading-snug hover:text-brand-orange-text cursor-pointer transition-colors">
                          {item.title}
                        </h4>
                      </Link>
                      <span className="text-[13px] text-subtle mt-0.5 block">Qty: {item.quantity}</span>
                    </div>
                    <span className="text-[15px] font-semibold text-brand-charcoal tabular-nums whitespace-nowrap">₦{(parsePrice(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-8 text-center bg-off-white rounded-stage">
                <Icon name="shopping_bag" size="lg" className="text-faint mx-auto mb-2" />
                <p className="text-[14px] text-subtle">Your cart is empty</p>
              </div>
            )}
          </motion.div>

          <div className="flex flex-col gap-2.5 mb-6 pt-5 border-t border-black/[0.06] text-[14px]">
            <div className="flex justify-between">
              <span className="text-subtle">Subtotal</span>
              <span className="text-brand-charcoal tabular-nums">₦{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-subtle">Shipping</span>
              <span className="text-brand-charcoal">{subtotal > 0 ? "Free" : "₦0.00"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-subtle">Estimated tax</span>
              <span className="text-brand-charcoal tabular-nums">₦{estimatedTax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-baseline pt-4 mt-2 border-t border-black/[0.06]">
              <div className="flex flex-col">
                <span className="text-[17px] font-semibold text-brand-charcoal">Total</span>
                <span className="text-[12px] text-faint">Incl. VAT</span>
              </div>
              <span className="text-[22px] font-semibold text-brand-charcoal tabular-nums tracking-[-0.01em] leading-none">₦{total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            variant="accent"
            size="lg"
            shape="pill"
            fullWidth
            className="text-[13px]!"
            disabled={cartItems.length === 0}
          >
            <span>Complete order</span>
            <Icon name="arrow_forward" size="xs" className="opacity-70" />
          </Button>

          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-1.5">
              <Icon name="verified_user" size="sm" className="text-faint" />
              <span className="text-[12px] text-subtle">Secure 256-bit SSL encryption</span>
            </div>

            <div className="flex items-center justify-center gap-4 opacity-50 hover:opacity-100 transition-opacity">
              <Image src="/payment/visa.png" alt="Visa" width={32} height={20} className="object-contain grayscale hover:grayscale-0 transition-all" />
              <Image src="/payment/mastercard.png" alt="Mastercard" width={32} height={20} className="object-contain grayscale hover:grayscale-0 transition-all" />
              <div className="w-px h-3 bg-light-gray mx-1" />
              <Icon name="security" size="sm" className="text-faint" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
