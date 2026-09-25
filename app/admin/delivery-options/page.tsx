"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/app/components/Button";
import {
  HiOutlineTruck,
  HiOutlineMagnifyingGlass,
  HiOutlineCheckCircle,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineKey,
  HiOutlineGlobeAlt,
  HiOutlineCheck,
} from "react-icons/hi2";

/* =========================================================================
   TYPES
   ========================================================================= */

interface CredentialField {
  label: string;
  key: string;
  value: string;
  placeholder?: string;
  isSecret?: boolean;
}

interface DeliveryOption {
  id: string;
  name: string;
  hasSandbox: boolean;
  enabled: boolean;
  sandbox: boolean;
  description: string;
  credentials?: CredentialField[];
}

/* =========================================================================
   INITIAL DATA: 11 DELIVERY OPTIONS
   ========================================================================= */

const initialDeliveryOptions: DeliveryOption[] = [
  {
    id: "royo-dispatcher",
    name: "Royo Dispatcher",
    hasSandbox: false,
    enabled: true,
    sandbox: false,
    description:
      "Automated in-house fleet routing, driver dispatching, and live cold-chain telemetry.",
  },
  {
    id: "lalamove",
    name: "Lalamove",
    hasSandbox: true,
    enabled: true,
    sandbox: false,
    description:
      "On-demand citywide courier dispatch for instant 2-wheelers, vans, and reefer trucks.",
  },
  {
    id: "shiprocket",
    name: "ShipRocket",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    description:
      "Multi-carrier shipping aggregator with automated surface freight and airway bills.",
  },
  {
    id: "dunzo",
    name: "Dunzo",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    description:
      "Hyperlocal rapid point-to-point courier network with live package tracking.",
  },
  {
    id: "d4b-dunzo",
    name: "D4B Dunzo",
    hasSandbox: true,
    enabled: true,
    sandbox: true,
    description:
      "Dunzo for Business enterprise logistics gateway for high-volume automated dispatch.",
    credentials: [
      {
        label: "App URL",
        key: "appUrl",
        value: "https://apis-staging.dunzo.in/api",
        placeholder: "https://apis-staging.dunzo.in/api",
        isSecret: false,
      },
      {
        label: "Client ID",
        key: "clientId",
        value: "d4b_client_koolbuy_prod_982",
        placeholder: "Enter Client ID",
        isSecret: false,
      },
      {
        label: "Client Secret",
        key: "clientSecret",
        value: "d4b_sec_9281048102948291048291048291",
        placeholder: "Enter Client Secret",
        isSecret: true,
      },
    ],
  },
  {
    id: "roadie",
    name: "Roadie",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    description:
      "Crowdsourced nationwide delivery platform with same-day and scheduled drop-offs.",
  },
  {
    id: "ahoy",
    name: "Ahoy",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    description:
      "Cold-chain and heavy goods delivery management engine with turn-by-turn routing.",
  },
  {
    id: "shippo",
    name: "Shippo",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    description:
      "Multi-carrier shipping API for discounted rates, customs forms, and label generation.",
  },
  {
    id: "kwikapi",
    name: "KwikApi",
    hasSandbox: true,
    enabled: true,
    sandbox: false,
    description:
      "West African on-demand motorcycle and van logistics dispatch API.",
  },
  {
    id: "borzoe",
    name: "Borzoe",
    hasSandbox: true,
    enabled: true,
    sandbox: true,
    description:
      "Same-day intracity courier service with automated dispatch webhooks.",
    credentials: [
      {
        label: "Api Token",
        key: "apiToken",
        value: "borzoe_token_live_839201948291048201948",
        placeholder: "Enter Api Token",
        isSecret: true,
      },
      {
        label: "Callback Token",
        key: "callbackToken",
        value: "borzoe_cb_9482019482019482",
        placeholder: "Enter Callback Token",
        isSecret: true,
      },
    ],
  },
  {
    id: "shipengine",
    name: "ShipEngine",
    hasSandbox: true,
    enabled: false,
    sandbox: true,
    description:
      "Enterprise multi-carrier shipping, rate shopping, and global address validation.",
  },
];

/* =========================================================================
   MAIN COMPONENT
   ========================================================================= */

export default function DeliveryOptionsPage() {
  const [options, setOptions] = useState<DeliveryOption[]>(
    initialDeliveryOptions,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "All" | "Enabled" | "Sandbox"
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

  // Toggle Delivery Enable
  const toggleOptionEnable = (id: string) => {
    setOptions((prev) =>
      prev.map((opt) => {
        if (opt.id === id) {
          const next = !opt.enabled;
          showToast(`${opt.name} ${next ? "Enabled" : "Disabled"}`);
          return { ...opt, enabled: next };
        }
        return opt;
      }),
    );
  };

  // Toggle Delivery Sandbox
  const toggleOptionSandbox = (id: string) => {
    setOptions((prev) =>
      prev.map((opt) => {
        if (opt.id === id) {
          const next = !opt.sandbox;
          showToast(
            `${opt.name} sandbox mode ${next ? "activated" : "deactivated"}`,
          );
          return { ...opt, sandbox: next };
        }
        return opt;
      }),
    );
  };

  // Update Credential value
  const handleUpdateCredential = (
    optionId: string,
    credKey: string,
    newValue: string,
  ) => {
    setOptions((prev) =>
      prev.map((opt) => {
        if (opt.id === optionId && opt.credentials) {
          return {
            ...opt,
            credentials: opt.credentials.map((c) =>
              c.key === credKey ? { ...c, value: newValue } : c,
            ),
          };
        }
        return opt;
      }),
    );
  };

  // Filtered Delivery Options
  const filteredOptions = useMemo(() => {
    return options.filter((opt) => {
      const matchesSearch =
        !searchQuery.trim() ||
        opt.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        opt.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim());

      if (!matchesSearch) return false;

      if (activeFilter === "Enabled") return opt.enabled;
      if (activeFilter === "Sandbox") return opt.sandbox;

      return true;
    });
  }, [options, searchQuery, activeFilter]);

  const enabledCount = options.filter((o) => o.enabled).length;
  const sandboxCount = options.filter((o) => o.sandbox).length;

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
              Delivery Options
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-blue-light text-brand-blue border border-[#00BCD4]/20">
              Logistics Integrations
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Configure automated courier dispatchers, hyperlocal delivery
            partners, and shipping aggregators
          </p> */}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search delivery options..."
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
            { id: "All", label: "All Delivery Options", count: options.length },
            { id: "Enabled", label: "Active Dispatchers", count: enabledCount },
            { id: "Sandbox", label: "Sandbox Testing", count: sandboxCount },
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
          <span>
            {enabledCount} of {options.length} dispatchers ready
          </span>
        </div>
      </div>

      {/* =========================================================================
          DELIVERY OPTIONS CARDS GRID
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOptions.map((opt) => (
          <div
            key={opt.id}
            className={`bg-white rounded-lg border transition-all duration-150 p-5 shadow-2xs hover:shadow-sm flex flex-col justify-between ${
              opt.enabled
                ? "border-gray-200"
                : "border-gray-200/60 bg-gray-50/40 opacity-80"
            }`}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                      opt.enabled
                        ? "bg-brand-blue-light border-[#00BCD4]/20 text-[#00BCD4]"
                        : "bg-gray-100 border-gray-200 text-gray-400"
                    }`}
                  >
                    <HiOutlineTruck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                      {opt.name}
                    </h3>
                    <span className="text-[10px] text-gray-400 font-medium">
                      Courier & Logistics
                    </span>
                  </div>
                </div>

                {opt.enabled && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                {opt.description}
              </p>

              {/* Toggles Box: Enable & Sandbox */}
              <div className="bg-gray-50/70 p-3.5 rounded-lg border border-gray-100 flex flex-col gap-2.5 mb-4">
                {/* Enable Switch */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">
                    Enable
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={opt.enabled}
                      onChange={() => toggleOptionEnable(opt.id)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00BCD4]" />
                  </label>
                </div>

                {/* Sandbox Switch */}
                {opt.hasSandbox && (
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-gray-600">
                        Sandbox
                      </span>
                      {opt.sandbox && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 font-mono">
                          TEST MODE
                        </span>
                      )}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={opt.sandbox}
                        onChange={() => toggleOptionSandbox(opt.id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
                    </label>
                  </div>
                )}
              </div>

              {/* Specific Credential Fields (e.g. D4B Dunzo, Borzoe) */}
              {opt.credentials && opt.credentials.length > 0 && (
                <div className="flex flex-col gap-2.5 pt-2 border-t border-gray-100 mb-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <HiOutlineKey className="w-3.5 h-3.5 text-[#00BCD4]" />
                    <span>Configuration Parameters</span>
                  </span>

                  {opt.credentials.map((cred) => {
                    const fieldUniqueKey = `${opt.id}-${cred.key}`;
                    const isSecretVisible = showSecretMap[fieldUniqueKey];

                    return (
                      <div key={cred.key} className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold text-gray-700">
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
                            placeholder={cred.placeholder}
                            onChange={(e) =>
                              handleUpdateCredential(
                                opt.id,
                                cred.key,
                                e.target.value,
                              )
                            }
                            className="w-full text-xs font-mono px-3 py-2 pr-8 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                          />
                          {cred.isSecret && (
                            <button
                              type="button"
                              onClick={() => toggleShowSecret(fieldUniqueKey)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
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

            {/* Bottom Status Footer */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 mt-2">
              <span className="flex items-center gap-1">
                {opt.enabled ? (
                  <>
                    <HiOutlineCheck className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-600 font-medium">
                      Ready for dispatch
                    </span>
                  </>
                ) : (
                  <span>Disabled</span>
                )}
              </span>
              <span className="font-mono">
                {opt.hasSandbox ? "Sandbox Supported" : "Production Only"}
              </span>
            </div>
          </div>
        ))}

        {filteredOptions.length === 0 && (
          <div className="col-span-full bg-white rounded-lg p-12 text-center border border-gray-100">
            <HiOutlineTruck className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-700">
              No delivery options found
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Try refining your search keyword above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
