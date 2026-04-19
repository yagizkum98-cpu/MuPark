"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type MapZone = {
  id: string;
  slug: string;
  name: string;
  block: string;
  address: string;
  capacity: number;
  hourlyRate: number;
  status: string;
  color?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  occupied: number;
  occupancyRate: number;
  availableSpots: number;
};

type MapboxMap = {
  remove: () => void;
  flyTo: (options: { center: [number, number]; zoom?: number; essential?: boolean }) => void;
};

type MapboxMarker = {
  setLngLat: (value: [number, number]) => MapboxMarker;
  setPopup: (value: unknown) => MapboxMarker;
  addTo: (map: MapboxMap) => MapboxMarker;
  remove: () => void;
};

type MapboxPopup = {
  setHTML: (html: string) => MapboxPopup;
};

type MapboxNamespace = {
  accessToken: string;
  Map: new (options: Record<string, unknown>) => MapboxMap;
  Marker: new (options: Record<string, unknown>) => MapboxMarker;
  Popup: new (options: Record<string, unknown>) => MapboxPopup;
};

declare global {
  interface Window {
    mapboxgl?: MapboxNamespace;
  }
}

const MAPBOX_SCRIPT_ID = "mapbox-gl-script";
const MAPBOX_STYLE_ID = "mapbox-gl-style";

function ensureMapboxAssets() {
  const styleHref = "https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css";
  const scriptSrc = "https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js";

  if (!document.getElementById(MAPBOX_STYLE_ID)) {
    const link = document.createElement("link");
    link.id = MAPBOX_STYLE_ID;
    link.rel = "stylesheet";
    link.href = styleHref;
    document.head.appendChild(link);
  }

  return new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(MAPBOX_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (window.mapboxgl) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Mapbox script could not be loaded")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = MAPBOX_SCRIPT_ID;
    script.src = scriptSrc;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Mapbox script could not be loaded"));
    document.body.appendChild(script);
  });
}

function getOccupancyTone(rate: number) {
  if (rate >= 80) return "#dc2626";
  if (rate >= 55) return "#f59e0b";
  return "#059669";
}

function getStatusLabel(rate: number) {
  if (rate >= 80) return "Yuksek doluluk";
  if (rate >= 55) return "Orta doluluk";
  return "Rahat";
}

export default function FethiyeParkingMap({
  zones,
  token,
  title,
  description,
}: {
  zones: MapZone[];
  token?: string;
  title: string;
  description: string;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<MapboxMap | null>(null);
  const markersRef = useRef<MapboxMarker[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>(zones[0]?.slug ?? "");
  const [mapError, setMapError] = useState<string | null>(null);

  const selectedZone = useMemo(
    () => zones.find((zone) => zone.slug === selectedSlug) ?? zones[0] ?? null,
    [selectedSlug, zones]
  );

  const center = useMemo(() => {
    if (selectedZone) {
      return [selectedZone.coordinates.lng, selectedZone.coordinates.lat] as [number, number];
    }
    if (!zones.length) {
      return [29.12758, 36.64038] as [number, number];
    }
    const totals = zones.reduce(
      (acc, zone) => ({
        lat: acc.lat + zone.coordinates.lat,
        lng: acc.lng + zone.coordinates.lng,
      }),
      { lat: 0, lng: 0 }
    );
    return [totals.lng / zones.length, totals.lat / zones.length] as [number, number];
  }, [selectedZone, zones]);

  useEffect(() => {
    if (!token || !mapRef.current || !zones.length) return;
    const mapToken = token;

    let cancelled = false;

    async function initMap() {
      try {
        await ensureMapboxAssets();
        if (cancelled || !mapRef.current || !window.mapboxgl) return;

        const mapboxgl = window.mapboxgl;
        mapboxgl.accessToken = mapToken;
        setMapError(null);

        if (!instanceRef.current) {
          instanceRef.current = new mapboxgl.Map({
            container: mapRef.current,
            style: "mapbox://styles/mapbox/light-v11",
            center,
            zoom: 12.8,
            pitch: 28,
            attributionControl: true,
          });
        }

        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = zones.map((zone) => {
          const element = document.createElement("button");
          element.type = "button";
          element.setAttribute("aria-label", zone.name);
          element.style.width = "18px";
          element.style.height = "18px";
          element.style.borderRadius = "9999px";
          element.style.border = "3px solid white";
          element.style.boxShadow = "0 10px 30px rgba(15, 23, 42, 0.28)";
          element.style.background = zone.color ?? getOccupancyTone(zone.occupancyRate);
          element.style.cursor = "pointer";
          element.addEventListener("click", () => setSelectedSlug(zone.slug));

          const popup = new mapboxgl.Popup({ offset: 18 }).setHTML(
            `<div style="min-width:180px;font-family:Arial,sans-serif">
              <strong>${zone.name}</strong>
              <div style="margin-top:6px;font-size:12px;color:#475569">${zone.address}</div>
              <div style="margin-top:8px;font-size:12px;color:#0f172a">${zone.availableSpots}/${zone.capacity} bos</div>
              <div style="font-size:12px;color:#0f172a">Doluluk: %${zone.occupancyRate}</div>
            </div>`
          );

          return new mapboxgl.Marker({ element })
            .setLngLat([zone.coordinates.lng, zone.coordinates.lat])
            .setPopup(popup)
            .addTo(instanceRef.current!);
        });

        instanceRef.current.flyTo({ center, zoom: 13.1, essential: true });
      } catch (error) {
        if (!cancelled) {
          setMapError(error instanceof Error ? error.message : "Mapbox baslatilamadi");
        }
      }
    }

    void initMap();

    return () => {
      cancelled = true;
    };
  }, [center, token, zones]);

  useEffect(() => {
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      instanceRef.current?.remove();
      instanceRef.current = null;
    };
  }, []);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28rem] text-sky-700">Mapbox</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">{description}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
          {zones.length} Fethiye noktasi haritada isleniyor
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_340px]">
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-950">
          {token ? (
            <div ref={mapRef} className="h-[460px] w-full" />
          ) : (
            <div className="flex h-[460px] items-center justify-center px-6 text-center text-sm text-slate-300">
              `NEXT_PUBLIC_MAPBOX_TOKEN` tanimlandiginda Fethiye haritasi burada canli olarak render edilir.
            </div>
          )}
          {mapError ? (
            <div className="border-t border-white/10 bg-slate-900 px-4 py-3 text-sm text-rose-300">
              {mapError}
            </div>
          ) : null}
        </div>

        <div className="space-y-3">
          {zones.map((zone) => {
            const isActive = zone.slug === selectedZone?.slug;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => setSelectedSlug(zone.slug)}
                className={`w-full rounded-[1.5rem] border p-4 text-left transition ${
                  isActive
                    ? "border-sky-300 bg-sky-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{zone.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{zone.address}</p>
                  </div>
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
                    style={{ backgroundColor: zone.color ?? getOccupancyTone(zone.occupancyRate) }}
                  >
                    %{zone.occupancyRate}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-600">
                  <div className="rounded-2xl bg-slate-100 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Bos</p>
                    <p className="mt-1 font-semibold text-slate-900">{zone.availableSpots}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-100 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Kapasite</p>
                    <p className="mt-1 font-semibold text-slate-900">{zone.capacity}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-100 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Durum</p>
                    <p className="mt-1 font-semibold text-slate-900">{getStatusLabel(zone.occupancyRate)}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
