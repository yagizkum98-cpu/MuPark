"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Car, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";

type SpotStatus = "available" | "occupied" | "reserved";

interface LiveSpotInfo {
  spotId: string;
  status: SpotStatus;
  label?: string;
  lastUpdated?: string;
}

interface ZoneSnapshot {
  slug: string;
  name: string;
  block: string;
  capacity: number;
  hourlyRate: number;
  color?: string;
  status: string;
  noShowPenalty: number;
  spots: LiveSpotInfo[];
}

const NO_SHOW_THRESHOLD_MINUTES = 30;
const FALLBACK_STORAGE_KEY = "mupark-live-demo-fallback-zones";
const DEMO_ZONES: ZoneSnapshot[] = [
  {
    slug: "ataturk-caddesi",
    name: "Atatürk Caddesi",
    block: "A",
    capacity: 12,
    hourlyRate: 4.2,
    color: "#13629F",
    status: "open",
    noShowPenalty: 35,
    spots: Array.from({ length: 12 }, (_, idx) => ({
      spotId: `ATATURK-CADDESI-${idx + 1}`,
      status: (["available", "occupied", "reserved"] as SpotStatus[])[idx % 3],
      label: `P-${idx + 1}`,
      lastUpdated: new Date(Date.now() - idx * 60_000).toISOString(),
    })),
  },
  {
    slug: "karagozler",
    name: "Karagözler",
    block: "B",
    capacity: 14,
    hourlyRate: 4.8,
    color: "#159B58",
    status: "open",
    noShowPenalty: 40,
    spots: Array.from({ length: 14 }, (_, idx) => ({
      spotId: `KARAGOZLER-${idx + 1}`,
      status: (["occupied", "available", "reserved"] as SpotStatus[])[idx % 3],
      label: `P-${idx + 1}`,
      lastUpdated: new Date(Date.now() - (idx + 2) * 60_000).toISOString(),
    })),
  },
  {
    slug: "carsi-caddesi",
    name: "Çarşı Caddesi",
    block: "C",
    capacity: 10,
    hourlyRate: 5,
    color: "#1EA3D2",
    status: "open",
    noShowPenalty: 45,
    spots: Array.from({ length: 10 }, (_, idx) => ({
      spotId: `CARSI-CADDESI-${idx + 1}`,
      status: (["reserved", "available", "occupied"] as SpotStatus[])[idx % 3],
      label: `P-${idx + 1}`,
      lastUpdated: new Date(Date.now() - (idx + 4) * 60_000).toISOString(),
    })),
  },
];

function cloneDemoZones() {
  return DEMO_ZONES.map((zone) => ({
    ...zone,
    spots: zone.spots.map((spot) => ({ ...spot })),
  }));
}

function readStoredFallbackZones() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(FALLBACK_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as ZoneSnapshot[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function writeStoredFallbackZones(zones: ZoneSnapshot[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(zones));
  } catch {
    // Ignore storage write failures and continue with in-memory fallback state.
  }
}

function clearStoredFallbackZones() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(FALLBACK_STORAGE_KEY);
  } catch {
    // Ignore storage cleanup failures.
  }
}

function updateSpotInZones(zones: ZoneSnapshot[], spotId: string, status: SpotStatus) {
  const timestamp = new Date().toISOString();
  let updatedSpot: LiveSpotInfo | null = null;

  const nextZones = zones.map((zone) => ({
    ...zone,
    spots: zone.spots.map((spot) => {
      if (spot.spotId !== spotId) {
        return spot;
      }

      updatedSpot = {
        ...spot,
        status,
        lastUpdated: timestamp,
      };

      return updatedSpot;
    }),
  }));

  return { zones: nextZones, updatedSpot };
}

export default function LiveDemo() {
  const { lang } = useLanguage();
  const [zones, setZones] = useState<ZoneSnapshot[]>([]);
  const [activeZoneSlug, setActiveZoneSlug] = useState<string | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<LiveSpotInfo | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useMemo(
    () =>
      lang === "tr"
        ? {
            fetchFail: "Veriler alınamadı.",
            statusFail: "Durum güncellenemedi.",
            resetDemo: "Simülasyonu sıfırla",
            reserveSpot: "Rezervasyonunuz oluşturuldu. Park yerine ilerleyebilirsiniz.",
            release: "Park tamamlandı, alan yeniden kullanılabilir.",
            statusAvailable: "Müsait",
            statusReserved: "Rezerve",
            statusOccupied: "Dolu",
            actionReserve: "Parkı Rezerve Et",
            actionReleaseOccupied: "Parkı Boşalt",
            actionRelease: "Parkı Bitir",
            busyReserve: "Rezervasyon güncelleniyor...",
            busyUpdate: "Durum güncelleniyor...",
            badge: "Canlı Sistem Demosu",
            titleA: "Gerçek Zamanlı",
            titleB: "Akıllı Park Yönetimi",
            subtitle: "Pilot bölgelerdeki anlık doluluk, rezervasyon ve saha durumunu tek ekrandan izleyin.",
            selectLocation: "Konum Seçin",
            fieldStatus: "Durum",
            fieldUpdated: "Son güncelleme",
            fieldPrice: "Ücret",
            loading: "Canlı veriler yükleniyor...",
            selectPrompt: "Rezervasyon yapmak için haritadan uygun (yeşil) bir park yeri seçin.",
            mapTitle: "Canlı Doluluk Haritası",
            live: "Canlı",
            fallback: "Demo",
            legendAvailable: "Müsait",
            legendOccupied: "Dolu",
            legendReserved: "Rezerve",
            focusTitle: "Faz 1 odağı",
            focusDesc:
              "Bu ilk sürüm yalnızca akıllı park rezervasyonu, canlı doluluk takibi ve saha operasyonuna odaklanır.",
            penalty: "Ceza sayacı",
            totalPenalty: "Toplam ceza",
            penaltyRate: "rezerve edilip gelinmeyen araç",
            priceUnit: "TL / saat",
          }
        : {
            fetchFail: "Failed to fetch data.",
            statusFail: "Failed to update status.",
            resetDemo: "Reset simulation",
            reserveSpot: "Reservation created. You can proceed to the parking area.",
            release: "Parking completed, spot is now available again.",
            statusAvailable: "Available",
            statusReserved: "Reserved",
            statusOccupied: "Occupied",
            actionReserve: "Reserve Spot",
            actionReleaseOccupied: "Release Spot",
            actionRelease: "Finish Parking",
            busyReserve: "Updating reservation...",
            busyUpdate: "Updating status...",
            badge: "Live System Demo",
            titleA: "Real-Time",
            titleB: "Smart Parking Management",
            subtitle: "Track live occupancy, reservation flow, and field status in pilot zones from one screen.",
            selectLocation: "Select Location",
            fieldStatus: "Status",
            fieldUpdated: "Last update",
            fieldPrice: "Price",
            loading: "Loading live data...",
            selectPrompt: "Select an available (green) spot on the map to reserve.",
            mapTitle: "Live Occupancy Map",
            live: "Live",
            fallback: "Demo",
            legendAvailable: "Available",
            legendOccupied: "Occupied",
            legendReserved: "Reserved",
            focusTitle: "Phase 1 focus",
            focusDesc:
              "This first release focuses only on smart parking reservation, live occupancy tracking, and field operations.",
            penalty: "Penalty counter",
            totalPenalty: "Total penalty",
            penaltyRate: "reserved but absent vehicle",
            priceUnit: "TRY / hour",
          },
    [lang]
  );

  const activeZone = useMemo(
    () => zones.find((zone) => zone.slug === activeZoneSlug) ?? zones[0],
    [zones, activeZoneSlug]
  );

  const refreshLiveSpots = useCallback(async () => {
    setLoading(true);
    setFetchError(null);

    try {
      const response = await fetch("/api/live-spots", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || copy.fetchFail);
      }

      const fetchedZones: ZoneSnapshot[] = payload.zones ?? [];
      if (fetchedZones.length === 0) {
        throw new Error(copy.fetchFail);
      }
      setIsFallbackMode(false);
      clearStoredFallbackZones();
      setZones(fetchedZones);

      setActiveZoneSlug((current) => {
        if (current && fetchedZones.some((zone) => zone.slug === current)) {
          return current;
        }
        return fetchedZones[0]?.slug ?? current ?? null;
      });

      setSelectedSpot((current) => {
        if (!current) return null;
        for (const zone of fetchedZones) {
          const updatedSpot = zone.spots.find((spot) => spot.spotId === current.spotId);
          if (updatedSpot) {
            return { ...updatedSpot };
          }
        }
        return null;
      });
    } catch {
      const fallbackZones = readStoredFallbackZones() ?? cloneDemoZones();
      setIsFallbackMode(true);
      setZones(fallbackZones);
      writeStoredFallbackZones(fallbackZones);
      setActiveZoneSlug((current) => {
        if (current && fallbackZones.some((zone) => zone.slug === current)) {
          return current;
        }
        return fallbackZones[0]?.slug ?? null;
      });
      setSelectedSpot((current) => {
        if (!current) return null;
        for (const zone of fallbackZones) {
          const updatedSpot = zone.spots.find((spot) => spot.spotId === current.spotId);
          if (updatedSpot) {
            return { ...updatedSpot };
          }
        }
        return null;
      });
      setFetchError(null);
    } finally {
      setLoading(false);
    }
  }, [copy.fetchFail]);

  useEffect(() => {
    refreshLiveSpots();
    const intervalId = setInterval(() => refreshLiveSpots(), 15_000);
    return () => {
      clearInterval(intervalId);
      if (feedbackTimer.current) {
        clearTimeout(feedbackTimer.current);
      }
    };
  }, [refreshLiveSpots]);

  const handleSpotClick = (spot: LiveSpotInfo) => {
    setSelectedSpot(spot);
  };

  const handleResetFallback = useCallback(() => {
    const nextZones = cloneDemoZones();
    clearStoredFallbackZones();
    writeStoredFallbackZones(nextZones);
    setIsFallbackMode(true);
    setZones(nextZones);
    setFeedback(null);
    setFetchError(null);
    setActiveZoneSlug((current) => {
      if (current && nextZones.some((zone) => zone.slug === current)) {
        return current;
      }
      return nextZones[0]?.slug ?? null;
    });
    setSelectedSpot((current) => {
      if (!current) return null;
      for (const zone of nextZones) {
        const updatedSpot = zone.spots.find((spot) => spot.spotId === current.spotId);
        if (updatedSpot) {
          return { ...updatedSpot };
        }
      }
      return null;
    });
  }, []);

  const handleSpotAction = useCallback(
    async (action: "reserve" | "release") => {
      if (!selectedSpot) return;
      setReserving(true);
      setFetchError(null);

      try {
        const nextStatus: SpotStatus = action === "reserve" ? "reserved" : "available";

        if (isFallbackMode) {
          const { zones: nextZones, updatedSpot } = updateSpotInZones(zones, selectedSpot.spotId, nextStatus);
          setZones(nextZones);
          setSelectedSpot(updatedSpot);
          writeStoredFallbackZones(nextZones);
          setFeedback(action === "reserve" ? copy.reserveSpot : copy.release);

          if (feedbackTimer.current) {
            clearTimeout(feedbackTimer.current);
          }
          feedbackTimer.current = setTimeout(() => setFeedback(null), 4500);
          return;
        }

        const response = await fetch("/api/live-spots", {
          method: "POST",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ spotId: selectedSpot.spotId, action }),
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.message || copy.statusFail);
        }

        const updatedStatus = payload.status as SpotStatus;
        setSelectedSpot((prev) => (prev ? { ...prev, status: updatedStatus } : prev));
        setFeedback(action === "reserve" ? copy.reserveSpot : copy.release);

        if (feedbackTimer.current) {
          clearTimeout(feedbackTimer.current);
        }
        feedbackTimer.current = setTimeout(() => setFeedback(null), 4500);
        await refreshLiveSpots();
      } catch (error) {
        const message = error instanceof Error ? error.message : copy.statusFail;
        setFetchError(message);
      } finally {
        setReserving(false);
      }
    },
    [copy.release, copy.reserveSpot, copy.statusFail, isFallbackMode, refreshLiveSpots, selectedSpot, zones]
  );

  const statusLabels: Record<SpotStatus, string> = {
    available: copy.statusAvailable,
    reserved: copy.statusReserved,
    occupied: copy.statusOccupied,
  };

  const currentAction = selectedSpot
    ? selectedSpot.status === "available"
      ? "reserve"
      : "release"
    : null;

  const actionLabel =
    currentAction === "reserve"
      ? copy.actionReserve
      : currentAction === "release"
        ? selectedSpot?.status === "occupied"
          ? copy.actionReleaseOccupied
          : copy.actionRelease
        : "";

  const busyLabel = currentAction === "reserve" ? copy.busyReserve : copy.busyUpdate;

  const spots = useMemo(() => activeZone?.spots ?? [], [activeZone]);
  const currentPenaltyRate = activeZone?.noShowPenalty ?? 0;
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(lang === "tr" ? "tr-TR" : "en-US", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 0,
      }),
    [lang]
  );

  const noShowPenaltySummary = useMemo(() => {
    const thresholdMs = Date.now() - NO_SHOW_THRESHOLD_MINUTES * 60 * 1000;
    const expiredReservations = spots.filter((spot) => {
      if (spot.status !== "reserved") return false;
      const updatedAt = spot.lastUpdated ? Date.parse(spot.lastUpdated) : Date.now();
      if (Number.isNaN(updatedAt)) {
        return false;
      }
      return updatedAt < thresholdMs;
    });
    const totalAmount = Number((expiredReservations.length * currentPenaltyRate).toFixed(2));
    return {
      count: expiredReservations.length,
      total: totalAmount,
      formattedTotal: currencyFormatter.format(totalAmount),
      formattedRate: currencyFormatter.format(currentPenaltyRate),
    };
  }, [spots, currentPenaltyRate, currencyFormatter]);

  return (
    <section id="demo" className="neon-grid relative bg-cyan-50/40 py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[color:var(--accent-strong)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {copy.badge}
          </div>
          <h2 className="mb-4 text-3xl font-bold text-[color:var(--hero-title)] md:text-4xl">
            {copy.titleA} <span className="text-[color:var(--accent-text)]">{copy.titleB}</span>
          </h2>
          <p className="text-lg text-[color:var(--muted)]">{copy.subtitle}</p>
        </div>

        <div className="neon-shell mx-auto flex min-h-[600px] max-w-5xl flex-col overflow-hidden rounded-3xl md:flex-row">
          <div className="flex w-full flex-col border-b border-[color:var(--panel-border)] bg-[var(--surface-strong)] p-6 md:w-80 md:border-b-0 md:border-r">
            <h3 className="mb-6 flex items-center gap-2 font-semibold text-[color:var(--hero-title)]">
              <MapPin className="text-[color:var(--accent-text)]" /> {copy.selectLocation}
            </h3>

            <div className="space-y-2 mb-8">
              {zones.map((zone) => (
                <button
                  key={zone.slug}
                  onClick={() => setActiveZoneSlug(zone.slug)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium",
                    activeZoneSlug === zone.slug
                      ? "border border-cyan-300/40 bg-cyan-400/10 text-[color:var(--accent-text)]"
                      : "text-[color:var(--muted)] hover:bg-white/10 hover:text-[color:var(--hero-title)]"
                  )}
                >
                  {zone.name}
                </button>
              ))}
            </div>

            <div className="mt-auto space-y-2">
              {fetchError && (
                <p className="text-sm text-red-300 bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3">
                  {fetchError}
                </p>
              )}

              {selectedSpot ? (
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 animate-in fade-in slide-in-from-bottom-4">
                  <h4 className="mb-2 flex items-center gap-2 font-bold text-[color:var(--hero-title)]">
                    <Car className="w-4 h-4" /> {selectedSpot.label ?? selectedSpot.spotId}
                  </h4>
                  <div className="my-4 space-y-3 text-sm text-[color:var(--muted)]">
                    <div className="flex justify-between">
                      <span>{copy.fieldStatus}</span>
                      <span className="text-[color:var(--hero-title)]">{statusLabels[selectedSpot.status]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{copy.fieldUpdated}</span>
                      <span className="text-[color:var(--hero-title)]">
                        {selectedSpot.lastUpdated
                          ? new Date(selectedSpot.lastUpdated).toLocaleTimeString(lang === "tr" ? "tr-TR" : "en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{copy.fieldPrice}</span>
                      <span className="text-[color:var(--hero-title)]">
                        {activeZone ? `${activeZone.hourlyRate.toFixed(2)} ${copy.priceUnit}` : "-"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => currentAction && handleSpotAction(currentAction)}
                    disabled={reserving}
                    className="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-semibold transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {reserving ? busyLabel : actionLabel}
                  </button>
                  {feedback && <p className="text-xs text-cyan-700 mt-2">{feedback}</p>}
                </div>
              ) : (
                <div className="rounded-xl border border-[color:var(--panel-border)] bg-[var(--surface-soft)] p-4 text-center">
                  <p className="text-sm text-[color:var(--muted)]">{loading ? copy.loading : copy.selectPrompt}</p>
                </div>
              )}
            </div>
          </div>

          <div className="relative flex-1 overflow-hidden bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_30%),linear-gradient(180deg,#02080d_0%,#03070a_100%)] p-6 md:p-10">
            <div className="absolute inset-0 opacity-80 [background-image:linear-gradient(to_right,rgba(61,219,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(61,219,255,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />
            <div className="absolute inset-x-0 top-8 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.1),transparent_28%),radial-gradient(circle_at_80%_90%,rgba(16,185,129,0.12),transparent_30%)]" />

            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {copy.mapTitle}
                  <span className="text-xs font-normal px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/20">{copy.live}</span>
                  {isFallbackMode && (
                    <span className="text-xs font-normal px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      {copy.fallback}
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-4 text-xs font-medium">
                  {isFallbackMode && (
                    <button
                      type="button"
                      onClick={handleResetFallback}
                      className="rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-amber-200 transition hover:bg-amber-500/20"
                    >
                      {copy.resetDemo}
                    </button>
                  )}
                  <div className="flex items-center gap-1.5 text-gray-400"><span className="w-2 h-2 rounded-full bg-green-500" />{copy.legendAvailable}</div>
                  <div className="flex items-center gap-1.5 text-gray-400"><span className="w-2 h-2 rounded-full bg-red-500" />{copy.legendOccupied}</div>
                  <div className="flex items-center gap-1.5 text-gray-400"><span className="w-2 h-2 rounded-full bg-blue-500" />{copy.legendReserved}</div>
                </div>
              </div>

              <div className="data-stream mb-4 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-50 shadow-lg shadow-cyan-900/20">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[color:var(--accent-strong)]">{copy.focusTitle}</p>
                <p className="mt-1 text-sm">{copy.focusDesc}</p>
              </div>

              <div className="mb-6 rounded-2xl border border-cyan-500/30 bg-white/5 px-4 py-3 text-sm text-white shadow-lg shadow-cyan-500/20">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[color:var(--accent-strong)]">{copy.penalty}</p>
                <p className="text-3xl font-bold">{noShowPenaltySummary.count}</p>
                <p className="text-xs text-muted">
                  {copy.totalPenalty}: <span className="text-white">{noShowPenaltySummary.formattedTotal}</span>
                </p>
                <p className="text-xs text-muted/70">
                  {noShowPenaltySummary.formattedRate} / {copy.penaltyRate}
                </p>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 gap-4 auto-rows-fr h-full max-h-[500px]">
                {spots.map((spot) => (
                  <motion.button
                    key={spot.spotId}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSpotClick(spot)}
                    className={cn(
                      "relative rounded-xl border-2 flex flex-col items-center justify-center p-4 transition-all duration-300 cursor-pointer",
                      spot.status === "available" && "bg-green-500/10 border-green-500/50 text-green-500 hover:bg-green-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
                      spot.status === "occupied" && "bg-red-500/5 border-red-500/20 text-white opacity-90",
                      spot.status === "reserved" && "bg-blue-500/10 border-blue-500/50 text-blue-400",
                      selectedSpot?.spotId === spot.spotId && "ring-2 ring-white ring-offset-2 ring-offset-black bg-green-500/30"
                    )}
                  >
                    <span className="absolute top-2 left-3 text-xs font-bold opacity-70">{spot.label ?? spot.spotId}</span>
                    {spot.status === "occupied" ? <Car className="w-8 h-8 opacity-50" /> : spot.status === "reserved" ? <Clock className="w-8 h-8 opacity-80" /> : <div className="text-2xl font-bold">P</div>}
                    <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center gap-1.5">
                      {[0, 1, 2].map((segment) => (
                        <motion.span
                          key={`${spot.spotId}-segment-${segment}`}
                          className={cn(
                            "h-1 flex-1 rounded-full",
                            spot.status === "available" ? "bg-green-300/80" : spot.status === "reserved" ? "bg-blue-300/80" : "bg-red-300/70"
                          )}
                          animate={{ opacity: [0.25, 0.95, 0.25], y: [0, -1.5, 0] }}
                          transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY, delay: segment * 0.2, ease: "easeInOut" }}
                        />
                      ))}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
