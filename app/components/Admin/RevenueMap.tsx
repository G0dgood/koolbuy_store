"use client";

import React, { useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Map as MbMap } from "mapbox-gl";
import { naira } from "./DashboardUi";

/* Mapbox map for the admin dashboard, set up like the Sales CRM team map
   (components/features/manager/MapboxMap.tsx in koolboks_sales_crm_web).
   Token: NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in .env.local. */

export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";

/** True when Mapbox can be used (a token is configured). */
export const hasMapbox = () => Boolean(MAPBOX_TOKEN);

export interface RevenuePoint {
  name: string;
  value: number;
  lat: number;
  lng: number;
}

const LAGOS: [number, number] = [3.3792, 6.5244];

/** A popup body built from text nodes (never HTML from data). */
const popupBody = (title: string, line: string) => {
  const el = document.createElement("div");
  el.style.cssText = "font: 13px/1.4 'Work Sans', system-ui, sans-serif; color: #050711";
  const h = document.createElement("div");
  h.style.fontWeight = "600";
  h.textContent = title;
  const p = document.createElement("div");
  p.style.color = "#6C757D";
  p.textContent = line;
  el.append(h, p);
  return el;
};

/**
 * Revenue by area: an orange circle per area, sized by its revenue. Tap a
 * circle for the amount. Calls onFail when Mapbox can't load (bad token,
 * blocked network) so the card can fall back to the static map.
 */
export default function RevenueMap({
  points,
  height = 260,
  onFail,
}: {
  points: RevenuePoint[];
  height?: number;
  onFail?: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<MbMap | null>(null);

  useEffect(() => {
    let cancelled = false;
    let m: MbMap | null = null;
    // Each map draws into its own inner element, so a map that is still being
    // torn down (see cleanup) never overlaps the next one.
    const el = document.createElement("div");
    el.style.cssText = "position:absolute;inset:0";
    box.current?.appendChild(el);
    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      if (cancelled || !box.current) return;
      mapboxgl.accessToken = MAPBOX_TOKEN;
      m = new mapboxgl.Map({
        container: el,
        style: document.documentElement.classList.contains("dark")
          ? "mapbox://styles/mapbox/dark-v11"
          : "mapbox://styles/mapbox/light-v11",
        center: LAGOS,
        zoom: 8,
        attributionControl: true,
        cooperativeGestures: true, // page scroll isn't hijacked; ctrl/⌘ + scroll zooms
      });
      map.current = m;
      m.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
      m.on("error", (e) => {
        const status = (e.error as { status?: number } | undefined)?.status;
        if (status === 401 || status === 403) onFail?.();
      });

      m.on("load", () => {
        if (!m) return;
        const max = Math.max(...points.map((p) => p.value), 1);
        m.addSource("revenue", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: points.map((p) => ({
              type: "Feature",
              properties: { name: p.name, amount: naira(p.value), size: p.value / max },
              geometry: { type: "Point", coordinates: [p.lng, p.lat] },
            })),
          },
        });
        // Soft halo, then the solid dot: bigger for more revenue.
        m.addLayer({
          id: "revenue-halo",
          type: "circle",
          source: "revenue",
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["get", "size"], 0, 10, 1, 30],
            "circle-color": "#F57E16",
            "circle-opacity": 0.18,
          },
        });
        m.addLayer({
          id: "revenue",
          type: "circle",
          source: "revenue",
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["get", "size"], 0, 5, 1, 11],
            "circle-color": "#F57E16",
            "circle-stroke-color": "#FFFFFF",
            "circle-stroke-width": 2,
          },
        });

        m.on("click", "revenue", (e) => {
          const f = e.features?.[0] as unknown as
            | { properties?: Record<string, unknown>; geometry?: { coordinates: [number, number] } }
            | undefined;
          if (!f?.geometry) return;
          new mapboxgl.Popup({ offset: 12, closeButton: false })
            .setLngLat(f.geometry.coordinates)
            .setDOMContent(popupBody(String(f.properties?.name), String(f.properties?.amount)))
            .addTo(m!);
        });
        m.on("mouseenter", "revenue", () => (m!.getCanvas().style.cursor = "pointer"));
        m.on("mouseleave", "revenue", () => (m!.getCanvas().style.cursor = ""));

        // Fit every area in view.
        if (points.length > 1) {
          const lngs = points.map((p) => p.lng);
          const lats = points.map((p) => p.lat);
          m.fitBounds(
            [
              [Math.min(...lngs), Math.min(...lats)],
              [Math.max(...lngs), Math.max(...lats)],
            ],
            { padding: 50, maxZoom: 11, duration: 0 },
          );
        } else if (points.length === 1) {
          m.jumpTo({ center: [points[0].lng, points[0].lat], zoom: 11 });
        }
      });
    })().catch(() => onFail?.());

    return () => {
      cancelled = true;
      map.current = null;
      // Hide now, remove a little later. Mapbox sends a "map loaded" usage event
      // when a map starts and clears that event's error callback in remove();
      // removing straight away (React mounts twice in development) made a failed
      // or blocked event call the cleared callback: "this.errorCb is not a function".
      el.style.display = "none";
      const dead = m;
      window.setTimeout(() => {
        dead?.remove();
        el.remove();
      }, 5000);
    };
    // The map is created once for the given points.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={box}
      role="region"
      aria-label="Revenue map"
      className="relative w-full rounded-lg overflow-hidden border border-light-gray"
      style={{ height }}
    />
  );
}
