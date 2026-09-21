"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/Button";

export default function TaxSettingsPage() {
  const [vatRate, setVatRate] = useState("7.5");
  const [withholdingTax, setWithholdingTax] = useState("5.0");
  const [shippingTax, setShippingTax] = useState("0.0");

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Tax & Regulatory Settings</h1>
        <p className="text-xs text-gray-500 mt-1">
          Configure value-added tax (VAT), withholding tax, and custom regional tax rates.
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3">
          Default Tax Rates
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Value Added Tax (VAT %)
            </label>
            <input
              type="number"
              step="0.1"
              value={vatRate}
              onChange={(e) => setVatRate(e.target.value)}
              className="px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-blue"
            />
            <span className="text-[10px] text-gray-400">
              Standard Nigerian VAT rate (7.5% applied at checkout).
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Withholding Tax (WHT %)
            </label>
            <input
              type="number"
              step="0.1"
              value={withholdingTax}
              onChange={(e) => setWithholdingTax(e.target.value)}
              className="px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-blue"
            />
            <span className="text-[10px] text-gray-400">
              Applicable to vendor commission payouts.
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Shipping & Logistics Surcharge (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={shippingTax}
              onChange={(e) => setShippingTax(e.target.value)}
              className="px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-blue"
            />
            <span className="text-[10px] text-gray-400">
              Optional tax applied to freight and cold chain delivery.
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
          <Button variant="ghost" size="sm">
            Reset Defaults
          </Button>
          <Button size="sm" className="bg-brand-blue hover:bg-brand-blue/90 text-white shadow-xs">
            Save Tax Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
