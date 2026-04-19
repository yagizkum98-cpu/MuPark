"use client";

import { motion } from "framer-motion";
import { Activity, Compass, MapPinned, Radar, Waves } from "lucide-react";
import FethiyeParkingMap from "@/components/fethiye/FethiyeParkingMap";

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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function getZoneTone(rate: number) {
  if (rate >= 80) return "from-rose-500 to-orange-400";
  if (rate >= 55) return "from-amber-500 to-yellow-400";
  return "from-emerald-500 to-teal-400";
}

export default function AdminMapExperience({ zones, token }: { zones: MapZone[]; token?: string }) {
  const totalCapacity = zones.reduce((sum, zone) => sum + zone.capacity, 0);
  const totalAvailable = zones.reduce((sum, zone) => sum + zone.availableSpots, 0);
  const avgOccupancy = zones.length
    ? Math.round(zones.reduce((sum, zone) => sum + zone.occupancyRate, 0) / zones.length)
    : 0;
  const hottestZone =
    zones.length > 0
      ? zones.reduce((prev, current) => (current.occupancyRate > prev.occupancyRate ? current : prev), zones[0])
      : null;

  const metricCards = [
    {
      label: "Mapped zones",
      value: String(zones.length),
      helper: "Live cluster cards and map markers",
      icon: MapPinned,
    },
    {
      label: "Total capacity",
      value: String(totalCapacity),
      helper: "Combined spot inventory",
      icon: Radar,
    },
    {
      label: "Available now",
      value: String(totalAvailable),
      helper: "Instant free space estimate",
      icon: Compass,
    },
    {
      label: "Avg occupancy",
      value: `%${avgOccupancy}`,
      helper: "Mean usage intensity across zones",
      icon: Activity,
    },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.section variants={item} className="rounded-[2rem] border border-card-border bg-white shadow-sm">
        <div className="bg-[radial-gradient(circle_at_15%_20%,rgba(34,197,94,0.12),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(59,130,246,0.18),transparent_28%),linear-gradient(135deg,#ffffff_0%,#eff6ff_52%,#ecfeff_100%)] p-7 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35rem] text-sky-700">Spatial Overlay</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl">
                Harita katmanini operasyonel karar merkezi gibi hissettirecek sekilde guclendirdik
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
                Harita artik yalnizca marker gostermiyor; kapasite, yogunluk ve kritik bolge okumasi ile birlikte
                daha kapsamli bir mekansal kontrol deneyimi sunuyor.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-white/70 bg-white/70 px-5 py-4 shadow-sm backdrop-blur">
              <p className="text-xs uppercase tracking-[0.28rem] text-slate-500">Hottest zone</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">{hottestZone?.name ?? "No data"}</p>
              <p className="mt-1 text-sm text-slate-600">%{hottestZone?.occupancyRate ?? 0} occupancy intensity</p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section variants={container} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => (
          <motion.div
            key={card.label}
            variants={item}
            whileHover={{ y: -5 }}
            className="rounded-[1.75rem] border border-card-border bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28rem] text-slate-500">{card.label}</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{card.value}</p>
                <p className="mt-2 text-sm text-slate-600">{card.helper}</p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-3">
                <card.icon className="h-5 w-5 text-slate-800" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.section>

      <motion.section variants={item}>
        <FethiyeParkingMap
          zones={zones}
          token={token}
          title="Fethiye doluluk haritasi"
          description="Yonetim paneli artik placeholder statik gorsel yerine Fethiye referans koordinatlarina oturan canli Mapbox katmani kullaniyor."
        />
      </motion.section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_360px]">
        <motion.section variants={container} className="rounded-[2rem] border border-card-border bg-white p-6 shadow-sm">
          <motion.div variants={item} className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.28rem] text-slate-500">Zone intensity</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Animated zone diagnostics</h2>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {zones.length} clusters
            </div>
          </motion.div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {zones.map((zone, index) => (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + index * 0.06 }}
                className="overflow-hidden rounded-[1.6rem] border border-card-border bg-slate-50"
              >
                <div className={`h-1.5 bg-gradient-to-r ${getZoneTone(zone.occupancyRate)}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{zone.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{zone.address}</p>
                    </div>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm">
                      Block {zone.block}
                    </span>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${zone.occupancyRate}%` }}
                      transition={{ delay: 0.2 + index * 0.06, duration: 0.6 }}
                      className={`h-full rounded-full bg-gradient-to-r ${getZoneTone(zone.occupancyRate)}`}
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                    <div className="rounded-2xl bg-white px-3 py-3">
                      <p className="uppercase tracking-wide text-slate-400">Occ.</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">%{zone.occupancyRate}</p>
                    </div>
                    <div className="rounded-2xl bg-white px-3 py-3">
                      <p className="uppercase tracking-wide text-slate-400">Free</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{zone.availableSpots}</p>
                    </div>
                    <div className="rounded-2xl bg-white px-3 py-3">
                      <p className="uppercase tracking-wide text-slate-400">Rate</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{zone.hourlyRate} TL</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.aside variants={container} className="space-y-6">
          <motion.section variants={item} className="rounded-[2rem] border border-card-border bg-slate-950 p-6 text-white shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.28rem] text-cyan-300">Flow pulse</p>
                <h2 className="mt-2 text-xl font-semibold">Spatial watchtower</h2>
              </div>
              <Waves className="h-5 w-5 text-cyan-300" />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Yogunlugun arttigi bolgeler kart ustundeki renk akisiyla daha hizli fark ediliyor; harita sayfasi artik
              statik bir overlay yerine operasyonel bir sinyal paneli gibi davraniyor.
            </p>
          </motion.section>

          <motion.section variants={item} className="rounded-[2rem] border border-card-border bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.28rem] text-slate-500">Critical note</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Priority zone</h2>
            <div className="mt-6 rounded-[1.5rem] border border-card-border bg-slate-50 p-5">
              <p className="text-lg font-semibold text-slate-900">{hottestZone?.name ?? "No data"}</p>
              <p className="mt-1 text-sm text-slate-600">{hottestZone?.address ?? "No address available"}</p>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${hottestZone?.occupancyRate ?? 0}%` }}
                  transition={{ delay: 0.25, duration: 0.65 }}
                  className={`h-full rounded-full bg-gradient-to-r ${getZoneTone(hottestZone?.occupancyRate ?? 0)}`}
                />
              </div>
              <p className="mt-3 text-sm text-slate-600">
                %{hottestZone?.occupancyRate ?? 0} occupancy with {hottestZone?.availableSpots ?? 0} available spots
              </p>
            </div>
          </motion.section>
        </motion.aside>
      </section>
    </motion.div>
  );
}
