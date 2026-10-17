"use client";

import React from "react";
import { ComingSoonPanel } from "@/app/components/Admin/ComingSoonPanel";

/**
 * Deal and push campaigns. The backend has no campaign model or endpoints,
 * so this page says so instead of listing sample campaigns.
 */
export default function MarketingCampaignsPage() {
  return (
    <div className="flex flex-col gap-6">
      <ComingSoonPanel
        illustration="promotions"
        title="Campaigns"
        description="This page will let you run deal campaigns: pick products, set a deal price and a start and end date, choose an audience and send a push or email announcement, then track reach and orders from each campaign. Campaigns don't exist in the backend yet, so there's nothing to schedule or report."
        needs={[
          "A campaign table (name, products, deal price or discount, audience, channel, start and end dates, status)",
          "Admin endpoints to create, schedule, pause and end campaigns",
          "Storefront pricing honouring an active deal, and orders recording which campaign they came from",
          "A sender for campaign push or email messages, with delivery counts",
        ]}
        related={[
          { label: "Products", href: "/admin/products" },
          { label: "Notifications", href: "/admin/notifications" },
        ]}
      />
    </div>
  );
}
