"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type ParkingZone = {
  id: string;
  slug: string;
  name: string;
  block: string;
  address: string;
  capacity: number;
  availableSpots: number;
  occupancyRate: number;
  hourlyRate: number;
  coordinates: {
    lat: number;
    lng: number;
  };
};

function buildEmbedUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
}

function buildDirectionsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
}

function buildSearchUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export default function GoogleMapsParkingFinder({ zones }: { zones: ParkingZone[] }) {
  const { lang } = useLanguage();
  const [selectedZoneId, setSelectedZoneId] = useState(zones[0]?.id ?? "");

  const selectedZone = useMemo(
    () => zones.find((zone) => zone.id === selectedZoneId) ?? zones[0],
    [selectedZoneId, zones]
  );

  if (!selectedZone) return null;

  const { coordinates } = selectedZone;
  const copy =
    lang === "tr"
      ? {
          badge: "Google Maps",
          title: "Haritada park yeri bul",
          description: "Musait park alanini sec, konumu haritada incele ve Google Maps ile dogrudan rota olustur.",
          startNavigation: "Navigasyonu Baslat",
          block: "Blok",
          availableSpots: "bos yer",
          occupied: "dolu",
          hourlyRate: "TL / saat",
          coordinates: "Koordinat",
          openInMaps: "Google Maps'te Ac",
          getDirections: "Yol Tarifi Al",
          iframeTitle: "Google Maps konumu",
        }
      : {
          badge: "Google Maps",
          title: "Find parking on the map",
          description: "Choose an available parking zone, inspect the location on the map, and launch directions in Google Maps.",
          startNavigation: "Start Navigation",
          block: "Block",
          availableSpots: "spots open",
          occupied: "occupied",
          hourlyRate: "TRY / hour",
          coordinates: "Coordinates",
          openInMaps: "Open in Google Maps",
          getDirections: "Get Directions",
          iframeTitle: "Google Maps location",
        };

  return (
    <section className="overflow-hidden rounded-3xl border border-card-border bg-white shadow-sm">
      <div className="border-b border-card-border bg-gradient-to-r from-teal-50 via-cyan-50 to-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3rem] text-teal-700">{copy.badge}</p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-text">{copy.title}</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">{copy.description}</p>
          </div>
          <a
            href={buildDirectionsUrl(coordinates.lat, coordinates.lng)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {copy.startNavigation}
          </a>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="border-b border-card-border bg-slate-50/80 p-4 lg:border-b-0 lg:border-r">
          <div className="grid gap-3">
            {zones.map((zone) => {
              const isActive = zone.id === selectedZone.id;

              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setSelectedZoneId(zone.id)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    isActive
                      ? "border-primary bg-teal-50 shadow-sm"
                      : "border-card-border bg-white hover:border-primary/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-text">{zone.name}</p>
                      <p className="mt-1 text-xs text-muted">{zone.address}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                      {copy.block} {zone.block}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="font-semibold text-primary">{zone.availableSpots} {copy.availableSpots}</span>
                    <span className="text-muted">%{zone.occupancyRate} {copy.occupied}</span>
                  </div>
                  <div className="mt-2 text-xs text-muted">{zone.hourlyRate} {copy.hourlyRate}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="overflow-hidden rounded-[28px] border border-card-border bg-slate-100 shadow-sm">
            <iframe
              title={`${selectedZone.name} ${copy.iframeTitle}`}
              src={buildEmbedUrl(coordinates.lat, coordinates.lng)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[420px] w-full border-0"
            />
          </div>

          <div className="mt-5 flex flex-col gap-4 rounded-3xl border border-card-border bg-background p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-semibold text-text">{selectedZone.name}</p>
              <p className="mt-1 text-sm text-muted">{selectedZone.address}</p>
              <p className="mt-2 text-xs text-muted">
                {copy.coordinates}: {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={buildSearchUrl(coordinates.lat, coordinates.lng)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-card-border px-4 py-2.5 text-sm font-semibold text-text transition hover:border-primary hover:text-primary"
              >
                {copy.openInMaps}
              </a>
              <a
                href={buildDirectionsUrl(coordinates.lat, coordinates.lng)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {copy.getDirections}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
