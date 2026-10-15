"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../Icon";

export interface MessageData {
 id: string;
 sender: string;
 avatar: string;
 subject: string;
 preview: string;
 time: string;
 isUnread: boolean;
}

const MOCK_MESSAGES: MessageData[] = [
 {
  id: "1",
  sender: "Alex (Supplier)",
  avatar: "/avatars/avatar=pic1.jpg",
  subject: "Order #8023 Updates",
  preview: "Can you confirm all dimensions before I approve the container? We need to finalize this before tomorrow.",
  time: "2m ago",
  isUnread: true,
 },
 {
  id: "2",
  sender: "TechStore Inc.",
  avatar: "/avatars/avatar=pic2.png",
  subject: "Shipping Tracking Number",
  preview: "Your tracking number is #9034211119. You can track this via our partnered logistics provider portal.",
  time: "1h ago",
  isUnread: true,
 },
 {
  id: "3",
  sender: "System",
  avatar: "icon:message_header",
  subject: "Welcome to the marketplace!",
  preview: "We're glad to have you. Explore new categories or configure your seller profile directly from settings.",
  time: "Yesterday",
  isUnread: false,
 },
 {
  id: "4",
  sender: "Design Studio Pro",
  avatar: "/avatars/avatar=pic3.png",
  subject: "Re: Branding Assets",
  preview: "Sounds good. We will update the spec sheet with the secondary colors and send over the PDF.",
  time: "Monday",
  isUnread: false,
 },
 {
  id: "5",
  sender: "Global Electronics",
  avatar: "/avatars/avatar=pic4.png",
  subject: "New Quote Responded",
  preview: "We have reviewed your request for quotation and the finalized pricing is attached in the dashboard.",
  time: "Last Week",
  isUnread: false,
 }
];

export const MessageFeed: React.FC = () => {
 const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

 const displayedMessages = activeTab === "all"
  ? MOCK_MESSAGES
  : MOCK_MESSAGES.filter(m => m.isUnread);

 // Framer motion variants for the container to stagger children
 const containerVariants = {
  hidden: { opacity: 0 },
  show: {
   opacity: 1,
   transition: { staggerChildren: 0.05 }
  }
 };

 // Variants for individual feed items
 const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
 };

 const TAB = "h-8 px-4 text-[14px] font-medium rounded-full transition-colors duration-200 cursor-pointer";

 return (
  <div className="w-full bg-white rounded-[22px] overflow-hidden flex flex-col">
   {/* Feed Toolbar */}
   <div className="px-5 py-4 md:px-6 border-b border-black/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4">
    <div className="flex gap-1 p-1 bg-black/[0.04] rounded-full">
     <button
      onClick={() => setActiveTab("all")}
      className={`${TAB} ${activeTab === 'all' ? 'bg-brand-orange text-white' : 'text-brand-charcoal hover:bg-black/[0.04]'}`}
     >
      All messages
     </button>
     <button
      onClick={() => setActiveTab("unread")}
      className={`${TAB} ${activeTab === 'unread' ? 'bg-brand-orange text-white' : 'text-brand-charcoal hover:bg-black/[0.04]'}`}
     >
      Unread
     </button>
    </div>

    <div className="relative w-full sm:w-64">
     <Icon name="search" size="sm" className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
     <input
      type="text"
      placeholder="Search messages..."
      className="w-full h-10 pl-11 pr-4 rounded-full bg-black/[0.04] border border-transparent outline-none transition-colors text-[14px] text-brand-charcoal placeholder:text-faint focus:bg-white focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15"
     />
    </div>
   </div>

   {/* Feed List Area */}
   <motion.div
    className="flex-1 w-full flex flex-col divide-y divide-black/[0.06] min-h-[400px]"
    variants={containerVariants}
    initial="hidden"
    animate="show"
   >
    <AnimatePresence mode="popLayout">
     {displayedMessages?.map((message) => {
      return (
       <motion.div
        key={message.id}
        variants={itemVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        layout
        className="pl-7 pr-5 py-4 sm:pl-8 sm:pr-6 sm:py-5 flex gap-4 bg-white hover:bg-black/[0.02] transition-colors duration-200 cursor-pointer group relative"
       >
        {message.isUnread && (
         <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-orange" aria-label="Unread"></div>
        )}

        <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 bg-off-white">
         {message.avatar.startsWith("icon:") ? (
          <div className="w-full h-full bg-brand-orange-soft flex items-center justify-center text-brand-orange-text">
           <Icon name={message.avatar.replace("icon:", "")} size="sm" />
          </div>
         ) : (
          <Image src={message.avatar} alt={message.sender} width={48} height={48} className="w-full h-full object-cover" />
         )}
        </div>

        <div className="flex-1 flex flex-col min-w-0 gap-0.5">
         <div className="flex justify-between items-baseline gap-4">
          <span className={`text-[15px] truncate text-brand-charcoal ${message.isUnread ? 'font-semibold' : 'font-medium'}`}>
           {message.sender}
          </span>
          <span className={`text-[12px] whitespace-nowrap ${message.isUnread ? 'font-medium text-brand-orange-text' : 'text-faint'}`}>
           {message.time}
          </span>
         </div>

         <span className={`text-[14px] truncate ${message.isUnread ? 'font-medium text-brand-charcoal' : 'text-brand-charcoal'}`}>
          {message.subject}
         </span>

         <p className="text-[13px] text-subtle line-clamp-1 sm:line-clamp-2 leading-relaxed">
          {message.preview}
         </p>
        </div>

        <div className="hidden sm:flex flex-col justify-center items-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
         <button className="w-8 h-8 rounded-full text-faint hover:text-error hover:bg-error-soft transition-colors flex items-center justify-center cursor-pointer">
          <Icon name="delete" size="sm" />
         </button>
        </div>
       </motion.div>
      )
     })}
     {displayedMessages.length === 0 && (
      <motion.div
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
       className="py-16 flex flex-col items-center justify-center gap-4 text-center w-full col-span-full"
      >
       <div className="w-16 h-16 bg-off-white rounded-full flex items-center justify-center text-faint">
        <Icon name="message_header" size="md" />
       </div>
       <p className="text-[17px] font-semibold text-brand-charcoal">No messages found.</p>
      </motion.div>
     )}
    </AnimatePresence>
   </motion.div>
  </div>
 );
};
