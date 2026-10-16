"use client";

import React from "react";
import Image from "next/image";

const parameters = [
  { label: "Model", value: "219L Thermocool Inverter Solar Freezer" },
  { label: "Capacity", value: "219 Litres" },
  { label: "Battery Spec", value: "24V 60Ah Lithium (LiFePO4) Battery" },
  { label: "Solar Panels", value: "2 x 600W Monocrystalline Panels" },
  { label: "Charge Controller", value: "40V PWM Intelligent Controller" },
];

/** Centered Apple-style feature headline: eyebrow, big title, calm subtitle. */
const FeatureHeader: React.FC<{ eyebrow: string; title: string; children: React.ReactNode }> = ({
  eyebrow,
  title,
  children,
}) => (
  <div className="text-center py-6 sm:py-10 max-w-3xl mx-auto px-4">
    <span className="text-[13px] font-semibold text-brand-orange-text">{eyebrow}</span>
    <h2 className="text-[24px] md:text-[36px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.1] mt-2 mb-4">
      {title}
    </h2>
    <p className="text-[17px] md:text-[19px] text-subtle leading-relaxed max-w-2xl mx-auto">{children}</p>
  </div>
);

const tile = "w-full relative overflow-hidden bg-white rounded-tile md:rounded-hero border border-light-gray flex items-center justify-center";

export const ProductFeatureGallery: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-4 md:gap-6">
      {/* Product parameters */}
      <div className="w-full bg-white rounded-tile md:rounded-hero border border-light-gray p-6 sm:p-8 md:p-10">
        <h3 className="text-[22px] md:text-[26px] font-semibold text-brand-charcoal tracking-[-0.02em] mb-4">
          Product parameters
        </h3>
        <dl className="flex flex-col text-[14px] md:text-[15px]">
          {parameters.map((row) => (
            <div
              key={row.label}
              className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3.5 border-t border-black/[0.06] first:border-t-0"
            >
              <dt className="text-subtle sm:w-56 shrink-0">{row.label}</dt>
              <dd className="text-brand-charcoal">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* 1. Main showcase */}
      <div className={`${tile} min-h-120 sm:min-h-155 lg:min-h-195 xl:min-h-215`}>
        <div className="relative w-full h-full min-h-110 sm:min-h-140 lg:min-h-175 xl:min-h-195">
          <Image
            src="/images/koolboks/KOOLBOKS+538L+PLUS+PANEL+1920x800.png"
            alt="Koolboks Solar Freezer with Solar Panel System"
            fill
            className="object-contain p-4 sm:p-8 mix-blend-multiply"
            priority
            sizes="(max-width: 1440px) 100vw, 1440px"
          />
        </div>
      </div>

      {/* Feature 1 */}
      <FeatureHeader eyebrow="Ultra-powerful inverter compressor" title="Instant deep freezing & consistent cold.">
        Powered by a high-efficiency DC inverter compressor, this solar
        freezer delivers rapid sub-zero cooling across all storage compartments,
        keeping food fresh and ice-solid without power fluctuations or grid
        dependency.
      </FeatureHeader>

      {/* 2. Secondary showcases */}
      <div className="w-full flex flex-col gap-4 md:gap-6">
        <div className={`${tile} min-h-75 sm:min-h-105 lg:min-h-130`}>
          <div className="relative w-full h-full min-h-65 sm:min-h-90 lg:min-h-115">
            <Image
              src="/images/koolboks/SCANFROST+-+600L+ALONE+1920+X+800.png"
              alt="Scanfrost Solar Inverter Freezer"
              fill
              className="object-contain p-4 sm:p-8 mix-blend-multiply"
              sizes="(max-width: 1440px) 100vw, 1440px"
            />
          </div>
        </div>

        {/* Feature 2 */}
        <FeatureHeader eyebrow="Smart inverter technology" title="Optimal freezing & energy efficiency.">
          Advanced inverter compressor automatically adapts to cooling
          demands, optimizing solar power usage while keeping perishables
          frozen for up to 4 days during sunless periods.
        </FeatureHeader>

        {/* Two-column showcases */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className={`${tile} min-h-80 sm:min-h-105 lg:min-h-120 p-4 sm:p-6`}>
            <div className="relative w-full h-full min-h-70 sm:min-h-90 lg:min-h-105">
              <Image
                src="/images/koolboks/THERMOCOOL+-+519L+ALONE+1920+x+800.png"
                alt="Thermocool Solar Deep Freezer"
                fill
                className="object-contain p-2 sm:p-4 mix-blend-multiply"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className={`${tile} min-h-80 sm:min-h-105 lg:min-h-120 p-4 sm:p-6`}>
            <div className="relative w-full h-full min-h-70 sm:min-h-90 lg:min-h-105">
              <Image
                src="/images/koolboks/items/3.webp"
                alt="200L AC/DC Inverter Solar Freezer"
                fill
                className="object-contain p-4 sm:p-6 mix-blend-multiply"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
