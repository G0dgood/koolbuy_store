"use client";

import React from "react";
import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";

interface ProductsMoreActionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onArchiveOutOfStock: () => void;
}

export function ProductsMoreActionsDrawer({ isOpen, onClose, onArchiveOutOfStock }: ProductsMoreActionsDrawerProps) {
  const actions = [
    {
      id: "export",
      title: "Export Catalog",
      description: "Download your entire product list as a CSV or Excel file for external auditing.",
      icon: "cloud_download",
      folder: "icon",
      onClick: () => console.log("Exporting catalog..."),
    },
    {
      id: "sync",
      title: "Auto-Sync Stock",
      description: "Synchronize inventory levels with your connected warehouse management system.",
      icon: "arrow-refresh-06",
      folder: "dashboardIcon",
      onClick: () => console.log("Syncing stock..."),
    },
    {
      id: "archive",
      title: "Archive Out of Stock",
      description: "Automatically move all products with 0 units to the 'Draft' archive.",
      icon: "archive",
      folder: "icon",
      variant: "danger",
      onClick: () => {
        onClose();
        onArchiveOutOfStock();
      },
    },
    {
      id: "pricing",
      title: "Bulk Price Adjustment",
      description: "Apply a percentage-based discount or markup across all selected categories.",
      icon: "verified_user",
      folder: "icon",
      onClick: () => console.log("Opening price adjustment tool..."),
    },
  ];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Products: More Actions">
      <div className="flex flex-col h-full gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-medium text-subtle px-4 mb-2">
            Catalog Integrity
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
            <Icon name="star" folder="icon" size="lg" className="text-white w-20 h-20" />
          </div>
          <div className="relative z-10 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-orange/20 border border-brand-orange/20 flex items-center justify-center text-brand-orange">
              <Icon name="verified" folder="icon" size="sm" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-semibold text-white">Pro Inventory Management</span>
              <span className="text-[11px] font-medium text-light-gray/60 leading-relaxed">
                Maintain a healthy catalog by archiving inactive items and syncing stock levels daily.
              </span>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
