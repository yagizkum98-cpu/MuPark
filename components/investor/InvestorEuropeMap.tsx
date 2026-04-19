"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type InvestorCity = {
  city: string;
  country: string;
  status: "pilot" | "active" | "scaling";
  revenue: number;
  growth: number;
  coordinates: {
    lat: number;
    lng: number;
  };
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

const MAPBOX_SCRIPT_ID = "investor-mapbox-script";
const MAPBOX_STYLE_ID = "investor-mapbox-style";

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
      existing.addEventListener("error", () => reject(new Error("Mapbox yuklenemedi")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = MAPBOX_SCRIPT_ID;
    script.src = scriptSrc;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Mapbox yuklenemedi"));
    document.body.appendChild(script);
  });
}

function statusColor(status: InvestorCity["status"]) {
  if (status === "pilot") return "#22c55e";
  if (status === "active") return "#38bdf8";
  return "#a855f7";
}

function statusLabel(status: InvestorCity["status"]) {
  if (status === "pilot") return "Pilot";
  if (status === "active") return "Active";
  return "Scaling";
}

export default function InvestorEuropeMap({
  cities,
  token,
}: {
  cities: InvestorCity[];
  token?: string;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<MapboxMap | null>(null);
  const markersRef = useRef<MapboxMarker[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<InvestorCity>(cities[0]);

  const center = useMemo<[number, number]>(() => [13.405, 50.2], []);

  useEffect(() => {
    if (!token || !mapRef.current || !cities.length) return;
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
            style: "mapbox://styles/mapbox/dark-v11",
            center,
            zoom: 3.2,
            pitch: 18,
            attributionControl: false,
          });
        }

        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = cities.map((city) => {
          const element = document.createElement("button");
          element.type = "button";
          element.style.width = "16px";
          element.style.height = "16px";
          element.style.borderRadius = "9999px";
          element.style.border = "2px solid rgba(255,255,255,0.9)";
          element.style.background = statusColor(city.status);
          element.style.boxShadow = "0 0 0 8px rgba(15, 23, 42, 0.25)";
          element.style.cursor = "pointer";
          element.addEventListener("click", () => setSelectedCity(city));

          const popup = new mapboxgl.Popup({ offset: 16 }).setHTML(
            `<div style="min-width:160px;font-family:Arial,sans-serif">
              <strong>${city.city}</strong>
              <div style="font-size:12px;color:#475569;margin-top:4px">${city.country}</div>
              <div style="font-size:12px;color:#0f172a;margin-top:8px">Status: ${statusLabel(city.status)}</div>
              <div style="font-size:12px;color:#0f172a">Revenue: €${city.revenue.toLocaleString("tr-TR")}</div>
            </div>`
          );

          return new mapboxgl.Marker({ element })
            .setLngLat([city.coordinates.lng, city.coordinates.lat])
            .setPopup(popup)
            .addTo(instanceRef.current!);
        });
      } catch (error) {
        if (!cancelled) {
          setMapError(error instanceof Error ? error.message : "Harita baslatilamadi");
        }
      }
    }

    void initMap();

    return () => {
      cancelled = true;
    };
  }, [center, cities, token]);

  useEffect(() => {
    if (!instanceRef.current) return;
    instanceRef.current.flyTo({
      center: [selectedCity.coordinates.lng, selectedCity.coordinates.lat],
      zoom: selectedCity.status === "scaling" ? 4.2 : 4.8,
      essential: true,
    });
  }, [selectedCity]);

  useEffect(() => {
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      instanceRef.current?.remove();
      instanceRef.current = null;
    };
  }, []);

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_320px]">
      <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950">
        {token ? (
          <div ref={mapRef} className="h-[420px] w-full" />
        ) : (
          <div className="flex h-[420px] items-center justify-center px-6 text-center text-sm text-slate-400">
            `NEXT_PUBLIC_MAPBOX_TOKEN` tanimlandiginda Avrupa haritasi burada interaktif olarak render edilir.
          </div>
        )}
        {mapError ? (
          <div className="border-t border-white/10 bg-slate-900 px-4 py-3 text-sm text-rose-300">{mapError}</div>
        ) : null}
      </div>

      <div className="space-y-3">
        {cities.map((city) => {
          const active = city.city === selectedCity.city;
          return (
            <button
              key={city.city}
              type="button"
              onClick={() => setSelectedCity(city)}
              className={`w-full rounded-[1.5rem] border px-4 py-4 text-left transition ${
                active
                  ? "border-sky-400/40 bg-white/12"
                  : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{city.city}</p>
                  <p className="mt-1 text-xs text-slate-400">{city.country}</p>
                </div>
                <span
                  className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
                  style={{ backgroundColor: statusColor(city.status) }}
                >
                  {statusLabel(city.status)}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
                <span>€{city.revenue.toLocaleString("tr-TR")}</span>
                <span>+%{city.growth}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
