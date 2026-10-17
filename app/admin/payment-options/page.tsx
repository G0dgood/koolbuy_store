"use client";

import React, { useRef, useState } from "react";
import { toast } from "sonner";
import {
  HiOutlineArrowDown,
  HiOutlineArrowUp,
  HiOutlineCloudArrowUp,
  HiOutlineCreditCard,
  HiOutlinePencilSquare,
  HiOutlinePlus,
  HiOutlineTrash,
} from "react-icons/hi2";
import { Button } from "@/app/components/Button";
import { Switch } from "@/app/components/Form/Switch";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import Modal from "@/app/components/Modal/Modal";
import { EmptyState } from "@/app/components/EmptyState";
import { apiErrorMessage } from "@/lib/store/base-api";
import { formatDate } from "@/lib/store/api/accounting-api";
import {
  IMAGE_TYPES,
  useCreatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useGetPaymentMethodsQuery,
  useReorderPaymentMethodsMutation,
  useUpdatePaymentMethodMutation,
  useUploadFile,
  type PaymentMethod,
} from "@/lib/store/api/catalogue-admin-api";

/* Payment options: the payment methods buyers see on the storefront (name and
   logo, in display order), from /admin/payment-methods/. Payments themselves
   run through Paystack; switching a method off only hides its logo.
   There is no payout-options endpoint (seller payouts are handled under
   Payout requests), so that sample section was removed. */

const inputClass =
  "w-full h-10 px-3 rounded-lg border border-light-gray text-xs focus:outline-none focus:border-brand-orange bg-white";

const validLogo = (v: string) => v === "" || /^https?:\/\/\S+$/i.test(v) || /^\/(?!\/)\S*$/.test(v);

export default function PaymentOptionsPage() {
  const { data, isLoading, isFetching, isError, error, refetch } = useGetPaymentMethodsQuery();
  const [updateMethod] = useUpdatePaymentMethodMutation();
  const [reorder, { isLoading: isReordering }] = useReorderPaymentMethodsMutation();
  const [deleteMethod, { isLoading: isDeleting }] = useDeletePaymentMethodMutation();
  const [editing, setEditing] = useState<PaymentMethod | "new" | null>(null);
  const [toDelete, setToDelete] = useState<PaymentMethod | null>(null);
  const items = data?.items ?? [];

  const toggle = async (m: PaymentMethod) => {
    try {
      await updateMethod({ id: m.id, is_active: !m.is_active }).unwrap();
      toast.success(m.is_active ? `${m.name} hidden from the storefront.` : `${m.name} shown on the storefront.`);
    } catch (e) {
      toast.error(apiErrorMessage(e, "Couldn't update the payment method."));
    }
  };

  const move = async (index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= items.length) return;
    const ids = items.map((m) => m.id);
    [ids[index], ids[j]] = [ids[j], ids[index]];
    try {
      await reorder(ids).unwrap();
      toast.success("Order saved.");
    } catch (e) {
      toast.error(apiErrorMessage(e, "Couldn't reorder the payment methods."));
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteMethod(toDelete.id).unwrap();
      toast.success(`${toDelete.name} deleted.`);
      setToDelete(null);
    } catch (e) {
      toast.error(apiErrorMessage(e, "Couldn't delete the payment method."));
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-brand-charcoal">Payment options</h1>
          <p className="text-xs text-subtle mt-0.5">
            The payment methods buyers see on the storefront, in display order. Payments are processed by Paystack.
          </p>
        </div>
        <Button variant="primary" iconLeft={<HiOutlinePlus size={14} aria-hidden />} onClick={() => setEditing("new")}>
          Add payment method
        </Button>
      </div>

      <div className={`bg-white border border-light-gray rounded-lg overflow-hidden transition-opacity ${isFetching && !isLoading ? "opacity-60" : ""}`}>
        {isLoading ? (
          <div className="p-4 sm:p-6 flex flex-col gap-3" aria-hidden>
            {Array.from({ length: 3 }, (_, i) => (
              <span key={i} className="block h-14 rounded-lg bg-black/[0.06] animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="py-12 flex flex-col items-center gap-2 text-center">
            <p className="text-[13px] text-error">{apiErrorMessage(error, "Couldn't load payment methods.")}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            illustration="payments"
            title="No payment methods yet"
            description="Payment methods you add will show on the storefront."
            action={{ label: "Add payment method", onClick: () => setEditing("new") }}
          />
        ) : (
          <ul className="divide-y divide-light-gray">
            {items.map((m, i) => (
              <li key={m.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 sm:px-6 py-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-14 h-10 rounded-lg border border-light-gray bg-white flex items-center justify-center overflow-hidden shrink-0">
                    {m.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.logo_url} alt="" className="max-w-full max-h-full object-contain p-1" />
                    ) : (
                      <HiOutlineCreditCard size={18} className="text-faint" aria-hidden />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-semibold text-brand-charcoal truncate">{m.name}</span>
                    <span className="text-[11px] text-faint">Updated {formatDate(m.updated_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Switch
                    checked={m.is_active}
                    onChange={() => toggle(m)}
                    aria-label={m.is_active ? `Hide ${m.name}` : `Show ${m.name}`}
                    label={<span className="text-[12px] text-subtle">{m.is_active ? "Shown" : "Hidden"}</span>}
                    className="mr-2"
                  />
                  <IconButton label="Move up" onClick={() => move(i, -1)} disabled={i === 0 || isReordering}>
                    <HiOutlineArrowUp size={14} />
                  </IconButton>
                  <IconButton label="Move down" onClick={() => move(i, 1)} disabled={i === items.length - 1 || isReordering}>
                    <HiOutlineArrowDown size={14} />
                  </IconButton>
                  <IconButton label={`Edit ${m.name}`} onClick={() => setEditing(m)}>
                    <HiOutlinePencilSquare size={14} />
                  </IconButton>
                  <IconButton label={`Delete ${m.name}`} onClick={() => setToDelete(m)} danger>
                    <HiOutlineTrash size={14} />
                  </IconButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <MethodModal method={editing} onClose={() => setEditing(null)} />

      <ConfirmationModal
        isOpen={!!toDelete}
        onClose={() => !isDeleting && setToDelete(null)}
        onConfirm={confirmDelete}
        title={`Delete ${toDelete?.name ?? "this payment method"}?`}
        message="It disappears from the storefront. To show it again later, switch it off instead of deleting."
        confirmText="Delete"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
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

function MethodModal({ method, onClose }: { method: PaymentMethod | "new" | null; onClose: () => void }) {
  const isNew = method === "new";
  const current = method && method !== "new" ? method : null;
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [active, setActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [seen, setSeen] = useState<typeof method>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const upload = useUploadFile();
  const [create, { isLoading: isCreating }] = useCreatePaymentMethodMutation();
  const [update, { isLoading: isUpdating }] = useUpdatePaymentMethodMutation();
  const busy = isCreating || isUpdating || isUploading;

  if (method !== seen) {
    setSeen(method);
    if (method) {
      setName(current?.name ?? "");
      setLogo(current?.logo_url ?? "");
      setActive(current?.is_active ?? true);
      setErrors({});
    }
  }

  const uploadLogo = async (file: File | undefined) => {
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type) && file.type !== "image/svg+xml") {
      setErrors((e) => ({ ...e, logo: "Use a JPG, PNG, WebP, AVIF or SVG image." }));
      return;
    }
    setIsUploading(true);
    try {
      setLogo(await upload(file));
      setErrors((e) => ({ ...e, logo: "" }));
    } catch (err) {
      setErrors((e) => ({ ...e, logo: apiErrorMessage(err, "Couldn't upload the logo.") }));
    } finally {
      setIsUploading(false);
    }
  };

  const submit = async () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Give the payment method a name.";
    else if (name.trim().length > 80) next.name = "Up to 80 characters.";
    if (!validLogo(logo.trim())) next.logo = "Use a full link (https://…) or a site path starting with /.";
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    const body = { name: name.trim(), logo_url: logo.trim(), is_active: active };
    try {
      if (isNew) {
        await create(body).unwrap();
        toast.success(`${body.name} added.`);
      } else if (current) {
        await update({ id: current.id, ...body }).unwrap();
        toast.success(`${body.name} saved.`);
      }
      onClose();
    } catch (e) {
      toast.error(apiErrorMessage(e, "Couldn't save the payment method."));
    }
  };

  return (
    <Modal
      isOpen={!!method}
      onClose={() => !busy && onClose()}
      title={isNew ? "Add payment method" : "Edit payment method"}
      size="sm"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="outline" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button variant="accent" onClick={submit} disabled={busy}>
            {isCreating || isUpdating ? "Saving…" : isNew ? "Add" : "Save"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-brand-charcoal">Name *</span>
          <input
            className={`${inputClass} ${errors.name ? "border-error" : ""}`}
            value={name}
            maxLength={80}
            placeholder="e.g. Visa"
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-[11px] text-error">{errors.name}</p>}
        </label>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-brand-charcoal">Logo</span>
          <div className="flex items-center gap-3">
            <div className="w-16 h-11 rounded-lg border border-light-gray bg-white flex items-center justify-center overflow-hidden shrink-0">
              {logo && validLogo(logo.trim()) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt="" className="max-w-full max-h-full object-contain p-1" />
              ) : (
                <HiOutlineCreditCard size={18} className="text-faint" aria-hidden />
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              iconLeft={<HiOutlineCloudArrowUp size={14} aria-hidden />}
              onClick={() => fileRef.current?.click()}
              disabled={busy}
            >
              {isUploading ? "Uploading…" : "Upload logo"}
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept={[...IMAGE_TYPES, "image/svg+xml"].join(",")}
              className="hidden"
              onChange={(e) => {
                uploadLogo(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </div>
          <input
            className={`${inputClass} ${errors.logo ? "border-error" : ""}`}
            value={logo}
            maxLength={500}
            placeholder="or paste a link: https://… or /images/…"
            onChange={(e) => setLogo(e.target.value)}
            aria-label="Logo link"
          />
          {errors.logo && <p className="text-[11px] text-error">{errors.logo}</p>}
        </div>
        <Switch
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          label={<span className="text-xs text-brand-charcoal">Show on the storefront</span>}
        />
      </div>
    </Modal>
  );
}
