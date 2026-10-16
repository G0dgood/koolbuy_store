"use client";

import React from "react";
import Modal from "./Modal";
import { FloatingInput } from "../Form";
import { Button } from "../Button";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin?: () => void;
}

/* Apple-store style pieces (DESIGN.md §7, §13), as in AuthModal. The ! keeps these
   ahead of the shared input's and Modal header's own classes. */
const TITLE = "text-[22px]! md:text-[24px]! font-semibold! text-brand-charcoal! tracking-[-0.02em]! leading-tight";
const FIELD =
  "h-12! rounded-xl! border-black/[0.12]! px-4! text-[15px]! text-brand-charcoal! transition-colors focus:border-brand-orange! focus:ring-4! focus:ring-brand-orange/15!";

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onBackToLogin,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title="Reset password"
      className={TITLE}
    >
      <div className="flex flex-col gap-6 py-2">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-[15px] text-subtle leading-relaxed">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <FloatingInput
            className={FIELD}
            label="Email address"
            placeholder="example@gmail.com"
            type="email"
          />
        </div>

        <Button
          variant="accent"
          shape="pill"
          fullWidth
          className="h-10 text-[13px]!"
          size="lg"
          onClick={() => {
            // Logic for sending reset link would go here
            console.log("Reset link sent");
          }}
        >
          Send reset link
        </Button>

        {onBackToLogin && (
          <p className="text-center text-[14px] text-subtle">
            Remember your password?{" "}
            <button
              onClick={onBackToLogin}
              className="text-brand-orange-text font-medium hover:underline cursor-pointer"
            >
              Back to login
            </button>
          </p>
        )}
      </div>
    </Modal>
  );
};
