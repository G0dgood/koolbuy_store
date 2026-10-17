"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { HiOutlinePencilSquare, HiOutlinePlus } from "react-icons/hi2";
import { Button } from "@/app/components/Button";
import { Switch } from "@/app/components/Form/Switch";
import { TabFilter } from "@/app/components/Admin/TabFilter";
import Modal from "@/app/components/Modal/Modal";
import { EmptyTableRow } from "@/app/components/EmptyState";
import { apiErrorMessage } from "@/lib/store/base-api";
import { formatDate } from "@/lib/store/api/accounting-api";
import {
  useCreatePricingRegionMutation,
  useGetPricingRegionsQuery,
  useUpdatePricingRegionMutation,
  type PricingRegion,
} from "@/lib/store/api/catalogue-admin-api";

/* Service areas: the pricing regions on the backend (/admin/pricing/regions/).
   A region groups states and cities of a market; products can be priced
   differently there (regional prices are set on the Pricing pages). Regions
   may not overlap. Anyone with pricing, margins, procurement or settings view
   can read them; only a Super Admin can add or change one, and the backend
   refuses others with a clear message, which is shown as is. */

const MARKETS = ["All", "NG", "KE"] as const;
type Market = (typeof MARKETS)[number];
const COLS = 6;

const inputClass =
  "w-full h-10 px-3 rounded-lg border border-light-gray text-xs focus:outline-none focus:border-brand-orange bg-white";
const textareaClass =
  "w-full min-h-20 px-3 py-2 rounded-lg border border-light-gray text-xs focus:outline-none focus:border-brand-orange bg-white resize-y";

const splitPlaces = (s: string) =>
  [...new Set(s.split(/[,\n]/).map((x) => x.trim()).filter(Boolean))];

function Places({ list }: { list: string[] }) {
  if (list.length === 0) return <span className="text-xs text-faint">—</span>;
  const shown = list.slice(0, 4);
  return (
    <div className="flex flex-wrap gap-1 max-w-72" title={list.join(", ")}>
      {shown.map((p) => (
        <span key={p} className="inline-flex px-2 py-0.5 rounded-full bg-off-white text-[11px] text-brand-charcoal capitalize">
          {p}
        </span>
      ))}
      {list.length > shown.length && <span className="text-[11px] text-faint self-center">+{list.length - shown.length} more</span>}
    </div>
  );
}

export default function ServiceAreaPage() {
  const { data, isLoading, isFetching, isError, error, refetch } = useGetPricingRegionsQuery();
  const [updateRegion] = useUpdatePricingRegionMutation();
  const [market, setMarket] = useState<Market>("All");
  const [editing, setEditing] = useState<PricingRegion | "new" | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const all = data?.items ?? [];
  const items = market === "All" ? all : all.filter((r) => r.market === market);
  const label = (m: Market) => (data ? `${m} (${m === "All" ? all.length : all.filter((r) => r.market === m).length})` : m);

  const toggle = async (r: PricingRegion) => {
    setTogglingId(r.id);
    try {
      await updateRegion({ id: r.id, is_active: !r.is_active }).unwrap();
      toast.success(r.is_active ? `${r.name} switched off.` : `${r.name} switched on.`);
    } catch (e) {
      toast.error(apiErrorMessage(e, "Couldn't change the region."));
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-brand-charcoal">Service areas</h1>
          <p className="text-xs text-subtle mt-0.5">
            Regions of states and cities where products can be priced differently. Only a Super Admin can add or change
            one.
          </p>
        </div>
        <Button variant="primary" iconLeft={<HiOutlinePlus size={14} aria-hidden />} onClick={() => setEditing("new")}>
          Add region
        </Button>
      </div>

      <div className="bg-white border border-light-gray rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-light-gray">
          <TabFilter
            tabs={MARKETS.map(label)}
            activeTab={label(market)}
            onChange={(t) => {
              const next = MARKETS.find((m) => label(m) === t);
              if (next) setMarket(next);
            }}
          />
        </div>

        <div className={`admin-table-container transition-opacity ${isFetching && !isLoading ? "opacity-60" : ""}`}>
          <table>
            <thead>
              <tr>
                <th>Region</th>
                <th>States</th>
                <th>Cities</th>
                <th>Regional prices</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }, (_, i) => (
                  <tr key={i} aria-hidden>
                    {Array.from({ length: COLS }, (_, j) => (
                      <td key={j}>
                        <span className="block h-3 w-20 rounded bg-black/[0.06] animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={COLS} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-1 max-w-md mx-auto">
                      <p className="text-[13px] text-error">{apiErrorMessage(error, "Couldn't load service areas.")}</p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
                        Try again
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <EmptyTableRow
                  colSpan={COLS}
                  illustration="delivery"
                  title="No service areas yet"
                  description="Regions you add will appear here. Until then every buyer gets the standard price."
                  action={{ label: "Add region", onClick: () => setEditing("new") }}
                />
              ) : (
                items.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-brand-charcoal">{r.name}</span>
                        <span className="text-[11px] text-faint">
                          {r.market} · updated {formatDate(r.updated_at)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <Places list={r.states} />
                    </td>
                    <td>
                      <Places list={r.cities} />
                    </td>
                    <td className="text-xs text-subtle tabular-nums">
                      {(r.regional_prices ?? 0).toLocaleString()} product{r.regional_prices === 1 ? "" : "s"}
                    </td>
                    <td>
                      <Switch
                        checked={r.is_active}
                        onChange={() => toggle(r)}
                        disabled={togglingId === r.id}
                        aria-label={r.is_active ? `Switch off ${r.name}` : `Switch on ${r.name}`}
                        label={<span className="text-[12px] text-subtle">{r.is_active ? "On" : "Off"}</span>}
                      />
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => setEditing(r)}
                        aria-label={`Edit ${r.name}`}
                        title="Edit region"
                        className="p-2 rounded-lg text-subtle hover:text-brand-charcoal hover:bg-off-white cursor-pointer"
                      >
                        <HiOutlinePencilSquare size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RegionModal region={editing} onClose={() => setEditing(null)} />
    </div>
  );
}

function RegionModal({ region, onClose }: { region: PricingRegion | "new" | null; onClose: () => void }) {
  const isNew = region === "new";
  const current = region && region !== "new" ? region : null;
  const [market, setMarket] = useState<"NG" | "KE">("NG");
  const [name, setName] = useState("");
  const [states, setStates] = useState("");
  const [cities, setCities] = useState("");
  const [active, setActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [seen, setSeen] = useState<typeof region>(null);
  const [create, { isLoading: isCreating }] = useCreatePricingRegionMutation();
  const [update, { isLoading: isUpdating }] = useUpdatePricingRegionMutation();
  const saving = isCreating || isUpdating;

  if (region !== seen) {
    setSeen(region);
    if (region) {
      setMarket(current?.market === "KE" ? "KE" : "NG");
      setName(current?.name ?? "");
      setStates((current?.states ?? []).join(", "));
      setCities((current?.cities ?? []).join(", "));
      setActive(current?.is_active ?? true);
      setErrors({});
    }
  }

  const submit = async () => {
    const s = splitPlaces(states);
    const c = splitPlaces(cities);
    const next: Record<string, string> = {};
    const n = name.trim();
    if (n.length < 2) next.name = "Give the region a name.";
    else if (n.length > 80) next.name = "Up to 80 characters.";
    if (s.length + c.length === 0) next.places = "List at least one state or city the region covers.";
    else if ([...s, ...c].some((p) => p.length < 2 || p.length > 60)) next.places = "Each place must be 2–60 characters.";
    else if (s.length > 100 || c.length > 100) next.places = "Up to 100 states and 100 cities.";
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    try {
      if (isNew) {
        await create({ market, name: n, states: s, cities: c, is_active: active }).unwrap();
        toast.success(`${n} region added.`);
      } else if (current) {
        await update({ id: current.id, name: n, states: s, cities: c, is_active: active }).unwrap();
        toast.success(`${n} region saved.`);
      }
      onClose();
    } catch (e) {
      toast.error(apiErrorMessage(e, "Couldn't save the region."));
    }
  };

  return (
    <Modal
      isOpen={!!region}
      onClose={() => !saving && onClose()}
      title={isNew ? "Add region" : "Edit region"}
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="accent" onClick={submit} disabled={saving}>
            {saving ? "Saving…" : isNew ? "Add region" : "Save"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-[12px] text-subtle">
          A state or city can belong to only one active region in a market. Only a Super Admin can save regions.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-brand-charcoal">Market</span>
            <select
              className={inputClass}
              value={market}
              onChange={(e) => setMarket(e.target.value as "NG" | "KE")}
              disabled={!isNew}
            >
              <option value="NG">Nigeria (NG)</option>
              <option value="KE">Kenya (KE)</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-xs font-semibold text-brand-charcoal">Name *</span>
            <input
              className={`${inputClass} ${errors.name ? "border-error" : ""}`}
              value={name}
              maxLength={80}
              placeholder="e.g. Lagos metro"
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="text-[11px] text-error">{errors.name}</p>}
          </label>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-brand-charcoal">States</span>
          <textarea
            className={textareaClass}
            value={states}
            placeholder="e.g. Lagos, Ogun"
            onChange={(e) => setStates(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-brand-charcoal">Cities</span>
          <textarea
            className={textareaClass}
            value={cities}
            placeholder="e.g. Ikeja, Lekki"
            onChange={(e) => setCities(e.target.value)}
          />
          {errors.places ? (
            <p className="text-[11px] text-error">{errors.places}</p>
          ) : (
            <p className="text-[11px] text-faint">Separate places with commas or new lines.</p>
          )}
        </label>
        <Switch
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          label={<span className="text-xs text-brand-charcoal">Region is on</span>}
        />
      </div>
    </Modal>
  );
}
