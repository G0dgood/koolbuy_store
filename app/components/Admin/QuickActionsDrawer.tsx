"use client";

import React from "react";
import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";

export interface QuickAction {
  id: string;
  label: string;
  description?: string;
  icon: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface QuickActionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  actions: QuickAction[];
}

export function QuickActionsDrawer({ 
  isOpen, 
  onClose, 
  title, 
  actions 
}: QuickActionsDrawerProps) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={title} width="max-w-md">
      <div className="flex flex-col gap-2 pb-8">
        <p className="text-[12px] font-medium text-subtle px-1 mb-2">Available actions</p>
        
        <div className="flex flex-col gap-1">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => {
                action.onClick();
                onClose();
              }}
              className={`flex items-center gap-4 p-4 rounded-lg transition-all group hover:bg-off-white text-left border border-transparent hover:border-light-gray ${
                action.variant === "danger" ? "hover:bg-error-soft/50 hover:border-error/20" : ""
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                action.variant === "danger" 
                  ? "bg-error-soft text-error group-hover:bg-error group-hover:text-white" 
                  : "bg-brand-orange-soft text-brand-orange-text group-hover:bg-brand-charcoal group-hover:text-white"
              }`}>
                <Icon name={action.icon as any} size="sm" />
              </div>
              
              <div className="flex flex-col gap-0.5">
                <span className={`text-[13px] font-semibold tracking-tight ${
                  action.variant === "danger" ? "text-error" : "text-brand-charcoal"
                }`}>
                  {action.label}
                </span>
                {action.description && (
                  <span className="text-[11px] font-semibold text-faint group-hover:text-faint transition-colors">
                    {action.description}
                  </span>
                )}
              </div>
              
              <Icon 
                name="chevron_right" 
                size="xs" 
                className={`ml-auto opacity-0 group-hover:opacity-40 transition-all -translate-x-2 group-hover:translate-x-0 ${
                  action.variant === "danger" ? "text-error" : "text-brand-orange-text"
                }`} 
              />
            </button>
          ))}
        </div>
        
        {/* Help Tip */}
        <div className="mt-6 p-4 rounded-lg bg-off-white/50 border border-dashed border-light-gray">
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-white border border-light-gray flex items-center justify-center text-faint">
                <Icon name="help_outline" size="xs" />
             </div>
             <p className="text-[11px] font-semibold text-faint leading-relaxed italic">
                These actions are contextual to the active view. Exports are processed in background and notified once ready.
             </p>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
