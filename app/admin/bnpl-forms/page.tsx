"use client";

import React from "react";
import { ComingSoonPanel } from "@/app/components/Admin/ComingSoonPanel";

/**
 * BNPL application form builder. The financing application form is defined
 * in code; there's no form builder model or endpoint. Submitted financing
 * applications are real and live on the BNPL orders page.
 */
export default function BNPLFormsPage() {
  return (
    <div className="flex flex-col gap-6">
      <ComingSoonPanel
        illustration="documents"
        title="BNPL Forms"
        description="This page will let you change the pay-later application form without a code change: add or remove questions, mark fields as required, and choose which documents applicants must upload. The questions are fixed in the apps' code today, so there's nothing to edit here. Applications people have already submitted are on the BNPL orders page."
        needs={[
          "A form definition table (sections, fields, field types, required flags, document uploads)",
          "Admin endpoints to edit and publish a form version",
          "The application flow rendering the published form and saving answers against that version",
        ]}
        related={[{ label: "BNPL orders", href: "/admin/bnpl-orders" }]}
      />
    </div>
  );
}
