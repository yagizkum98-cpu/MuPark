"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Car, Clock, Zap, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";

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
  const { lang } = useLanguage();
  const [zones, setZones] = useState<ZoneSnapshot[]>([]);
  const [activeZoneSlug, setActiveZoneSlug] = useState<string | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<LiveSpotInfo | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useMemo(
    () =>
      lang === "tr"
        ? {
            fetchFail: "Veriler alinamadi.",
            liveFail: "Canli doluluk guncellenemedi.",
            statusFail: "Durum guncellenemedi.",
            reserveEv: `EV kosesi rezerve edildi. Sarjda ilk ${EV_FREE_MINUTES} dakika MuPark hediyesi aktif.`,
            reserveCar: "Rezervasyonunuz olusturuldu. Park yerine ilerleyebilirsiniz.",
            release: "Park tamamlandi, alan yeniden kullanilabilir.",
            statusAvailable: "Musait",
            statusReserved: "Rezerve",
            statusOccupied: "Dolu",
            actionReserve: "Parki Rezerve Et",
            actionReleaseOccupied: "Parki Bosalt",
            actionRelease: "Parki Bitir",
            busyReserve: "Rezervasyon guncelleniyor...",
            busyUpdate: "Durum guncelleniyor...",
            badge: "Canli Sistem Demosu",
            titleA: "Gercek Zamanli",
            titleB: "Park Yonetimi",
            subtitle: "Pilot bolgelerdeki anlik durumu interaktif harita uzerinden izleyin.",
            selectLocation: "Konum Secin",
            fieldStatus: "Durum",
            fieldUpdated: "Son guncelleme",
            fieldPrice: "Ucret",
            fieldCharge: "Sarj tarifesi",
            freeMinute: `${EV_FREE_MINUTES} dk ucretsiz`,
            stateTariff: "(devlet)",
            gift: "MuPark Hediyesi",
            leftFree: "dk ucretsiz kaldi",
            points: "Oyunlastirma puani",
            loading: "Canli veriler yukleniyor...",
            selectPrompt: "Rezervasyon yapmak icin haritadan uygun (yesil) bir park yeri secin.",
            mapTitle: "Canli Doluluk Haritasi",
            live: "Canli",
            legendAvailable: "Musait",
            legendOccupied: "Dolu",
            legendReserved: "Rezerve",
            legendEv: "EV Kosesi",
            campaignTitle: "Elektrikli arac kampanyasi",
            campaignDesc: `2 park alani EV kosesi olarak ayrildi. Sarj devlet tarifesiyle isler, ilk ${EV_FREE_MINUTES} dakika MuPark'tan hediye.`,
            penalty: "Ceza sayaci",
            totalPenalty: "Toplam ceza",
            penaltyRate: "rezerve edilen fakat gelmeyen arac",
          }
        : {
            fetchFail: "Failed to fetch data.",
            liveFail: "Live occupancy refresh failed.",
            statusFail: "Failed to update status.",
            reserveEv: `EV corner reserved. MuPark gift covers first ${EV_FREE_MINUTES} minutes of charging.`,
            reserveCar: "Reservation created. You can proceed to the parking area.",
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
            titleB: "Parking Management",
            subtitle: "Track live conditions in pilot zones with an interactive map.",
            selectLocation: "Select Location",
            fieldStatus: "Status",
            fieldUpdated: "Last update",
            fieldPrice: "Price",
            fieldCharge: "Charging tariff",
            freeMinute: `First ${EV_FREE_MINUTES} min free`,
            stateTariff: "(state)",
            gift: "MuPark Gift",
            leftFree: "min free left",
            points: "Gamification score",
            loading: "Loading live data...",
            selectPrompt: "Select an available (green) spot on the map to reserve.",
            mapTitle: "Live Occupancy Map",
            live: "Live",
            legendAvailable: "Available",
            legendOccupied: "Occupied",
            legendReserved: "Reserved",
            legendEv: "EV Corner",
            campaignTitle: "EV campaign",
            campaignDesc: `2 parking spots are dedicated as EV corners. Charging follows state tariff, first ${EV_FREE_MINUTES} minutes are sponsored by MuPark.`,
            penalty: "Penalty counter",
            totalPenalty: "Total penalty",
            penaltyRate: "reserved but absent vehicle",
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
      const message = error instanceof Error ? error.message : copy.liveFail;
      setFetchError(message);
    } finally {
      setLoading(false);
    }
  }, [copy.fetchFail, copy.liveFail]);

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
          throw new Error(payload?.message || copy.statusFail);
        }

        const updatedStatus = payload.status as SpotStatus;
        setSelectedSpot((prev) => (prev ? { ...prev, status: updatedStatus } : prev));
        setFeedback(action === "reserve" ? (selectedSpot.isEv ? copy.reserveEv : copy.reserveCar) : copy.release);

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
    [copy.release, copy.reserveCar, copy.reserveEv, copy.statusFail, refreshLiveSpots, selectedSpot]
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

  const spots = activeZone?.spots ?? [];
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
    const usedMinutes = Number.isFinite(elapsedMs) && elapsedMs > 0 ? Math.floor(elapsedMs / 60000) : 0;
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
    <section id="demo" className="py-24 relative bg-cyan-50/40">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {copy.badge}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {copy.titleA} <span className="text-cyan-400">{copy.titleB}</span>
          </h2>
          <p className="text-muted text-lg">{copy.subtitle}</p>
        </div>

        <div className="max-w-5xl mx-auto rounded-3xl bg-white/90 border border-cyan-100 backdrop-blur-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-cyan-100 bg-white p-6 flex flex-col">
            <h3 className="text-slate-900 font-semibold mb-6 flex items-center gap-2">
              <MapPin className="text-cyan-400" /> {copy.selectLocation}
            </h3>

            <div className="space-y-2 mb-8">
              {zones.map((zone) => (
                <button
                  key={zone.slug}
                  onClick={() => setActiveZoneSlug(zone.slug)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium",
                    activeZoneSlug === zone.slug
                      ? "bg-cyan-100 text-cyan-800 border border-cyan-300"
                      : "text-slate-600 hover:bg-cyan-50 hover:text-slate-900"
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
                  <h4 className="text-slate-900 font-bold mb-2 flex items-center gap-2">
                    {selectedSpot.isEv ? <Zap className="w-4 h-4 text-amber-300" /> : <Car className="w-4 h-4" />} {selectedSpot.label ?? selectedSpot.spotId}
                  </h4>
                  <div className="space-y-3 text-sm text-slate-600 my-4">
                    <div className="flex justify-between">
                      <span>{copy.fieldStatus}</span>
                      <span className="text-slate-900">{statusLabels[selectedSpot.status]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{copy.fieldUpdated}</span>
                      <span className="text-slate-900">
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
                      <span className="text-slate-900">
                        {selectedSpot.isEv ? copy.freeMinute : activeZone ? `${activeZone.hourlyRate.toFixed(2)} TL / hour` : "-"}
                      </span>
                    </div>
                    {selectedSpot.isEv && (
                      <div className="flex justify-between">
                        <span>{copy.fieldCharge}</span>
                        <span className="text-slate-900">
                          {EV_STATE_TARIFF.toFixed(2)} TL / kWh {copy.stateTariff}
                        </span>
                      </div>
                    )}
                  </div>
                  {selectedSpot.isEv && evUsageSummary && (
                    <div className="mb-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3">
                      <div className="flex items-center justify-between text-xs text-amber-100">
                        <span className="inline-flex items-center gap-1">
                          <Gift className="h-3.5 w-3.5" /> {copy.gift}
                        </span>
                        <span>
                          {evUsageSummary.remainingFreeMinutes} {copy.leftFree}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-black/30">
                        <div className="h-full rounded-full bg-amber-300 transition-all" style={{ width: `${evUsageSummary.progress}%` }} />
                      </div>
                      <p className="mt-2 text-xs text-amber-50">
                        {copy.points}: <span className="font-semibold">{evUsageSummary.ecoPoints} EcoPoint</span>
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
                  {feedback && <p className="text-xs text-cyan-700 mt-2">{feedback}</p>}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-100 text-center">
                  <p className="text-muted text-sm">{loading ? copy.loading : copy.selectPrompt}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 p-6 md:p-10 bg-[url('https://images.unsplash.com/photo-1621929747188-0b4b23297109?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center md:bg-gray-900 relative">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {copy.mapTitle}
                  <span className="text-xs font-normal px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/20">{copy.live}</span>
                </h3>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5 text-gray-400"><span className="w-2 h-2 rounded-full bg-green-500" />{copy.legendAvailable}</div>
                  <div className="flex items-center gap-1.5 text-gray-400"><span className="w-2 h-2 rounded-full bg-red-500" />{copy.legendOccupied}</div>
                  <div className="flex items-center gap-1.5 text-gray-400"><span className="w-2 h-2 rounded-full bg-blue-500" />{copy.legendReserved}</div>
                  <div className="flex items-center gap-1.5 text-gray-400"><span className="w-2 h-2 rounded-full bg-amber-400" />{copy.legendEv}</div>
                </div>
              </div>

              <div className="mb-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-50 shadow-lg shadow-amber-900/20">
                <p className="text-[10px] tracking-[0.2em] uppercase text-amber-200">{copy.campaignTitle}</p>
                <p className="mt-1 text-sm">{copy.campaignDesc}</p>
              </div>

              <div className="mb-6 rounded-2xl border border-cyan-500/30 bg-white/5 px-4 py-3 text-sm text-white shadow-lg shadow-cyan-500/20">
                <p className="text-[10px] tracking-[0.2em] uppercase text-cyan-200">{copy.penalty}</p>
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
                      spot.isEv && "border-amber-400/70 bg-amber-500/10 text-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.15)]",
                      !spot.isEv && spot.status === "available" && "bg-green-500/10 border-green-500/50 text-green-500 hover:bg-green-500/20 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)]",
                      !spot.isEv && spot.status === "occupied" && "bg-red-500/5 border-red-500/20 text-white opacity-90",
                      !spot.isEv && spot.status === "reserved" && "bg-blue-500/10 border-blue-500/50 text-blue-400",
                      selectedSpot?.spotId === spot.spotId && "ring-2 ring-white ring-offset-2 ring-offset-black bg-green-500/30"
                    )}
                  >
                    <span className="absolute top-2 left-3 text-xs font-bold opacity-70">{spot.label ?? spot.spotId}</span>
                    {spot.isEv ? <Zap className="w-8 h-8" /> : spot.status === "occupied" ? <Car className="w-8 h-8 opacity-50" /> : spot.status === "reserved" ? <Clock className="w-8 h-8 opacity-80" /> : <div className="text-2xl font-bold">P</div>}
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
                    {spot.isEv && <span className="absolute bottom-2 rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-100">EV</span>}
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
