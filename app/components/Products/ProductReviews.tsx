"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Icon } from "../Icon";
import { toast } from "sonner";
import { ReviewModal } from "../Modal";

interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

const mockReviews: Review[] = [
  {
    id: 1,
    user: "Michael Scott",
    avatar: "/avatars/avatar=pic1.jpg",
    rating: 5,
    date: "2 days ago",
    comment: "Absolutely amazing! The quality of the fabric is much better than I expected. It fits perfectly and looks very premium. Highly recommended for summer wear.",
    verified: true
  },
  {
    id: 2,
    user: "Pam Beesly",
    avatar: "/avatars/avatar=pic2.png",
    rating: 4,
    date: "1 week ago",
    comment: "Very nice shirt, the color is exactly as shown in the pictures. Shipping was fast. It's a bit loose on the shoulders but still looks great.",
    verified: true
  },
  {
    id: 3,
    user: "Jim Halpert",
    avatar: "/avatars/avatar=pic1.jpg",
    rating: 5,
    date: "2 weeks ago",
    comment: "This is my second purchase from this brand. Consistency is key and they never disappoint. Perfect for office wear too.",
    verified: true
  }
];

const ProductReviews = () => {
  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-8"
    >
      {/* Rating summary */}
      <div className="flex flex-col md:flex-row gap-8 md:items-center bg-off-white rounded-[22px] p-6 md:p-8">
        <div className="flex flex-col items-center text-center md:border-r border-black/[0.06] md:pr-12">
          <span className="text-[48px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-none tabular-nums">4.8</span>
          <div className="flex gap-1 my-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon key={star} name="star" size="sm" className={star <= 4 ? "text-brand-orange" : "text-gray-300"} />
            ))}
          </div>
          <p className="text-[13px] text-subtle">Based on 124 reviews</p>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          {[5, 4, 3, 2, 1].map((stars) => {
             const percentages = { 5: 85, 4: 10, 3: 3, 2: 2, 1: 0 };
             const pct = percentages[stars as keyof typeof percentages];
             return (
               <div key={stars} className="flex items-center gap-4">
                  <span className="text-[13px] text-subtle w-14">{stars} Stars</span>
                  <div className="flex-1 h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                      className="h-full rounded-full bg-brand-orange"
                    />
                  </div>
                  <span className="text-[13px] text-faint w-10 text-right tabular-nums">{pct}%</span>
               </div>
             );
          })}
        </div>
      </div>

      {/* Review list */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-[22px] md:text-[26px] font-semibold text-brand-charcoal tracking-[-0.02em]">User reviews</h3>
          <button 
            onClick={() => setIsReviewModalOpen(true)}
            className="text-[14px] md:text-[15px] font-medium text-brand-orange-text hover:underline cursor-pointer whitespace-nowrap"
          >
            Write a review ›
          </button>
        </div>

        <ReviewModal 
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          productName="Canon EOS R5 Mirrorless Camera"
        />

        <div className="flex flex-col gap-3">
          {mockReviews.map((review) => (
            <div key={review.id} className="bg-off-white rounded-[18px] p-5 md:p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-light-gray shrink-0">
                    <Image src={review.avatar} alt={review.user} fill sizes="40px" className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold text-brand-charcoal">{review.user}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                       <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Icon key={star} name="star" size="xs" className={star <= review.rating ? "text-brand-orange" : "text-gray-300"} />
                          ))}
                       </div>
                       <span className="text-[12px] text-faint">• {review.date}</span>
                    </div>
                  </div>
                </div>

                {review.verified && (
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-success-soft text-[12px] font-medium text-success rounded-full shrink-0">
                    <Icon name="check" size="xs" />
                    Verified
                  </div>
                )}
              </div>

              <p className="text-subtle text-[14px] leading-relaxed max-w-[900px]">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export { ProductReviews };
