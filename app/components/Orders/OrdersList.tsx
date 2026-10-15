"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "../Button/Button";
import { Icon } from "../Icon";
import { Pagination } from "../Navigation/Pagination";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface OrderData {
  id: string;
  date: string;
  items: number;
  total: number;
  status: "Shipped" | "Processing" | "Delivered" | "Cancelled";
  image?: string;
}

const MOCK_ORDERS: OrderData[] = [
  {
    id: "#ORD-99321",
    date: "Oct 24, 2026",
    items: 3,
    total: 1045.50,
    status: "Delivered",
    image: "/images/headphone.jpg"
  },
  {
    id: "#ORD-99322",
    date: "Oct 22, 2026",
    items: 1,
    total: 39.99,
    status: "Shipped",
    image: "/images/laptop.jpg"
  },
  {
    id: "#ORD-99323",
    date: "Oct 19, 2026",
    items: 5,
    total: 2110.00,
    status: "Processing",
    image: "/images/watch.jpg"
  },
  {
    id: "#ORD-99324",
    date: "Sep 05, 2026",
    items: 2,
    total: 154.20,
    status: "Cancelled",
    image: "/images/camera.jpg"
  },
  {
    id: "#ORD-99325",
    date: "Aug 12, 2026",
    items: 4,
    total: 820.00,
    status: "Delivered",
    image: "/images/headphone.jpg"
  },
  {
    id: "#ORD-99326",
    date: "Aug 02, 2026",
    items: 2,
    total: 120.00,
    status: "Delivered",
    image: "/images/headphone.jpg"
  },
  {
    id: "#ORD-99327",
    date: "Jul 21, 2026",
    items: 1,
    total: 890.00,
    status: "Cancelled",
    image: "/images/laptop.jpg"
  },
  {
    id: "#ORD-99328",
    date: "Jul 05, 2026",
    items: 8,
    total: 1240.20,
    status: "Processing",
    image: "/images/watch.jpg"
  }
];

export const OrdersList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const router = useRouter();
  const { addToCart } = useCart();

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredOrders = MOCK_ORDERS.filter((order) =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleReorder = (order: OrderData) => {
    // In a real app, we would fetch the order items and add them all.
    // For this mock, we'll add the primary item representing the order.
    addToCart({
      id: `reorder-${order.id}`,
      title: `Items from ${order.id}`,
      price: `₦${order.total / order.items}`,
      image: order.image || "/images/camera.jpg",
    });
    toast.success(`Items from order ${order.id} added to cart`);
  };

  const handleViewDetails = (orderId: string) => {
    // Navigate directly to product details as requested
    router.push(`/products/detail`);
    toast.info(`Viewing details for ${orderId}`);
  };

  const STATUS_PILL: Record<OrderData["status"], string> = {
    Delivered: "bg-success-soft text-success",
    Shipped: "bg-brand-orange-soft text-brand-orange-text",
    Processing: "bg-brand-orange-soft text-brand-orange-text",
    Cancelled: "bg-error-soft text-error",
  };

  const getStatusBadge = (status: OrderData["status"]) => (
    <span className={`inline-flex items-center h-6 px-2.5 rounded-full text-[12px] font-medium whitespace-nowrap ${STATUS_PILL[status] ?? "bg-black/[0.04] text-subtle"}`}>
      {status}
    </span>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-[22px] flex flex-col">
        {/* List Toolbar */}
        <div className="px-5 pt-5 pb-4 md:px-8 md:pt-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-black/[0.06]">
          <h2 className="text-[19px] md:text-[20px] font-semibold text-brand-charcoal tracking-[-0.01em] leading-tight">All orders</h2>

          <div className="w-full sm:w-80 relative">
            <Icon name="search" size="sm" className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
            <input
              type="text"
              placeholder="Search by order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-11 pr-4 rounded-full bg-black/[0.04] border border-transparent outline-none transition-colors text-[14px] text-brand-charcoal placeholder:text-faint focus:bg-white focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15"
            />
          </div>
        </div>

        {/* Orders Map */}
        <div className="flex flex-col px-5 md:px-8">
          {paginatedOrders.length > 0 ? (
            paginatedOrders.map((order) => (
              <div key={order.id} className="py-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 border-b border-black/[0.06] last:border-0">
                <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-[16px] bg-off-white p-3 flex items-center justify-center">
                    {order.image ? (
                      <div className="relative w-full h-full">
                        <Image src={order.image} alt={`Order ${order.id}`} fill sizes="96px" className="object-contain mix-blend-multiply" />
                      </div>
                    ) : (
                      <Icon name="inventory_2" size="lg" className="text-faint" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                    <span className="text-[15px] font-semibold text-brand-charcoal leading-snug tabular-nums">{order.id}</span>
                    <span className="text-[13px] text-subtle">Placed on {order.date}</span>
                    <span className="text-[13px] text-subtle">
                      Contains {order.items} {order.items === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </div>

                {/* Price & Status */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 md:w-36 lg:w-44">
                  <span className="text-[17px] font-semibold text-brand-charcoal tabular-nums tracking-[-0.01em]">₦{order.total.toLocaleString()}</span>
                  {getStatusBadge(order.status)}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:flex-col md:items-stretch w-full md:w-auto flex-shrink-0">
                  <Button
                    onClick={() => handleReorder(order)}
                    variant="secondary"
                    shape="pill"
                    className="flex-1 md:flex-none md:w-[130px] h-10 text-[14px]! bg-black/[0.04] hover:bg-black/[0.08] text-brand-charcoal"
                  >
                    Reorder
                  </Button>
                  <Button
                    onClick={() => handleViewDetails(order.id)}
                    variant="ghost"
                    shape="pill"
                    className="flex-1 md:flex-none md:w-[130px] h-10 text-[14px]! font-medium! text-brand-orange-text hover:bg-brand-orange-soft!"
                  >
                    View details
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-off-white rounded-full flex items-center justify-center text-faint">
                <Icon name="inventory_2" size="md" />
              </div>
              <p className="text-[17px] font-semibold text-brand-charcoal">No orders found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination component replaces manual buttons */}
      {totalPages > 1 && (
        <div className="flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};
