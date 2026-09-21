"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/app/components/Button";
import {
  HiOutlineCreditCard,
  HiOutlineMagnifyingGlass,
  HiOutlineCheckCircle,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineBuildingLibrary,
  HiOutlineArrowUpRight,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineKey,
  HiOutlineArrowPath,
} from "react-icons/hi2";

/* =========================================================================
   TYPES
   ========================================================================= */

interface CredentialField {
  label: string;
  key: string;
  value: string;
  isSecret?: boolean;
}

interface PaymentGateway {
  id: string;
  name: string;
  hasSandbox: boolean;
  enabled: boolean;
  sandbox: boolean;
  credentials?: CredentialField[];
  category?:
    | "Card / Wallet"
    | "Mobile Money"
    | "Bank Transfer"
    | "Regional"
    | "Manual / Cash";
}

interface PayoutOption {
  id: string;
  name: string;
  hasSandbox: boolean;
  enabled: boolean;
  sandbox: boolean;
}

/* =========================================================================
   INITIAL DATA: 65 PAYMENT GATEWAYS & OPTIONS
   ========================================================================= */

const initialGateways: PaymentGateway[] = [
  {
    id: "cash-on-delivery",
    name: "Cash On Delivery",
    hasSandbox: false,
    enabled: true,
    sandbox: false,
    category: "Manual / Cash",
  },
  {
    id: "paypal",
    name: "PayPal",
    hasSandbox: true,
    enabled: true,
    sandbox: true,
    category: "Card / Wallet",
  },
  {
    id: "stripe",
    name: "Stripe",
    hasSandbox: true,
    enabled: true,
    sandbox: false,
    credentials: [
      {
        label: "Secret Key",
        key: "secretKey",
        value: "sk_live_51P8291048KoolbuyStripeKeySecret",
        isSecret: true,
      },
      {
        label: "Publishable Key",
        key: "publishableKey",
        value: "pk_live_51P8291048KoolbuyStripeKeyPub",
        isSecret: false,
      },
    ],
    category: "Card / Wallet",
  },
  {
    id: "paystack",
    name: "Paystack",
    hasSandbox: true,
    enabled: true,
    sandbox: false,
    credentials: [
      {
        label: "Secret Key",
        key: "secretKey",
        value: "sk_live_48291048194820194820194820194820",
        isSecret: true,
      },
      {
        label: "Publishable Key",
        key: "publishableKey",
        value: "pk_live_48291048194820194820194820194820",
        isSecret: false,
      },
    ],
    category: "Card / Wallet",
  },
  {
    id: "payfast",
    name: "Payfast",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Card / Wallet",
  },
  {
    id: "mobbex",
    name: "Mobbex",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Regional",
  },
  {
    id: "yoco",
    name: "Yoco",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Card / Wallet",
  },
  {
    id: "paylink",
    name: "Paylink",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Card / Wallet",
  },
  {
    id: "razorpay",
    name: "Razorpay",
    hasSandbox: false,
    enabled: false,
    sandbox: false,
    category: "Card / Wallet",
  },
  {
    id: "gcash",
    name: "GCash",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Mobile Money",
  },
  {
    id: "simplify",
    name: "Simplify",
    hasSandbox: false,
    enabled: false,
    sandbox: false,
    category: "Card / Wallet",
  },
  {
    id: "square",
    name: "Square",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Card / Wallet",
  },
  {
    id: "ozow",
    name: "Ozow",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Bank Transfer",
  },
  {
    id: "pagarme",
    name: "Pagarme",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Regional",
  },
  {
    id: "checkout",
    name: "Checkout",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Card / Wallet",
  },
  {
    id: "authorize-net",
    name: "Authorize.net",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Card / Wallet",
  },
  {
    id: "stripe-fpx",
    name: "Stripe FPX",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Bank Transfer",
  },
  {
    id: "kongapay",
    name: "KongaPay",
    hasSandbox: false,
    enabled: false,
    sandbox: false,
    category: "Card / Wallet",
  },
  {
    id: "viva-wallet",
    name: "Viva Wallet",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Card / Wallet",
  },
  {
    id: "ccavenue",
    name: "CCAvenue",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Card / Wallet",
  },
  {
    id: "easypaisa",
    name: "Easypaisa",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Mobile Money",
  },
  {
    id: "cashfree",
    name: "Cashfree",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Card / Wallet",
  },
  {
    id: "payment-gateway-easebuzz",
    name: "PAYMENT GATEWAY - EASEBUZZ",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Card / Wallet",
  },
  {
    id: "toyyibpay",
    name: "Toyyibpay",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Regional",
  },
  {
    id: "paytab",
    name: "PayTab",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Regional",
  },
  {
    id: "vnpay",
    name: "VNPay",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Regional",
  },
  {
    id: "mpesa-vodafone",
    name: "Mpesa Vodafone",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Mobile Money",
  },
  {
    id: "flutter-wave",
    name: "Flutter Wave",
    hasSandbox: true,
    enabled: true,
    sandbox: false,
    credentials: [
      {
        label: "Public Key",
        key: "publicKey",
        value: "FLWPUBK-c79e5476f1e6f431e846ef75049855f0-X",
        isSecret: false,
      },
      {
        label: "Secret Key",
        key: "secretKey",
        value: "FLWSECK-8492019482910482019482019482019482019482019482",
        isSecret: true,
      },
      {
        label: "Encryption Key",
        key: "encryptionKey",
        value: "FLWENC-7382910482910482",
        isSecret: true,
      },
    ],
    category: "Card / Wallet",
  },
  {
    id: "payphone",
    name: "PayPhone",
    hasSandbox: false,
    enabled: false,
    sandbox: false,
    category: "Mobile Money",
  },
  {
    id: "braintree",
    name: "Braintree",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Card / Wallet",
  },
  {
    id: "windcave",
    name: "Windcave",
    hasSandbox: false,
    enabled: false,
    sandbox: false,
    category: "Card / Wallet",
  },
  {
    id: "paytech",
    name: "PayTech",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Regional",
  },
  {
    id: "mycash",
    name: "MyCash",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Mobile Money",
  },
  {
    id: "stripe-oxxo",
    name: "Stripe OXXO",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Manual / Cash",
  },
  {
    id: "offline-manual-payment",
    name: "Offline Manual Payment",
    hasSandbox: false,
    enabled: true,
    sandbox: false,
    category: "Manual / Cash",
  },
  {
    id: "stripe-ideal",
    name: "Stripe Ideal",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Bank Transfer",
  },
  {
    id: "userede",
    name: "Userede",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Regional",
  },
  {
    id: "open-pay",
    name: "Open-pay",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Card / Wallet",
  },
  {
    id: "direct-pay-online",
    name: "Direct Pay Online",
    hasSandbox: false,
    enabled: false,
    sandbox: false,
    category: "Card / Wallet",
  },
  {
    id: "unionbank-payments",
    name: "UnionBank Payments and Collections Solution",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Bank Transfer",
  },
  {
    id: "conekta",
    name: "Conekta",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Regional",
  },
  {
    id: "telr",
    name: "Telr",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Regional",
  },
  {
    id: "mastercard",
    name: "Mastercard",
    hasSandbox: true,
    enabled: true,
    sandbox: false,
    category: "Card / Wallet",
  },
  {
    id: "khalti",
    name: "Khalti",
    hasSandbox: false,
    enabled: false,
    sandbox: false,
    category: "Mobile Money",
  },
  {
    id: "mtn-momo",
    name: "Mtn Momo",
    hasSandbox: true,
    enabled: true,
    sandbox: false,
    category: "Mobile Money",
  },
  {
    id: "plugnpay",
    name: "plugnpay",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Card / Wallet",
  },
  {
    id: "azulpay",
    name: "Azulpay",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Regional",
  },
  {
    id: "payway",
    name: "Payway",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Regional",
  },
  {
    id: "skpcash",
    name: "SkpCash",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Regional",
  },
  {
    id: "nmi",
    name: "Nmi",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Card / Wallet",
  },
  {
    id: "yappy",
    name: "yappy",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Mobile Money",
  },
  {
    id: "data-trans",
    name: "Data Trans",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Card / Wallet",
  },
  {
    id: "opay",
    name: "O'Pay",
    hasSandbox: true,
    enabled: true,
    sandbox: false,
    category: "Mobile Money",
  },
  {
    id: "pesapal",
    name: "pesapal",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Regional",
  },
  {
    id: "powertrans",
    name: "powertrans",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Regional",
  },
  {
    id: "livee",
    name: "livee",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Card / Wallet",
  },
  {
    id: "pay-via-company",
    name: "Pay Via Company",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Bank Transfer",
  },
  {
    id: "mpesa-safari",
    name: "Mpesa Safari",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Mobile Money",
  },
  {
    id: "totalpay",
    name: "TotalPay",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Card / Wallet",
  },
  {
    id: "thawani",
    name: "Thawani",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Regional",
  },
  {
    id: "icici-upi",
    name: "Icici Upi",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Bank Transfer",
  },
  {
    id: "hitpay",
    name: "HitPay",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Card / Wallet",
  },
  {
    id: "cyber-source",
    name: "Cyber Source",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Card / Wallet",
  },
  {
    id: "orange-pay",
    name: "Orange Pay",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    category: "Mobile Money",
  },
  {
    id: "mono",
    name: "Mono",
    hasSandbox: true,
    enabled: true,
    sandbox: false,
    credentials: [
      {
        label: "Secret Key",
        key: "secretKey",
        value: "live_sk_rhxp7vqdgrmzbcpwuht8",
        isSecret: true,
      },
      {
        label: "Public Key",
        key: "publicKey",
        value: "live_pk_m8slmutsetzilop81ddy",
        isSecret: false,
      },
    ],
    category: "Bank Transfer",
  },
];

/* =========================================================================
   INITIAL DATA: PAYOUT OPTIONS
   ========================================================================= */

const initialPayoutOptions: PayoutOption[] = [
  {
    id: "payout-off-platform",
    name: "Off the Platform",
    hasSandbox: false,
    enabled: true,
    sandbox: false,
  },
  {
    id: "payout-stripe",
    name: "Stripe",
    hasSandbox: true,
    enabled: true,
    sandbox: false,
  },
  {
    id: "payout-pagarme",
    name: "Pagarme",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
  },
  {
    id: "payout-razorpay",
    name: "Razorpay",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
  },
];

/* =========================================================================
   MAIN COMPONENT
   ========================================================================= */

export default function PaymentOptionsPage() {
  const [gateways, setGateways] = useState<PaymentGateway[]>(initialGateways);
  const [payouts, setPayouts] = useState<PayoutOption[]>(initialPayoutOptions);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "All" | "Enabled" | "Sandbox" | "Payout"
  >("All");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSecretMap, setShowSecretMap] = useState<Record<string, boolean>>(
    {},
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleShowSecret = (fieldKey: string) => {
    setShowSecretMap((prev) => ({
      ...prev,
      [fieldKey]: !prev[fieldKey],
    }));
  };

  // Toggle Gateway Enable
  const toggleGatewayEnable = (id: string) => {
    setGateways((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const next = !g.enabled;
          showToast(`${g.name} ${next ? "Enabled" : "Disabled"}`);
          return { ...g, enabled: next };
        }
        return g;
      }),
    );
  };

  // Toggle Gateway Sandbox
  const toggleGatewaySandbox = (id: string) => {
    setGateways((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const next = !g.sandbox;
          showToast(
            `${g.name} sandbox mode ${next ? "activated" : "deactivated"}`,
          );
          return { ...g, sandbox: next };
        }
        return g;
      }),
    );
  };

  // Update Credential value
  const handleUpdateCredential = (
    gatewayId: string,
    credKey: string,
    newValue: string,
  ) => {
    setGateways((prev) =>
      prev.map((g) => {
        if (g.id === gatewayId && g.credentials) {
          return {
            ...g,
            credentials: g.credentials.map((c) =>
              c.key === credKey ? { ...c, value: newValue } : c,
            ),
          };
        }
        return g;
      }),
    );
  };

  // Toggle Payout Enable
  const togglePayoutEnable = (id: string) => {
    setPayouts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.enabled;
          showToast(`Payout method ${p.name} ${next ? "Enabled" : "Disabled"}`);
          return { ...p, enabled: next };
        }
        return p;
      }),
    );
  };

  // Toggle Payout Sandbox
  const togglePayoutSandbox = (id: string) => {
    setPayouts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.sandbox;
          showToast(
            `Payout method ${p.name} sandbox ${next ? "activated" : "deactivated"}`,
          );
          return { ...p, sandbox: next };
        }
        return p;
      }),
    );
  };

  // Filtered gateways
  const filteredGateways = useMemo(() => {
    return gateways.filter((g) => {
      const matchesSearch =
        !searchQuery.trim() ||
        g.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        g.category?.toLowerCase().includes(searchQuery.toLowerCase().trim());

      if (!matchesSearch) return false;

      if (activeFilter === "Enabled") return g.enabled;
      if (activeFilter === "Sandbox") return g.sandbox;
      if (activeFilter === "Payout") return false;

      return true;
    });
  }, [gateways, searchQuery, activeFilter]);

  // Filtered payouts
  const filteredPayouts = useMemo(() => {
    if (activeFilter === "Enabled") return payouts.filter((p) => p.enabled);
    if (activeFilter === "Sandbox") return payouts.filter((p) => p.sandbox);
    return payouts.filter(
      (p) =>
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()),
    );
  }, [payouts, searchQuery, activeFilter]);

  const enabledGatewaysCount = gateways.filter((g) => g.enabled).length;
  const enabledPayoutsCount = payouts.filter((p) => p.enabled).length;

  return (
    <div className="flex flex-col gap-6 mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#1D3557] text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <HiOutlineCheckCircle className="w-4 h-4 text-[#00BCD4]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          {/* <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Payment Options
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-blue-light text-brand-blue border border-[#00BCD4]/20">
              Payment Gateways & Payouts
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Configure online checkout payment methods, merchant API credentials,
            sandbox testing, and vendor payouts
          </p> */}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search payment gateway..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] shadow-2xs"
            />
            <HiOutlineMagnifyingGlass className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Quick Status Bar & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-lg border border-gray-100 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: "All", label: "All Payment Options", count: gateways.length },
            {
              id: "Enabled",
              label: "Enabled Gateways",
              count: enabledGatewaysCount,
            },
            {
              id: "Sandbox",
              label: "Sandbox Mode",
              count: gateways.filter((g) => g.sandbox).length,
            },
            { id: "Payout", label: "Payout Options", count: payouts.length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeFilter === tab.id
                  ? "bg-[#00BCD4] text-white shadow-xs"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] rounded-full font-semibold ${
                  activeFilter === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-2 text-xs font-medium text-gray-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{enabledGatewaysCount} active gateways</span>
          <span>•</span>
          <span>{enabledPayoutsCount} active payouts</span>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: PAYMENT GATEWAYS
          ========================================================================= */}
      {activeFilter !== "Payout" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#1D3557] uppercase tracking-wider flex items-center gap-2">
              <HiOutlineCreditCard className="w-4 h-4 text-[#00BCD4]" />
              <span>Payment Gateways ({filteredGateways.length})</span>
            </h2>
            <span className="text-xs text-gray-400">
              Toggle gateways to enable checkout acceptance
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGateways.map((gateway) => (
              <div
                key={gateway.id}
                className={`bg-white rounded-lg border transition-all duration-150 p-4 shadow-2xs hover:shadow-sm flex flex-col justify-between ${
                  gateway.enabled
                    ? "border-gray-200"
                    : "border-gray-200/60 bg-gray-50/40 opacity-80"
                }`}
              >
                <div>
                  {/* Top Bar: Title & Category */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-gray-900 tracking-tight truncate">
                          {gateway.name}
                        </h3>
                        {gateway.enabled && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active
                          </span>
                        )}
                      </div>
                      {gateway.category && (
                        <span className="text-[10px] text-gray-400 font-medium">
                          {gateway.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Toggle Controls: Enable & Sandbox */}
                  <div className="bg-gray-50/70 p-3 rounded-lg border border-gray-100 flex flex-col gap-2.5 mb-3">
                    {/* Enable Toggle */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700">
                        Enable
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={gateway.enabled}
                          onChange={() => toggleGatewayEnable(gateway.id)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#00BCD4]" />
                      </label>
                    </div>

                    {/* Sandbox Toggle */}
                    {gateway.hasSandbox && (
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-gray-600">
                            Sandbox
                          </span>
                          {gateway.sandbox && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 font-mono">
                              TEST MODE
                            </span>
                          )}
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={gateway.sandbox}
                            onChange={() => toggleGatewaySandbox(gateway.id)}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-amber-500" />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Credentials Section (if present) */}
                  {gateway.credentials && gateway.credentials.length > 0 && (
                    <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 mb-2">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <HiOutlineKey className="w-3 h-3 text-[#00BCD4]" />
                        <span>API Credentials</span>
                      </span>

                      {gateway.credentials.map((cred) => {
                        const fieldUniqueKey = `${gateway.id}-${cred.key}`;
                        const isSecretVisible = showSecretMap[fieldUniqueKey];

                        return (
                          <div key={cred.key} className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold text-gray-600">
                              {cred.label}
                            </label>
                            <div className="relative">
                              <input
                                type={
                                  cred.isSecret && !isSecretVisible
                                    ? "password"
                                    : "text"
                                }
                                value={cred.value}
                                onChange={(e) =>
                                  handleUpdateCredential(
                                    gateway.id,
                                    cred.key,
                                    e.target.value,
                                  )
                                }
                                className="w-full text-xs font-mono px-2.5 py-1.5 pr-8 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#00BCD4] text-gray-800"
                              />
                              {cred.isSecret && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleShowSecret(fieldUniqueKey)
                                  }
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                                >
                                  {isSecretVisible ? (
                                    <HiOutlineEyeSlash className="w-3.5 h-3.5" />
                                  ) : (
                                    <HiOutlineEye className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 mt-2">
                  <span>
                    {gateway.enabled ? "Live on checkout" : "Disabled"}
                  </span>
                  <span className="font-mono">
                    {gateway.hasSandbox
                      ? "Sandbox Supported"
                      : "Production Only"}
                  </span>
                </div>
              </div>
            ))}

            {filteredGateways.length === 0 && (
              <div className="col-span-full bg-white rounded-lg p-12 text-center border border-gray-100">
                <HiOutlineCreditCard className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-700">
                  No payment gateways found
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try refining your search keyword above
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 2: PAYOUT OPTIONS
          ========================================================================= */}
      {(activeFilter === "All" || activeFilter === "Payout") && (
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <div>
              <h2 className="text-sm font-bold text-[#1D3557] uppercase tracking-wider flex items-center gap-2">
                <HiOutlineBuildingLibrary className="w-4 h-4 text-[#00BCD4]" />
                <span>Payout Options ({filteredPayouts.length})</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Enable disbursement channels for vendor payout requests,
                automated settlements, and commissions
              </p>
            </div>
            <span className="text-xs font-bold text-gray-700 bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-2xs">
              {enabledPayoutsCount} of {payouts.length} Enabled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredPayouts.map((payout) => (
              <div
                key={payout.id}
                className={`bg-white rounded-lg border p-4 shadow-2xs flex flex-col justify-between ${
                  payout.enabled
                    ? "border-gray-200"
                    : "border-gray-200/60 bg-gray-50/40 opacity-80"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                      {payout.name}
                    </h3>
                    {payout.enabled && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="bg-gray-50/70 p-3 rounded-lg border border-gray-100 flex flex-col gap-2.5">
                    {/* Enable Toggle */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700">
                        Enable
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={payout.enabled}
                          onChange={() => togglePayoutEnable(payout.id)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#00BCD4]" />
                      </label>
                    </div>

                    {/* Sandbox Toggle */}
                    {payout.hasSandbox && (
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-gray-600">
                            Sandbox
                          </span>
                          {payout.sandbox && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 font-mono">
                              TEST
                            </span>
                          )}
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={payout.sandbox}
                            onChange={() => togglePayoutSandbox(payout.id)}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-amber-500" />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 mt-3">
                  <span>{payout.enabled ? "Active Payout" : "Disabled"}</span>
                  <span className="font-mono">
                    {payout.hasSandbox ? "Sandbox Mode" : "Direct"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
