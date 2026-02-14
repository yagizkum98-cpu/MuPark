"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Car, Clock, Zap, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

type SpotStatus = "available" | "occupied" | "reserved";

interface LiveSpotInfo {
  spotId: string;
  status: SpotStatus;
  label?: string;
  isEv: boolean;
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
const EV_FREE_MINUTES = 100;
const EV_STATE_TARIFF = 7.9;

export default function LiveDemo() {
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
            ? selectedSpot.isEv
              ? "EV köşesi rezerve edildi. Şarjda ilk 100 dakika MuPark hediyesi aktif."
              : "Rezervasyonunuz oluşturuldu. Park yerine ilerleyebilirsiniz."
            : "Park tamamlandı, alan yeniden kullanılabilir."
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
    available: "Müsait",
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

  const evUsageSummary = useMemo(() => {
    if (!selectedSpot?.isEv) {
      return null;
    }

    if (!selectedSpot.lastUpdated || selectedSpot.status === "available") {
      return {
        remainingFreeMinutes: EV_FREE_MINUTES,
        progress: 0,
        ecoPoints: 0,
      };
    }

    const elapsedMs = Date.now() - Date.parse(selectedSpot.lastUpdated);
    const usedMinutes =
      Number.isFinite(elapsedMs) && elapsedMs > 0 ? Math.floor(elapsedMs / 60000) : 0;
    const remainingFreeMinutes = Math.max(0, EV_FREE_MINUTES - usedMinutes);
    const progress = Math.min(100, Math.round((usedMinutes / EV_FREE_MINUTES) * 100));
    const ecoPoints = Math.max(0, Math.min(250, usedMinutes * 2));

    return {
      remainingFreeMinutes,
      progress,
      ecoPoints,
    };
  }, [selectedSpot]);

  return (
    <section id="demo" className="py-24 relative bg-black/40">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Canlı Sistem Demosu
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Gerçek Zamanlı <span className="text-cyan-400">Park Yönetimi</span>
          </h2>
          <p className="text-muted text-lg">
            Pilot bölgelerdeki anlık durumu interaktif harita üzerinden izleyin.
          </p>
        </div>

        <div className="max-w-5xl mx-auto rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/10 bg-black/20 p-6 flex flex-col">
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <MapPin className="text-cyan-400" /> Konum Seçin
            </h3>

            <div className="space-y-2 mb-8">
              {zones.map((zone) => (
                <button
                  key={zone.slug}
                  onClick={() => setActiveZoneSlug(zone.slug)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium",
                    activeZoneSlug === zone.slug
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
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
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 animate-in fade-in slide-in-from-bottom-4">
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                    {selectedSpot.isEv ? (
                      <Zap className="w-4 h-4 text-amber-300" />
                    ) : (
                      <Car className="w-4 h-4" />
                    )}{" "}
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
                    <span>Ücret</span>
                    <span className="text-white">
                      {selectedSpot.isEv
                        ? `İlk ${EV_FREE_MINUTES} dk ücretsiz`
                        : activeZone
                        ? `${activeZone.hourlyRate.toFixed(2)} TL / saat`
                        : "—"}
                    </span>
                  </div>
                  {selectedSpot.isEv && (
                    <div className="flex justify-between">
                      <span>Şarj tarifesi</span>
                      <span className="text-white">{EV_STATE_TARIFF.toFixed(2)} TL / kWh (devlet)</span>
                    </div>
                  )}
                </div>
                  {selectedSpot.isEv && evUsageSummary && (
                    <div className="mb-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3">
                      <div className="flex items-center justify-between text-xs text-amber-100">
                        <span className="inline-flex items-center gap-1">
                          <Gift className="h-3.5 w-3.5" /> MuPark Hediyesi
                        </span>
                        <span>{evUsageSummary.remainingFreeMinutes} dk ücretsiz kaldı</span>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-black/30">
                        <div
                          className="h-full rounded-full bg-amber-300 transition-all"
                          style={{ width: `${evUsageSummary.progress}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-amber-50">
                        Oyunlaştırma puanı:{" "}
                        <span className="font-semibold">{evUsageSummary.ecoPoints} EcoPuan</span>
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => currentAction && handleSpotAction(currentAction)}
                    disabled={reserving}
                    className="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-semibold transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {reserving ? busyLabel : actionLabel}
                  </button>
                  {feedback && <p className="text-xs text-cyan-100 mt-2">{feedback}</p>}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                  <p className="text-muted text-sm">
                    {loading
                      ? "Canlı veriler yükleniyor..."
                      : "Rezervasyon yapmak için haritadan uygun (yeşil) bir park yeri seçin."}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 p-6 md:p-10 bg-[url('https://images.unsplash.com/photo-1621929747188-0b4b23297109?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center md:bg-gray-900 relative">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      Canlı Doluluk Haritası
                    <span className="text-xs font-normal px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/20">
                      Canlı
                    </span>
                </h3>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Müsait
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Dolu
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Rezerve
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    EV Köşesi
                  </div>
                </div>
              </div>

              <div className="mb-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-50 shadow-lg shadow-amber-900/20">
                <p className="text-[10px] tracking-[0.2em] uppercase text-amber-200">
                  Elektrikli araç kampanyası
                </p>
                <p className="mt-1 text-sm">
                  2 park alanı EV köşesi olarak ayrıldı. Şarj devlet tarifesiyle işler, ilk{" "}
                  {EV_FREE_MINUTES} dakika MuPark&apos;tan hediye.
                </p>
              </div>

              <div className="mb-6 rounded-2xl border border-cyan-500/30 bg-white/5 px-4 py-3 text-sm text-white shadow-lg shadow-cyan-500/20">
                <p className="text-[10px] tracking-[0.2em] uppercase text-cyan-200">Ceza sayacı</p>
                <p className="text-3xl font-bold">{noShowPenaltySummary.count}</p>
                <p className="text-xs text-muted">
                  Toplam ceza: <span className="text-white">{noShowPenaltySummary.formattedTotal}</span>
                </p>
                <p className="text-xs text-muted/70">
                  {noShowPenaltySummary.formattedRate} / rezerve edilen fakat gelmeyen araç
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
                      spot.isEv &&
                        "border-amber-400/70 bg-amber-500/10 text-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.15)]",
                      !spot.isEv &&
                        spot.status === "available" &&
                        "bg-green-500/10 border-green-500/50 text-green-500 hover:bg-green-500/20 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)]",
                      !spot.isEv &&
                        spot.status === "occupied" &&
                        "bg-red-500/5 border-red-500/20 text-white opacity-90",
                      !spot.isEv &&
                        spot.status === "reserved" &&
                        "bg-blue-500/10 border-blue-500/50 text-blue-400",
                      selectedSpot?.spotId === spot.spotId &&
                        "ring-2 ring-white ring-offset-2 ring-offset-black bg-green-500/30"
                    )}
                  >
                    <span className="absolute top-2 left-3 text-xs font-bold opacity-70">
                      {spot.label ?? spot.spotId}
                    </span>
                    {spot.isEv ? (
                      <Zap className="w-8 h-8" />
                    ) : spot.status === "occupied" ? (
                      <Car className="w-8 h-8 opacity-50" />
                    ) : spot.status === "reserved" ? (
                      <Clock className="w-8 h-8 opacity-80" />
                    ) : (
                      <div className="text-2xl font-bold">P</div>
                    )}
                    <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center gap-1.5">
                      {[0, 1, 2].map((segment) => (
                        <motion.span
                          key={`${spot.spotId}-segment-${segment}`}
                          className={cn(
                            "h-1 flex-1 rounded-full",
                            spot.status === "available"
                              ? "bg-green-300/80"
                              : spot.status === "reserved"
                              ? "bg-blue-300/80"
                              : "bg-red-300/70"
                          )}
                          animate={{ opacity: [0.25, 0.95, 0.25], y: [0, -1.5, 0] }}
                          transition={{
                            duration: 1.4,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: segment * 0.2,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                    {spot.isEv && (
                      <span className="absolute bottom-2 rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-100">
                        EV
                      </span>
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
