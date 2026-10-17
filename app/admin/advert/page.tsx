"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  HiOutlineArrowDown,
  HiOutlineArrowUp,
  HiOutlineCloudArrowUp,
  HiOutlinePencilSquare,
  HiOutlinePlus,
  HiOutlineTrash,
} from "react-icons/hi2";
import { Button } from "@/app/components/Button";
import { Icon } from "@/app/components/Icon";
import { Input } from "@/app/components/Form/Inputs";
import { Switch } from "@/app/components/Form/Switch";
import { TabFilter } from "@/app/components/Admin/TabFilter";
import { Pagination } from "@/app/components/Admin/Pagination";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import Modal from "@/app/components/Modal/Modal";
import { EmptyState } from "@/app/components/EmptyState";
import { BannerImage } from "@/app/components/Admin/BannerImage";
import { apiErrorMessage } from "@/lib/store/base-api";
import { formatDate, humanize } from "@/lib/store/api/accounting-api";
import {
  HERO_ANIMATIONS,
  IMAGE_TYPES,
  readAsDataUrl,
  useCreateHeroBannerMutation,
  useDeleteHeroBannerMutation,
  useGetHeroBannersQuery,
  useGetStoreBannersQuery,
  useReorderHeroBannersMutation,
  useUpdateHeroBannerMutation,
  useUpdateStoreBannerMutation,
  useUploadFile,
  type HeroAnimation,
  type HeroBanner,
  type StoreBanner,
} from "@/lib/store/api/catalogue-admin-api";

/* Adverts and banners.
   - Homepage banners: the hero slides on the storefront home page
     (/admin/hero-banners/: add, edit, switch on/off, reorder, delete). The
     image is sent with the banner (JPG, PNG, WebP or AVIF under 3MB).
   - Store banners: the cover image on each retailer's and wholesaler's store
     page (/admin/store-banners/: replace or remove for them). */

const TABS = ["Homepage banners", "Store banners"] as const;
type Tab = (typeof TABS)[number];
const MAX_HERO_BYTES = 3 * 1024 * 1024;

const inputClass =
  "w-full h-10 px-3 rounded-lg border border-light-gray text-xs focus:outline-none focus:border-brand-orange bg-white";

function ErrorBox({ error, fallback, onRetry }: { error: unknown; fallback: string; onRetry: () => void }) {
  return (
    <div className="py-12 flex flex-col items-center gap-2 text-center">
      <p className="text-[13px] text-error">{apiErrorMessage(error, fallback)}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

/** ?tab=homepage | ?tab=store (the sidebar links to each) */
const TAB_PARAM: Record<Tab, string> = { "Homepage banners": "homepage", "Store banners": "store" };
const tabFromParam = (v: string | null): Tab => (v === "store" ? "Store banners" : "Homepage banners");

export default function AdvertPage() {
  return (
    <Suspense fallback={null}>
      <AdvertContent />
    </Suspense>
  );
}

function AdvertContent() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tab = tabFromParam(params.get("tab"));
  const setTab = (t: Tab) => {
    const next = new URLSearchParams(params.toString());
    next.set("tab", TAB_PARAM[t]);
    next.delete("type");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };
  return (
    <div className="flex flex-col gap-6 pb-12">
      <div>
        <h1 className="text-xl font-semibold text-brand-charcoal">Adverts and banners</h1>
        <p className="text-xs text-subtle mt-0.5">The slides on the storefront home page and each store&apos;s banner.</p>
      </div>
      <div className="bg-white border border-light-gray rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-light-gray">
          <TabFilter tabs={[...TABS]} activeTab={tab} onChange={(t) => setTab(t as Tab)} />
        </div>
        {tab === "Homepage banners" ? <HeroBanners /> : <StoreBanners />}
      </div>
    </div>
  );
}

/* ───────────────────────── Homepage (hero) banners ───────────────────────── */

function HeroBanners() {
  const { data, isLoading, isFetching, isError, error, refetch } = useGetHeroBannersQuery();
  const [updateBanner] = useUpdateHeroBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteHeroBannerMutation();
  const [reorder, { isLoading: isReordering }] = useReorderHeroBannersMutation();
  const [editing, setEditing] = useState<HeroBanner | "new" | null>(null);
  const [toDelete, setToDelete] = useState<HeroBanner | null>(null);
  const items = data?.items ?? [];

  const toggle = async (b: HeroBanner) => {
    try {
      await updateBanner({ id: b.id, is_active: !b.is_active }).unwrap();
      toast.success(b.is_active ? "Banner hidden from the home page." : "Banner is live on the home page.");
    } catch (e) {
      toast.error(apiErrorMessage(e, "Couldn't update the banner."));
    }
  };

  const move = async (index: number, dir: -1 | 1) => {
    const next = [...items];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    try {
      await reorder(next.map((b, i) => ({ id: b.id, sort_order: i }))).unwrap();
      toast.success("Banner order saved.");
    } catch (e) {
      toast.error(apiErrorMessage(e, "Couldn't reorder the banners."));
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteBanner(toDelete.id).unwrap();
      toast.success("Banner deleted.");
      setToDelete(null);
    } catch (e) {
      toast.error(apiErrorMessage(e, "Couldn't delete the banner."));
    }
  };

  return (
    <>
      <div className="p-4 sm:px-6 flex flex-col sm:flex-row gap-3 sm:items-center justify-between border-b border-light-gray">
        <p className="text-[12px] text-subtle">
          Live banners play in this order on the home page.
          {data && ` ${items.filter((b) => b.is_active).length} of ${items.length} live.`}
        </p>
        <Button variant="primary" iconLeft={<HiOutlinePlus size={14} aria-hidden />} onClick={() => setEditing("new")}>
          Add banner
        </Button>
      </div>

      <div className={`p-4 sm:p-6 transition-opacity ${isFetching && !isLoading ? "opacity-60" : ""}`}>
        {isLoading ? (
          <div className="flex flex-col gap-3" aria-hidden>
            {Array.from({ length: 3 }, (_, i) => (
              <span key={i} className="block h-24 rounded-lg bg-black/[0.06] animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <ErrorBox error={error} fallback="Couldn't load the homepage banners." onRetry={refetch} />
        ) : items.length === 0 ? (
          <EmptyState
            illustration="promotions"
            title="No banners yet"
            description="Banners you add will play on the storefront home page."
            action={{ label: "Add banner", onClick: () => setEditing("new") }}
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map((b, i) => (
              <li
                key={b.id}
                className="flex flex-col md:flex-row md:items-center gap-4 p-3 rounded-lg border border-light-gray"
              >
                <div className="w-full md:w-48 aspect-[16/7] rounded-lg bg-off-white overflow-hidden shrink-0">
                  <BannerImage src={b.image_url} emptyLabel="No image" brokenLabel="Image couldn't load" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <span className="text-[13px] font-semibold text-brand-charcoal truncate">{b.title || "Untitled banner"}</span>
                  {b.subtitle && <span className="text-xs text-subtle truncate">{b.subtitle}</span>}
                  <span className="text-[11px] text-faint truncate">
                    {humanize(b.animation)} · {Math.round(b.duration / 100) / 10}s
                    {b.link_url ? ` · links to ${b.link_url}` : " · no link"} · updated {formatDate(b.updated_at)}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Switch
                    checked={b.is_active}
                    onChange={() => toggle(b)}
                    aria-label={b.is_active ? "Hide banner" : "Show banner"}
                    label={<span className="text-[12px] text-subtle">{b.is_active ? "Live" : "Hidden"}</span>}
                    className="mr-2"
                  />
                  <IconButton label="Move up" onClick={() => move(i, -1)} disabled={i === 0 || isReordering}>
                    <HiOutlineArrowUp size={14} />
                  </IconButton>
                  <IconButton label="Move down" onClick={() => move(i, 1)} disabled={i === items.length - 1 || isReordering}>
                    <HiOutlineArrowDown size={14} />
                  </IconButton>
                  <IconButton label="Edit banner" onClick={() => setEditing(b)}>
                    <HiOutlinePencilSquare size={14} />
                  </IconButton>
                  <IconButton label="Delete banner" onClick={() => setToDelete(b)} danger>
                    <HiOutlineTrash size={14} />
                  </IconButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <HeroBannerModal banner={editing} onClose={() => setEditing(null)} />

      <ConfirmationModal
        isOpen={!!toDelete}
        onClose={() => !isDeleting && setToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete this banner?"
        message={`"${toDelete?.title || "Untitled banner"}" will be removed from the home page. This can't be undone.`}
        confirmText="Delete"
        type="danger"
        isLoading={isDeleting}
      />
    </>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`p-2 rounded-lg text-subtle cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
        danger ? "hover:text-error hover:bg-error-soft" : "hover:text-brand-charcoal hover:bg-off-white"
      }`}
    >
      {children}
    </button>
  );
}

function HeroBannerModal({ banner, onClose }: { banner: HeroBanner | "new" | null; onClose: () => void }) {
  const isNew = banner === "new";
  const current = banner && banner !== "new" ? banner : null;
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [link, setLink] = useState("");
  const [seconds, setSeconds] = useState("5");
  const [animation, setAnimation] = useState<HeroAnimation>("fade");
  const [active, setActive] = useState(true);
  const [image, setImage] = useState<{ dataUrl: string; type: string; name: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [seen, setSeen] = useState<typeof banner>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [create, { isLoading: isCreating }] = useCreateHeroBannerMutation();
  const [update, { isLoading: isUpdating }] = useUpdateHeroBannerMutation();
  const saving = isCreating || isUpdating;

  if (banner !== seen) {
    setSeen(banner);
    if (banner) {
      setTitle(current?.title ?? "");
      setSubtitle(current?.subtitle ?? "");
      setLink(current?.link_url ?? "");
      setSeconds(String(current ? current.duration / 1000 : 5));
      setAnimation(((current?.animation as HeroAnimation) || "fade") as HeroAnimation);
      setActive(current?.is_active ?? true);
      setImage(null);
      setErrors({});
    }
  }

  const pickImage = async (file: File | undefined) => {
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) {
      setErrors((e) => ({ ...e, image: "Use a JPG, PNG, WebP or AVIF image." }));
      return;
    }
    if (file.size > MAX_HERO_BYTES) {
      setErrors((e) => ({ ...e, image: "The image must be under 3MB." }));
      return;
    }
    try {
      setImage({ dataUrl: await readAsDataUrl(file), type: file.type, name: file.name });
      setErrors((e) => ({ ...e, image: "" }));
    } catch (err) {
      setErrors((e) => ({ ...e, image: (err as Error).message }));
    }
  };

  const submit = async () => {
    const next: Record<string, string> = {};
    const secs = Number(seconds);
    if (!Number.isFinite(secs) || secs < 1 || secs > 1200) next.duration = "Between 1 and 1,200 seconds.";
    if (isNew && !image) next.image = "Choose an image for the banner.";
    if (title.length > 120) next.title = "Up to 120 characters.";
    if (subtitle.length > 255) next.subtitle = "Up to 255 characters.";
    if (link.length > 255) next.link = "Up to 255 characters.";
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    const body = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      link_url: link.trim(),
      duration: Math.round(secs * 1000),
      animation,
      is_active: active,
      ...(image ? { image_base64: image.dataUrl, image_content_type: image.type } : {}),
    };
    try {
      if (isNew) {
        await create({ ...body, image_base64: image!.dataUrl }).unwrap();
        toast.success("Banner added.");
      } else if (current) {
        await update({ id: current.id, ...body }).unwrap();
        toast.success("Banner saved.");
      }
      onClose();
    } catch (e) {
      toast.error(apiErrorMessage(e, "Couldn't save the banner."));
    }
  };

  const preview = image?.dataUrl || current?.image_url || "";
  const err = (k: string) => errors[k] && <p className="text-[11px] text-error">{errors[k]}</p>;

  return (
    <Modal
      isOpen={!!banner}
      onClose={() => !saving && onClose()}
      title={isNew ? "Add banner" : "Edit banner"}
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="accent" onClick={submit} disabled={saving}>
            {saving ? "Saving…" : isNew ? "Add banner" : "Save"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-brand-charcoal">Image{isNew ? " *" : ""}</span>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative w-full aspect-[16/7] rounded-lg border border-dashed border-light-gray bg-off-white overflow-hidden flex items-center justify-center cursor-pointer hover:border-brand-orange"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="flex flex-col items-center gap-1 text-subtle">
                <HiOutlineCloudArrowUp size={24} aria-hidden />
                <span className="text-[12px] font-medium">Choose an image</span>
              </span>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept={IMAGE_TYPES.join(",")}
            className="hidden"
            onChange={(e) => {
              pickImage(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          {errors.image ? err("image") : <p className="text-[11px] text-faint">JPG, PNG, WebP or AVIF, under 3MB. Wide images work best.</p>}
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-brand-charcoal">Title</span>
          <input className={inputClass} value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} />
          {err("title")}
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-brand-charcoal">Subtitle</span>
          <input className={inputClass} value={subtitle} maxLength={255} onChange={(e) => setSubtitle(e.target.value)} />
          {err("subtitle")}
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-brand-charcoal">Link</span>
          <input
            className={inputClass}
            value={link}
            maxLength={255}
            placeholder="e.g. /products?category=freezers"
            onChange={(e) => setLink(e.target.value)}
          />
          {errors.link ? err("link") : <p className="text-[11px] text-faint">Where the banner goes when tapped. Leave empty for no link.</p>}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-brand-charcoal">Shown for (seconds)</span>
            <input
              className={inputClass}
              type="number"
              min={1}
              max={1200}
              value={seconds}
              onChange={(e) => setSeconds(e.target.value)}
            />
            {err("duration")}
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-brand-charcoal">Transition</span>
            <select className={inputClass} value={animation} onChange={(e) => setAnimation(e.target.value as HeroAnimation)}>
              {HERO_ANIMATIONS.map((a) => (
                <option key={a} value={a}>
                  {humanize(a.replace("-", "_"))}
                </option>
              ))}
            </select>
          </label>
        </div>
        <Switch
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          label={<span className="text-xs text-brand-charcoal">Live on the home page</span>}
        />
      </div>
    </Modal>
  );
}

/* ───────────────────────── Store banners ───────────────────────── */

const BANNER_FILTERS = ["All", "With banner", "Without banner"] as const;
type BannerFilter = (typeof BANNER_FILTERS)[number];
const ROLE_FILTERS = ["All stores", "Retailers", "Wholesalers"] as const;
type RoleFilter = (typeof ROLE_FILTERS)[number];
const STORE_PAGE_SIZE = 24;

function StoreBanners() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [bannerFilter, setBannerFilter] = useState<BannerFilter>("All");
  const [role, setRole] = useState<RoleFilter>("All stores");
  const [page, setPage] = useState(1);
  const [toRemove, setToRemove] = useState<StoreBanner | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const target = useRef<StoreBanner | null>(null);
  const upload = useUploadFile();
  const [updateStore, { isLoading: isUpdating }] = useUpdateStoreBannerMutation();

  useEffect(() => {
    const id = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetStoreBannersQuery({
    q: query || undefined,
    banner: bannerFilter === "With banner" ? "with" : bannerFilter === "Without banner" ? "without" : undefined,
    role: role === "Retailers" ? "retailer" : role === "Wholesalers" ? "wholesaler" : undefined,
    page,
    page_size: STORE_PAGE_SIZE,
  });
  const items = data?.items ?? [];
  const counts = data?.counts;
  const total = data?.pagination.total ?? 0;
  const totalPages = total ? Math.max(1, Math.ceil(total / STORE_PAGE_SIZE)) : 1;
  const filtered = !!query || bannerFilter !== "All" || role !== "All stores";

  const bannerLabel = (f: BannerFilter) => {
    if (!counts) return f;
    const n = f === "All" ? counts.all : f === "With banner" ? counts.with : counts.without;
    return `${f} (${n})`;
  };

  const startReplace = (s: StoreBanner) => {
    target.current = s;
    fileRef.current?.click();
  };

  const replace = async (file: File | undefined) => {
    const store = target.current;
    if (!file || !store) return;
    if (!IMAGE_TYPES.includes(file.type)) {
      toast.error("Use a JPG, PNG, WebP or AVIF image.");
      return;
    }
    setUploadingId(store.id);
    try {
      const url = await upload(file);
      await updateStore({ id: store.id, cover_image_url: url }).unwrap();
      toast.success(`New banner set for ${store.business_name}.`);
    } catch (e) {
      toast.error(apiErrorMessage(e, "Couldn't change the banner."));
    } finally {
      setUploadingId(null);
    }
  };

  const confirmRemove = async () => {
    if (!toRemove) return;
    try {
      await updateStore({ id: toRemove.id, cover_image_url: "" }).unwrap();
      toast.success(`Banner removed from ${toRemove.business_name}.`);
      setToRemove(null);
    } catch (e) {
      toast.error(apiErrorMessage(e, "Couldn't remove the banner."));
    }
  };

  return (
    <>
      <div className="p-4 sm:px-6 flex flex-col xl:flex-row gap-3 xl:items-center justify-between border-b border-light-gray">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <TabFilter
            tabs={BANNER_FILTERS.map(bannerLabel)}
            activeTab={bannerLabel(bannerFilter)}
            onChange={(t) => {
              const next = BANNER_FILTERS.find((f) => bannerLabel(f) === t);
              if (next) {
                setBannerFilter(next);
                setPage(1);
              }
            }}
          />
          <TabFilter
            tabs={[...ROLE_FILTERS]}
            activeTab={role}
            onChange={(t) => {
              setRole(t as RoleFilter);
              setPage(1);
            }}
          />
        </div>
        <Input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search store name"
          aria-label="Search stores"
          containerClassName="w-full xl:w-72"
          className="bg-white border-light-gray placeholder:text-faint text-xs font-medium"
          suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-faint" />}
        />
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={IMAGE_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          replace(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <div className={`p-4 sm:p-6 transition-opacity ${isFetching && !isLoading ? "opacity-60" : ""}`}>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" aria-hidden>
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} className="block h-44 rounded-lg bg-black/[0.06] animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <ErrorBox error={error} fallback="Couldn't load store banners." onRetry={refetch} />
        ) : items.length === 0 ? (
          filtered ? (
            <EmptyState
              illustration="search"
              title="No matches"
              description="No stores match these filters."
              action={{
                label: "Clear filters",
                onClick: () => {
                  setSearch("");
                  setQuery("");
                  setBannerFilter("All");
                  setRole("All stores");
                  setPage(1);
                },
              }}
            />
          ) : (
            <EmptyState illustration="vendors" title="No stores yet" description="Stores will appear here once sellers sign up." />
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map((s) => (
              <div key={s.id} className="flex flex-col rounded-lg border border-light-gray overflow-hidden">
                <div className="relative aspect-[16/6] bg-off-white">
                  <BannerImage src={s.cover_image_url} positionY={s.cover_image_position} />
                </div>
                <div className="p-3 flex items-center justify-between gap-3">
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-brand-charcoal truncate">{s.business_name}</span>
                    <span className="text-[11px] text-faint">
                      {humanize(s.role)}
                      {s.is_verified ? " · verified" : ""}
                      {s.is_active ? "" : " · inactive"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startReplace(s)}
                      disabled={uploadingId !== null || isUpdating}
                    >
                      {uploadingId === s.id ? "Uploading…" : s.cover_image_url ? "Replace" : "Add banner"}
                    </Button>
                    {s.cover_image_url && (
                      <IconButton label="Remove banner" onClick={() => setToRemove(s)} danger disabled={uploadingId !== null}>
                        <HiOutlineTrash size={14} />
                      </IconButton>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmationModal
        isOpen={!!toRemove}
        onClose={() => !isUpdating && setToRemove(null)}
        onConfirm={confirmRemove}
        title="Remove this store's banner?"
        message={`${toRemove?.business_name ?? "The store"}'s page will show without a banner until a new one is added.`}
        confirmText="Remove"
        type="danger"
        isLoading={isUpdating}
      />
    </>
  );
}
