"use client";

import React from "react";
import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";
import { Button } from "../Button";

interface RefundDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  refund: any;
  onUpdateStatus?: () => void;
}

const statusStyles = {
  Completed: { color: "text-success", bg: "bg-success", lightBg: "bg-success-soft" },
  Canceled: { color: "text-error", bg: "bg-error", lightBg: "bg-error-soft" },
  Pending: { color: "text-brand-orange-text", bg: "bg-brand-orange", lightBg: "bg-brand-orange-soft" },
};

export function RefundDetailDrawer({ isOpen, onClose, refund, onUpdateStatus }: RefundDetailDrawerProps) {
  if (!refund) return null;

  const currentStatus = statusStyles[refund.status as keyof typeof statusStyles] || statusStyles.Pending;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Refund Details" width="max-w-md">
      <div className="flex flex-col gap-8">
        {/* Core Summary */}
        <div className={`p-6 rounded-lg ${currentStatus.lightBg} border border-white/50 flex flex-col gap-4`}>
          <div className="flex justify-between items-start">
             <div className="flex flex-col gap-1">
                <span className="text-[12px] font-medium text-subtle">Refund ID</span>
                <span className="text-sm font-semibold text-brand-charcoal">{refund.refundId || "#RFD_98273645"}</span>
             </div>
             <div className={`px-3 py-1 rounded-full ${currentStatus.bg} text-white text-[11px] font-semibold`}>
                {refund.status}
             </div>
          </div>
          <div className="flex flex-col">
             <span className="text-[12px] font-medium text-subtle">Refund amount</span>
             <span className="text-3xl font-semibold text-brand-charcoal tracking-tight">{refund.total}</span>
          </div>
        </div>

        {/* Original Transaction */}
        <div className="flex flex-col gap-4">
           <h4 className="text-[12px] font-medium text-subtle px-1">Original transaction</h4>
           <div className="bg-white border border-light-gray rounded-lg p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-off-white border border-light-gray flex items-center justify-center p-2">
                 <Icon name="Payment Card" folder="dashboardIcon" size="md" />
              </div>
              <div className="flex-1 flex flex-col gap-0.5">
                 <span className="text-[13px] font-semibold text-brand-charcoal">Transaction #TXN_00234</span>
                 <span className="text-[11px] font-semibold text-faint">Total: ₦45,000 via {refund.method || "CC"}</span>
              </div>
           </div>
        </div>

        {/* Customer Breakdown */}
        <div className="flex flex-col gap-4">
           <h4 className="text-[12px] font-medium text-subtle px-1">Customer details</h4>
           <div className="bg-white border border-light-gray rounded-lg p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-orange-soft border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                 <img src={refund.image || "https://ui-avatars.com/api/?name=" + refund.name} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col gap-0.5">
                 <span className="text-[13px] font-semibold text-brand-charcoal">{refund.name}</span>
                 <span className="text-[11px] font-semibold text-faint text-brand-orange-text">{refund.custId}</span>
              </div>
              <button className="p-2 text-faint hover:text-brand-orange-text transition-colors">
                 <Icon name="link-external" folder="dashboardIcon" size="sm" />
              </button>
           </div>
        </div>

        {/* Reason */}
        <div className="flex flex-col gap-4">
           <h4 className="text-[12px] font-medium text-subtle px-1">Refund reason</h4>
           <div className="bg-off-white border border-light-gray rounded-lg p-4">
              <p className="text-xs font-semibold text-brand-charcoal leading-relaxed">
                 {refund.reason || "Customer requested cancellation due to delayed shipping."}
              </p>
           </div>
        </div>

        {/* Timeline */}
        <div className="flex flex-col gap-6">
           <h4 className="text-[12px] font-medium text-subtle px-1">Refund timeline</h4>
           <div className="flex flex-col gap-8 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-off-white">
              <div className="relative flex flex-col gap-1">
                 <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-brand-orange border-2 border-white ring-4 ring-brand-orange/15"></div>
                 <span className="text-[12px] font-semibold text-brand-charcoal">Refund Processed</span>
                 <span className="text-[11px] font-semibold text-faint">Just now • 10:15 AM</span>
              </div>
              <div className="relative flex flex-col gap-1 opacity-60">
                 <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-light-gray border-2 border-white"></div>
                 <span className="text-[12px] font-semibold text-brand-charcoal">Refund Authorized</span>
                 <span className="text-[11px] font-semibold text-faint">{refund.date} • 09:30 AM</span>
              </div>
              <div className="relative flex flex-col gap-1 opacity-60">
                 <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-light-gray border-2 border-white"></div>
                 <span className="text-[12px] font-semibold text-brand-charcoal">Request Submitted</span>
                 <span className="text-[11px] font-semibold text-faint">{refund.date} • 08:45 AM</span>
              </div>
           </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto pt-8 border-t border-light-gray flex flex-col gap-3">
           <Button 
              variant="primary" 
              className="w-full h-9 sm:h-10 text-[12px] font-semibold"
              onClick={onUpdateStatus}
           >
              Update refund status
           </Button>
           <Button variant="outline" className="w-full h-9 sm:h-10 text-[12px] font-semibold border-light-gray text-faint hover:text-brand-charcoal">
              Generate refund receipt
           </Button>
        </div>
      </div>
    </Drawer>
  );
}
