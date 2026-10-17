"use client";

import React, { useState, useRef, useMemo } from "react";
import { Icon } from "../../components/Icon";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { StatCard } from "../../components/Admin/StatCard";
import { Button } from "@/app/components/Button";
import Search from "@/app/components/ui/Search";
import { Input } from "../../components/Form/Inputs";
import { AddCategoryModal } from "../../components/Admin/AddCategoryModal";
import { CategoriesMoreActionsDrawer } from "../../components/Admin/CategoriesMoreActionsDrawer";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import Checkbox from "@/app/components/Checkbox";
import { EditCategoryDrawer } from "../../components/Admin/EditCategoryDrawer";
import { BulkActionsDrawer } from "../../components/Admin/BulkActionsDrawer";
import { RowsPerPage } from "@/app/components/rows-per-page";
import {
  useGetAdminCategoriesQuery,
  useDeleteCategoryMutation,
  type CategoryItem,
} from "@/lib/store/api/categories-api";
import { apiErrorMessage } from "@/lib/store/base-api";
import { toast } from "sonner";

// Static category images for visuals when category has no dedicated image
const FALLBACK_CATEGORY_IMAGES = [
  "/images/koolboks/items/5.webp",
  "/images/koolboks/items/4.webp",
  "/images/koolboks/items/1.webp",
  "/images/koolboks/items/2.webp",
  "/images/koolboks/items/3.webp",
  "/images/koolboks/items/6.webp",
];

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);

  // Modals / Drawers state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Status query derived from tab
  const statusFilter = useMemo(() => {
    if (activeTab.startsWith("Active")) return "active";
    if (activeTab.startsWith("Hidden")) return "hidden";
    return "all";
  }, [activeTab]);

  // RTK Query: Fetch categories from backend
  const {
    data: categoriesData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAdminCategoriesQuery({
    q: searchQuery.trim() || undefined,
    status: statusFilter,
  });

  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const allItems: CategoryItem[] = useMemo(
    () => categoriesData?.items ?? [],
    [categoriesData]
  );
  const counts = categoriesData?.counts ?? { all: 0, active: 0, hidden: 0 };

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(allItems.length / rowsPerPage));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return allItems.slice(start, start + rowsPerPage);
  }, [allItems, currentPage, rowsPerPage]);

  const toggleAll = () => {
    if (selectedSlugs.length === paginatedItems.length) {
      setSelectedSlugs([]);
    } else {
      setSelectedSlugs(paginatedItems.map((p) => p.slug));
    }
  };

  const toggleItem = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((item) => item !== slug) : [...prev, slug]
    );
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete.slug).unwrap();
      toast.success(`Category "${categoryToDelete.label}" was removed successfully.`);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      refetch();
    } catch (err: unknown) {
      toast.error(
        apiErrorMessage(
          err,
          "This category is currently in use and cannot be deleted. Hide it instead."
        )
      );
    }
  };

  const tabLabels = [
    `All Categories (${counts.all})`,
    `Active (${counts.active})`,
    `Hidden (${counts.hidden})`,
  ];

  return (
    <div className="flex flex-col gap-6 mx-auto pb-12">
      {/* Actions */}
      <div className="flex justify-end items-center gap-2.5 w-full">
          <Button
            variant="outline"
            shape="rounded-sm"
            className="flex-1 sm:flex-initial text-xs h-9"
            iconLeft={
              <span className={isFetching ? "animate-spin" : ""}>
                <Icon name="refresh" folder="icon" size="xs" />
              </span>
            }
            onClick={() => refetch()}
            title="Refresh categories"
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            shape="rounded-sm"
            className="flex-1 sm:flex-initial text-xs h-9 bg-brand-charcoal hover:bg-brand-charcoal/90 text-white"
            iconLeft={<Icon name="add" folder="icon" size="xs" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Category
          </Button>
          <Button
            variant="outline"
            shape="rounded-sm"
            className="flex-1 sm:flex-initial text-xs h-9"
            iconRight={<Icon name="more_vert" folder="icon" size="xs" />}
            onClick={() => setIsMoreActionsOpen(true)}
          >
            More Action
          </Button>
        </div>

      {/* The 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          size="sm"
          title="Total Categories"
          value={String(counts.all)}
          trendValue="Catalog"
          trendIsUp={true}
          subtitle="System picklists"
        />
        <StatCard
          size="sm"
          title="Active Categories"
          value={String(counts.active)}
          trendValue="Visible"
          trendIsUp={true}
          subtitle="Customer & vendor selectable"
        />
        <StatCard
          size="sm"
          title="Hidden / Inactive"
          value={String(counts.hidden)}
          trendValue={counts.hidden === 0 ? "Optimal" : "Archived"}
          trendIsUp={counts.hidden === 0}
          subtitle="Excluded from storefront"
        />
        <StatCard
          size="sm"
          title="Assigned Products"
          value={String(
            allItems.reduce((sum, c) => sum + (c.usage_count || 0), 0)
          )}
          trendValue="In Catalog"
          trendIsUp={true}
          subtitle="Active items mapped"
        />
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="relative group">
        <button
          className="absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-light-gray rounded-full flex items-center justify-center text-faint hover:text-brand-charcoal z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={() => scroll("left")}
          type="button"
        >
          <Icon name="chevron_left" folder="icon" size="sm" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth px-1"
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 w-52 bg-white p-3 rounded-lg border border-light-gray flex items-center gap-3 animate-pulse"
              >
                <div className="w-11 h-11 rounded-lg bg-light-gray shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-light-gray rounded w-3/4" />
                  <div className="h-2.5 bg-light-gray rounded w-1/2" />
                </div>
              </div>
            ))
          ) : allItems.length === 0 ? (
            <div className="w-full text-center py-6 text-xs text-faint bg-white rounded-lg border border-dashed border-light-gray">
              No categories configured yet. Click "Add Category" to create one.
            </div>
          ) : (
            allItems.map((cat, i) => {
              const image =
                FALLBACK_CATEGORY_IMAGES[i % FALLBACK_CATEGORY_IMAGES.length];
              return (
                <div
                  key={cat.slug}
                  onClick={() => {
                    setCategoryToEdit(cat);
                    setIsEditDrawerOpen(true);
                  }}
                  className="shrink-0 w-56 bg-white p-2.5 rounded-lg flex items-center gap-3 hover:shadow-lift transition-all cursor-pointer hover:border-brand-charcoal/40 border border-light-gray/80 group/item"
                >
                  <div className="w-11 h-11 rounded-lg overflow-hidden bg-off-white flex items-center justify-center p-1 border border-light-gray group-hover/item:border-brand-charcoal/30 transition-colors shrink-0">
                    <img
                      src={image}
                      alt={cat.label}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold text-brand-charcoal group-hover/item:text-brand-charcoal truncate block leading-tight">
                      {cat.label}
                    </span>
                    <span className="text-[11px] text-faint mt-0.5 block">
                      {cat.usage_count} {cat.usage_count === 1 ? "product" : "products"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button
          className="absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-light-gray rounded-full flex items-center justify-center text-faint hover:text-brand-charcoal z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={() => scroll("right")}
          type="button"
        >
          <Icon name="chevron_right" folder="icon" size="sm" />
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white flex flex-col pt-4 border border-light-gray/80 rounded-lg">
        {/* Fill Tabs & Controls */}
        <div className="px-6 flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <TabFilter
            tabs={tabLabels}
            activeTab={
              activeTab.startsWith("Active")
                ? tabLabels[1]
                : activeTab.startsWith("Hidden")
                ? tabLabels[2]
                : tabLabels[0]
            }
            onChange={(tab) => {
              if (tab.startsWith("Active")) setActiveTab("Active");
              else if (tab.startsWith("Hidden")) setActiveTab("Hidden");
              else setActiveTab("All Categories");
              setCurrentPage(1);
            }}
          />

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <Search
              placeholder="Search category name or slug..."
              value={searchQuery}
              onChange={(val) => {
                const s = typeof val === "string" ? val : (val as any).target?.value ?? "";
                setSearchQuery(s);
                setCurrentPage(1);
              }}
              className="flex-1 md:!w-80"
              maxWidth="max-w-none"
            />
            <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />
          </div>
        </div>

        {/* Table */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th className="pl-6 w-12">
                  <Checkbox
                    checked={
                      selectedSlugs.length === paginatedItems.length &&
                      paginatedItems.length > 0
                    }
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-4 w-14">No.</th>
                <th>Category</th>
                <th>Unique Slug</th>
                <th>VAT Rule</th>
                <th className="text-center">Products</th>
                <th>Status</th>
                <th className="text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="pl-6"><div className="w-4 h-4 bg-light-gray rounded" /></td>
                    <td className="px-4"><div className="w-4 h-3 bg-light-gray rounded" /></td>
                    <td><div className="w-36 h-4 bg-light-gray rounded" /></td>
                    <td><div className="w-24 h-3 bg-light-gray rounded" /></td>
                    <td><div className="w-16 h-4 bg-light-gray rounded" /></td>
                    <td><div className="w-8 h-4 mx-auto bg-light-gray rounded" /></td>
                    <td><div className="w-14 h-4 bg-light-gray rounded" /></td>
                    <td className="pr-6"><div className="w-16 h-6 ml-auto bg-light-gray rounded" /></td>
                  </tr>
                ))
              ) : paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-xs text-faint">
                    No categories found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((cat, idx) => {
                  const globalIdx = (currentPage - 1) * rowsPerPage + idx + 1;
                  const image =
                    FALLBACK_CATEGORY_IMAGES[idx % FALLBACK_CATEGORY_IMAGES.length];
                  return (
                    <tr key={cat.slug} className="group hover:bg-off-white/50">
                      <td className="pl-6">
                        <Checkbox
                          checked={selectedSlugs.includes(cat.slug)}
                          onChange={() => toggleItem(cat.slug)}
                        />
                      </td>
                      <td className="px-4">
                        <span className="text-xs font-semibold text-faint">
                          {globalIdx}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-off-white border border-light-gray p-1 shrink-0">
                            <img
                              src={image}
                              alt={cat.label}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-brand-charcoal leading-tight block">
                              {cat.label}
                            </span>
                            {cat.is_catch_all && (
                              <span className="text-[11px] text-warning font-medium">
                                Catch-all fallback
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <code className="text-[11px] font-mono text-subtle bg-off-white px-1.5 py-0.5 rounded">
                          {cat.slug}
                        </code>
                      </td>
                      <td>
                        <span className="text-xs font-medium text-subtle capitalize">
                          {cat.vat_treatment === "exempt"
                            ? "Exempt"
                            : cat.vat_treatment === "zero_rated"
                            ? "Zero-rated"
                            : "Standard (7.5%)"}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold bg-off-white text-subtle">
                          {cat.usage_count}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            cat.is_active
                              ? "bg-success-soft text-success border border-success/30"
                              : "bg-off-white text-subtle border border-light-gray"
                          }`}
                        >
                          {cat.is_active ? "Active" : "Hidden"}
                        </span>
                      </td>
                      <td className="text-right pr-6">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            variant="outline"
                            shape="rounded-sm"
                            className="p-1.5 text-faint hover:text-brand-charcoal hover:border-medium-gray"
                            title="Edit Category"
                            onClick={() => {
                              setCategoryToEdit(cat);
                              setIsEditDrawerOpen(true);
                            }}
                          >
                            <Icon name="settings" folder="dashboardIcon" size="sm" />
                          </Button>
                          <Button
                            variant="outline"
                            shape="rounded-sm"
                            className="p-1.5 text-faint hover:text-error hover:border-error/30 hover:bg-error-soft"
                            title="Delete Category"
                            onClick={() => {
                              setCategoryToDelete(cat);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <Icon name="Delete" folder="dashboardIcon" size="sm" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add Category Modal (Custom CRM Modal) */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => refetch()}
      />

      {/* Edit Category Drawer */}
      <EditCategoryDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => {
          setIsEditDrawerOpen(false);
          setCategoryToEdit(null);
        }}
        category={categoryToEdit}
        onSuccess={() => refetch()}
      />

      {/* More Actions Drawer */}
      <CategoriesMoreActionsDrawer
        isOpen={isMoreActionsOpen && selectedSlugs.length === 0}
        onClose={() => setIsMoreActionsOpen(false)}
        onCleanEmpty={() => setIsBulkDeleteConfirmOpen(true)}
        selectedIds={[]}
        items={allItems}
        onClearSelection={() => setSelectedSlugs([])}
      />

      {/* Bulk Actions Drawer */}
      <BulkActionsDrawer
        isOpen={selectedSlugs.length > 0}
        onClose={() => setSelectedSlugs([])}
        selectedIds={selectedSlugs.map((_, i) => i + 1)}
        items={selectedSlugs.map((slug) => ({
          id: slug,
          product: allItems.find((c) => c.slug === slug)?.label || slug,
        }))}
        onClearSelection={() => setSelectedSlugs([])}
        title="Categories Selected"
        labelProp="product"
        actions={[
          {
            id: "export",
            title: "Export Selected",
            icon: "cloud_download",
            folder: "icon",
            onClick: () => {
              const rows = allItems.filter((c) => selectedSlugs.includes(c.slug));
              const blob = new Blob([JSON.stringify(rows, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `koolbuy-categories-export.json`;
              a.click();
              URL.revokeObjectURL(url);
              toast.success(`Exported ${rows.length} categories.`);
            },
          },
        ]}
      />

      {/* Clean Empty Categories Confirmation */}
      <ConfirmationModal
        isOpen={isBulkDeleteConfirmOpen}
        onClose={() => setIsBulkDeleteConfirmOpen(false)}
        onConfirm={() => {
          toast.info("Clean Empty Categories finished.");
          setIsBulkDeleteConfirmOpen(false);
        }}
        title="Clean Empty Categories"
        message="Are you sure you want to review all categories with 0 products? Unused categories can be safely deleted or hidden."
        confirmText="Confirm"
        type="danger"
      />

      {/* Delete Category Confirmation */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setCategoryToDelete(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        isLoading={isDeleting}
        confirmText={isDeleting ? "Deleting..." : "Yes, delete category"}
        type="danger"
        message={
          categoryToDelete ? (
            <div className="space-y-3">
              <p>
                Are you sure you want to remove{" "}
                <strong className="text-brand-charcoal font-semibold">
                  "{categoryToDelete.label}"
                </strong>
                ? This action cannot be undone.
              </p>
              <div className="p-2.5 bg-off-white rounded-lg border border-light-gray flex items-center justify-between text-[11px]">
                <span className="text-faint">Unique Slug:</span>
                <code className="font-mono text-brand-charcoal bg-white px-1.5 py-0.5 rounded border border-light-gray">
                  {categoryToDelete.slug}
                </code>
              </div>
              {categoryToDelete.usage_count > 0 && (
                <div className="p-2.5 bg-warning/10 rounded-lg border border-warning/30 text-[11px] text-brand-charcoal flex items-start gap-2">
                  <span className="font-semibold shrink-0">Notice:</span>
                  <span>
                    This category has{" "}
                    <strong>{categoryToDelete.usage_count} product(s)</strong>{" "}
                    assigned. If you only want to hide it from new products, mark it as Hidden instead.
                  </span>
                </div>
              )}
            </div>
          ) : (
            "Are you sure you want to delete this category?"
          )
        }
      />
    </div>
  );
}
