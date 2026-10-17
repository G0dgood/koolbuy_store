"use client";

import React from "react";
import { ComingSoonPanel } from "@/app/components/Admin/ComingSoonPanel";

/**
 * SMS templates. Notification kinds and their wording are defined in the
 * backend code, with no template table or endpoints, so they can't be edited
 * here yet.
 */
export default function SMSTemplatesPage() {
  return (
    <div className="flex flex-col gap-6">
      <ComingSoonPanel
        illustration="messages"
        title="SMS Templates"
        description="This page will let you edit the wording of each automatic text message (verification codes, order and delivery updates, payment reminders), insert tags like the order number, and turn individual messages on or off. Today the messages are written into the backend code, so there's nothing to edit here. You can see the messages that were actually sent in the notifications log."
        needs={[
          "A template table for SMS (notification kind, message body, enabled)",
          "Admin endpoints to list, edit and toggle SMS templates",
          "The SMS sender reading the stored template and filling in its tags",
        ]}
        related={[{ label: "Notifications", href: "/admin/notifications" }]}
      />
    </div>
  );
}
