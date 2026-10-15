"use client";

import React from "react";
import { Icon } from "../Icon";

const ProductDescription = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5 max-w-[800px]">
        <p className="text-subtle text-[15px] md:text-[16px] leading-relaxed">
          Engineered for Nigerian off-grid resilience and unstable grid environments. The Thermocool Inverter Solar Freezer utilizes ice-bank thermal storage and high-efficiency DC inverter compression to maintain freezing temperatures for up to 72 hours without continuous power.
        </p>

        <table className="w-full border-collapse text-[14px] md:text-[15px]">
          <tbody>
            {[
              { label: "Voltage Input", value: "24V DC / 220–240V AC (Automatic Switchover)" },
              { label: "Insulation", value: "80mm High-Density Cyclopentane Foam" },
              { label: "Refrigerant", value: "R600a Eco-friendly Gas" },
              { label: "Autonomy Retention", value: "Up to 72 Hours Ice-Bank Cold Storage" },
              { label: "Solar Compatibility", value: "2 x 600W Monocrystalline PV Panels" },
              { label: "Battery Chemistry", value: "24V 60Ah Lithium Iron Phosphate (LiFePO4)" },
              { label: "Warranty", value: "3 Years Compressor & Solar System Warranty" },
            ].map((row, idx) => (
              <tr key={idx} className="border-b border-light-gray last:border-0">
                <td className="text-subtle py-3.5 pr-4 w-44 md:w-60 align-top">{row.label}</td>
                <td className="text-brand-charcoal font-medium py-3.5">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Feature List */}
      <div className="flex flex-col gap-3">
        {[
          "Zero-bills solar direct drive operation with automatic night battery backup",
          "Low voltage protection (LVD) and smart surge safeguard against power fluctuations",
          "Fast freeze mode with rapid ice formation capability within 4 hours",
          "Digital temperature controller with exterior LED display and lockable lid",
        ].map((feature, idx) => (
          <div key={idx} className="flex items-center gap-3 text-[14px] md:text-[15px] text-brand-charcoal">
            <span className="w-5 h-5 rounded-full bg-success-soft text-success flex items-center justify-center shrink-0"><Icon name="check" size="xs" /></span>
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export { ProductDescription };
