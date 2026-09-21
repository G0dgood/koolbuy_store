"use client";

import React from "react";
import { Button } from "@/app/components/Button";

const loyaltyPrograms = [
  {
    tier: "Gold VIP",
    pointsMultiplier: "2.0x Points",
    activeMembers: 142,
    discount: "5% Storewide",
    color: "from-amber-400 to-amber-600",
  },
  {
    tier: "Silver Preferred",
    pointsMultiplier: "1.5x Points",
    activeMembers: 580,
    discount: "3% Storewide",
    color: "from-slate-400 to-slate-600",
  },
  {
    tier: "Bronze Member",
    pointsMultiplier: "1.0x Points",
    activeMembers: 1820,
    discount: "Free Standard Shipping",
    color: "from-orange-400 to-orange-600",
  },
];

export default function LoyaltyCardsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Loyalty Cards & Rewards
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage customer membership tiers, reward points, and loyalty
            benefits.
          </p>
        </div>
        <Button
          size="sm"
          className="bg-brand-blue hover:bg-brand-blue/90 text-white shadow-xs"
        >
          + Create New Tier
        </Button>
      </div>

      {/* Program Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loyaltyPrograms.map((prog) => (
          <div
            key={prog.tier}
            className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs flex flex-col"
          >
            <div
              className={`p-6 bg-linear-to-br ${prog.color} text-white flex flex-col justify-between h-36`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-bold opacity-80">
                  Membership Card
                </span>
                <span className="text-xs font-black">KOOLBUY</span>
              </div>
              <div>
                <h3 className="text-lg font-black">{prog.tier}</h3>
                <span className="text-xs opacity-90">{prog.discount}</span>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Active Members</span>
                <span className="font-bold text-gray-900">
                  {prog.activeMembers}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Earning Rate</span>
                <span className="font-bold text-emerald-600">
                  {prog.pointsMultiplier}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  View Members
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
