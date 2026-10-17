"use client";

import React, { useState, useEffect } from "react";
import Drawer from "../Drawer/Drawer";
import { Input, Textarea } from "../Form/Inputs";
import { Button } from "../Button";
import { Icon } from "../Icon";

interface EditMediaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  media: any;
}

export function EditMediaDrawer({ isOpen, onClose, media }: EditMediaDrawerProps) {
  const [formData, setFormData] = useState({
    name: "",
    altText: "",
  });

  useEffect(() => {
    if (media) {
      setFormData({
        name: media.name || "",
        altText: media.altText || "",
      });
    }
  }, [media]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving media metadata:", { ...media, ...formData });
    onClose();
  };

  if (!media) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Asset Metadata Settings">
      <form onSubmit={handleSubmit} className="flex flex-col h-full gap-8">
        <div className="flex flex-col gap-8">
          {/* Asset Preview Header */}
          <div className="flex flex-col gap-4">
             <div className="relative aspect-video rounded-lg overflow-hidden bg-off-white border border-light-gray flex items-center justify-center p-6 group">
                <img src={media.url} alt="" className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
                {media.type === "video" && (
                   <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-float">
                         <Icon name="play_circle_filled" folder="icon" size="sm" className="text-brand-charcoal" />
                      </div>
                   </div>
                )}
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[11px] font-semibold text-brand-charcoal border border-light-gray/50">
                   {media.type}
                </div>
             </div>
             <div className="flex items-center justify-between px-1">
                <div className="flex flex-col gap-0.5">
                   <h4 className="text-[13px] font-semibold text-brand-charcoal truncate max-w-[240px]">{media.name}</h4>
                   <span className="text-[12px] font-medium text-subtle">{media.size} • {media.date}</span>
                </div>
                <button 
                   type="button"
                   className="p-2 rounded-lg border border-light-gray text-faint hover:text-brand-orange-text hover:border-brand-charcoal/30 transition-all"
                   onClick={() => window.open(media.url, '_blank')}
                   title="View Full Asset"
                >
                   <Icon name="link-external" folder="dashboardIcon" size="sm" />
                </button>
             </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-subtle px-1">Filename management</label>
              <Input
                type="text"
                placeholder="e.g. product_hero_main"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 border-light-gray font-semibold text-brand-charcoal"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-subtle px-1">SEO alternative text</label>
              <Textarea
                placeholder="Describe the asset for screen readers and search engines..."
                value={formData.altText}
                onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                className="min-h-[120px] border-light-gray text-xs font-medium text-subtle leading-relaxed"
              />
              <p className="text-[11px] font-semibold text-faint mt-1 pl-1">
                 Optimization Tip: Use descriptive keywords that relate to the associated product.
              </p>
            </div>
          </div>

          {/* Technical Metadata (Read-only) */}
          <div className="bg-off-white rounded-lg border border-light-gray p-6 flex flex-col gap-4">
             <span className="text-[12px] font-medium text-subtle">Technical details</span>
             <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                <div className="flex flex-col gap-1">
                   <span className="text-[11px] font-semibold text-faint">Resolution</span>
                   <span className="text-xs font-semibold text-brand-charcoal">1920 × 1080 (HD)</span>
                </div>
                <div className="flex flex-col gap-1">
                   <span className="text-[11px] font-semibold text-faint">MIME Type</span>
                   <span className="text-xs font-semibold text-brand-charcoal">{media.type === 'video' ? 'video/mp4' : 'image/png'}</span>
                </div>
                <div className="flex flex-col gap-1">
                   <span className="text-[11px] font-semibold text-faint">Storage Class</span>
                   <span className="text-xs font-semibold text-brand-charcoal">Standard Multi-Regional</span>
                </div>
                <div className="flex flex-col gap-1">
                   <span className="text-[11px] font-semibold text-faint">Optimized</span>
                   <div className="flex items-center gap-1.5 text-success">
                      <Icon name="verified" folder="icon" size="xs" />
                      <span className="text-xs font-semibold">Passed</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-light-gray flex flex-col gap-3">
          <Button 
            variant="primary" 
            type="submit"
            className="w-full h-10 text-[12px] font-semibold"
          >
            Update asset metadata
          </Button>
          <Button 
            variant="ghost" 
            type="button" 
            onClick={onClose}
            className="w-full h-10 text-[11px] font-semibold text-faint hover:text-brand-charcoal"
          >
            Discard Changes
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
