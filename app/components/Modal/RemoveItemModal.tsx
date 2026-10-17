"use client";

import React from "react";
import Modal from "./Modal";
import { Button } from "../Button";
import { Icon } from "../Icon";

interface RemoveItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productTitle?: string;
}

export const RemoveItemModal: React.FC<RemoveItemModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  productTitle,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title="Remove from Wishlist"
    >
      <div className="flex flex-col items-center text-center gap-6 py-4">
        <div className="w-16 h-16 bg-error-soft rounded-full flex items-center justify-center text-error">
          <Icon name="delete_outline" size="lg" />
        </div>
        
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-brand-charcoal">Remove this item?</h3>
          <p className="text-sm text-faint leading-relaxed px-4">
            Are you sure you want to remove <span className="font-semibold text-subtle">"{productTitle}"</span> from your wishlist?
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 mt-2">
          <Button 
            className="w-full h-10 font-semibold bg-error hover:bg-error/90 text-white border-transparent" 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Remove Item
          </Button>
          <Button 
            variant="ghost"
            className="w-full h-9 font-semibold text-faint hover:text-subtle" 
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
