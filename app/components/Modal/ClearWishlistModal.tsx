"use client";

import React from "react";
import Modal from "./Modal";
import { Button } from "../Button";
import { Icon } from "../Icon";

interface ClearWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

export const ClearWishlistModal: React.FC<ClearWishlistModalProps> = ({
  isOpen,
  onClose,
  onClear,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title="Clear Wishlist"
    >
      <div className="flex flex-col items-center text-center gap-6 py-4">
        <div className="w-16 h-16 bg-error-soft rounded-full flex items-center justify-center text-error">
          <Icon name="delete_outline" size="lg" />
        </div>
        
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-brand-charcoal">Are you sure?</h3>
          <p className="text-sm text-faint leading-relaxed px-4">
            This will permanently remove all items from your wishlist. This action cannot be undone.
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 mt-2">
          <Button 
            className="w-full h-10 font-semibold bg-error hover:bg-error/90 text-white border-transparent" 
            onClick={() => {
              onClear();
              onClose();
            }}
          >
            Clear All Items
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
