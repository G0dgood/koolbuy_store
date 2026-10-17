"use client";

import React from "react";
import { Icon } from "../Icon";

const ServiceBadges = () => {
  const badges = [
    { 
      title: "Secure payment", 
      desc: "Have you ever finally just", 
      icon: "lock",
      color: "bg-black/[0.04]" 
    },
    { 
      title: "Customer support", 
      desc: "Have you ever finally just", 
      icon: "chat",
      color: "bg-black/[0.04]" 
    },
    { 
      title: "Free delivery", 
      desc: "Have you ever finally just", 
      icon: "van",
      color: "bg-black/[0.04]" 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
      {badges.map((badge, idx) => (
        <div key={idx} className="flex items-center gap-3">
           <div className={`w-10 h-10 bg-white rounded-full flex-shrink-0 flex items-center justify-center text-subtle`}>
              <Icon name={badge.icon} size="sm" />
           </div>
           <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-brand-charcoal">{badge.title}</span>
              <p className="text-[13px] text-subtle leading-snug">{badge.desc}</p>
           </div>
        </div>
      ))}
    </div>
  );
};

export { ServiceBadges };
