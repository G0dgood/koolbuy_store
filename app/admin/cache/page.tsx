"use client";

import React from "react";
import { ComingSoonPanel } from "@/app/components/Admin/ComingSoonPanel";

/**
 * Cache control. Caching is server configuration with no admin endpoint, so
 * this page says so instead of showing sample cache modules.
 */
export default function CacheControlPage() {
  return (
    <div className="flex flex-col gap-6">
      <ComingSoonPanel
        illustration="settings"
        title="Cache Control"
        description="This page will let you see which parts of the store are cached (home page, products, categories, vendor stores, search), turn each on or off, and clear a cache after a big change. Caching is currently set in the server's configuration, and there's no admin endpoint to read or clear it."
        needs={[
          "A list of cache areas the server exposes, with on or off state and time-to-live",
          "Admin endpoints to toggle a cache area and to clear one or all caches",
          "An audit log entry whenever a cache is cleared",
        ]}
        related={[
          { label: "Health", href: "/admin/health" },
          { label: "Audit logs", href: "/admin/audit-logs" },
        ]}
      />
    </div>
  );
}
