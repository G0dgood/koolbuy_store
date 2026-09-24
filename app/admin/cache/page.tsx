"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/Button";
import {
  HiOutlineServerStack,
  HiOutlineTrash,
  HiOutlineArrowPath,
  HiOutlineCheckCircle,
  HiOutlineBolt,
  HiOutlineCircleStack,
  HiOutlineHome,
  HiOutlineSquares2X2,
  HiOutlineBuildingStorefront,
  HiOutlineCube,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";

/* =========================================================================
   TYPES
   ========================================================================= */

interface CacheModuleItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  redisKey: string;
  ttl: string;
  icon: React.ComponentType<{ className?: string }>;
}

/* =========================================================================
   INITIAL MODULE CACHE DATA
   ========================================================================= */

const initialModules: CacheModuleItem[] = [
  {
    id: "home-page-cache",
    name: "Home Page Cache",
    description: "Enable cache will cache the home page data in redis.",
    enabled: true,
    redisKey: "koolbuy:home:data",
    ttl: "1 Hour (3600s)",
    icon: HiOutlineHome,
  },
  {
    id: "catalog-product-cache",
    name: "Catalog & Product Cache",
    description:
      "Enable cache will cache product details, pricing, solar variants, and inventory stock in redis.",
    enabled: true,
    redisKey: "koolbuy:catalog:products",
    ttl: "30 Mins (1800s)",
    icon: HiOutlineCube,
  },
  {
    id: "category-listing-cache",
    name: "Category Listing Cache",
    description:
      "Enable cache will cache category trees, filter counts, and appliance classifications in redis.",
    enabled: true,
    redisKey: "koolbuy:categories:tree",
    ttl: "2 Hours (7200s)",
    icon: HiOutlineSquares2X2,
  },
  {
    id: "vendor-store-cache",
    name: "Vendor Store Cache",
    description:
      "Enable cache will cache merchant profiles, operating hours, and storefront listings in redis.",
    enabled: false,
    redisKey: "koolbuy:vendors:storefront",
    ttl: "1 Hour (3600s)",
    icon: HiOutlineBuildingStorefront,
  },
  {
    id: "search-query-cache",
    name: "Search Query Cache",
    description:
      "Enable cache will cache customer search queries, typeahead suggestions, and popular tags in redis.",
    enabled: true,
    redisKey: "koolbuy:search:queries",
    ttl: "15 Mins (900s)",
    icon: HiOutlineMagnifyingGlass,
  },
];

export default function CacheControlPage() {
  const [modules, setModules] = useState<CacheModuleItem[]>(initialModules);
  const [clearingKey, setClearingKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle Module Enable
  const toggleModuleEnable = (id: string) => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id === id) {
          const nextState = !mod.enabled;
          showToast(`${mod.name} ${nextState ? "Enabled" : "Disabled"}`);
          return { ...mod, enabled: nextState };
        }
        return mod;
      }),
    );
  };

  // Clear specific module cache
  const handleClearModuleCache = (mod: CacheModuleItem) => {
    setClearingKey(mod.id);
    setTimeout(() => {
      setClearingKey(null);
      showToast(`Flushed Redis keys for ${mod.name}!`);
    }, 600);
  };

  // Flush all Redis cache
  const handleFlushAllRedis = () => {
    setClearingKey("all");
    setTimeout(() => {
      setClearingKey(null);
      showToast("Flushed all Redis cache keys successfully!");
    }, 800);
  };

  const enabledCount = modules.filter((m) => m.enabled).length;

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
              Cache Control
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-blue-light text-brand-blue border border-[#00BCD4]/20">
              Redis Performance
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Manage application memory caching, Redis key invalidations, and
            module-specific caching rules
          </p> */}
        </div>

        <Button
          variant="primary"
          shape="rounded-sm"
          className="bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 text-xs font-semibold px-4 py-2 cursor-pointer shadow-xs"
          onClick={handleFlushAllRedis}
          disabled={clearingKey !== null}
        >
          {clearingKey === "all" ? (
            <HiOutlineArrowPath className="w-4 h-4 animate-spin" />
          ) : (
            <HiOutlineTrash className="w-4 h-4" />
          )}
          <span>Flush All Redis Cache</span>
        </Button>
      </div>

      {/* Redis Server Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Redis Status
            </span>
            <HiOutlineServerStack className="w-4 h-4 text-[#00BCD4]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-lg font-black text-gray-900">Connected</p>
          </div>
          <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">
            Port: 6379 (Redis 7.2)
          </span>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Memory Usage
            </span>
            <HiOutlineBolt className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-lg font-black text-gray-900">42.8 MB</p>
          <span className="text-[10px] text-purple-600 font-semibold">
            Peak allocation: 64 MB
          </span>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Cache Hit Ratio
            </span>
            <HiOutlineCircleStack className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg font-black text-gray-900">98.4%</p>
          <span className="text-[10px] text-emerald-600 font-semibold">
            Avg query latency: 1.2ms
          </span>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Active Modules
            </span>
            <HiOutlineCube className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-lg font-black text-gray-900">
            {enabledCount} of {modules.length}
          </p>
          <span className="text-[10px] text-gray-500 font-semibold">
            Modules caching in Redis
          </span>
        </div>
      </div>

      {/* =========================================================================
          MODULE-WISE CACHE MANAGEMENT CARD
          ========================================================================= */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-2xs overflow-hidden flex flex-col">
        {/* Card Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-blue-light border border-[#00BCD4]/20 text-[#00BCD4] flex items-center justify-center">
              <HiOutlineServerStack className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1D3557] uppercase tracking-wider">
                Module-wise Cache Management
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Enable or disable automated Redis caching per application module
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-gray-700 bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-2xs self-start sm:self-auto">
            {enabledCount} Modules Active
          </span>
        </div>

        {/* Modules List */}
        <div className="divide-y divide-gray-100">
          {modules.map((mod) => {
            const IconComponent = mod.icon;
            const isClearingThis = clearingKey === mod.id;

            return (
              <div
                key={mod.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
              >
                {/* Left: Info */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                      mod.enabled
                        ? "bg-brand-blue-light border-[#00BCD4]/20 text-[#00BCD4]"
                        : "bg-gray-100 border-gray-200 text-gray-400"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                        {mod.name}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                          mod.enabled
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                        }`}
                      >
                        {mod.enabled ? "Active" : "Disabled"}
                      </span>
                    </div>

                    {/* Exact requested copy: "Enable cache will cache the home page data in redis." */}
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {mod.description}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1 font-mono">
                      <span>Key: {mod.redisKey}</span>
                      <span>•</span>
                      <span>TTL: {mod.ttl}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Toggle Switch & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  {/* Purge Key Button */}
                  {mod.enabled && (
                    <Button
                      variant="outline"
                      shape="rounded-sm"
                      className="text-xs font-semibold px-2.5 py-1.5 border-gray-200 hover:border-rose-400 hover:text-rose-600 cursor-pointer"
                      onClick={() => handleClearModuleCache(mod)}
                      disabled={clearingKey !== null}
                      title="Flush this module's Redis keys"
                    >
                      {isClearingThis ? (
                        <HiOutlineArrowPath className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <HiOutlineTrash className="w-3.5 h-3.5" />
                      )}
                      <span>Flush</span>
                    </Button>
                  )}

                  {/* Enable Switch */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-700">
                      Enable
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={mod.enabled}
                        onChange={() => toggleModuleEnable(mod.id)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[#00BCD4]" />
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
