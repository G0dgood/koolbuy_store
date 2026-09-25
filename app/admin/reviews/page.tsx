"use client";

import React, { useState, useMemo } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { Pagination } from "../../components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Drawer from "../../components/Drawer/Drawer";
import { EditProductDrawer } from "../../components/Admin/EditProductDrawer";
import { ReviewReplyDrawer } from "../../components/Admin/ReviewReplyDrawer";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import {
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineChatBubbleLeftRight,
  HiStar,
  HiTrash,
} from "react-icons/hi2";

interface CustomerReview {
  id: number;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  date: string;
  status: "Published" | "Pending" | "Spam";
}

interface ProductReviewItem {
  id: number;
  name: string;
  sku: string;
  price: string;
  stock: number;
  status: string;
  image: string;
  averageRating: number;
  totalReviews: number;
  reviews: CustomerReview[];
}

const initialProductReviews: ProductReviewItem[] = [
  {
    id: 1,
    name: "Kool - Scanfrost 600L Inverter Chest Freezer",
    sku: "KB-SF-600",
    price: "₦1,406,000",
    stock: 24,
    status: "Published",
    image: "/images/koolboks/items/5.webp",
    averageRating: 4.8,
    totalReviews: 42,
    reviews: [
      {
        id: 101,
        customer: {
          name: "Arlene McCoy",
          email: "arlene.mccoy@example.com",
          avatar:
            "https://ui-avatars.com/api/?name=Arlene+McCoy&background=2196F3&color=fff",
        },
        rating: 5,
        comment:
          "Keeps freezing for over 72 hours without power. Excellent solar inverter performance!",
        date: "Oct 24, 2024",
        status: "Published",
      },
      {
        id: 102,
        customer: {
          name: "Emeka Obi",
          email: "emeka.obi@koolboks.com",
          avatar:
            "https://ui-avatars.com/api/?name=Emeka+Obi&background=3F51B5&color=fff",
        },
        rating: 5,
        comment:
          "Very spacious and energy-saving. Runs quietly even on backup solar battery.",
        date: "Nov 02, 2024",
        status: "Published",
      },
      {
        id: 103,
        customer: {
          name: "Tunde Babalola",
          email: "tunde.babalola@gmail.com",
          avatar:
            "https://ui-avatars.com/api/?name=Tunde+Babalola&background=00BCD4&color=fff",
        },
        rating: 4,
        comment:
          "High capacity freezer. Delivery was fast and installation was seamless.",
        date: "Dec 15, 2024",
        status: "Published",
      },
    ],
  },
  {
    id: 2,
    name: "Kool Bruhm 100ah Solar Pedestal Freezer",
    sku: "KB-BR-100",
    price: "₦1,662,370",
    stock: 15,
    status: "Published",
    image: "/images/koolboks/items/4.webp",
    averageRating: 4.6,
    totalReviews: 28,
    reviews: [
      {
        id: 201,
        customer: {
          name: "Brooklyn Simmons",
          email: "brooklyn.s@example.com",
          avatar:
            "https://ui-avatars.com/api/?name=Brooklyn+Simmons&background=E91E63&color=fff",
        },
        rating: 4,
        comment:
          "Perfect for our shop. Battery backup keeps everything chilled seamlessly.",
        date: "Oct 22, 2024",
        status: "Published",
      },
      {
        id: 202,
        customer: {
          name: "Chioma Okonkwo",
          email: "chioma.okonkwo@yahoo.com",
          avatar:
            "https://ui-avatars.com/api/?name=Chioma+Okonkwo&background=4CAF50&color=fff",
        },
        rating: 5,
        comment: "Outstanding temperature retention and durable compressor.",
        date: "Jan 04, 2025",
        status: "Published",
      },
    ],
  },
  {
    id: 3,
    name: "Kool-242L Somotex Glass Door Display Freezer",
    sku: "KB-ST-242",
    price: "₦950,000",
    stock: 18,
    status: "Published",
    image: "/images/koolboks/items/3.webp",
    averageRating: 4.9,
    totalReviews: 35,
    reviews: [
      {
        id: 301,
        customer: {
          name: "Cody Fisher",
          email: "cody.f@example.com",
          avatar:
            "https://ui-avatars.com/api/?name=Cody+Fisher&background=9C27B0&color=fff",
        },
        rating: 5,
        comment:
          "Great display clarity and rapid cooling for commercial beverages and food.",
        date: "Oct 20, 2024",
        status: "Published",
      },
    ],
  },
  {
    id: 4,
    name: "Kool Scanfrost 60ah Single Door Chest Freezer",
    sku: "KB-SF-60",
    price: "₦580,000",
    stock: 30,
    status: "Published",
    image: "/images/koolboks/items/1.webp",
    averageRating: 4.7,
    totalReviews: 19,
    reviews: [
      {
        id: 401,
        customer: {
          name: "Jane Cooper",
          email: "jane.c@example.com",
          avatar:
            "https://ui-avatars.com/api/?name=Jane+Cooper&background=FF9800&color=fff",
        },
        rating: 5,
        comment:
          "Low energy consumption, works very quietly and fits nicely in the kitchen.",
        date: "Oct 18, 2024",
        status: "Published",
      },
    ],
  },
  {
    id: 5,
    name: "200L AC Inverter Deep Freezer",
    sku: "KB-AC-200",
    price: "₦720,000",
    stock: 12,
    status: "Published",
    image: "/images/koolboks/items/2.webp",
    averageRating: 4.3,
    totalReviews: 14,
    reviews: [
      {
        id: 501,
        customer: {
          name: "Robert Fox",
          email: "robert.f@example.com",
          avatar:
            "https://ui-avatars.com/api/?name=Robert+Fox&background=607D8B&color=fff",
        },
        rating: 4,
        comment:
          "Freezer is good. Delivery took a little while but product performs nicely.",
        date: "Oct 15, 2024",
        status: "Published",
      },
    ],
  },
  {
    id: 6,
    name: "230L Hisense Deep Chest Freezer",
    sku: "KB-HS-230",
    price: "₦430,000",
    stock: 22,
    status: "Published",
    image: "/images/koolboks/items/6.webp",
    averageRating: 4.9,
    totalReviews: 56,
    reviews: [
      {
        id: 601,
        customer: {
          name: "Esther Howard",
          email: "esther.h@example.com",
          avatar:
            "https://ui-avatars.com/api/?name=Esther+Howard&background=2196F3&color=fff",
        },
        rating: 5,
        comment:
          "Super cold and reliable for everyday business use. Highly recommend.",
        date: "Oct 12, 2024",
        status: "Published",
      },
      {
        id: 602,
        customer: {
          name: "Zainab Bello",
          email: "zainab.bello@gmail.com",
          avatar:
            "https://ui-avatars.com/api/?name=Zainab+Bello&background=00BCD4&color=fff",
        },
        rating: 5,
        comment:
          "High performance deep freezer, temperature drops rapidly and stays cold.",
        date: "Jan 18, 2025",
        status: "Published",
      },
    ],
  },
  {
    id: 7,
    name: "Double Door Chest Freezer 400L",
    sku: "KB-DD-400",
    price: "₦1,120,000",
    stock: 8,
    status: "Low Stock",
    image: "/images/koolboks/items/2.webp",
    averageRating: 4.5,
    totalReviews: 22,
    reviews: [
      {
        id: 701,
        customer: {
          name: "Amaka Johnson",
          email: "amaka.johnson@outlook.com",
          avatar:
            "https://ui-avatars.com/api/?name=Amaka+Johnson&background=9C27B0&color=fff",
        },
        rating: 5,
        comment:
          "Double door design is very convenient for separating frozen goods.",
        date: "Jan 12, 2025",
        status: "Published",
      },
    ],
  },
  {
    id: 8,
    name: "Commercial Solar Deep Freezer 500L",
    sku: "KB-CS-500",
    price: "₦2,350,000",
    stock: 5,
    status: "Published",
    image: "/images/koolboks/items/3.webp",
    averageRating: 4.8,
    totalReviews: 31,
    reviews: [
      {
        id: 801,
        customer: {
          name: "David Adeleke",
          email: "david.adeleke@gmail.com",
          avatar:
            "https://ui-avatars.com/api/?name=David+Adeleke&background=FF9800&color=fff",
        },
        rating: 5,
        comment:
          "Excellent for commercial store usage. Keeps everything frozen for days.",
        date: "Jan 20, 2025",
        status: "Published",
      },
    ],
  },
];

export default function ReviewListing() {
  const [productsData, setProductsData] = useState<ProductReviewItem[]>(
    initialProductReviews,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal / Drawer states
  const [selectedProductForReviews, setSelectedProductForReviews] =
    useState<ProductReviewItem | null>(null);
  const [isReviewsDrawerOpen, setIsReviewsDrawerOpen] = useState(false);

  const [selectedProductForEdit, setSelectedProductForEdit] =
    useState<ProductReviewItem | null>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  const [reviewToReply, setReviewToReply] = useState<CustomerReview | null>(
    null,
  );
  const [isReplyDrawerOpen, setIsReplyDrawerOpen] = useState(false);

  const [reviewToDelete, setReviewToDelete] = useState<CustomerReview | null>(
    null,
  );
  const [isDeleteReviewModalOpen, setIsDeleteReviewModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return productsData;
    return productsData.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.price.toLowerCase().includes(q),
    );
  }, [productsData, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredProducts.slice(start, start + rowsPerPage);
  }, [filteredProducts, currentPage, rowsPerPage]);

  const handleDeleteReview = () => {
    if (!reviewToDelete || !selectedProductForReviews) return;
    setProductsData((prev) =>
      prev.map((prod) => {
        if (prod.id === selectedProductForReviews.id) {
          const updatedReviews = prod.reviews.filter(
            (r) => r.id !== reviewToDelete.id,
          );
          return {
            ...prod,
            reviews: updatedReviews,
            totalReviews: Math.max(0, prod.totalReviews - 1),
          };
        }
        return prod;
      }),
    );
    setSelectedProductForReviews((prev) =>
      prev
        ? {
            ...prev,
            reviews: prev.reviews.filter((r) => r.id !== reviewToDelete.id),
            totalReviews: Math.max(0, prev.totalReviews - 1),
          }
        : null,
    );
    setIsDeleteReviewModalOpen(false);
    setReviewToDelete(null);
  };

  return (
    <div className="flex flex-col gap-6 mx-auto pb-12">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Products Reviews
          </h1>
          <p className="text-sm text-gray-500">
            Monitor customer feedback, ratings, and reviews for each product in
            your catalog.
          </p> */}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white overflow-hidden flex flex-col border border-[#1C1C1C1A] rounded-lg shadow-2xs">
        {/* Toolbar Bar */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100">
          <div className="relative w-full sm:w-80">
            <Input
              type="text"
              placeholder="Search product name or SKU..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              containerClassName="w-full"
              className="bg-white border-gray-200 placeholder:text-gray-400 text-xs font-medium"
              suffixElement={
                <Icon
                  name="search-01"
                  folder="dashboardIcon"
                  size="sm"
                  className="text-gray-400"
                />
              }
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />
          </div>
        </div>

        {/* Product Reviews Table with EXACT requested headers */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th className="w-14 text-center">#</th>
                <th>Product Name</th>
                <th>Average Rating</th>
                <th>Total Reviews</th>
                <th>View Reviews</th>
                <th className="text-right pr-6">Edit Product</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product, idx) => {
                  const rowNumber = (currentPage - 1) * rowsPerPage + idx + 1;
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      {/* # */}
                      <td className="text-center font-bold text-gray-500 text-xs">
                        {rowNumber}
                      </td>

                      {/* Product Name */}
                      <td>
                        <div className="flex items-center gap-3 min-w-55">
                          <div className="w-12 h-12 rounded-lg border border-gray-100 bg-white p-1 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900 leading-tight">
                              {product.name}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] font-medium text-gray-400">
                                SKU: {product.sku}
                              </span>
                              <span className="text-[11px] font-semibold text-brand-blue">
                                {product.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Average Rating */}
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <HiStar
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= Math.round(product.averageRating)
                                    ? "text-amber-400"
                                    : "text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-bold text-gray-900">
                            {product.averageRating.toFixed(1)}
                          </span>
                        </div>
                      </td>

                      {/* Total Reviews */}
                      <td>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-brand-blue">
                          {product.totalReviews} Reviews
                        </span>
                      </td>

                      {/* View Reviews */}
                      <td>
                        <Button
                          variant="outline"
                          shape="rounded-sm"
                          className="px-3 py-1.5 text-xs font-semibold text-[#00BCD4] border-[#00BCD4]/30 hover:bg-[#00BCD4]/10 transition-all flex items-center gap-1.5 cursor-pointer"
                          onClick={() => {
                            setSelectedProductForReviews(product);
                            setIsReviewsDrawerOpen(true);
                          }}
                        >
                          <HiOutlineEye className="w-4 h-4 text-[#00BCD4]" />
                          <span>View Reviews</span>
                        </Button>
                      </td>

                      {/* Edit Product */}
                      <td className="text-right pr-6">
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            shape="rounded-sm"
                            className="px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-brand-blue hover:bg-gray-50 border-gray-200 transition-all flex items-center gap-1.5 cursor-pointer"
                            onClick={() => {
                              setSelectedProductForEdit(product);
                              setIsEditDrawerOpen(true);
                            }}
                          >
                            <HiOutlinePencilSquare className="w-4 h-4 text-gray-400" />
                            <span>Edit Product</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-gray-400 text-sm"
                  >
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-gray-400 font-medium">
            Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
            products
          </span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* View Product Reviews Drawer */}
      <Drawer
        isOpen={isReviewsDrawerOpen}
        onClose={() => setIsReviewsDrawerOpen(false)}
        title="Product Reviews"
      >
        {selectedProductForReviews && (
          <div className="flex flex-col gap-6 h-full">
            {/* Product Overview Card */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-16 h-16 rounded-lg bg-white border border-gray-100 p-1 shrink-0 flex items-center justify-center shadow-2xs">
                <img
                  src={selectedProductForReviews.image}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <h4 className="text-sm font-bold text-[#1D3557] truncate">
                  {selectedProductForReviews.name}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-brand-blue">
                    {selectedProductForReviews.price}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">
                    SKU: {selectedProductForReviews.sku}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <HiStar
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <=
                          Math.round(selectedProductForReviews.averageRating)
                            ? "text-amber-400"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-800">
                    {selectedProductForReviews.averageRating.toFixed(1)} (
                    {selectedProductForReviews.totalReviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Reviews List */}
            <div className="flex flex-col gap-4 overflow-y-auto pr-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Customer Reviews ({selectedProductForReviews.reviews.length})
                </span>
              </div>

              {selectedProductForReviews.reviews.length > 0 ? (
                selectedProductForReviews.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-white rounded-lg border border-gray-100 shadow-2xs flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.customer.avatar}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover border border-gray-100"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-800">
                            {rev.customer.name}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {rev.customer.email}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] text-gray-400 font-medium">
                        {rev.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <HiStar
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= rev.rating
                              ? "text-amber-400"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed italic">
                      "{rev.comment}"
                    </p>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50">
                      <Button
                        variant="outline"
                        shape="rounded-sm"
                        className="px-2.5 py-1 text-[11px] font-semibold text-brand-blue hover:bg-blue-50 transition-all flex items-center gap-1 cursor-pointer"
                        onClick={() => {
                          setReviewToReply(rev);
                          setIsReplyDrawerOpen(true);
                        }}
                      >
                        <HiOutlineChatBubbleLeftRight className="w-3.5 h-3.5" />
                        <span>Reply</span>
                      </Button>
                      <Button
                        variant="outline"
                        shape="rounded-sm"
                        className="p-1! text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                        onClick={() => {
                          setReviewToDelete(rev);
                          setIsDeleteReviewModalOpen(true);
                        }}
                        title="Delete review"
                      >
                        <HiTrash className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-400 text-xs">
                  No individual customer reviews available for this product.
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Edit Product Drawer */}
      <EditProductDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        product={selectedProductForEdit}
      />

      {/* Reply to Review Drawer */}
      <ReviewReplyDrawer
        isOpen={isReplyDrawerOpen}
        onClose={() => setIsReplyDrawerOpen(false)}
        review={reviewToReply}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteReviewModalOpen}
        onClose={() => setIsDeleteReviewModalOpen(false)}
        onConfirm={handleDeleteReview}
        title="Delete Customer Review"
        message={`Are you sure you want to delete the review from "${reviewToDelete?.customer.name}"? This action cannot be undone.`}
        confirmText="Yes, delete review"
        type="danger"
      />
    </div>
  );
}
