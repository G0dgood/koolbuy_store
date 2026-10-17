"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { Button } from "../Button";
import { Radio } from "../Form/Radio";
import { Icon } from "../Icon";
import { Textarea } from "../Form/Inputs";

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: string, reason: string) => void;
  target: any;
}

export const UpdateRefundStatusModal: React.FC<UpdateStatusModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  target,
}) => {
  const [selectedStatus, setSelectedStatus] = useState("Completed");
  const [reason, setReason] = useState("");

  if (!target) return null;

  const isBulk = !!target.count;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Update Refund Status"
    >
      <div className="flex flex-col gap-8 py-4">
        {/* Target Info */}
        <div className="bg-off-white border border-light-gray rounded-lg p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-white border border-light-gray flex items-center justify-center text-brand-orange-text">
            <Icon name={isBulk ? "users" : "cached"} folder={isBulk ? "dashboardIcon" : "icon"} size="md" />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-medium text-subtle">Target selection</span>
            <span className="text-sm font-semibold text-brand-charcoal">
              {isBulk ? `${target.count} Refund Requests` : `Refund for ${target.name}`}
            </span>
          </div>
        </div>

        {/* Status Selection */}
        <div className="flex flex-col gap-4">
          <label className="text-[12px] font-medium text-subtle px-1">Select new status</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setSelectedStatus("Completed")}
              className={`w-full p-4 rounded-lg border-2 transition-all cursor-pointer flex flex-col gap-3
                 ${selectedStatus === "Completed" ? "border-success bg-success-soft/30" : "border-light-gray bg-white hover:border-light-gray"}
               `}
            >
              <div className="w-full flex  items-center justify-between">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedStatus === "Completed" ? "bg-success text-white" : "bg-off-white text-faint"}`}>
                  <Icon name="verified" folder="icon" size="xs" />
                </div>
                <Radio
                  checked={selectedStatus === "Completed"}
                  onChange={() => setSelectedStatus("Completed")}
                  activeColor="#10b981" // emerald-500
                  className="w-auto"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-brand-charcoal">Approve</span>
                <p className="text-[11px] font-medium text-faint">Refund funds to customer</p>
              </div>
            </div>

            <div
              onClick={() => setSelectedStatus("Canceled")}
              className={`w-full p-4 rounded-lg border-2 transition-all cursor-pointer flex flex-col gap-3
                 ${selectedStatus === "Canceled" ? "border-error bg-error-soft/30" : "border-light-gray bg-white hover:border-light-gray"}
               `}
            >
              <div className="w-full flex items-center justify-between">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedStatus === "Canceled" ? "bg-error text-white" : "bg-off-white text-faint"}`}>
                  <Icon name="Delete" folder="dashboardIcon" size="xs" />
                </div>
                <Radio
                  checked={selectedStatus === "Canceled"}
                  onChange={() => setSelectedStatus("Canceled")}
                  activeColor="#f43f5e" // rose-500
                  className="w-auto"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-brand-charcoal">Reject</span>
                <p className="text-[11px] font-medium text-faint">Deny refund request</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Reason */}
        <div className="flex flex-col gap-4">
          <label className="text-[12px] font-medium text-subtle px-1">Internal feedback (optional)</label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Provide a reason for this status update..."
            className="!rounded-lg !bg-off-white !border-light-gray placeholder:text-faint text-sm font-medium"
            style={{ minHeight: '96px' }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t border-light-gray">
          <Button
            variant="ghost"
            className="flex-1 h-9 text-[12px] font-semibold text-faint"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-2 h-9 text-[12px] font-semibold"
            onClick={() => {
              onConfirm(selectedStatus, reason);
              onClose();
            }}
          >
            Confirm status update
          </Button>
        </div>
      </div>
    </Modal>
  );
};
