"use client";

import React from "react";
import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";

interface ReviewsMoreActionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onClearSpam?: () => void;
  onBulkApprove?: () => void;
  onExport?: () => void;
}

export function ReviewsMoreActionsDrawer({ 
  isOpen, 
  onClose, 
  onClearSpam, 
  onBulkApprove, 
  onExport 
}: ReviewsMoreActionsDrawerProps) {
  const actions = [
    {
      id: "export",
      title: "Export Feedback",
      description: "Download a comprehensive report of all customer reviews and ratings as a CSV file.",
      icon: "cloud_download",
      folder: "icon",
      onClick: () => {
        onClose();
        onExport?.();
      },
    },
    {
      id: "bulk-approve",
      title: "Bulk Approve Pending",
      description: "Automatically move all reviews in the 'Pending' queue to 'Published' status.",
      icon: "verified",
      folder: "icon",
      onClick: () => {
        onClose();
        onBulkApprove?.();
      },
    },
    {
      id: "clear-spam",
      title: "Clear Spam Queue",
      description: "Permanently delete all reviews currently flagged as Spam from the database.",
      icon: "delete_outline",
      folder: "icon",
      variant: "danger",
      onClick: () => {
        onClose();
        onClearSpam?.();
      },
    },
    {
      id: "sentiment",
      title: "Analyze Sentiment",
      description: "Run an AI-powered sentiment analysis across the latest 100 reviews.",
      icon: "description",
      folder: "icon",
      onClick: () => console.log("Running sentiment analysis..."),
    },
  ];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Reviews: More Actions">
      <div className="flex flex-col h-full gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-medium text-subtle px-4 mb-2">
            Moderation Tools
          </p>
          <div className="flex flex-col gap-1">
            {actions.map((action: any) => (
              <button
                key={action.id}
                onClick={action.onClick}
                className={`flex items-start gap-4 p-4 rounded-lg transition-all hover:bg-off-white group text-left
                  ${action.variant === "danger" ? "hover:bg-error-soft" : ""}
                `}
              >
                <div className={`mt-1 w-10 h-10 rounded-lg flex items-center justify-center transition-all
                  ${action.variant === "danger" 
                    ? "bg-error-soft text-error group-hover:bg-error-soft" 
                    : "bg-brand-orange-soft text-brand-orange-text group-hover:bg-brand-charcoal group-hover:text-white"}
                `}>
                  <Icon name={action.icon} folder={action.folder} size="sm" />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <span className={`text-[13px] font-semibold transition-colors
                    ${action.variant === "danger" ? "text-error" : "text-brand-charcoal"}
                  `}>
                    {action.title}
                  </span>
                  <span className="text-[11px] font-semibold text-faint leading-relaxed">
                    {action.description}
                  </span>
                </div>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  <Icon name="arrow_forward" folder="icon" size="xs" className="text-faint" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-5 bg-brand-charcoal rounded-lg border border-brand-charcoal overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
             <Icon name="verified" folder="icon" size="lg" className="text-white w-20 h-20" />
          </div>
          <div className="relative z-10 flex flex-col gap-3">
             <div className="w-10 h-10 rounded-lg bg-brand-orange/20 border border-brand-orange/20 flex items-center justify-center text-brand-orange">
                <Icon name="verified" folder="icon" size="sm" />
             </div>
             <div className="flex flex-col gap-1">
                <span className="text-[14px] font-semibold text-white">Trust & Moderation</span>
                <span className="text-[11px] font-medium text-light-gray/60 leading-relaxed">
                   Maintain a high-quality feedback loop. Keeping your reviews clean improves customer trust and SEO.
                </span>
             </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
