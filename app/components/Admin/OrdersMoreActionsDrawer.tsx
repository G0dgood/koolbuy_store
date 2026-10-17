"use client";

import React from "react";
import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { ConfirmationModal } from "./ConfirmationModal";
import { useState } from "react";

interface OrdersMoreActionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onBulkPrint: () => void;
}

export function OrdersMoreActionsDrawer({ isOpen, onClose, onBulkPrint }: OrdersMoreActionsDrawerProps) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const actions = [
    {
      title: "Export Orders",
      description: "Download current orders as CSV or PDF",
      icon: "cloud_download",
      folder: "icon",
      color: "text-brand-orange-text",
      bg: "bg-brand-orange-soft",
    },
    {
      title: "Bulk Status Update",
      description: "Change status for multiple orders at once",
      icon: "arrow-refresh-06",
      folder: "dashboardIcon",
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      title: "Print Packing Slips",
      description: "Generate and print slips for all pending orders",
      icon: "print",
      folder: "icon",
      color: "text-success",
      bg: "bg-success-soft",
    },
    {
      title: "Bulk Archive",
      description: "Move completed orders to archive storage",
      icon: "archive",
      folder: "icon",
      color: "text-subtle",
      bg: "bg-off-white",
    },
    {
      title: "Delete All Cancelled",
      description: "Permanently remove all cancelled orders",
      icon: "Delete",
      folder: "dashboardIcon",
      color: "text-error",
      bg: "bg-error-soft",
    },
  ];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="More Actions">
      <div className="flex flex-col gap-4">
        <p className="text-[12px] font-medium text-subtle mb-2 px-1">
          Available Operations
        </p>
        
        <div className="flex flex-col gap-2">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={() => {
                if (action.title === "Delete All Cancelled") {
                  setIsDeleteConfirmOpen(true);
                } else if (action.title === "Print Packing Slips") {
                  onBulkPrint();
                  onClose();
                } else {
                  console.log(`Triggering ${action.title}`);
                  onClose();
                }
              }}
              className="flex items-start gap-4 p-5 rounded-lg border border-light-gray hover:border-brand-charcoal/30 hover:bg-brand-charcoal/5 transition-all group text-left"
            >
              <div className={`w-10 h-10 rounded-lg ${action.bg} ${action.color} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}>
                <Icon name={action.icon} folder={action.folder as any} size="sm" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-brand-charcoal group-hover:text-brand-orange-text transition-colors">
                  {action.title}
                </span>
                <span className="text-[11px] font-semibold text-faint mt-1 leading-relaxed">
                  {action.description}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-light-gray">
          <Button 
            className="w-full h-10 text-[12px] font-semibold border border-light-gray text-faint hover:bg-off-white transition-all rounded-lg"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => {
          console.log("Bulk deleting cancelled orders...");
          setIsDeleteConfirmOpen(false);
          onClose();
        }}
        title="Delete Cancelled Orders"
        message="Are you sure you want to permanently remove all cancelled orders? This action cannot be undone."
        confirmText="Yes, delete all"
        type="danger"
      />
    </Drawer>
  );
}
