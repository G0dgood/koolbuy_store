"use client";

import React from "react";
import { ComingSoonPanel } from "@/app/components/Admin/ComingSoonPanel";

/**
 * Email templates. Notification kinds and their wording are defined in the
 * backend code, with no template table or endpoints, so they can't be edited
 * here yet.
 */
export default function EmailTemplatesPage() {
  return (
    <div className="flex flex-col gap-6">
      <ComingSoonPanel
        illustration="messages"
        title="Email Templates"
        description="This page will let you edit the subject and wording of each automatic email (sign-up, order updates, payment receipts and so on), insert tags like the customer's name, and turn individual emails on or off. Today the emails and their wording are written into the backend code, so there's nothing to edit here. You can see the emails that were actually sent in the notifications log."
        needs={[
          "A template table (notification kind, subject, body, enabled)",
          "Admin endpoints to list, edit and toggle templates",
          "The email sender reading the stored template and filling in its tags",
        ]}
        related={[{ label: "Notifications", href: "/admin/notifications" }]}
      />
    </div>
  );
}
