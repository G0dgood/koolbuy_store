"use client";

import React from "react";
import Image from "next/image";

export const ProductFeatureGallery: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-6 sm:gap-8 md:gap-10">
      {/* 5-Line Product Parameters Section */}
      <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
          Product Parameters:
        </h3>
        <div className="flex flex-col gap-2.5 text-xs sm:text-sm text-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="font-bold text-gray-900 min-w-36 sm:min-w-44">
              Model:
            </span>
            <span className="text-gray-600">
              219L Thermocool Inverter Solar Freezer
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="font-bold text-gray-900 min-w-36 sm:min-w-44">
              Capacity:
            </span>
            <span className="text-gray-600">219 Litres</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="font-bold text-gray-900 min-w-36 sm:min-w-44">
              Battery Spec:
            </span>
            <span className="text-gray-600">
              24V 60Ah Lithium (LiFePO4) Battery
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="font-bold text-gray-900 min-w-36 sm:min-w-44">
              Solar Panels:
            </span>
            <span className="text-gray-600">
              2 x 600W Monocrystalline Panels
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="font-bold text-gray-900 min-w-36 sm:min-w-44">
              Charge Controller:
            </span>
            <span className="text-gray-600">
              40V PWM Intelligent Controller
            </span>
          </div>
        </div>
      </div>

      {/* 1. Giant Main Showcase Card (Almost Fullscreen) */}
      <div className="w-full relative overflow-hidden min-h-120 sm:min-h-155 lg:min-h-195 xl:min-h-215 flex items-center justify-center">
        <div className="relative w-full h-full min-h-110 sm:min-h-140 lg:min-h-175 xl:min-h-195">
          <Image
            src="/images/koolboks/KOOLBOKS+538L+PLUS+PANEL+1920x800.png"
            alt="Koolboks Solar Freezer with Solar Panel System"
            fill
            className="object-contain p-2 sm:p-4"
            priority
            sizes="(max-width: 1440px) 100vw, 1440px"
          />
        </div>
      </div>

      {/* Feature 1 Header (After first image, before second image) */}
      <div className="text-center py-3 sm:py-5 max-w-3xl mx-auto px-4">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FF7A00]">
          Ultra-Powerful Inverter Compressor
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mt-1.5 mb-2.5">
          Instant Deep Freezing & Consistent Cold
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Powered by a high-efficiency DC inverter compressor, this solar
          freezer delivers rapid sub-zero cooling across all storage compartments,
          keeping food fresh and ice-solid without power fluctuations or grid
          dependency.
        </p>
      </div>

      {/* 2. Large Secondary Feature Showcase Cards */}
      <div className="w-full flex flex-col gap-6 sm:gap-8 md:gap-10">
        {/* Wide Showcase Card */}
        <div className="w-full relative overflow-hidden min-h-75 sm:min-h-105 lg:min-h-130 flex items-center justify-center">
          <div className="relative w-full h-full min-h-65 sm:min-h-90 lg:min-h-115">
            <Image
              src="/images/koolboks/SCANFROST+-+600L+ALONE+1920+X+800.png"
              alt="Scanfrost Solar Inverter Freezer"
              fill
              className="object-contain p-2 sm:p-4"
              sizes="(max-width: 1440px) 100vw, 1440px"
            />
          </div>
        </div>

        {/* Feature 2 Header (Before the third showcase) */}
        <div className="text-center py-3 sm:py-5 max-w-3xl mx-auto px-4">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FF7A00]">
            Smart Inverter Technology
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mt-1.5 mb-2.5">
            Optimal Freezing & Energy Efficiency
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Advanced inverter compressor automatically adapts to cooling
            demands, optimizing solar power usage while keeping perishables
            frozen for up to 4 days during sunless periods.
          </p>
        </div>

        {/* 2-Column Split Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <div className="w-full relative overflow-hidden min-h-80 sm:min-h-105 lg:min-h-120 flex items-center justify-center p-4 sm:p-6">
            <div className="relative w-full h-full min-h-70 sm:min-h-90 lg:min-h-105">
              <Image
                src="/images/koolboks/THERMOCOOL+-+519L+ALONE+1920+x+800.png"
                alt="Thermocool Solar Deep Freezer"
                fill
                className="object-contain p-2 sm:p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="w-full relative overflow-hidden min-h-80 sm:min-h-105 lg:min-h-120 flex items-center justify-center p-4 sm:p-6">
            <div className="relative w-full h-full min-h-70 sm:min-h-90 lg:min-h-105">
              <Image
                src="/images/koolboks/items/3.webp"
                alt="200L AC/DC Inverter Solar Freezer"
                fill
                className="object-contain p-4 sm:p-6"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

