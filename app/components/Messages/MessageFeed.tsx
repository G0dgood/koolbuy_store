"use client";

import React from "react";
import { EmptyState } from "../EmptyState";

/**
 * Message inbox. The store has no messaging service yet, so this always shows
 * the empty state; conversations will be listed here once one exists.
 */
export const MessageFeed: React.FC = () => (
  <EmptyState
    variant="card"
    illustration="messages"
    title="No messages yet"
    description="Messages from vendors and KoolBuy will appear here."
    action={{ label: "Browse products", href: "/products" }}
  />
);
