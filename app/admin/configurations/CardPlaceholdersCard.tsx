"use client";

import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { HiOutlineArrowPath, HiOutlineCloudArrowUp, HiOutlinePhoto } from "react-icons/hi2";
import { Button } from "@/app/components/Button";
import { Switch } from "@/app/components/Form/Switch";
import { TabFilter } from "@/app/components/Tabs";
import { CardPlaceholderPreview, LazyProductImage, VendorImage } from "@/app/components/ProductImage";
import { apiErrorMessage } from "@/lib/store/base-api";
import { formatDate } from "@/lib/store/api/accounting-api";
import { IMAGE_TYPES, useUploadFile } from "@/lib/store/api/catalogue-admin-api";
import {
  CARD_PLACEHOLDER_DEFAULTS,
  PLACEHOLDER_OPACITY_MAX,
  PLACEHOLDER_OPACITY_MIN,
  useGetAdminCardPlaceholdersQuery,
  useUpdateCardPlaceholdersMutation,
  type AdminCardPlaceholdersResponse,
  type CardPlaceholder,
  type CardPlaceholders,
  type CardPlaceholdersPatch,
  type CardPlaceholderType,
  type PlaceholderMode,
} from "@/lib/store/api/storefront-settings-api";

/* Card image placeholders (KoolBuy engine, /koolbuy/admin/storefront-settings/card-placeholders/):
   what the storefront's product and vendor cards show while their photo loads
   or when they have none. Edits are previewed live on real cards (through
   <CardPlaceholderPreview>) before saving. */

const box = "bg-white border border-light-gray rounded-lg";
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const MODES: Record<CardPlaceholderType, { value: PlaceholderMode; label: string; hint: string }[]> = {
  product: [
    { value: "logo", label: "KoolBuy logo", hint: "The faded KoolBuy mark (default)" },
    { value: "image", label: "Custom image", hint: "An image you upload" },
    { value: "plain", label: "Plain", hint: "Just the soft stage, no mark" },
  ],
  vendor: [
    { value: "logo", label: "KoolBuy logo", hint: "The faded KoolBuy mark (default)" },
    { value: "name", label: "Store name", hint: "The store's name as a sign" },
    { value: "image", label: "Custom image", hint: "An image you upload" },
    { value: "plain", label: "Plain", hint: "Just the soft stage, no mark" },
  ],
};

const SAMPLES: Record<CardPlaceholderType, { name: string; meta: string }[]> = {
  product: [
    { name: "Solar chest freezer 200L", meta: "₦485,000" },
    { name: "Frozen chicken, 10kg carton", meta: "₦52,000" },
    { name: "Table water, 75cl × 12", meta: "₦3,600" },
  ],
  vendor: [
    { name: "YAM", meta: "Lagos" },
    { name: "Mama Ngozi Cold Room", meta: "Abuja" },
    { name: "Bright Future Provisions & Frozen Foods Wholesale", meta: "Port Harcourt" },
  ],
};

const pick = (d: CardPlaceholders): CardPlaceholders => ({ product: { ...d.product }, vendor: { ...d.vendor } });
const same = (a: CardPlaceholder, b: CardPlaceholder) =>
  a.mode === b.mode && a.image_url === b.image_url && a.opacity === b.opacity && a.glow === b.glow && a.shimmer === b.shimmer;
const validUrl = (v: string) => /^https?:\/\/\S+$/i.test(v) || /^\/(?!\/)\S*$/.test(v);

export function CardPlaceholdersCard() {
  const { data, isLoading, isError, error, refetch } = useGetAdminCardPlaceholdersQuery();
  return (
    <section className={box}>
      <div className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-light-gray">
        <div className="min-w-0 flex-1">
          <h2 className="text-[14px] font-semibold text-brand-charcoal">Card image placeholders</h2>
          <p className="text-[12px] text-subtle mt-0.5">
            What store product and vendor cards show while their photo loads, or when they have none.
          </p>
        </div>
        {data?.updated_at && (
          <p className="text-[11px] text-faint">
            Last changed {formatDate(data.updated_at)}
            {data.updated_by?.name ? ` by ${data.updated_by.name}` : ""}
          </p>
        )}
      </div>
      {isLoading ? (
        <PlaceholdersSkeleton />
      ) : isError || !data ? (
        <div className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[13px] text-error">{apiErrorMessage(error, "Couldn't load the card placeholder settings.")}</p>
          <Button variant="outline" size="sm" onClick={refetch}>
            Try again
          </Button>
        </div>
      ) : (
        <PlaceholdersForm key={JSON.stringify([data.product, data.vendor])} saved={data} />
      )}
    </section>
  );
}

function PlaceholdersSkeleton() {
  return (
    <div className="p-4 sm:px-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6" aria-hidden>
      <div className="flex flex-col gap-4">
        <span className="block h-9 w-56 rounded-lg bg-black/[0.06] animate-pulse" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} className="block h-16 rounded-stage bg-black/[0.06] animate-pulse" />
          ))}
        </div>
        <span className="block h-5 w-full rounded bg-black/[0.06] animate-pulse" />
        <span className="block h-6 w-40 rounded bg-black/[0.06] animate-pulse" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} className="block aspect-square rounded-tile bg-black/[0.06] animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function PlaceholdersForm({ saved }: { saved: AdminCardPlaceholdersResponse }) {
  const savedValue = pick(saved);
  const [tab, setTab] = useState<CardPlaceholderType>("product");
  const [draft, setDraft] = useState<CardPlaceholders>(savedValue);
  const [errors, setErrors] = useState<Partial<Record<CardPlaceholderType, string>>>({});
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const upload = useUploadFile();
  const [save, { isLoading: isSaving }] = useUpdateCardPlaceholdersMutation();

  const cur = draft[tab];
  const dirtyTypes = (["product", "vendor"] as const).filter((t) => !same(draft[t], savedValue[t]));
  const dirty = dirtyTypes.length > 0;
  const isDefault = same(cur, CARD_PLACEHOLDER_DEFAULTS[tab]);
  const busy = isSaving || isUploading;

  const set = (patch: Partial<CardPlaceholder>) => {
    setDraft((d) => ({ ...d, [tab]: { ...d[tab], ...patch } }));
    setErrors((e) => ({ ...e, [tab]: "" }));
  };

  const uploadImage = async (file: File | undefined) => {
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) {
      setErrors((e) => ({ ...e, [tab]: "Use a JPG, PNG, WebP or AVIF image." }));
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setErrors((e) => ({ ...e, [tab]: "The image must be 2 MB or smaller." }));
      return;
    }
    setIsUploading(true);
    try {
      const url = await upload(file);
      set({ image_url: url, mode: "image" });
    } catch (err) {
      setErrors((e) => ({ ...e, [tab]: apiErrorMessage(err, "Couldn't upload the image.") }));
    } finally {
      setIsUploading(false);
    }
  };

  const submit = async () => {
    const next: Partial<Record<CardPlaceholderType, string>> = {};
    for (const t of dirtyTypes) {
      const v = draft[t];
      if (v.mode === "image" && !v.image_url) next[t] = "Upload an image, or choose another style.";
      else if (v.image_url && !validUrl(v.image_url)) next[t] = "The image link isn't valid. Upload the image again.";
    }
    setErrors(next);
    const bad = dirtyTypes.find((t) => next[t]);
    if (bad) {
      setTab(bad);
      return;
    }
    if (!dirty) return;
    const patch: CardPlaceholdersPatch = {};
    for (const t of dirtyTypes) patch[t] = draft[t];
    try {
      await save(patch).unwrap();
      toast.success("Card placeholders saved. The store shows them within a minute.");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't save the card placeholders."));
    }
  };

  const tabOptions = [
    { value: "product" as const, label: "Product cards", count: dirtyTypes.includes("product") ? "•" : undefined },
    { value: "vendor" as const, label: "Vendor cards", count: dirtyTypes.includes("vendor") ? "•" : undefined },
  ];

  return (
    <div className="flex flex-col">
      <div className="p-4 sm:px-6 flex flex-col gap-5">
        <TabFilter options={tabOptions} activeTab={tab} onChange={setTab} ariaLabel="Card type" />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6">
          {/* ── Controls ── */}
          <div className="flex flex-col gap-5">
            <fieldset className="flex flex-col gap-2">
              <legend className="text-xs font-semibold text-brand-charcoal mb-2">What the placeholder shows</legend>
              <div role="radiogroup" aria-label="Placeholder style" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MODES[tab].map((m) => {
                  const selected = cur.mode === m.value;
                  return (
                    <button
                      key={m.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => set({ mode: m.value })}
                      className={`text-left p-3 rounded-stage bg-white transition-shadow cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50 ${
                        selected ? "ring-2 ring-brand-orange" : "ring-1 ring-black/[0.08] hover:ring-black/[0.16]"
                      }`}
                    >
                      <span className="block text-[13px] font-semibold text-brand-charcoal">{m.label}</span>
                      <span className="block text-[11px] text-subtle mt-0.5">{m.hint}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {cur.mode === "image" && (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-brand-charcoal">Placeholder image</span>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-stage border border-light-gray bg-off-white flex items-center justify-center overflow-hidden shrink-0">
                    {cur.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cur.image_url} alt="" className="max-w-full max-h-full object-contain p-1.5" />
                    ) : (
                      <HiOutlinePhoto size={20} className="text-faint" aria-hidden />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      iconLeft={<HiOutlineCloudArrowUp size={14} aria-hidden />}
                      onClick={() => fileRef.current?.click()}
                      disabled={busy}
                    >
                      {isUploading ? "Uploading…" : cur.image_url ? "Replace image" : "Upload image"}
                    </Button>
                    <p className="text-[11px] text-faint">JPG, PNG, WebP or AVIF, up to 2 MB. A transparent PNG works best.</p>
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept={IMAGE_TYPES.join(",")}
                    className="hidden"
                    onChange={(e) => {
                      uploadImage(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                </div>
              </div>
            )}

            {cur.mode !== "plain" && (
              <label className="flex flex-col gap-2">
                <span className="flex items-center justify-between text-xs font-semibold text-brand-charcoal">
                  {cur.mode === "name" ? "Sign strength" : "Mark opacity"}
                  <span className="tabular-nums text-subtle font-medium">{Math.round(cur.opacity * 100)}%</span>
                </span>
                <input
                  type="range"
                  min={PLACEHOLDER_OPACITY_MIN * 100}
                  max={PLACEHOLDER_OPACITY_MAX * 100}
                  step={1}
                  value={Math.round(cur.opacity * 100)}
                  onChange={(e) => set({ opacity: Number(e.target.value) / 100 })}
                  className="w-full h-5 cursor-pointer accent-brand-orange"
                />
                <span className="text-[11px] text-faint">
                  With no photo. While a photo loads it shows a little fainter. Default 28%.
                </span>
              </label>
            )}

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <Switch
                  checked={cur.glow}
                  onChange={(e) => set({ glow: e.target.checked })}
                  label={<span className="text-xs font-semibold text-brand-charcoal">Warm glow</span>}
                />
                <p className="text-[11px] text-faint">The soft orange wash at the top of the card.</p>
              </div>
              <div className="flex flex-col gap-1">
                <Switch
                  checked={cur.shimmer}
                  onChange={(e) => set({ shimmer: e.target.checked })}
                  label={<span className="text-xs font-semibold text-brand-charcoal">Shimmer while loading</span>}
                />
                <p className="text-[11px] text-faint">A light sweep while the photo loads (always off for visitors who prefer less motion).</p>
              </div>
            </div>

            {errors[tab] && <p className="text-[12px] text-error">{errors[tab]}</p>}
          </div>

          {/* ── Live preview with the unsaved values ── */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-brand-charcoal">
              Live preview <span className="font-normal text-faint">· unsaved changes show here first</span>
            </p>
            <CardPlaceholderPreview value={draft}>
              <div className="rounded-lg bg-off-white p-3 sm:p-4 flex flex-col gap-4">
                <PreviewRow type={tab} state="missing" title="No photo" />
                <PreviewRow type={tab} state="loading" title="While the photo loads" />
                {tab === "vendor" && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-medium text-subtle">Small avatar (“Sold by” on a product page)</span>
                    <div className="flex items-center gap-3">
                      {SAMPLES.vendor.slice(0, 2).map((s) => (
                        <div key={s.name} className="relative w-12 h-12 rounded-full overflow-hidden ring-1 ring-black/[0.08] bg-white">
                          <VendorImage src={null} name={s.name} sizes="48px" compact previewState="missing" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardPlaceholderPreview>
          </div>
        </div>
      </div>

      <div className="p-4 sm:px-6 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 border-t border-light-gray">
        <Button
          variant="ghost"
          size="sm"
          iconLeft={<HiOutlineArrowPath size={14} aria-hidden />}
          onClick={() => set({ ...CARD_PLACEHOLDER_DEFAULTS[tab], image_url: cur.image_url })}
          disabled={isDefault || busy}
        >
          Reset {tab === "product" ? "product" : "vendor"} cards to default
        </Button>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setDraft(pick(saved));
              setErrors({});
            }}
            disabled={!dirty || busy}
          >
            Discard changes
          </Button>
          <Button variant="accent" onClick={submit} disabled={!dirty || busy}>
            {isSaving ? "Saving…" : "Save placeholders"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function PreviewRow({ type, state, title }: { type: CardPlaceholderType; state: "loading" | "missing"; title: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-medium text-subtle">{title}</span>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {SAMPLES[type].map((s) => (
          <div key={s.name} className="bg-white rounded-tile border border-light-gray overflow-hidden flex flex-col">
            <div className={`relative w-full ${type === "product" ? "aspect-square" : "aspect-[4/3]"}`}>
              {type === "product" ? (
                <LazyProductImage src={null} alt={s.name} sizes="160px" previewState={state} caption={false} />
              ) : (
                <VendorImage src={null} name={s.name} sizes="160px" previewState={state} />
              )}
            </div>
            <div className="px-2.5 pt-2 pb-2.5 min-w-0">
              <p className="text-[11px] sm:text-[12px] font-semibold text-brand-charcoal truncate">{s.name}</p>
              <p className="text-[10px] sm:text-[11px] text-subtle truncate tabular-nums">{s.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
