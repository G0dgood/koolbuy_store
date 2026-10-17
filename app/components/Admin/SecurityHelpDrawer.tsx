"use client";

import React from "react";
import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";
import { Button } from "../Button";

interface SecurityHelpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SecurityHelpDrawer({ isOpen, onClose }: SecurityHelpDrawerProps) {
  const helpItems = [
    {
      title: "Password Complexity",
      description: "Passwords must be at least 12 characters long and include a mix of uppercase letters, numbers, and special symbols (@, #, $, etc.).",
      icon: "lock",
    },
    {
      title: "Two-Factor Authentication",
      description: "Enable 2FA in your account settings to add an extra layer of security. This requires a code from your mobile device to log in.",
      icon: "verified_user",
    },
    {
      title: "Session Governance",
      description: "Administrative sessions expire after 30 minutes of inactivity. Ensure you save your changes frequently to avoid data loss.",
      icon: "security",
    },
    {
      title: "Account Recovery",
      description: "If you lose access to your primary email, contact the Super Admin immediately to trigger a manual identity verification process.",
      icon: "vpn_key",
    },
  ];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Security & Access Help">
      <div className="flex flex-col h-full gap-8">
        <div className="flex items-center gap-4 p-5 bg-brand-orange-soft/50 border border-brand-orange/15 rounded-lg">
           <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center text-brand-orange-text shrink-0">
              <Icon name="live_help" folder="icon" size="sm" />
           </div>
           <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-semibold text-brand-charcoal">Need immediate assistance?</span>
              <span className="text-[11px] font-medium text-brand-orange-text leading-tight">Our security team is available 24/7 for account emergencies.</span>
           </div>
        </div>

        <div className="flex flex-col gap-2">
           <p className="text-[12px] font-medium text-subtle border-b border-light-gray pb-2 px-2 mb-2">
              Security Guidelines
           </p>
           <div className="flex flex-col gap-3">
              {helpItems.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-lg hover:bg-off-white transition-all group">
                   <div className="mt-1 w-8 h-8 rounded-lg bg-white border border-light-gray flex items-center justify-center text-faint group-hover:text-brand-orange-text group-hover:border-brand-charcoal/20 transition-all shrink-0">
                      <Icon name={item.icon} folder="icon" size="xs" />
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[12px] font-semibold text-brand-charcoal group-hover:text-brand-orange-text transition-colors">{item.title}</span>
                      <span className="text-[11px] font-medium text-faint leading-relaxed">{item.description}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="mt-auto flex flex-col gap-3 pb-8">
           <Button 
            variant="primary" 
            className="w-full h-9 sm:h-10 text-[12px] font-semibold"
            onClick={() => {
              console.log("Escalating to support...");
              onClose();
            }}
           >
              Message security team
           </Button>
           <p className="text-[12px] font-medium text-subtle text-center">
              Response time: ~5 minutes
           </p>
        </div>
      </div>
    </Drawer>
  );
}
