"use client";

import React from "react";
import { ComingSoonPanel } from "@/app/components/Admin/ComingSoonPanel";

/**
 * Reasons. Cancel, refund and decline reasons are fixed in the backend code
 * (or typed as free text); there's no reasons table or endpoint, so this page
 * says so instead of listing samples.
 */
export default function ReasonsManagementPage() {
  return (
    <div className="flex flex-col gap-6">
      <ComingSoonPanel
        illustration="documents"
        title="Reasons Management"
        description="This page will let you manage the reasons people pick from when they cancel an order, ask for a refund or return, or when a vendor declines an order, so the lists stay consistent and reportable. These reasons aren't stored as a list in the backend yet; they're fixed in code or typed in as free text."
        needs={[
          "A reasons table (reason text, type: cancel, refund, return, vendor decline or delivery delay, status)",
          "Admin endpoints to add, edit and deactivate reasons",
          "Cancel, refund and decline flows offering the active reasons and saving the one chosen",
        ]}
        related={[
          { label: "Refunds", href: "/admin/refunds" },
          { label: "Orders", href: "/admin/orders" },
        ]}
      />
    </div>
  );
}
