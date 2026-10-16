"use client";

import React from "react";
import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";
import { Button } from "../Button";

interface TicketDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: any;
}

const priorityStyles = {
  Urgent: "text-rose-600 bg-rose-50 border-rose-100",
  High: "text-brand-orange-text bg-brand-orange-soft border-brand-orange/15",
  Medium: "text-brand-orange-text bg-brand-orange-soft border-brand-orange/15",
  Low: "text-emerald-600 bg-emerald-50 border-emerald-100",
};

export function TicketDetailDrawer({ isOpen, onClose, ticket }: TicketDetailDrawerProps) {
  if (!ticket) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Ticket Details" width="max-w-md">
      <div className="flex flex-col gap-8 pb-8">
        {/* Header Summary */}
        <div className="p-6 rounded-2xl bg-brand-charcoal text-white flex flex-col gap-4 shadow-lg shadow-brand-charcoal/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
             <Icon name="tabler_message" folder="dashboardIcon" size="lg" className="w-24 h-24" />
          </div>
          <div className="flex justify-between items-start relative z-10">
             <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-light-gray uppercase tracking-wider">Reference ID</span>
                <span className="text-sm font-bold text-white">{ticket.ticketId}</span>
             </div>
             <div className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border shadow-sm ${priorityStyles[ticket.priority as keyof typeof priorityStyles]}`}>
                {ticket.priority} Priority
             </div>
          </div>
          <div className="flex flex-col gap-1 relative z-10">
             <span className="text-[11px] font-bold text-light-gray uppercase tracking-wider">Subject</span>
             <h3 className="text-lg font-bold leading-tight">{ticket.subject}</h3>
          </div>
        </div>

        {/* Customer Information */}
        <div className="flex flex-col gap-4">
           <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1">Customer Profile</h4>
           <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-brand-orange-soft border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                 <img src={"https://ui-avatars.com/api/?name=" + ticket.customer} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col gap-0.5">
                 <span className="text-[13px] font-bold text-brand-charcoal">{ticket.customer}</span>
                 <span className="text-[11px] font-bold text-gray-400">#USR_023456789</span>
              </div>
              <button className="p-2 text-gray-400 hover:text-brand-orange-text transition-colors">
                 <Icon name="link-external" folder="dashboardIcon" size="sm" />
              </button>
           </div>
        </div>

        {/* Ticket Description / Messages */}
        <div className="flex flex-col gap-4">
           <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1">Ticket Conversation</h4>
           <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                 <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-none p-4 shadow-sm">
                    <p className="text-xs font-bold text-brand-charcoal leading-relaxed">
                       Hello support team, I'm having issues with my latest order. The status hasn't updated in three days though I've been charged. Please assist.
                    </p>
                 </div>
                 <span className="text-[11px] font-bold text-gray-400 pl-1">{ticket.activity}</span>
              </div>

              {/* Internal Note Tag */}
              <div className="flex items-center gap-2 border-l-4 border-amber-400 pl-3 py-1">
                 <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">Internal Note</span>
                    <p className="text-[11px] font-bold text-gray-500">System checked: Transaction verified, logistics delay detected.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Timeline Log */}
        <div className="flex flex-col gap-6">
           <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1">Case Timeline</h4>
           <div className="flex flex-col gap-8 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              <div className="relative flex flex-col gap-1">
                 <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-brand-orange border-2 border-white ring-4 ring-brand-orange/15"></div>
                 <span className="text-[12px] font-bold text-brand-charcoal">Last Activity Tracked</span>
                 <span className="text-[11px] font-bold text-gray-400">{ticket.activity}</span>
              </div>
              <div className="relative flex flex-col gap-1 opacity-60">
                 <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-gray-200 border-2 border-white"></div>
                 <span className="text-[12px] font-bold text-brand-charcoal">Ticket Assigned to Agent</span>
                 <span className="text-[11px] font-bold text-gray-400">1 hour ago</span>
              </div>
              <div className="relative flex flex-col gap-1 opacity-60">
                 <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-gray-200 border-2 border-white"></div>
                 <span className="text-[12px] font-bold text-brand-charcoal">Ticket Created</span>
                 <span className="text-[11px] font-bold text-gray-400">3 hours ago</span>
              </div>
           </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto pt-8 border-t border-gray-50 flex flex-col gap-3">
           <Button variant="primary" className="w-full h-9 sm:h-10 text-[11px] font-bold uppercase tracking-wider ">
              Reply to Customer
           </Button>
           <Button variant="outline" className="w-full h-9 sm:h-10 text-[11px] font-bold uppercase tracking-wider border-gray-200 text-gray-400 hover:text-brand-charcoal">
              Escalate Ticket
           </Button>
        </div>
      </div>
    </Drawer>
  );
}
