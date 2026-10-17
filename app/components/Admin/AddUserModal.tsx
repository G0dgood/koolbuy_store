"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import ModalFooter from "../Modal/ModalFooter";
import { Input } from "../Form/Inputs";
import { Select } from "../Form/Select";
import { Button } from "../Button";
import { apiErrorMessage } from "@/lib/store/base-api";
import { useCreateStaffMemberMutation, type AdminRole } from "@/lib/store/api/people-api";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: AdminRole[];
}

const EMPTY = { first_name: "", last_name: "", email: "", phone_number: "", role_id: "", password: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const fieldLabel = "text-[12px] font-medium text-brand-charcoal";

/** Validates the team-member form the same way the API does. */
export function validateStaffForm(
  f: typeof EMPTY,
  { requirePassword, requireRole }: { requirePassword: boolean; requireRole: boolean }
): Partial<Record<keyof typeof EMPTY, string>> {
  const errors: Partial<Record<keyof typeof EMPTY, string>> = {};
  if (!f.first_name.trim()) errors.first_name = "Enter the first name.";
  if (!f.last_name.trim()) errors.last_name = "Enter the last name.";
  if (!EMAIL_RE.test(f.email.trim())) errors.email = "Enter a valid email address.";
  if (f.phone_number.trim().length > 20) errors.phone_number = "Enter a valid phone number.";
  if (requireRole && !f.role_id) errors.role_id = "Pick a role for this team member.";
  if (requirePassword ? f.password.length < 8 : f.password.length > 0 && f.password.length < 8) {
    errors.password = "The password must be at least 8 characters.";
  }
  return errors;
}

export function AddUserModal({ isOpen, onClose, roles }: AddUserModalProps) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof EMPTY, string>>>({});
  const [createStaff, { isLoading }] = useCreateStaffMemberMutation();

  const set = (key: keyof typeof EMPTY, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const close = () => {
    if (isLoading) return;
    setForm(EMPTY);
    setErrors({});
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateStaffForm(form, { requirePassword: true, requireRole: true });
    setErrors(found);
    if (Object.keys(found).length) return;
    try {
      await createStaff({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim().toLowerCase(),
        phone_number: form.phone_number.trim() || null,
        role_id: form.role_id,
        password: form.password,
      }).unwrap();
      toast.success(`${form.first_name.trim()} ${form.last_name.trim()} was added to the team.`);
      setForm(EMPTY);
      setErrors({});
      onClose();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't add this team member."));
    }
  };

  const roleOptions = roles.map((r) => ({ value: r.id, label: r.name }));

  return (
    <Modal isOpen={isOpen} onClose={close} title="Add team member" size="lg">
      <form onSubmit={handleSubmit} noValidate>
        <ModalBody className="flex flex-col gap-5">
          <p className="text-[13px] text-faint">
            They sign in with this email and password, and are asked to choose their own password the first time.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className={fieldLabel}>First name</span>
              <Input value={form.first_name} onChange={(e) => set("first_name", e.target.value)} error={!!errors.first_name} autoComplete="off" />
              {errors.first_name && <span className="text-[12px] text-error">{errors.first_name}</span>}
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={fieldLabel}>Last name</span>
              <Input value={form.last_name} onChange={(e) => set("last_name", e.target.value)} error={!!errors.last_name} autoComplete="off" />
              {errors.last_name && <span className="text-[12px] text-error">{errors.last_name}</span>}
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={fieldLabel}>Email</span>
              <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} error={!!errors.email} autoComplete="off" />
              {errors.email && <span className="text-[12px] text-error">{errors.email}</span>}
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={fieldLabel}>
                Phone number <span className="text-faint font-normal">(optional)</span>
              </span>
              <Input type="tel" value={form.phone_number} onChange={(e) => set("phone_number", e.target.value)} error={!!errors.phone_number} autoComplete="off" />
              {errors.phone_number && <span className="text-[12px] text-error">{errors.phone_number}</span>}
            </label>
            <div className="flex flex-col gap-1.5">
              <span className={fieldLabel}>Role</span>
              <Select
                options={roleOptions}
                value={form.role_id}
                onChange={(v) => set("role_id", v)}
                placeholder={roles.length ? "Pick a role" : "No roles yet"}
                disabled={!roles.length}
                error={errors.role_id}
              />
            </div>
            <label className="flex flex-col gap-1.5">
              <span className={fieldLabel}>Temporary password</span>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                error={!!errors.password}
                autoComplete="new-password"
              />
              {errors.password ? (
                <span className="text-[12px] text-error">{errors.password}</span>
              ) : (
                <span className="text-[12px] text-faint">At least 8 characters.</span>
              )}
            </label>
          </div>
        </ModalBody>

        <ModalFooter className="py-4">
          <Button variant="outline" type="button" onClick={close} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading} disabled={isLoading}>
            Add team member
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
