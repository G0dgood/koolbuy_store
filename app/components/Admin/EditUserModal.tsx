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
import {
  useUpdateStaffMemberMutation,
  type AdminRole,
  type StaffMember,
  type UpdateStaffBody,
} from "@/lib/store/api/people-api";
import { fieldLabel, validateStaffForm } from "./AddUserModal";

interface EditUserModalProps {
  /** The team member to edit; the modal is open while this is set. */
  staff: StaffMember | null;
  onClose: () => void;
  roles: AdminRole[];
}

type Form = { first_name: string; last_name: string; email: string; phone_number: string; role_id: string; password: string };

const fromStaff = (s: StaffMember): Form => ({
  first_name: s.first_name ?? "",
  last_name: s.last_name ?? "",
  email: s.email ?? "",
  phone_number: s.phone_number ?? "",
  role_id: s.role?.id ?? "",
  password: "",
});

export function EditUserModal({ staff, onClose, roles }: EditUserModalProps) {
  return (
    <Modal isOpen={!!staff} onClose={onClose} title="Edit team member" size="lg">
      {staff && <EditForm key={staff.id} staff={staff} onClose={onClose} roles={roles} />}
    </Modal>
  );
}

function EditForm({ staff, onClose, roles }: { staff: StaffMember; onClose: () => void; roles: AdminRole[] }) {
  const initial = fromStaff(staff);
  const [form, setForm] = useState<Form>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [updateStaff, { isLoading }] = useUpdateStaffMemberMutation();

  const set = (key: keyof Form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateStaffForm(form, { requirePassword: false, requireRole: !staff.is_super_admin });
    setErrors(found);
    if (Object.keys(found).length) return;

    // Send only what changed
    const body: UpdateStaffBody = { id: staff.id };
    if (form.first_name.trim() !== initial.first_name) body.first_name = form.first_name.trim();
    if (form.last_name.trim() !== initial.last_name) body.last_name = form.last_name.trim();
    if (form.email.trim().toLowerCase() !== initial.email.toLowerCase()) body.email = form.email.trim().toLowerCase();
    if (form.phone_number.trim() !== initial.phone_number) body.phone_number = form.phone_number.trim() || null;
    if (!staff.is_super_admin && form.role_id && form.role_id !== initial.role_id) body.role_id = form.role_id;
    if (form.password) body.password = form.password;

    if (Object.keys(body).length === 1) {
      onClose();
      return;
    }
    try {
      await updateStaff(body).unwrap();
      toast.success(`${staff.name || "Team member"} was updated.`);
      onClose();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't save these changes."));
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <ModalBody className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className={fieldLabel}>First name</span>
            <Input value={form.first_name} onChange={(e) => set("first_name", e.target.value)} error={!!errors.first_name} />
            {errors.first_name && <span className="text-[12px] text-error">{errors.first_name}</span>}
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={fieldLabel}>Last name</span>
            <Input value={form.last_name} onChange={(e) => set("last_name", e.target.value)} error={!!errors.last_name} />
            {errors.last_name && <span className="text-[12px] text-error">{errors.last_name}</span>}
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={fieldLabel}>Email</span>
            <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} error={!!errors.email} />
            {errors.email && <span className="text-[12px] text-error">{errors.email}</span>}
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={fieldLabel}>
              Phone number <span className="text-faint font-normal">(optional)</span>
            </span>
            <Input type="tel" value={form.phone_number} onChange={(e) => set("phone_number", e.target.value)} error={!!errors.phone_number} />
            {errors.phone_number && <span className="text-[12px] text-error">{errors.phone_number}</span>}
          </label>
          <div className="flex flex-col gap-1.5">
            <span className={fieldLabel}>Role</span>
            {staff.is_super_admin ? (
              <p className="text-[13px] text-faint py-2">Super Admin holds every permission; no role is needed.</p>
            ) : (
              <Select
                options={roles.map((r) => ({ value: r.id, label: r.name }))}
                value={form.role_id}
                onChange={(v) => set("role_id", v)}
                placeholder="Pick a role"
                error={errors.role_id}
              />
            )}
          </div>
          <label className="flex flex-col gap-1.5">
            <span className={fieldLabel}>
              New password <span className="text-faint font-normal">(optional)</span>
            </span>
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
              <span className="text-[12px] text-faint">Leave empty to keep their password. They must change a new one at sign-in.</span>
            )}
          </label>
        </div>
      </ModalBody>

      <ModalFooter className="py-4">
        <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" isLoading={isLoading} disabled={isLoading}>
          Save changes
        </Button>
      </ModalFooter>
    </form>
  );
}
