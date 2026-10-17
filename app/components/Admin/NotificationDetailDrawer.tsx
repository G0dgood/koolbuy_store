"use client";

import React from "react";
import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { useRouter } from "next/navigation";

interface NotificationDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notification: any;
}

const typeStyles = {
  Orders: { icon: "Cart", color: "text-brand-orange-text", bg: "bg-brand-orange-soft", action: "/admin/orders", label: "Manage Order" },
  Stock: { icon: "inventory_2", color: "text-warning", bg: "bg-warning/10", action: "/admin/products", label: "Inventory Management" },
  Security: { icon: "security", color: "text-error", bg: "bg-error-soft", action: "/admin/roles", label: "View Audit Log" },
};

export function NotificationDetailDrawer({ isOpen, onClose, notification }: NotificationDetailDrawerProps) {
  const router = useRouter();

  if (!notification) return null;

  const style = typeStyles[notification.type as keyof typeof typeStyles] || typeStyles.Security;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Event Audit Details" width="max-w-md">
      <div className="flex flex-col h-full gap-8">
        <div className="flex flex-col gap-8">
           {/* Notification Header Card */}
           <div className={`p-8 rounded-lg ${style.bg} border-2 border-white flex flex-col items-center text-center gap-4`}>
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center bg-white ${style.color}`}>
                 <Icon 
                    name={style.icon} 
                    folder={notification.type === 'Orders' ? 'dashboardIcon' : 'icon'} 
                    size="md" 
                 />
              </div>
              <div className="flex flex-col gap-1">
                 <h2 className="text-xl font-semibold text-brand-charcoal tracking-tight">{notification.title}</h2>
                 <span className={`text-[11px] font-semibold ${style.color}`}>
                    {notification.type} Event
                 </span>
              </div>
           </div>

           {/* Event Breakdown */}
           <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                 <h4 className="text-[12px] font-medium text-subtle px-1">Detailed log message</h4>
                 <div className="bg-off-white/50 rounded-lg border border-light-gray p-5">
                    <p className="text-sm font-semibold text-brand-charcoal leading-relaxed">
                       {notification.description}
                    </p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col gap-2">
                    <h4 className="text-[12px] font-medium text-subtle px-1">Audited actor</h4>
                    <div className="bg-white border border-light-gray rounded-lg p-3 flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-brand-orange-soft flex items-center justify-center">
                          <Icon name="user-profile-circle" folder="dashboardIcon" size="xs" className="text-brand-orange-text" />
                       </div>
                       <span className="text-[11px] font-semibold text-brand-charcoal truncate">{notification.actor}</span>
                    </div>
                 </div>
                 <div className="flex flex-col gap-2">
                    <h4 className="text-[12px] font-medium text-subtle px-1">Timestamp</h4>
                    <div className="bg-white border border-light-gray rounded-lg p-3 flex items-center gap-2 text-faint">
                       <Icon name="info-circle" folder="dashboardIcon" size="xs" />
                       <span className="text-[11px] font-semibold">{notification.time}</span>
                    </div>
                 </div>
              </div>

              {/* Resolution Status */}
              <div className="flex flex-col gap-2">
                 <h4 className="text-[12px] font-medium text-subtle px-1">Management status</h4>
                 <div className="bg-white border border-light-gray rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className={`w-2 h-2 rounded-full ${notification.isRead ? 'bg-medium-gray' : 'bg-brand-charcoal animate-pulse'}`}></div>
                       <span className="text-xs font-semibold text-subtle">{notification.isRead ? 'Archived / Read' : 'Unresolved Event'}</span>
                    </div>
                    {!notification.isRead && (
                       <button className="text-[11px] font-semibold text-brand-orange-text hover:underline">Mark resolved</button>
                    )}
                 </div>
              </div>
           </div>
        </div>

        {/* Action Suite */}
        <div className="mt-auto pt-8 border-t border-light-gray flex flex-col gap-3">
           <Button 
              variant="primary" 
              className="w-full h-10 text-[12px] font-semibold"
              onClick={() => {
                 router.push(style.action);
                 onClose();
              }}
           >
              {style.label}
           </Button>
           <Button 
              variant="ghost" 
              className="w-full h-10 text-[12px] font-semibold text-faint hover:text-error transition-colors"
              onClick={onClose}
           >
              Dismiss details
           </Button>
        </div>
      </div>
    </Drawer>
  );
}
