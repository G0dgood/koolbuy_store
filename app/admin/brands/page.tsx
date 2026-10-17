"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  HiOutlinePlus,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineTag,
  HiOutlineCheckCircle,
  HiOutlineCube,
} from "react-icons/hi2";
import { StatCard } from "@/app/components/Admin/StatCard";
import { Button } from "@/app/components/Button";
import Search from "@/app/components/ui/Search";
import { Modal } from "@/app/components/ui/Modal";
import { Input } from "@/app/components/Form/Inputs";
import { EmptyTableRow } from "@/app/components/EmptyState";
import { Pagination } from "@/app/components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import {
  useGetCatalogueFacetsQuery,
  useGetAdminCatalogueProductsQuery,
  useUpdateProductMerchandisingMutation,
  type AdminCatalogueProduct,
} from "@/lib/store/api/catalogue-api";
import { BulkBrandModal } from "../products/BulkBrandModal";
import { validateBrand } from "../products/merchandising";

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  count: number;
  status: "active" | "hidden";
  logo?: string;
}

const BRAND_LOGOS: Record<string, string> = {
  koolboks: "/images/koolboks/koolbuy_logo.webp",
};

export default function BrandsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isNewBrandOpen, setIsNewBrandOpen] = useState(false);
  const [assignBrandName, setAssignBrandName] = useState<string | null>(null);

  // Live catalogue facets & products
  const facetsQ = useGetCatalogueFacetsQuery();
  const productsQ = useGetAdminCatalogueProductsQuery({ page_size: 100 });

  const rawBrands = facetsQ.data?.brands ?? [];
  const products = productsQ.data?.items ?? [];

  // Build structured brand items
  const brands: BrandItem[] = useMemo(() => {
    return rawBrands.map((b) => {
      const slug = b.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return {
        id: slug,
        name: b.name,
        slug,
        count: b.count,
        status: "active",
        logo: BRAND_LOGOS[slug],
      };
    });
  }, [rawBrands]);

  // Total branded vs unbranded products
  const brandedProductsCount = brands.reduce((acc, b) => acc + b.count, 0);
  const totalProducts = productsQ.data?.pagination?.total ?? brandedProductsCount;
  const unbrandedCount = Math.max(0, totalProducts - brandedProductsCount);

  // Filtered brands
  const filteredBrands = useMemo(() => {
    if (!search.trim()) return brands;
    const q = search.toLowerCase();
    return brands.filter(
      (b) => b.name.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q)
    );
  }, [brands, search]);

  const totalPages = Math.max(1, Math.ceil(filteredBrands.length / pageSize));
  const pagedBrands = filteredBrands.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-brand-charcoal">Brands</h1>
          <p className="text-xs text-subtle mt-0.5">
            Manage appliance and freezer brands, logo branding, and catalogue product assignments.
          </p>
        </div>
        <Button
          variant="accent"
          size="md"
          iconLeft={<HiOutlinePlus size={16} />}
          onClick={() => setIsNewBrandOpen(true)}
        >
          New brand
        </Button>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          size="sm"
          title="Total Brands"
          value={brands.length}
          subtitle="Active on storefront"
        />
        <StatCard
          size="sm"
          title="Assigned Products"
          value={brandedProductsCount}
          subtitle="Products with a brand"
        />
        <StatCard
          size="sm"
          title="Unassigned Units"
          value={unbrandedCount}
          subtitle="Products needing a brand"
        />
        <StatCard
          size="sm"
          title="Sidebar Filters"
          value={brands.length > 0 ? "Active" : "None"}
          subtitle="Enabled on catalogue"
        />
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-lg border border-light-gray overflow-hidden flex flex-col">
        {/* Table filter header */}
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-light-gray">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-brand-charcoal uppercase tracking-wider">
              Brand Directory ({filteredBrands.length})
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Search
              value={search}
              onChange={(val) => {
                setSearch(typeof val === "string" ? val : (val as { target?: { value?: string } }).target?.value ?? "");
                setPage(1);
              }}
              placeholder="Search brand name or slug"
              className="w-full sm:!w-72"
              maxWidth="max-w-none"
            />
            <RowsPerPage
              value={pageSize}
              options={[10, 20, 50]}
              onChange={(n) => {
                setPageSize(n);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th>Brand</th>
                <th>Slug</th>
                <th>Products</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {facetsQ.isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-black/[0.06]" />
                        <div className="h-4 w-28 bg-black/[0.06] rounded" />
                      </div>
                    </td>
                    <td><div className="h-4 w-20 bg-black/[0.06] rounded" /></td>
                    <td><div className="h-4 w-12 bg-black/[0.06] rounded" /></td>
                    <td><div className="h-4 w-16 bg-black/[0.06] rounded" /></td>
                    <td className="text-right"><div className="h-7 w-20 bg-black/[0.06] rounded ml-auto" /></td>
                  </tr>
                ))
              ) : pagedBrands.length === 0 ? (
                <EmptyTableRow
                  colSpan={5}
                  illustration="products"
                  title={search.trim() ? "No matching brands" : "No brands yet"}
                  description={
                    search.trim()
                      ? `No brands match "${search}". Try a different search term.`
                      : "Create your first freezer brand to organize products on the storefront."
                  }
                  action={{
                    label: search.trim() ? "Clear search" : "New brand",
                    onClick: search.trim() ? () => setSearch("") : () => setIsNewBrandOpen(true),
                  }}
                />
              ) : (
                pagedBrands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-off-white/60 transition-colors">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg border border-light-gray bg-white flex items-center justify-center overflow-hidden shrink-0">
                          {brand.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain p-1" />
                          ) : (
                            <span className="text-xs font-bold text-brand-orange uppercase">
                              {brand.name.slice(0, 2)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-brand-charcoal">{brand.name}</p>
                          <p className="text-[11px] text-subtle">Freezer & Cooling Brand</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <code className="text-[11px] px-2 py-0.5 rounded bg-off-white text-brand-charcoal border border-light-gray">
                        {brand.slug}
                      </code>
                    </td>
                    <td>
                      <Link
                        href={`/admin/products?search=${encodeURIComponent(brand.name)}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-off-white hover:bg-brand-orange-soft text-brand-charcoal text-xs font-semibold transition-colors"
                        title="View products assigned to this brand"
                      >
                        <HiOutlineCube size={13} className="text-subtle" />
                        <span>{brand.count} items</span>
                      </Link>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-green px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                        <HiOutlineCheckCircle size={12} />
                        Active
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAssignBrandName(brand.name)}
                          title="Assign this brand to products"
                        >
                          Assign products
                        </Button>
                        <Link
                          href={`/products?brand=${encodeURIComponent(brand.name)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded text-subtle hover:text-brand-orange hover:bg-off-white transition-colors"
                          title="View brand on storefront"
                        >
                          <HiOutlineArrowTopRightOnSquare size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredBrands.length > pageSize && (
          <div className="p-4 border-t border-light-gray flex items-center justify-between">
            <span className="text-xs text-subtle">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredBrands.length)} of {filteredBrands.length} brands
            </span>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* New Brand Modal */}
      {isNewBrandOpen && (
        <CreateBrandModal
          open={isNewBrandOpen}
          existingBrands={brands.map((b) => b.name)}
          onClose={() => setIsNewBrandOpen(false)}
          onCreated={(newBrand) => {
            setIsNewBrandOpen(false);
            setAssignBrandName(newBrand);
          }}
        />
      )}

      {/* Assign Brand Modal */}
      {assignBrandName && (
        <BulkBrandModal
          open={Boolean(assignBrandName)}
          products={products}
          brands={brands.map((b) => b.name)}
          onClose={() => setAssignBrandName(null)}
          onDone={(ids) => {
            setAssignBrandName(null);
            facetsQ.refetch();
            productsQ.refetch();
            toast.success(`Updated ${ids.length} products to brand "${assignBrandName}".`);
          }}
        />
      )}
    </div>
  );
}

function CreateBrandModal({
  open,
  existingBrands,
  onClose,
  onCreated,
}: {
  open: boolean;
  existingBrands: string[];
  onClose: () => void;
  onCreated: (brand: string) => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setSlug(autoSlug);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = name.trim();
    const msg = validateBrand(clean);
    if (msg) {
      setError(msg);
      return;
    }
    const exists = existingBrands.some((b) => b.toLowerCase() === clean.toLowerCase());
    if (exists) {
      setError(`Brand "${clean}" already exists.`);
      return;
    }
    toast.success(`Brand "${clean}" ready. Select products to assign it.`);
    onCreated(clean);
  };

  return (
    <Modal open={open} onClose={onClose} title="New Brand" size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-brand-charcoal mb-1">
            Brand name
          </label>
          <Input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Scanfrost, Nexus, Koolboks"
            autoFocus
          />
          {error && <p className="text-[11px] text-error mt-1">{error}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-charcoal mb-1">
            Brand slug
          </label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. scanfrost"
          />
          <p className="text-[11px] text-faint mt-1">Used in catalogue URL filters and SEO tags.</p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-light-gray">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="accent" size="sm" type="submit" disabled={!name.trim()}>
            Continue to Products
          </Button>
        </div>
      </form>
    </Modal>
  );
}
