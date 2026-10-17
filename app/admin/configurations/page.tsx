"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { HiOutlinePencilSquare, HiOutlinePlus } from "react-icons/hi2";
import { Button } from "@/app/components/Button";
import { Switch } from "@/app/components/Form/Switch";
import Modal from "@/app/components/Modal/Modal";
import Search from "@/app/components/ui/Search";
import { EmptyState, EmptyTableRow } from "@/app/components/EmptyState";
import { apiErrorMessage } from "@/lib/store/base-api";
import { formatDate, formatMoney, humanize } from "@/lib/store/api/accounting-api";
import {
  useGetBusinessRulesQuery,
  useGetCheckoutMinimumsQuery,
  useGetSiteSettingsQuery,
  useSaveCheckoutMinimumMutation,
  useUpdateSiteSettingsMutation,
  type BusinessRuleSection,
  type CheckoutMinimum,
  type MinimumAudience,
  type MinimumMetric,
  type SiteSettings,
  type SiteSettingsPatch,
} from "@/lib/store/api/catalogue-admin-api";
import { CardPlaceholdersCard } from "./CardPlaceholdersCard";

/* Configurations: the platform settings the backend actually stores.
   - Site settings (/admin/site-settings/): contact email and phone, the
     "wholesalers near you" radius, the global Koolboks markup (needs
     Pricing → Edit and a reason) and Paystack dedicated accounts (Super Admin).
   - Minimum order at checkout (/admin/checkout-minimums/): one rule per
     market and buyer type, every change needs a reason.
   - Business rules (/admin/business-rules/): a read-only overview of every
     configurable rule and its current value, following the caller's role.
   - Card image placeholders (/koolbuy/admin/storefront-settings/card-placeholders/,
     CardPlaceholdersCard.tsx): what store product / vendor cards show while
     their photo loads or when they have none, with a live preview.
   The old sample config cards and custom modules had no backend and were
   removed. */

const inputClass =
  "w-full h-10 px-3 rounded-lg border border-light-gray text-xs focus:outline-none focus:border-brand-orange bg-white disabled:bg-off-white";
const box = "bg-white border border-light-gray rounded-lg overflow-hidden";

function SectionHeader({ title, hint, action }: { title: string; hint: string; action?: React.ReactNode }) {
  return (
    <div className="p-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-light-gray">
      <div className="min-w-0 flex-1">
        <h2 className="text-[14px] font-semibold text-brand-charcoal">{title}</h2>
        <p className="text-[12px] text-subtle mt-0.5">{hint}</p>
      </div>
      {action && <div className="shrink-0 w-full md:w-auto">{action}</div>}
    </div>
  );
}

function ErrorBox({ error, fallback, onRetry }: { error: unknown; fallback: string; onRetry: () => void }) {
  return (
    <div className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <p className="text-[13px] text-error">{apiErrorMessage(error, fallback)}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

function SkeletonFields({ n }: { n: number }) {
  return (
    <div className="p-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-4" aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <span className="block h-2.5 w-24 rounded bg-black/[0.06] animate-pulse" />
          <span className="block h-10 rounded-lg bg-black/[0.06] animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function ConfigurationsPage() {
  return (
    <div className="flex flex-col gap-6 pb-12">
      <SiteSettingsCard />
      <CardPlaceholdersCard />
      <CheckoutMinimumsCard />
      <BusinessRulesCard />
    </div>
  );
}

/* ───────────────────────── Site settings ───────────────────────── */

function SiteSettingsCard() {
  const { data, isLoading, isError, error, refetch } = useGetSiteSettingsQuery();
  return (
    <section className={box}>
      <SectionHeader title="Site settings" hint="Contact details shown to customers, and marketplace-wide values." />
      {isLoading ? (
        <SkeletonFields n={4} />
      ) : isError || !data ? (
        <ErrorBox error={error} fallback="Couldn't load site settings." onRetry={refetch} />
      ) : (
        <SiteSettingsForm key={JSON.stringify(data.settings)} settings={data.settings} />
      )}
    </section>
  );
}

function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [email, setEmail] = useState(settings.contact_email);
  const [phone, setPhone] = useState(settings.contact_phone);
  const [radius, setRadius] = useState(String(settings.nearby_radius_km));
  const [markup, setMarkup] = useState(String(settings.marketplace_markup_percent));
  const [reason, setReason] = useState("");
  const [dedicated, setDedicated] = useState(settings.dedicated_accounts_enabled);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [save, { isLoading: isSaving }] = useUpdateSiteSettingsMutation();

  const markupChanged = Number(markup) !== settings.marketplace_markup_percent;
  const patch: SiteSettingsPatch = {};
  if (email.trim() !== settings.contact_email) patch.contact_email = email.trim();
  if (phone.trim() !== settings.contact_phone) patch.contact_phone = phone.trim();
  if (Number(radius) !== settings.nearby_radius_km) patch.nearby_radius_km = Number(radius);
  if (markupChanged) {
    patch.marketplace_markup_percent = Number(markup);
    if (reason.trim()) patch.markup_reason = reason.trim();
  }
  if (dedicated !== settings.dedicated_accounts_enabled) patch.dedicated_accounts_enabled = dedicated;
  const dirty = Object.keys(patch).length > 0;

  const reset = () => {
    setEmail(settings.contact_email);
    setPhone(settings.contact_phone);
    setRadius(String(settings.nearby_radius_km));
    setMarkup(String(settings.marketplace_markup_percent));
    setReason("");
    setDedicated(settings.dedicated_accounts_enabled);
    setErrors({});
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const next: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "Enter a valid email address.";
    if (!/^\+?[\d\s]{7,20}$/.test(phone.trim())) next.phone = "7–20 digits and spaces, with an optional leading +.";
    const r = Number(radius);
    if (!radius.trim() || !Number.isFinite(r) || r < 0.5 || r > 100) next.radius = "Between 0.5 and 100 km.";
    const m = Number(markup);
    if (!markup.trim() || !Number.isFinite(m) || m < 0 || m > 100) next.markup = "Between 0 and 100%.";
    if (markupChanged && reason.trim().length < 3) next.reason = "Say why the markup is changing (kept in price history).";
    setErrors(next);
    if (Object.values(next).some(Boolean) || !dirty) return;
    try {
      await save(patch).unwrap();
      toast.success("Site settings saved.");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't save site settings."));
    }
  };

  const field = (
    id: string,
    label: string,
    value: string,
    set: (v: string) => void,
    hint: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-brand-charcoal">{label}</span>
      <input
        id={id}
        value={value}
        onChange={(e) => set(e.target.value)}
        className={`${inputClass} ${errors[id] ? "border-error" : ""}`}
        aria-invalid={!!errors[id]}
        {...props}
      />
      {errors[id] ? <p className="text-[11px] text-error">{errors[id]}</p> : <p className="text-[11px] text-faint">{hint}</p>}
    </label>
  );

  return (
    <form onSubmit={submit} noValidate className="flex flex-col">
      <div className="p-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {field("email", "Contact email", email, setEmail, "Shown in the footer and on help pages.", { type: "email", maxLength: 254 })}
        {field("phone", "Contact phone", phone, setPhone, "Shown in the footer and on help pages.", { type: "tel", maxLength: 20 })}
        {field("radius", "Nearby wholesalers radius (km)", radius, setRadius, "How far retailers see wholesalers “near you”. 0.5–100 km.", {
          type: "number",
          min: 0.5,
          max: 100,
          step: 0.5,
        })}
        {field("markup", "Koolboks markup (%)", markup, setMarkup, "Added to the vendor price everywhere a buyer sees a price. Needs Pricing → Edit.", {
          type: "number",
          min: 0,
          max: 100,
          step: 0.1,
        })}
        {markupChanged && (
          <div className="md:col-span-2">
            {field("reason", "Reason for the markup change *", reason, setReason, "Kept in price history with who changed it.", { maxLength: 2000 })}
          </div>
        )}
        <div className="md:col-span-2 flex flex-col gap-1">
          <Switch
            checked={dedicated}
            onChange={(e) => setDedicated(e.target.checked)}
            label={<span className="text-xs font-semibold text-brand-charcoal">Paystack dedicated accounts</span>}
          />
          <p className="text-[11px] text-faint">
            Gives buyers a personal bank account number to pay into. Only a Super Admin can switch this.
          </p>
        </div>
      </div>
      <div className="p-4 sm:px-6 flex justify-end gap-3 border-t border-light-gray">
        <Button variant="outline" type="button" onClick={reset} disabled={!dirty || isSaving}>
          Discard changes
        </Button>
        <Button variant="accent" type="submit" disabled={!dirty || isSaving}>
          {isSaving ? "Saving…" : "Save settings"}
        </Button>
      </div>
    </form>
  );
}

/* ───────────────────────── Checkout minimums ───────────────────────── */

const METRIC_LABEL: Record<string, string> = { kg: "Kilograms", litre: "Litres", ngn: "Order value (NGN)" };

function thresholdText(r: Pick<CheckoutMinimum, "metric" | "threshold">) {
  if (r.metric === "ngn") return formatMoney(r.threshold, "NGN");
  return `${r.threshold.toLocaleString()} ${r.metric === "kg" ? "kg" : "litres"}`;
}

function CheckoutMinimumsCard() {
  const { data, isLoading, isFetching, isError, error, refetch } = useGetCheckoutMinimumsQuery();
  const [editing, setEditing] = useState<CheckoutMinimum | "new" | null>(null);
  const items = data?.items ?? [];
  const COLS = 6;

  return (
    <section className={`${box} overflow-hidden`}>
      <SectionHeader
        title="Minimum order at checkout"
        hint="Each store order must reach this quantity or value before the buyer can check out. One rule per market and buyer type."
        action={
          <Button variant="primary" iconLeft={<HiOutlinePlus size={14} aria-hidden />} onClick={() => setEditing("new")}>
            Add rule
          </Button>
        }
      />
      <div className={`admin-table-container transition-opacity ${isFetching && !isLoading ? "opacity-60" : ""}`}>
        <table>
          <thead>
            <tr>
              <th>Market</th>
              <th>Buyer type</th>
              <th>Minimum</th>
              <th>Status</th>
              <th>Note</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 2 }, (_, i) => (
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
                <td colSpan={COLS} className="p-0">
                  <ErrorBox error={error} fallback="Couldn't load the checkout minimums." onRetry={refetch} />
                </td>
              </tr>
            ) : items.length === 0 ? (
              <EmptyTableRow
                colSpan={COLS}
                illustration="settings"
                title="No minimums set"
                description="Buyers can check out any order size until you add a rule."
                action={{ label: "Add rule", onClick: () => setEditing("new") }}
              />
            ) : (
              items.map((r) => (
                <tr key={r.id}>
                  <td className="text-xs font-semibold text-brand-charcoal">{r.market}</td>
                  <td className="text-xs text-subtle">{humanize(r.audience)}s</td>
                  <td className="text-xs text-brand-charcoal tabular-nums whitespace-nowrap">{thresholdText(r)}</td>
                  <td>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        r.is_active ? "bg-success-soft text-success" : "bg-off-white text-subtle"
                      }`}
                    >
                      {r.is_active ? "On" : "Off"}
                    </span>
                  </td>
                  <td className="text-xs text-subtle max-w-64 truncate" title={r.note || undefined}>
                    {r.note || "—"}
                    <span className="block text-[11px] text-faint">Updated {formatDate(r.updated_at)}</span>
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={() => setEditing(r)}
                      aria-label={`Edit the ${r.market} ${r.audience} minimum`}
                      title="Edit rule"
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
      <MinimumModal rule={editing} existing={items} onClose={() => setEditing(null)} />
    </section>
  );
}

function MinimumModal({
  rule,
  existing,
  onClose,
}: {
  rule: CheckoutMinimum | "new" | null;
  existing: CheckoutMinimum[];
  onClose: () => void;
}) {
  const isNew = rule === "new";
  const current = rule && rule !== "new" ? rule : null;
  const [market, setMarket] = useState<"NG" | "KE" | "UG">("NG");
  const [audience, setAudience] = useState<MinimumAudience>("retailer");
  const [metric, setMetric] = useState<MinimumMetric>("ngn");
  const [threshold, setThreshold] = useState("");
  const [active, setActive] = useState(true);
  const [note, setNote] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [seen, setSeen] = useState<typeof rule>(null);
  const [save, { isLoading: isSaving }] = useSaveCheckoutMinimumMutation();

  if (rule !== seen) {
    setSeen(rule);
    if (rule) {
      setMarket(current?.market === "KE" ? "KE" : "NG");
      setAudience(current?.audience === "wholesaler" ? "wholesaler" : "retailer");
      setMetric((["kg", "litre", "ngn"].includes(current?.metric ?? "") ? current!.metric : "ngn") as MinimumMetric);
      setThreshold(current ? String(current.threshold) : "");
      setActive(current?.is_active ?? true);
      setNote(current?.note ?? "");
      setReason("");
      setErrors({});
    }
  }

  const replaces = isNew ? existing.find((r) => r.market === market && r.audience === audience) : undefined;

  const submit = async () => {
    const next: Record<string, string> = {};
    const t = Number(threshold);
    if (!threshold.trim() || !Number.isFinite(t) || t <= 0) next.threshold = "The minimum must be above zero.";
    else if (t > 1_000_000_000) next.threshold = "The minimum is too large.";
    if (reason.trim().length < 3) next.reason = "Give a reason for the change (at least 3 characters).";
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    try {
      await save({ market, audience, metric, threshold: t, is_active: active, note: note.trim(), reason: reason.trim() }).unwrap();
      toast.success(`Minimum for ${market} ${audience}s saved.`);
      onClose();
    } catch (e) {
      toast.error(apiErrorMessage(e, "Couldn't save the minimum."));
    }
  };

  return (
    <Modal
      isOpen={!!rule}
      onClose={() => !isSaving && onClose()}
      title={isNew ? "Add checkout minimum" : "Edit checkout minimum"}
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="accent" onClick={submit} disabled={isSaving}>
            {isSaving ? "Saving…" : "Save rule"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-brand-charcoal">Market</span>
            <select className={inputClass} value={market} onChange={(e) => setMarket(e.target.value as "NG" | "KE" | "UG")} disabled={!isNew}>
              <option value="NG">Nigeria (NG)</option>
              <option value="KE">Kenya (KE)</option>
              <option value="UG">Uganda (UG)</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-brand-charcoal">Buyer type</span>
            <select
              className={inputClass}
              value={audience}
              onChange={(e) => setAudience(e.target.value as MinimumAudience)}
              disabled={!isNew}
            >
              <option value="retailer">Retailers</option>
              <option value="wholesaler">Wholesalers</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-brand-charcoal">Measure</span>
            <select className={inputClass} value={metric} onChange={(e) => setMetric(e.target.value as MinimumMetric)}>
              {(["ngn", "kg", "litre"] as const).map((m) => (
                <option key={m} value={m}>
                  {METRIC_LABEL[m]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-brand-charcoal">Minimum *</span>
            <input
              className={`${inputClass} ${errors.threshold ? "border-error" : ""}`}
              type="number"
              min={0}
              step="any"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
            />
            {errors.threshold && <p className="text-[11px] text-error">{errors.threshold}</p>}
          </label>
        </div>
        {replaces && (
          <p className="text-[12px] text-brand-orange-text">
            This replaces the current {market} {audience} minimum ({thresholdText(replaces)}).
          </p>
        )}
        <p className="text-[11px] text-faint">Order value counts goods only: no delivery, VAT or financing fees.</p>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-brand-charcoal">Note</span>
          <input className={inputClass} value={note} maxLength={500} onChange={(e) => setNote(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-brand-charcoal">Reason for the change *</span>
          <input
            className={`${inputClass} ${errors.reason ? "border-error" : ""}`}
            value={reason}
            maxLength={500}
            onChange={(e) => setReason(e.target.value)}
          />
          {errors.reason ? (
            <p className="text-[11px] text-error">{errors.reason}</p>
          ) : (
            <p className="text-[11px] text-faint">Kept in the audit log.</p>
          )}
        </label>
        <Switch
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          label={<span className="text-xs text-brand-charcoal">Rule is on</span>}
        />
      </div>
    </Modal>
  );
}

/* ───────────────────────── Business rules ───────────────────────── */

function BusinessRulesCard() {
  const { data, isLoading, isError, error, refetch } = useGetBusinessRulesQuery();
  const [search, setSearch] = useState("");
  const sections = data?.sections ?? [];

  const filtered = search.trim()
    ? sections.filter((s) => {
        const q = search.toLowerCase();
        return (
          s.title?.toLowerCase().includes(q) ||
          s.about?.toLowerCase().includes(q) ||
          s.limits?.toLowerCase().includes(q) ||
          s.values?.some((v) => v.label.toLowerCase().includes(q) || String(v.value).toLowerCase().includes(q))
        );
      })
    : sections;

  return (
    <section className={box}>
      <SectionHeader
        title="Business rules"
        hint="Every configurable rule and its current value. Each is changed in its own place; this is an overview."
        action={
          <div className="w-full sm:w-64 md:w-72">
            <Search
              value={search}
              onChange={(val) => setSearch(typeof val === "string" ? val : (val as { target?: { value?: string } }).target?.value ?? "")}
              placeholder="Search business rules..."
              className="w-full sm:!w-64 md:!w-72"
              maxWidth="max-w-none"
            />
          </div>
        }
      />
      <div className="min-h-[360px]">
        {isLoading ? (
          <SkeletonFields n={4} />
        ) : isError ? (
          <ErrorBox error={error} fallback="Couldn't load the business rules." onRetry={refetch} />
        ) : sections.length === 0 ? (
          <EmptyState illustration="settings" title="No rules to show" description="Rules your role can see will appear here." size="sm" />
        ) : filtered.length === 0 ? (
          <div className="p-8 flex items-center justify-center min-h-[300px]">
            <EmptyState illustration="search" title="No matching rules" description="Try a different search term." size="sm" />
          </div>
        ) : (
          <div className="p-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((s) => (
              <RuleSection key={s.key} section={s} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function RuleSection({ section: s }: { section: BusinessRuleSection }) {
  const row = (label: React.ReactNode, value: React.ReactNode, key: string) => (
    <div key={key} className="flex items-start justify-between gap-3 py-1.5 border-b border-light-gray last:border-0">
      <span className="text-[12px] text-subtle">{label}</span>
      <span className="text-[12px] font-semibold text-brand-charcoal text-right tabular-nums">{value}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg bg-off-white">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[13px] font-semibold text-brand-charcoal">{s.title}</h3>
        {!s.can_edit && <span className="text-[11px] text-faint whitespace-nowrap">View only</span>}
      </div>
      <p className="text-[12px] text-subtle leading-relaxed">{s.about}</p>
      <div className="flex flex-col">
        {s.values?.map((v, i) =>
          row(v.label, `${typeof v.value === "number" ? v.value.toLocaleString() : v.value}${v.unit ? ` ${v.unit}` : ""}`, `v${i}`),
        )}
        {s.policies?.map((p) =>
          row(
            `${p.market} (${p.currency})${p.enabled ? "" : " · off"}`,
            p.bands.length
              ? p.bands.map((b) => `${b.min_days}–${b.max_days} days: ${b.fee_percent}%`).join(" · ")
              : `${p.min_days}–${p.max_days} days`,
            `p${p.market}`,
          ),
        )}
        {s.rules &&
          (s.rules.length
            ? s.rules.map((r, i) =>
                row(
                  `${r.name} (${r.freezer})`,
                  `${r.threshold?.toLocaleString() ?? "—"} ${r.metric === "ngn" ? "NGN" : r.metric} ${humanize(r.period).toLowerCase()}`,
                  `r${i}`,
                ),
              )
            : row("Rules", "none", "r-none"))}
        {s.models && (
          <>
            {s.default_contribution_percent !== undefined &&
              row("Default contribution", `${s.default_contribution_percent}%`, "m-default")}
            {s.offer_expiry_days !== undefined && row("Offer expiry", `${s.offer_expiry_days} days`, "m-expiry")}
            {s.models.map((m) =>
              row(
                m.name,
                `${formatMoney(m.unlock_price, m.currency)} unlock · ${m.effective_contribution_percent ?? "—"}%`,
                `m${m.id}`,
              ),
            )}
          </>
        )}
      </div>
      {s.limits && <p className="text-[11px] text-faint">Limits: {s.limits}</p>}
    </div>
  );
}
