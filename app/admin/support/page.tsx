"use client";

import React from "react";
import { ComingSoonPanel } from "@/app/components/Admin/ComingSoonPanel";

/**
 * Support tickets. The backend has no ticket model; customer enquiries come in
 * through the public contact form (POST /contact/) and by email for now.
 */
export default function SupportPage() {
  return (
    <div className="flex flex-col gap-6">
      <ComingSoonPanel
        illustration="messages"
        title="Support"
        description="This page will collect customer and vendor support tickets in one place: assign them, reply in a thread, set priority and status, and track response times. There's no ticket system in the backend yet. For now, enquiries arrive by email and through the store's contact form."
        needs={[
          "A ticket table (customer or vendor, subject, related order, priority, status, assignee)",
          "A message thread per ticket, with replies sent to the customer by email",
          "The contact form creating a ticket instead of only sending an email",
          "Admin endpoints to list, assign, reply to and close tickets",
        ]}
        related={[
          { label: "Customers", href: "/admin/customers" },
          { label: "Orders", href: "/admin/orders" },
        ]}
      />
    </div>
  );
}
