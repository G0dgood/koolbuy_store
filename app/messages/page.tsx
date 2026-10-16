import React from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { MessageFeed } from "../components/Messages/MessageFeed";

export const metadata = {
  title: "Messages | Storefront",
  description: "View and manage your conversations",
};

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-off-white flex flex-col font-inter">
      <Header />

      <div className="flex-1 w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-8 md:py-12 flex flex-col gap-8 md:gap-10">
        <div className="flex flex-col gap-4">
          <div className="text-[13px] text-faint hidden md:flex items-center gap-1.5">
            <span>Home</span>
            <span aria-hidden="true" className="text-gray-300">›</span>
            <span className="text-subtle">Messages</span>
          </div>

          <div>
            <h1 className="text-[20px] md:text-[22px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-tight">My messages</h1>
            <p className="mt-1 text-[14px] md:text-[15px] text-subtle">View and manage your conversations.</p>
          </div>
        </div>

        <MessageFeed />
      </div>

      <Footer />
    </div>
  );
}
