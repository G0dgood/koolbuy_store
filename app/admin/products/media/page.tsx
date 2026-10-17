"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { HiOutlineCloudArrowUp, HiOutlineLink, HiOutlineTrash, HiXMark } from "react-icons/hi2";
import { Button } from "@/app/components/Button";
import { Icon } from "@/app/components/Icon";
import { Input } from "@/app/components/Form/Inputs";
import { TabFilter } from "@/app/components/Admin/TabFilter";
import { Pagination } from "@/app/components/Admin/Pagination";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import Modal from "@/app/components/Modal/Modal";
import { EmptyState } from "@/app/components/EmptyState";
import { apiErrorMessage } from "@/lib/store/base-api";
import { formatDate, humanize } from "@/lib/store/api/accounting-api";
import {
  IMAGE_TYPES,
  MEDIA_CATEGORIES,
  imageSize,
  useAddMediaItemsMutation,
  useDeleteMediaItemMutation,
  useGetMediaLibraryQuery,
  useUpdateMediaItemMutation,
  useUploadFile,
  type MediaCategory,
  type MediaItem,
  type NewMediaItem,
} from "@/lib/store/api/catalogue-admin-api";

/* Media library: images uploaded once and reused for hero banners, category
   cards, store banners and products. Files go through the storage upload
   (POST /storage/sas/upload/ → PUT) and are then registered here with a
   category. Removing an image only takes it out of the library; anything
   already using its link keeps working. */

const PAGE_SIZE = 40;
const MAX_FILES = 50;
const MAX_BYTES = 10 * 1024 * 1024;

const selectClass =
  "h-8 px-2 rounded-lg border border-light-gray bg-white text-[12px] text-brand-charcoal focus:outline-none focus:border-brand-orange";

const categoryLabel = (c: string) => (c === "general" ? "General" : humanize(c));

function formatBytes(n: number) {
  if (!n) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibraryPage() {
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [toDelete, setToDelete] = useState<MediaItem | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetMediaLibraryQuery({
    category: category === "all" ? undefined : category,
    search: query || undefined,
    page,
    page_size: PAGE_SIZE,
  });
  const [updateItem] = useUpdateMediaItemMutation();
  const [deleteItem, { isLoading: isDeleting }] = useDeleteMediaItemMutation();

  const items = data?.items ?? [];
  const counts = data?.counts;
  const total = data?.pagination.total ?? 0;
  const totalPages = total ? Math.max(1, Math.ceil(total / PAGE_SIZE)) : 1;

  const tabKeys = ["all", ...MEDIA_CATEGORIES] as string[];
  const tabLabel = (k: string) => `${k === "all" ? "All" : categoryLabel(k)}${counts ? ` (${counts[k] ?? 0})` : ""}`;

  const changeCategory = async (item: MediaItem, next: MediaCategory) => {
    try {
      await updateItem({ id: item.id, category: next }).unwrap();
      toast.success(`Moved ${item.filename || "the image"} to ${categoryLabel(next)}.`);
    } catch (e) {
      toast.error(apiErrorMessage(e, "Couldn't change the category."));
    }
  };

  const copyLink = async (item: MediaItem) => {
    try {
      await navigator.clipboard.writeText(item.url);
      toast.success("Image link copied.");
    } catch {
      toast.error("Couldn't copy the link. Copy it from the image instead.");
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteItem(toDelete.id).unwrap();
      toast.success(`Removed ${toDelete.filename || "the image"} from the library.`);
      setToDelete(null);
    } catch (e) {
      toast.error(apiErrorMessage(e, "Couldn't remove the image."));
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-brand-charcoal">Media library</h1>
          <p className="text-xs text-subtle mt-0.5">
            Images you upload once and reuse for banners, category cards, store banners and products.
          </p>
        </div>
        <Button
          variant="primary"
          iconLeft={<HiOutlineCloudArrowUp size={16} aria-hidden />}
          onClick={() => setUploadOpen(true)}
        >
          Upload images
        </Button>
      </div>

      <div className="bg-white border border-light-gray rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 sm:px-6 flex flex-col xl:flex-row gap-3 xl:items-center justify-between border-b border-light-gray">
          <TabFilter
            tabs={tabKeys.map(tabLabel)}
            activeTab={tabLabel(category)}
            onChange={(t) => {
              const next = tabKeys.find((k) => tabLabel(k) === t);
              if (next) {
                setCategory(next);
                setPage(1);
              }
            }}
          />
          <Input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search file name"
            aria-label="Search media"
            containerClassName="w-full xl:w-72"
            className="bg-white border-light-gray placeholder:text-faint text-xs font-medium"
            suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-faint" />}
          />
        </div>

        <div className={`p-4 sm:p-6 transition-opacity ${isFetching && !isLoading ? "opacity-60" : ""}`}>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4" aria-hidden>
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <span className="block aspect-square rounded-lg bg-black/[0.06] animate-pulse" />
                  <span className="block h-3 w-24 rounded bg-black/[0.06] animate-pulse" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="py-12 flex flex-col items-center gap-2 text-center">
              <p className="text-[13px] text-error">{apiErrorMessage(error, "Couldn't load the media library.")}</p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          ) : items.length === 0 ? (
            query || category !== "all" ? (
              <EmptyState
                illustration="search"
                title="No matches"
                description="No images match this search or category."
                action={{
                  label: "Show all images",
                  onClick: () => {
                    setSearch("");
                    setQuery("");
                    setCategory("all");
                    setPage(1);
                  },
                }}
              />
            ) : (
              <EmptyState
                illustration="documents"
                title="No media yet"
                description="Images you upload will appear here."
                action={{ label: "Upload images", onClick: () => setUploadOpen(true) }}
              />
            )
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col gap-2 min-w-0">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block aspect-square rounded-lg bg-off-white border border-light-gray overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50"
                    title="Open full size"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt={item.filename} className="w-full h-full object-cover" loading="lazy" />
                  </a>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-brand-charcoal truncate" title={item.filename}>
                      {item.filename || "Untitled"}
                    </span>
                    <span className="text-[11px] text-faint">
                      {formatBytes(item.size_bytes)}
                      {item.width && item.height ? ` · ${item.width}×${item.height}` : ""} · {formatDate(item.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <select
                      value={item.category}
                      onChange={(e) => changeCategory(item, e.target.value as MediaCategory)}
                      aria-label={`Category for ${item.filename}`}
                      className={`${selectClass} flex-1 min-w-0`}
                    >
                      {MEDIA_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {categoryLabel(c)}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => copyLink(item)}
                      aria-label={`Copy link to ${item.filename}`}
                      title="Copy link"
                      className="p-2 rounded-lg text-subtle hover:text-brand-charcoal hover:bg-off-white cursor-pointer"
                    >
                      <HiOutlineLink size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setToDelete(item)}
                      aria-label={`Remove ${item.filename}`}
                      title="Remove from library"
                      className="p-2 rounded-lg text-subtle hover:text-error hover:bg-error-soft cursor-pointer"
                    >
                      <HiOutlineTrash size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        defaultCategory={category === "all" ? "general" : (category as MediaCategory)}
      />

      <ConfirmationModal
        isOpen={!!toDelete}
        onClose={() => !isDeleting && setToDelete(null)}
        onConfirm={confirmDelete}
        title="Remove this image?"
        message="It leaves the media library. Banners or products already using its link keep showing it."
        confirmText="Remove"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

/* ───────────────────────── Upload ───────────────────────── */

function UploadModal({
  isOpen,
  onClose,
  defaultCategory,
}: {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory: MediaCategory;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState<MediaCategory>(defaultCategory);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [wasOpen, setWasOpen] = useState(isOpen);
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadFile();
  const [addItems] = useAddMediaItemsMutation();

  // Each time the modal opens it starts empty, in the current tab's category.
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setFiles([]);
      setCategory(defaultCategory);
      setProgress(0);
    }
  }

  const addFiles = (list: FileList | File[]) => {
    const next: File[] = [];
    for (const f of Array.from(list)) {
      if (!IMAGE_TYPES.includes(f.type)) {
        toast.error(`${f.name}: use a JPG, PNG, WebP or AVIF image.`);
        continue;
      }
      if (f.size > MAX_BYTES) {
        toast.error(`${f.name} is over 10MB.`);
        continue;
      }
      next.push(f);
    }
    setFiles((prev) => {
      const merged = [...prev, ...next];
      if (merged.length > MAX_FILES) toast.error(`Up to ${MAX_FILES} images at a time.`);
      return merged.slice(0, MAX_FILES);
    });
  };

  const close = () => {
    if (!isUploading) onClose();
  };

  const submit = async () => {
    if (files.length === 0) {
      toast.error("Choose at least one image.");
      return;
    }
    setIsUploading(true);
    setProgress(0);
    const uploaded: NewMediaItem[] = [];
    const failed: string[] = [];
    for (const file of files) {
      try {
        const [url, size] = await Promise.all([upload(file), imageSize(file)]);
        uploaded.push({
          url,
          filename: file.name.slice(0, 255),
          content_type: file.type,
          size_bytes: file.size,
          width: size?.width ?? null,
          height: size?.height ?? null,
          category,
        });
      } catch {
        failed.push(file.name);
      }
      setProgress((p) => p + 1);
    }
    try {
      if (uploaded.length > 0) {
        await addItems(uploaded).unwrap();
        toast.success(`Added ${uploaded.length} image${uploaded.length === 1 ? "" : "s"} to the library.`);
      }
      if (failed.length > 0) {
        toast.error(`Couldn't upload ${failed.join(", ")}.`);
        setFiles((prev) => prev.filter((f) => failed.includes(f.name)));
      } else {
        onClose();
      }
    } catch (e) {
      toast.error(apiErrorMessage(e, "The images uploaded but couldn't be added to the library."));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title="Upload images"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="outline" onClick={close} disabled={isUploading}>
            Cancel
          </Button>
          <Button variant="accent" onClick={submit} disabled={isUploading || files.length === 0}>
            {isUploading ? `Uploading ${progress}/${files.length}…` : `Upload${files.length ? ` ${files.length}` : ""}`}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
          }}
          disabled={isUploading}
          className="flex flex-col items-center justify-center gap-2 py-8 px-4 rounded-lg border border-dashed border-light-gray bg-off-white text-center cursor-pointer hover:border-brand-orange transition-colors disabled:opacity-60"
        >
          <HiOutlineCloudArrowUp size={28} className="text-subtle" aria-hidden />
          <span className="text-[13px] font-semibold text-brand-charcoal">Choose images or drop them here</span>
          <span className="text-[11px] text-faint">JPG, PNG, WebP or AVIF, up to 10MB each, {MAX_FILES} at a time</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_TYPES.join(",")}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-brand-charcoal">Where they&apos;ll be used</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as MediaCategory)}
            className={`${selectClass} h-10 rounded-lg`}
            disabled={isUploading}
          >
            {MEDIA_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {categoryLabel(c)}
              </option>
            ))}
          </select>
          <span className="text-[11px] text-faint">Pickers suggest images from their own category first.</span>
        </label>

        {files.length > 0 && (
          <ul className="flex flex-col divide-y divide-light-gray border border-light-gray rounded-lg max-h-56 overflow-y-auto">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 px-3 py-2">
                <span className="text-xs text-brand-charcoal truncate">{f.name}</span>
                <span className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-faint">{formatBytes(f.size)}</span>
                  <button
                    type="button"
                    onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                    disabled={isUploading}
                    aria-label={`Remove ${f.name}`}
                    className="p-1 rounded text-subtle hover:text-error cursor-pointer disabled:opacity-50"
                  >
                    <HiXMark size={14} />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}
