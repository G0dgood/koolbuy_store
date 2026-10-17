"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { Button } from "../Button";
import { Select } from "../Form/Select";
import { Textarea } from "../Form/Inputs";
import { Icon } from "../Icon";

interface UpdateTicketStatusModalProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: (status: string, note: string) => void;
   ticket: any;
}

const statusOptions = [
   { value: "Open", label: "Open" },
   { value: "Pending", label: "Pending" },
   { value: "Resolved", label: "Resolved" },
];

export const UpdateTicketStatusModal: React.FC<UpdateTicketStatusModalProps> = ({
   isOpen,
   onClose,
   onConfirm,
   ticket,
}) => {
   const [selectedStatus, setSelectedStatus] = useState(ticket?.status || "Open");
   const [note, setNote] = useState("");

   if (!ticket) return null;

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         size="sm"
         title="Update Ticket Status"
      >
         <div className="flex flex-col gap-8 py-2">
            {/* Ticket Context */}
            <div className="flex items-center gap-3 p-4 bg-off-white rounded-lg border border-light-gray">
               <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-brand-orange-text border border-light-gray">
                  <Icon name="ticket" folder="dashboardIcon" size="sm" />
               </div>
               <div className="flex flex-col">
                  <span className="text-[12px] font-medium text-subtle">Updating ticket</span>
                  <span className="text-sm font-semibold text-brand-charcoal">{ticket.ticketId}</span>
               </div>
            </div>

            {/* Status Selection */}
            <div className="flex flex-col gap-3">
               <label className="text-[12px] font-medium text-subtle px-1">Select status</label>
               <Select
                  options={statusOptions}
                  value={selectedStatus}
                  onChange={(val) => setSelectedStatus(val as string)}
                  className="!w-full"
               />
            </div>

            {/* Resolution Note */}
            <div className="flex flex-col gap-3">
               <label className="text-[12px] font-medium text-subtle px-1">Internal note / resolution</label>
               <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Provide context for this status change..."
                  style={{ minHeight: '100px' }}
               />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-light-gray">
               <Button variant="ghost" className="flex-1 h-9 text-[12px] font-semibold text-faint" onClick={onClose}>
                  Cancel
               </Button>
               <Button
                  variant="primary"
                  className="flex-2 h-9 text-[12px] font-semibold"
                  onClick={() => {
                     onConfirm(selectedStatus, note);
                     onClose();
                  }}
               >
                  Update status
               </Button>
            </div>
         </div>
      </Modal>
   );
};
