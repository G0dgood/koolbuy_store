"use client";

import React, { useState, useEffect } from "react";
import Drawer from "../Drawer/Drawer";
import { Input, Textarea } from "../Form/Inputs";
import { Button } from "../Button";
import { Icon } from "../Icon";
import {
  useUpdateCategoryMutation,
  type VatTreatment,
} from "@/lib/store/api/categories-api";
import { apiErrorMessage } from "@/lib/store/base-api";
import { toast } from "sonner";

interface EditCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  category: any;
  onSuccess?: () => void;
}

export function EditCategoryDrawer({
  isOpen,
  onClose,
  category,
  onSuccess,
}: EditCategoryDrawerProps) {
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    vatTreatment: "standard" as VatTreatment,
    isActive: true,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.label || category.name || "",
        image: category.image || "",
        description: category.description || "",
        vatTreatment: (category.vat_treatment as VatTreatment) || "standard",
        isActive: category.is_active ?? true,
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = category?.slug;
    if (!slug) {
      toast.error("Category slug missing.");
      return;
    }

    try {
      await updateCategory({
        slug,
        label: formData.name.trim(),
        vat_treatment: formData.vatTreatment,
        is_active: formData.isActive,
      }).unwrap();

      toast.success(`Category "${formData.name.trim()}" updated successfully.`);
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      toast.error(apiErrorMessage(err, "Failed to update category."));
    }
  };

  if (!category) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Edit Category">
      <form onSubmit={handleSubmit} className="flex flex-col h-full gap-6">
        <div className="flex flex-col gap-5 text-xs">
          <div>
            <label className="text-xs font-semibold text-subtle mb-1.5 block">
              Category Name *
            </label>
            <Input
              placeholder="e.g. Solar Freezers"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-10 text-xs rounded-lg border-light-gray"
              required
              disabled={isLoading}
            />
            {category.slug && (
              <p className="text-[11px] text-faint mt-1">
                Slug: <code className="font-mono text-subtle">{category.slug}</code>
              </p>
            )}
          </div>

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
          </div>

          <div>
            <label className="text-xs font-semibold text-subtle mb-1.5 block">
              Category Status
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isActive: true })}
                className={`flex-1 h-9 rounded-lg border text-xs font-medium transition-all ${
                  formData.isActive
                    ? "border-success bg-success-soft text-success font-semibold"
                    : "border-light-gray bg-white text-subtle hover:bg-off-white"
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isActive: false })}
                className={`flex-1 h-9 rounded-lg border text-xs font-medium transition-all ${
                  !formData.isActive
                    ? "border-error bg-error-soft text-error font-semibold"
                    : "border-light-gray bg-white text-subtle hover:bg-off-white"
                }`}
              >
                Hidden
              </button>
            </div>
            <p className="text-[11px] text-faint mt-1">
              Hidden categories are excluded from vendor and customer selection.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-subtle mb-1.5 block">
              Category Image Path (Optional)
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
          </div>

          <div>
            <label className="text-xs font-semibold text-subtle mb-1.5 block">
              Description (Optional)
            </label>
            <Textarea
              placeholder="Provide a brief description of this category..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="min-h-[100px] text-xs rounded-lg border-light-gray p-2.5"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-light-gray flex gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-9 text-xs font-medium rounded-lg"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isLoading}
            className="flex-1 h-9 text-xs font-semibold rounded-lg bg-brand-charcoal text-white hover:bg-brand-charcoal/90 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Drawer>
  );
}

export default EditCategoryDrawer;
