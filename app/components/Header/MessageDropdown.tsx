import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Icon } from "../Icon";
import { DropdownMenu, DropdownFooterAction } from "../Dropdown/DropdownMenu";

export const MessageDropdown: React.FC = () => {
  const router = useRouter();

  return (
    <div 
      className="absolute top-full right-1/2 translate-x-1/2 pt-4 z-50 cursor-default" 
      onClick={e => e.preventDefault()}
    >
      <DropdownMenu width={320} className="shadow-float border-light-gray p-0">
        <div className="px-4 py-3 border-b border-black/[0.06] flex justify-between items-center bg-off-white/50">
          <span className="font-semibold text-brand-charcoal text-sm">Messages</span>
          <span className="text-[11px] text-brand-orange-text bg-brand-orange-soft px-2 py-0.5 rounded-full font-semibold">2 New</span>
        </div>

        <div className="flex flex-col max-h-[320px] overflow-y-auto">
          {/* Notification 1 (Unread) */}
          <div className="px-4 py-3 hover:bg-black/[0.04] flex gap-3 cursor-pointer transition-colors border-b border-black/[0.06] last:border-0 relative">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-light-gray bg-white">
              <Image src="/avatars/avatar=pic1.jpg" alt="Avatar" width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col min-w-0 pr-4">
              <div className="flex justify-between items-start gap-2">
                <span className="text-sm font-semibold text-brand-charcoal truncate">Alex (Supplier)</span>
                <span className="text-[11px] text-faint whitespace-nowrap">2m ago</span>
              </div>
              <p className="text-xs text-brand-orange-text font-medium truncate mt-0.5">Can you confirm all dimensions...</p>
            </div>
            <div className="w-2 h-2 bg-brand-charcoal rounded-full absolute top-5 right-4 shadow-sm"></div>
          </div>

          {/* Notification 2 (Unread) */}
          <div className="px-4 py-3 hover:bg-black/[0.04] flex gap-3 cursor-pointer transition-colors border-b border-black/[0.06] last:border-0 relative">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-light-gray bg-white">
              <Image src="/avatars/avatar=pic2.png" alt="Avatar" width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col min-w-0 pr-4">
              <div className="flex justify-between items-start gap-2">
                <span className="text-sm font-semibold text-brand-charcoal truncate">TechStore Inc.</span>
                <span className="text-[11px] text-faint whitespace-nowrap">1h ago</span>
              </div>
              <p className="text-xs text-brand-orange-text font-medium truncate mt-0.5">Your tracking number is #9034...</p>
            </div>
            <div className="w-2 h-2 bg-brand-charcoal rounded-full absolute top-5 right-4 shadow-sm"></div>
          </div>

          {/* Notification 3 (Read) */}
          <div className="px-4 py-3 hover:bg-black/[0.04] flex gap-3 cursor-pointer transition-colors border-b border-black/[0.06] last:border-0 opacity-75">
            <div className="w-10 h-10 rounded-full bg-brand-orange-soft flex items-center justify-center flex-shrink-0 text-brand-orange-text">
              <Icon name="message_header" size="sm" />
            </div>
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex justify-between items-start gap-2">
                <span className="text-sm font-semibold text-brand-charcoal truncate">System</span>
                <span className="text-[11px] text-faint whitespace-nowrap">Yesterday</span>
              </div>
              <p className="text-xs text-faint font-medium truncate mt-0.5">Welcome to the marketplace!</p>
            </div>
          </div>
        </div>

        <DropdownFooterAction 
          label="View all messages" 
          onClick={() => router.push('/messages')} 
          icon="arrow_forward" 
        />
      </DropdownMenu>
    </div>
  );
};
