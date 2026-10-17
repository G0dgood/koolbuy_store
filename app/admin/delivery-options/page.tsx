"use client";

import React from "react";
import { ComingSoonPanel } from "@/app/components/Admin/ComingSoonPanel";

/**
 * Delivery options. The store backend has no courier or delivery option model;
 * delivery prices live in the KoolLogistics app, so this page says so instead
 * of showing sample options.
 */
export default function DeliveryOptionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <ComingSoonPanel
        illustration="delivery"
        title="Delivery Options"
        description="This page will let you choose which delivery methods shoppers see at checkout (standard, express, pickup), which courier handles each, and what each costs. The store doesn't have delivery options or couriers set up yet. Delivery prices are kept in the KoolLogistics app."
        needs={[
          "A delivery option table (name, courier, price or price rule, estimated days, status)",
          "Admin endpoints to create, edit and turn options on or off",
          "Checkout offering the active options and pricing them from KoolLogistics rates",
        ]}
        related={[
          { label: "Logistics", href: "/admin/logistics" },
          { label: "Service area", href: "/admin/service-area" },
        ]}
      />
    </div>
  );
}
