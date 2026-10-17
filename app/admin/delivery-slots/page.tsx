"use client";

import React from "react";
import { ComingSoonPanel } from "@/app/components/Admin/ComingSoonPanel";

/**
 * Delivery slots. The store backend has no delivery slot model or endpoints;
 * delivery is arranged through the KoolLogistics app, so this page says so
 * instead of listing sample slots.
 */
export default function DeliverySlotsPage() {
  return (
    <div className="flex flex-col gap-6">
      <ComingSoonPanel
        illustration="delivery"
        title="Delivery Slots"
        description="This page will let you set the delivery time windows shoppers can pick at checkout, per area and day, with a cap on how many orders each window takes. The store has no delivery slots yet; deliveries are scheduled and priced in the KoolLogistics app, not here."
        needs={[
          "A delivery slot table (area, day, time window, order capacity, status)",
          "Admin endpoints to create, edit and close slots",
          "Checkout offering open slots and saving the chosen slot on the order",
          "The slot being passed to KoolLogistics when the delivery is booked",
        ]}
        related={[
          { label: "Logistics", href: "/admin/logistics" },
          { label: "Service area", href: "/admin/service-area" },
        ]}
      />
    </div>
  );
}
