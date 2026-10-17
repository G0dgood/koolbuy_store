"use client";

import React, { useState, useMemo } from "react";
import { Modal, ModalBody, ModalFooter } from "@/app/components/ui/Modal";
import { Input, Textarea } from "../Form/Inputs";
import { Button } from "../Button";
import { Icon } from "../Icon";
import {
  useCreateCategoryMutation,
  type VatTreatment,
} from "@/lib/store/api/categories-api";
import { apiErrorMessage } from "@/lib/store/base-api";
import { toast } from "sonner";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

function deriveSlug(label: string): string {
  return label
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 50)
    .replace(/_+$/g, "");
}

export function AddCategoryModal({
  isOpen,
  onClose,
  onSuccess,
}: AddCategoryModalProps) {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const [formData, setFormData] = useState({
    name: "",
    customSlug: "",
    vatTreatment: "standard" as VatTreatment,
    image: "",
    description: "",
  });

  const previewSlug = useMemo(() => {
    return formData.customSlug.trim()
      ? deriveSlug(formData.customSlug)
      : deriveSlug(formData.name);
  }, [formData.name, formData.customSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const label = formData.name.trim();
    if (!label) {
      toast.error("Please enter a category name.");
      return;
    }

    try {
      await createCategory({
        label,
        slug: previewSlug || undefined,
        vat_treatment: formData.vatTreatment,
      }).unwrap();

      toast.success(`Category "${label}" created successfully.`);
      // Reset form
      setFormData({
        name: "",
        customSlug: "",
        vatTreatment: "standard",
        image: "",
        description: "",
      });
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      toast.error(apiErrorMessage(err, "Failed to create category. Please check your inputs."));
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Category"
      description="Create a product category in the core catalog."
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <ModalBody className="space-y-4 py-4 text-xs">
          {/* Category Name */}
          <div>
            <label className="text-xs font-semibold text-subtle mb-1.5 block">
              Category Name <span className="text-error">*</span>
            </label>
            <Input
              placeholder="e.g. Solar Freezers, Poultry, Commercial Freezers"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-10 text-xs rounded-lg border-light-gray"
              required
              disabled={isLoading}
            />
            {previewSlug && (
              <p className="text-[11px] text-faint mt-1 flex items-center gap-1.5">
                <span>Unique slug:</span>
                <code className="bg-off-white text-brand-charcoal px-1.5 py-0.5 rounded text-[11px] font-mono">
                  {previewSlug}
                </code>
              </p>
            )}
          </div>

          {/* VAT Treatment */}
          <div>
            <label className="text-xs font-semibold text-subtle mb-1.5 block">
              VAT Treatment
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "standard", label: "Standard (7.5%)" },
                { value: "zero_rated", label: "Zero-Rated" },
                { value: "exempt", label: "VAT Exempt" },
              ].map((vat) => (
                <button
                  key={vat.value}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      vatTreatment: vat.value as VatTreatment,
                    })
                  }
                  disabled={isLoading}
                  className={`h-9 px-2 text-xs rounded-lg border text-center transition-all cursor-pointer font-medium ${
                    formData.vatTreatment === vat.value
                      ? "border-brand-charcoal bg-brand-charcoal text-white"
                      : "border-light-gray bg-white text-subtle hover:bg-off-white"
                  }`}
                >
                  {vat.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-faint mt-1">
              Determines tax application on products assigned to this category.
            </p>
          </div>

          {/* Category Image Path (Optional) */}
          <div>
            <label className="text-xs font-semibold text-subtle mb-1.5 block">
              Display Image Path (Optional)
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="/images/koolboks/items/1.webp"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="h-10 text-xs rounded-lg border-light-gray flex-1"
                disabled={isLoading}
              />
              <button
                type="button"
                className="w-10 h-10 p-0 flex items-center justify-center rounded-lg border border-light-gray bg-off-white text-subtle hover:bg-off-white transition-colors shrink-0 cursor-pointer"
                title="Browse image"
                disabled={isLoading}
              >
                <Icon name="photo" folder="icon" size="sm" />
              </button>
            </div>
            <p className="text-[11px] text-faint mt-1">
              Path to category icon or hero photo in public storage.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-subtle mb-1.5 block">
              Description (Optional)
            </label>
            <Textarea
              placeholder="Brief description of this cooling or equipment category..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="min-h-[80px] text-xs rounded-lg border-light-gray p-2.5"
              disabled={isLoading}
            />
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-2 px-6 py-4 bg-off-white/70 border-t border-light-gray">
          <Button
            variant="outline"
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 h-9 text-xs font-medium rounded-lg"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isLoading}
            className="px-5 h-9 text-xs font-semibold rounded-lg bg-brand-charcoal text-white hover:bg-brand-charcoal/90 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </span>
            ) : (
              "Create Category"
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

export default AddCategoryModal;
