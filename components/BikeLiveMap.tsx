"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function BikeLiveMap() {
  const [zones, setZones] = useState<ZoneSnapshot[]>([]);
  const [activeZoneSlug, setActiveZoneSlug] = useState<string | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<LiveSpotInfo | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        throw new Error(payload?.message || "Veriler alınamadı.");
      }

      const fetchedZones: ZoneSnapshot[] = payload.zones ?? [];
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
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Canlı doluluk güncellenemedi.";
      setFetchError(message);
    } finally {
      setLoading(false);
    }
  }, []);

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

  const handleSpotAction = useCallback(
    async (action: "reserve" | "release") => {
      if (!selectedSpot) return;
      setReserving(true);
      setFetchError(null);

      try {
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
          throw new Error(payload?.message || "Durum güncellenemedi.");
        }

        const updatedStatus = payload.status as SpotStatus;
        setSelectedSpot((prev) => (prev ? { ...prev, status: updatedStatus } : prev));
        setFeedback(
          action === "reserve"
            ? "Bisiklet parkı rezerve edildi. Hemen hareket edebilirsiniz."
            : "Park serbest, alan yeniden kullanılabilir."
        );
        feedbackTimer.current && clearTimeout(feedbackTimer.current);
        feedbackTimer.current = setTimeout(() => setFeedback(null), 4500);
        await refreshLiveSpots();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Durum güncellenemedi.";
        setFetchError(message);
      } finally {
        setReserving(false);
      }
    },
    [refreshLiveSpots, selectedSpot]
  );

  const statusLabels: Record<SpotStatus, string> = {
    available: "Boş",
    reserved: "Rezerve",
    occupied: "Dolu",
  };

  const currentAction = selectedSpot
    ? selectedSpot.status === "available"
      ? "reserve"
      : "release"
    : null;

  const actionLabel =
    currentAction === "reserve"
      ? "Parkı Rezerve Et"
      : currentAction === "release"
      ? selectedSpot?.status === "occupied"
        ? "Parkı Boşalt"
        : "Parkı Bitir"
      : "";

  const busyLabel =
    currentAction === "reserve" ? "Rezervasyon güncelleniyor..." : "Durum güncelleniyor...";

  const spots = activeZone?.spots ?? [];
  const currentPenaltyRate = activeZone?.noShowPenalty ?? 0;
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 0,
      }),
    []
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
    <section id="bike-demo" className="py-24 relative bg-black/40">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Bisiklet Park Haritası
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Şehirdeki <span className="text-emerald-400">Bisiklet Parkları</span> için Canlı Takip
          </h2>
          <p className="text-muted text-lg">
            Kentin sürdürülebilir ulaştırma planları için bisiklet dostu parkları gerçek zamanlı olarak izleyin ve yönetin.
          </p>
        </div>

        <div className="max-w-5xl mx-auto rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/10 bg-black/20 p-6 flex flex-col">
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <MapPin className="text-emerald-400" /> Bisiklete Özel Konum
            </h3>

            <div className="space-y-2 mb-8">
              {zones.map((zone) => (
                <button
                  key={zone.slug}
                  onClick={() => setActiveZoneSlug(zone.slug)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium",
                    activeZoneSlug === zone.slug
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "text-muted hover:bg-white/5 hover:text-white"
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
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 animate-in fade-in slide-in-from-bottom-4">
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                    {selectedSpot.label ?? selectedSpot.spotId}
                  </h4>
                  <div className="space-y-3 text-sm text-gray-300 my-4">
                    <div className="flex justify-between">
                      <span>Durum</span>
                      <span className="text-white">{statusLabels[selectedSpot.status]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Son güncelleme</span>
                      <span className="text-white">
                        {selectedSpot.lastUpdated
                          ? new Date(selectedSpot.lastUpdated).toLocaleTimeString("tr-TR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Park kullanım ücreti</span>
                      <span className="text-white">
                        {activeZone ? `${activeZone.hourlyRate.toFixed(2)} TL / saat` : "—"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => currentAction && handleSpotAction(currentAction)}
                    disabled={reserving}
                    className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {reserving ? busyLabel : actionLabel}
                  </button>
                  {feedback && <p className="text-xs text-emerald-100 mt-2">{feedback}</p>}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                  <p className="text-muted text-sm">
                    {loading
                      ? "Canlı veriler yükleniyor..."
                      : "Bisiklet parkı rezervasyonu için bir konum seçin."}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 p-6 md:p-10 bg-[url('https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center md:bg-gray-900 relative">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  Canlı Bisiklet Doluluk Haritası
                  <span className="text-xs font-normal px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                    Canlı
                  </span>
                </h3>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Boş
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Dolu
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    Rezerve
                  </div>
                </div>
              </div>

              <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-white/5 px-4 py-3 text-sm text-white shadow-lg shadow-emerald-900/30">
                <p className="text-[10px] tracking-[0.2em] uppercase text-emerald-200">Ceza sayacı</p>
                <p className="text-3xl font-bold">{noShowPenaltySummary.count}</p>
                <p className="text-xs text-muted">
                  Toplam ceza: <span className="text-white">{noShowPenaltySummary.formattedTotal}</span>
                </p>
                <p className="text-xs text-muted/70">
                  {noShowPenaltySummary.formattedRate} / gelmeyen bisiklet rezerve aracı
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
                      spot.status === "available" &&
                        "bg-emerald-500/10 border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/20 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)]",
                      spot.status === "occupied" &&
                        "bg-red-500/5 border-red-500/20 text-white opacity-90",
                      spot.status === "reserved" &&
                        "bg-sky-500/10 border-sky-500/50 text-sky-400",
                      selectedSpot?.spotId === spot.spotId &&
                        "ring-2 ring-white ring-offset-2 ring-offset-black bg-emerald-500/30"
                    )}
                  >
                    <span className="absolute top-2 left-3 text-xs font-bold opacity-70">
                      {spot.label ?? spot.spotId}
                    </span>
                    {spot.status === "occupied" ? (
                      <Clock className="w-8 h-8 opacity-50" />
                    ) : spot.status === "reserved" ? (
                      <Clock className="w-8 h-8 opacity-80" />
                    ) : (
                      <div className="text-2xl font-bold">P</div>
                    )}
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
