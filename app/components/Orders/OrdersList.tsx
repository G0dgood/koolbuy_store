"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Button } from "../Button/Button";
import { Icon } from "../Icon";
import { Pagination } from "../Navigation/Pagination";
import { useCart } from "@/app/context/CartContext";
import { useAuthModal } from "@/app/context/AuthModalContext";
import { readStoredTokens } from "@/lib/api";
import { useGetOrdersQuery, type Order, type OrderItem } from "@/lib/store/api/orders-api";
import { Modal } from "../ui/Modal";
import { toast } from "sonner";
import Link from "next/link";
import { FailedOrdersIllustration } from "./FailedOrdersIllustration";

export const OrdersList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { addToCart } = useCart();
  const { openLogin } = useAuthModal();

  const [hasToken, setHasToken] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Check auth state on client mount
  useEffect(() => {
    const tokens = readStoredTokens();
    setHasToken(Boolean(tokens?.access));
  }, []);

  // Fetch live orders for authenticated customer
  const {
    data: ordersData,
    isLoading,
    isError,
    refetch,
  } = useGetOrdersQuery(undefined, {
    skip: !hasToken,
  });

  const orders: Order[] = useMemo(() => {
    if (!ordersData) return [];
    if (Array.isArray(ordersData)) return ordersData;
    if ("items" in ordersData && Array.isArray(ordersData.items)) return ordersData.items;
    if ("results" in ordersData && Array.isArray(ordersData.results)) return ordersData.results;
    return [];
  }, [ordersData]);

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filter live orders by query
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;
    const q = searchQuery.toLowerCase().trim();
    return orders.filter((order) => {
      const orderId = (order.order_number || order.id || "").toLowerCase();
      const status = (order.status || "").toLowerCase();
      const itemNames = (order.items || []).map((i) => (i.name || i.title || "").toLowerCase()).join(" ");
      const vendorName = (order.vendor?.name || "").toLowerCase();
      return orderId.includes(q) || status.includes(q) || itemNames.includes(q) || vendorName.includes(q);
    });
  }, [orders, searchQuery]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const handleReorder = (order: Order) => {
    const items = order.items || [];
    if (items.length === 0) {
      toast.error("No items found in this order to reorder.");
      return;
    }

    for (const item of items) {
      addToCart({
        id: item.product_id || item.id || `item-${Date.now()}`,
        title: item.name || item.title || "Catalog Product",
        price: typeof item.price === "number" ? `₦${item.price.toLocaleString()}` : String(item.price || "₦0.00"),
        image: item.image || "/images/koolboks/items/1.webp",
      });
    }

    toast.success(`Added ${items.length} ${items.length === 1 ? "item" : "items"} from order to your cart!`);
  };

  const getStatusBadge = (status: string) => {
    const s = (status || "processing").toLowerCase();
    if (s.includes("delivered") || s.includes("completed")) {
      return (
        <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[12px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          Delivered
        </span>
      );
    }
    if (s.includes("shipped") || s.includes("transit")) {
      return (
        <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[12px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
          In Transit
        </span>
      );
    }
    if (s.includes("cancel")) {
      return (
        <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[12px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
          Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[12px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
        Processing
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recent";
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-NG", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Recent";
    }
  };

  // Not signed in state
  if (!hasToken) {
    return (
      <div className="bg-white rounded-3xl border border-black/[0.06] p-8 md:p-14 text-center flex flex-col items-center justify-center gap-4 max-w-lg mx-auto shadow-xs">
        <div className="w-16 h-16 rounded-full bg-brand-orange-soft flex items-center justify-center text-brand-orange-text">
          <Icon name="inventory_2" size="lg" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-brand-charcoal tracking-[-0.02em]">
            Sign in to view your orders
          </h2>
          <p className="text-sm text-gray-500 max-w-sm">
            Please log in with your customer account to track current shipments and view past equipment purchase history.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-3 w-full sm:w-auto">
          <Button
            onClick={openLogin}
            variant="primary"
            shape="pill"
            className="w-full sm:w-auto px-7 h-9 text-sm bg-brand-charcoal text-white hover:bg-brand-charcoal/85"
          >
            Sign in to account
          </Button>
          <Button
            href="/products"
            variant="secondary"
            shape="pill"
            className="w-full sm:w-auto px-6 h-9 text-sm bg-black/[0.04] text-gray-700 hover:bg-black/[0.08]"
          >
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-3xl border border-black/[0.06] flex flex-col overflow-hidden shadow-xs">
        {/* List Toolbar */}
        <div className="px-6 py-5 md:px-8 md:py-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-black/[0.06]">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-brand-charcoal tracking-[-0.01em] leading-tight">
              All Orders
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {orders.length} {orders.length === 1 ? "order" : "orders"} on record
            </p>
          </div>

          <div className="w-full sm:w-80 relative">
            <Icon
              name="search"
              size="sm"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by order ID or item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-11 pr-4 rounded-full bg-black/[0.04] border border-transparent outline-none transition-colors text-sm text-brand-charcoal placeholder:text-gray-400 focus:bg-white focus:border-brand-orange-text focus:ring-4 focus:ring-brand-orange-text/10"
            />
          </div>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="p-8 flex flex-col gap-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="animate-pulse flex items-center gap-4 p-4 rounded-2xl bg-black/[0.02]"
              >
                <div className="w-20 h-20 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded-md w-1/4" />
                  <div className="h-3 bg-gray-200 rounded-md w-1/3" />
                  <div className="h-3 bg-gray-200 rounded-md w-1/5" />
                </div>
                <div className="w-24 h-8 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!isLoading && isError && (
          <div className="py-14 px-6 text-center flex flex-col items-center justify-center gap-3">
            <FailedOrdersIllustration className="w-48 h-36 mb-1" />
            <p className="text-base font-bold text-brand-charcoal">
              Failed to load your orders
            </p>
            <p className="text-xs text-gray-500 max-w-sm">
              We couldn&rsquo;t retrieve your order history from the server. Please check your network connection and try again.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-2 inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-full bg-brand-charcoal text-white hover:bg-brand-charcoal/85 transition-colors cursor-pointer shadow-xs"
            >
              <Icon name="refresh" size="xs" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Orders List */}
        {!isLoading && !isError && (
          <div className="flex flex-col px-6 md:px-8">
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => {
                const orderNumber =
                  order.order_number || `#ORD-${order.id.slice(0, 8).toUpperCase()}`;
                const itemCount = order.items?.length || 1;
                const primaryImage =
                  order.items?.[0]?.image || "/images/koolboks/items/1.webp";
                const totalFormatted =
                  typeof order.total_amount === "number"
                    ? `₦${order.total_amount.toLocaleString()}`
                    : String(order.total_amount || "₦0.00");

                return (
                  <div
                    key={order.id}
                    className="py-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 border-b border-black/[0.06] last:border-0"
                  >
                    <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-2xl bg-off-white p-2.5 flex items-center justify-center border border-black/[0.04]">
                        <div className="relative w-full h-full">
                          <Image
                            src={primaryImage}
                            alt={`Order ${orderNumber}`}
                            fill
                            sizes="96px"
                            className="object-contain"
                          />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex flex-col flex-1 min-w-0 gap-1">
                        <span className="text-sm md:text-base font-bold text-brand-charcoal leading-snug tabular-nums">
                          {orderNumber}
                        </span>
                        <span className="text-xs text-gray-500">
                          Placed on {formatDate(order.created_at)}
                        </span>
                        <span className="text-xs text-gray-600 font-medium">
                          Contains {itemCount} {itemCount === 1 ? "item" : "items"}
                          {order.vendor?.name ? ` • Sold by ${order.vendor.name}` : ""}
                        </span>
                      </div>
                    </div>

                    {/* Price & Status */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 md:w-40 lg:w-48">
                      <span className="text-base md:text-lg font-bold text-brand-charcoal tabular-nums tracking-[-0.01em]">
                        {totalFormatted}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:flex-col md:items-stretch w-full md:w-auto flex-shrink-0">
                      <Button
                        onClick={() => handleReorder(order)}
                        variant="secondary"
                        shape="pill"
                        className="flex-1 md:flex-none md:w-[130px] h-9 text-xs font-semibold bg-black/[0.04] hover:bg-black/[0.08] text-brand-charcoal transition-colors"
                      >
                        Reorder
                      </Button>
                      <Button
                        onClick={() => setSelectedOrder(order)}
                        variant="ghost"
                        shape="pill"
                        className="flex-1 md:flex-none md:w-[130px] h-9 text-xs font-semibold text-brand-orange-text hover:bg-brand-orange-soft transition-colors"
                      >
                        View details
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-16 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-off-white rounded-full flex items-center justify-center text-gray-400">
                  <Icon name="inventory_2" size="lg" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-brand-charcoal">
                    {searchQuery ? "No matching orders found" : "No orders yet"}
                  </h3>
                  <p className="text-xs text-gray-500 max-w-sm">
                    {searchQuery
                      ? `No orders match "${searchQuery}". Try searching with a different order number or term.`
                      : "When you place equipment orders through KoolBuy, they will appear right here with live delivery updates."}
                  </p>
                </div>
                <Link
                  href="/products"
                  className="mt-2 text-xs font-semibold px-5 py-2.5 rounded-full bg-brand-charcoal text-white hover:bg-brand-charcoal/85 transition-colors"
                >
                  Browse Catalog
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          open={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          size="lg"
          title={`Order Details • ${selectedOrder.order_number || selectedOrder.id.slice(0, 8).toUpperCase()}`}
          description={`Placed on ${formatDate(selectedOrder.created_at)}`}
        >
          <div className="space-y-6 pt-2">
            {/* Header info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-black/[0.02] border border-black/[0.04] text-xs">
              <div>
                <span className="text-gray-400 block font-medium">Status</span>
                <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Total Paid</span>
                <span className="text-sm font-bold text-brand-charcoal block mt-0.5">
                  ₦{Number(selectedOrder.total_amount || 0).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Merchant / Vendor</span>
                <span className="text-gray-800 font-semibold block mt-0.5 truncate">
                  {selectedOrder.vendor?.name || "KoolBuy Official"}
                </span>
              </div>
            </div>

            {/* Delivery address if provided */}
            {selectedOrder.delivery_address && (
              <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.04]">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Delivery Destination
                </h4>
                <p className="text-xs text-gray-800 leading-relaxed">
                  {typeof selectedOrder.delivery_address === "string"
                    ? selectedOrder.delivery_address
                    : JSON.stringify(selectedOrder.delivery_address)}
                </p>
              </div>
            )}

            {/* Line Items */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Items in Order ({selectedOrder.items?.length || 0})
              </h4>
              <div className="divide-y divide-black/[0.06] border border-black/[0.06] rounded-2xl overflow-hidden">
                {(selectedOrder.items || []).map((item: OrderItem, idx: number) => {
                  const price = Number(item.price || 0);
                  const qty = Number(item.quantity || 1);
                  return (
                    <div
                      key={item.id || idx}
                      className="p-3.5 flex items-center justify-between gap-3 bg-white hover:bg-black/[0.01]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-off-white p-1 flex-shrink-0 border border-black/[0.04] relative">
                          <Image
                            src={item.image || "/images/koolboks/items/1.webp"}
                            alt={item.name || item.title || "Item"}
                            fill
                            sizes="48px"
                            className="object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-800 truncate">
                            {item.name || item.title || "Product Item"}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Qty: {qty} • ₦{price.toLocaleString()} each
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-brand-charcoal tabular-nums shrink-0">
                        ₦{(price * qty).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal actions */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-black/[0.06]">
              <Button
                onClick={() => setSelectedOrder(null)}
                variant="secondary"
                shape="pill"
                className="px-5 h-9 text-xs font-medium bg-black/[0.04] text-gray-700 hover:bg-black/[0.08]"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  handleReorder(selectedOrder);
                  setSelectedOrder(null);
                }}
                variant="primary"
                shape="pill"
                className="px-6 h-9 text-xs font-semibold bg-brand-charcoal text-white hover:bg-brand-charcoal/85"
              >
                Reorder all items
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
