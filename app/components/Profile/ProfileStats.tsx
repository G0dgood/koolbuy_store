import React from "react";
import { Icon } from "../Icon";

interface StatProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatProps> = ({ label, value, icon, color }) => (
  <div className="bg-white p-5 rounded-tile flex items-center gap-4 cursor-default">
    <div className={`w-11 h-11 rounded-full ${color} flex items-center justify-center shrink-0`}>
      <Icon name={icon} size="sm" />
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-[24px] font-semibold text-brand-charcoal tracking-[-0.02em] leading-tight tabular-nums">{value}</span>
      <span className="text-[13px] text-subtle truncate">{label}</span>
    </div>
  </div>
);

export const ProfileStats: React.FC = () => {
  const stats = [
    { label: "Total orders", value: 12, icon: "favorite", color: "bg-brand-orange-soft text-brand-orange-text" },
    { label: "Pending shipments", value: 3, icon: "send", color: "bg-brand-orange-soft text-brand-orange-text" },
    { label: "Reward points", value: "2.4k", icon: "security", color: "bg-brand-orange-soft text-brand-orange-text" },
    { label: "Messages", value: 2, icon: "message_header", color: "bg-black/[0.04] text-brand-charcoal" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
};
