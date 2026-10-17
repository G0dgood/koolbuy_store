"use client";

import React from "react";
import Modal from "./Modal";
import { Button } from "../Button";
import { Icon } from "../Icon";

interface ClearCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

export const ClearCartModal: React.FC<ClearCartModalProps> = ({
  isOpen,
  onClose,
  onClear,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title="Clear Cart"
    >
      <div className="flex flex-col items-center text-center gap-6 py-4">
        <div className="w-16 h-16 bg-error-soft rounded-full flex items-center justify-center text-error border border-error/10">
          <Icon name="delete_outline" size="lg" />
        </div>
        
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold text-brand-charcoal leading-tight">Clear your cart?</h3>
          <p className="text-sm text-faint font-medium leading-relaxed px-4">
            Are you sure you want to remove all items from your cart? This action cannot be undone.
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 mt-4">
          <Button 
            className="w-full h-10 font-semibold bg-error hover:bg-error/90 text-white border-transparent transition-colors" 
            onClick={() => {
              onClear();
              onClose();
            }}
          >
            Yes, clear all items
          </Button>
          <Button 
            variant="ghost"
            className="w-full h-9 font-semibold text-faint hover:text-subtle hover:bg-black/[0.04]" 
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
