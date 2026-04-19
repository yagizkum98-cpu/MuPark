"use client";

import { motion } from "framer-motion";
import {
  Activity,
  CircleDollarSign,
  Download,
  FileSpreadsheet,
  FileText,
  ReceiptText,
  ShieldCheck,
  UserRound,
} from "lucide-react";

type BreakdownItem = {
  label: string;
  value: number;
};

type ZonePerformanceItem = {
  zoneName: string;
  reservations: number;
  revenue: number;
  completed: number;
  active: number;
};

type DailyTrendItem = {
  date: string;
  reservations: number;
  revenue: number;
};

type HourlyLoadItem = {
  hour: string;
  value: number;
};

type ReportItem = {
  zoneName: string;
  driver: string;
  driverEmail: string;
  vehicle: string;
  vehicleType: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  reservedAt: string | Date;
  startTime: string | Date | null;
  endTime: string | Date | null;
};

type ReportData = {
  days: number;
  totalReservations: number;
  totalRevenue: number;
  averageTicket: number;
  completedCount: number;
  activeCount: number;
  cancelledCount: number;
  uniqueDrivers: number;
  paymentSuccessRate: number;
  statusBreakdown: BreakdownItem[];
  paymentBreakdown: BreakdownItem[];
  vehicleBreakdown: BreakdownItem[];
  zonePerformance: ZonePerformanceItem[];
  dailyTrend: DailyTrendItem[];
  hourlyLoad: HourlyLoadItem[];
  items: ReportItem[];
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: "easeOut" } },
};

function getStatusTone(status: string) {
  if (status === "completed") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "active") return "bg-cyan-50 text-cyan-700 border-cyan-200";
  if (status === "approved") return "bg-indigo-50 text-indigo-700 border-indigo-200";
  if (status === "pending") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

function getPaymentTone(status: string) {
  if (status === "paid") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "pending") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

function formatDate(value: string | Date) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString("tr-TR");
}

export default function AdminReportsExperience({ report }: { report: ReportData }) {
  const topZone = report.zonePerformance[0];
  const maxDailyReservations = Math.max(...report.dailyTrend.map((entry) => entry.reservations), 1);
  const maxHourlyLoad = Math.max(...report.hourlyLoad.map((entry) => entry.value), 1);

  const summaryCards = [
    {
      label: `${report.days}-day reservations`,
      value: String(report.totalReservations),
      helper: "Current reporting window volume",
      icon: ReceiptText,
    },
    {
      label: "Revenue total",
      value: `$${report.totalRevenue.toFixed(2)}`,
      helper: "All reservation amounts in window",
      icon: CircleDollarSign,
    },
    {
      label: "Average ticket",
      value: `$${report.averageTicket.toFixed(2)}`,
      helper: "Revenue per reservation",
      icon: Activity,
    },
    {
      label: "Unique drivers",
      value: String(report.uniqueDrivers),
      helper: "Distinct users included in report",
      icon: UserRound,
    },
  ];

  const operationalCards = [
    {
      label: "Completed",
      value: report.completedCount,
      helper: "Successfully closed parking sessions",
      tone: "from-emerald-500/20 to-white",
    },
    {
      label: "Active flow",
      value: report.activeCount,
      helper: "Pending, approved or active sessions",
      tone: "from-cyan-500/20 to-white",
    },
    {
      label: "Cancelled",
      value: report.cancelledCount,
      helper: "Dropped reservations in current range",
      tone: "from-rose-500/20 to-white",
    },
    {
      label: "Payment success",
      value: `${report.paymentSuccessRate}%`,
      helper: "Successful transaction ratio",
      tone: "from-violet-500/20 to-white",
    },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.section variants={item} className="overflow-hidden rounded-[2rem] border border-card-border bg-white shadow-sm">
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_28%),radial-gradient(circle_at_10%_20%,rgba(20,184,166,0.15),transparent_28%),linear-gradient(135deg,#ffffff_0%,#f8fafc_42%,#eef2ff_100%)] p-7 md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35rem] text-indigo-700">Reports Command Center</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl">
                Operasyon, gelir ve davranis sinyallerini tek rapor merkezinde topladik
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
                Sidebar&apos;daki `Reports` sekmesi artik yalnizca liste gostermiyor; yonetim ekibinin ozet metrikleri,
                alan performansini, durum ve odeme kirilimlarini, gunluk hacim akisini ve son kayitlari tek ekranda
                okuyabilecegi kapsamli bir rapor deneyimi sunuyor.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={`/api/reports/summary?days=${report.days}&format=pdf`}
                className="inline-flex items-center gap-2 rounded-2xl border border-card-border bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </a>
              <a
                href={`/api/reports/summary?days=${report.days}&format=excel`}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export Excel
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section variants={container} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((metric) => (
          <motion.div
            key={metric.label}
            variants={item}
            whileHover={{ y: -5 }}
            className="rounded-[1.75rem] border border-card-border bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28rem] text-slate-500">{metric.label}</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{metric.value}</p>
                <p className="mt-2 text-sm text-slate-600">{metric.helper}</p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-3">
                <metric.icon className="h-5 w-5 text-slate-800" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.section>

      <motion.section variants={container} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {operationalCards.map((metric) => (
          <motion.div
            key={metric.label}
            variants={item}
            whileHover={{ y: -5 }}
            className={`rounded-[1.75rem] border border-card-border bg-gradient-to-br ${metric.tone} p-6 shadow-sm`}
          >
            <p className="text-xs uppercase tracking-[0.28rem] text-slate-500">{metric.label}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{metric.value}</p>
            <p className="mt-2 text-sm text-slate-600">{metric.helper}</p>
          </motion.div>
        ))}
      </motion.section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_380px]">
        <motion.section variants={item} className="rounded-[2rem] border border-card-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.28rem] text-slate-500">Daily trend</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Reservation volume by day</h2>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {report.dailyTrend.length} days tracked
            </div>
          </div>

          <div className="mt-8">
            <div className="flex h-[300px] items-end gap-3 overflow-x-auto pb-2">
              {report.dailyTrend.map((entry, index) => {
                const height = Math.max((entry.reservations / maxDailyReservations) * 100, 8);
                return (
                  <motion.div
                    key={entry.date}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.04 }}
                    className="flex min-w-[90px] flex-1 flex-col items-center justify-end"
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 0.16 + index * 0.04, duration: 0.55 }}
                      className="flex w-full items-end rounded-t-[1.4rem] bg-gradient-to-t from-indigo-500 via-cyan-500 to-sky-300 px-3 py-4 text-white shadow-[0_16px_36px_rgba(79,70,229,0.18)]"
                    >
                      <div>
                        <p className="text-lg font-bold">{entry.reservations}</p>
                        <p className="text-[11px] text-white/80">${entry.revenue.toFixed(0)}</p>
                      </div>
                    </motion.div>
                    <p className="mt-3 text-center text-xs text-slate-500">{entry.date}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        <motion.aside variants={container} className="space-y-6">
          <motion.section variants={item} className="rounded-[2rem] border border-card-border bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.28rem] text-slate-500">Zone leader</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Top earning zone</h2>
            <div className="mt-6 rounded-[1.5rem] border border-card-border bg-slate-50 p-5">
              <p className="text-lg font-semibold text-slate-900">{topZone?.zoneName ?? "No data"}</p>
              <p className="mt-2 text-sm text-slate-600">
                {topZone?.reservations ?? 0} reservations, ${topZone?.revenue.toFixed(2) ?? "0.00"} revenue
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl bg-white px-3 py-3">
                  <p className="uppercase tracking-wide text-slate-400">Completed</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{topZone?.completed ?? 0}</p>
                </div>
                <div className="rounded-2xl bg-white px-3 py-3">
                  <p className="uppercase tracking-wide text-slate-400">Active</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{topZone?.active ?? 0}</p>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section variants={item} className="rounded-[2rem] border border-card-border bg-slate-950 p-6 text-white shadow-sm">
            <p className="text-xs uppercase tracking-[0.28rem] text-cyan-300">Snapshot note</p>
            <h2 className="mt-2 text-xl font-semibold">Reporting focus</h2>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Bu ekran yoneticinin once ozet resmi, sonra operasyonel kirilimlari ve en sonda kayit detaylarini
              okuyacagi sekilde katmanlandi. Boylece `Reports` sekmesi artik dogrudan karar almaya hizmet ediyor.
            </p>
          </motion.section>
        </motion.aside>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <motion.section variants={item} className="rounded-[2rem] border border-card-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.28rem] text-slate-500">Zone performance</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Area-by-area breakdown</h2>
            </div>
            <ShieldCheck className="h-5 w-5 text-slate-500" />
          </div>

          <div className="mt-6 space-y-4">
            {report.zonePerformance.map((zone, index) => (
              <motion.div
                key={zone.zoneName}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + index * 0.05 }}
                className="rounded-[1.5rem] border border-card-border bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{zone.zoneName}</p>
                    <p className="mt-1 text-xs text-slate-500">{zone.reservations} reservations in range</p>
                  </div>
                  <p className="text-lg font-bold text-slate-900">${zone.revenue.toFixed(2)}</p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                  <div className="rounded-2xl bg-white px-3 py-3">
                    <p className="uppercase tracking-wide text-slate-400">Reservations</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{zone.reservations}</p>
                  </div>
                  <div className="rounded-2xl bg-white px-3 py-3">
                    <p className="uppercase tracking-wide text-slate-400">Completed</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{zone.completed}</p>
                  </div>
                  <div className="rounded-2xl bg-white px-3 py-3">
                    <p className="uppercase tracking-wide text-slate-400">Active</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{zone.active}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section variants={container} className="space-y-6">
          <motion.section variants={item} className="rounded-[2rem] border border-card-border bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.28rem] text-slate-500">Status breakdown</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Reservation workflow</h2>
            <div className="mt-6 space-y-4">
              {report.statusBreakdown.map((entry, index) => {
                const percentage = report.totalReservations ? Math.round((entry.value / report.totalReservations) * 100) : 0;
                return (
                  <motion.div
                    key={entry.label}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + index * 0.06 }}
                    className="rounded-[1.4rem] border border-card-border bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold capitalize text-slate-900">{entry.label}</span>
                      <span className="text-slate-500">{entry.value}</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.2 + index * 0.06, duration: 0.55 }}
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">%{percentage} of reservations</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          <motion.section variants={item} className="rounded-[2rem] border border-card-border bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.28rem] text-slate-500">Payment & vehicle mix</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Composition panels</h2>
            <div className="mt-6 grid gap-4">
              <div className="rounded-[1.4rem] border border-card-border bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Payment status</p>
                <div className="mt-4 space-y-3">
                  {report.paymentBreakdown.map((entry) => (
                    <div key={entry.label} className="flex items-center justify-between text-sm">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getPaymentTone(entry.label)}`}>
                        {entry.label}
                      </span>
                      <span className="font-semibold text-slate-900">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[1.4rem] border border-card-border bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Vehicle types</p>
                <div className="mt-4 space-y-3">
                  {report.vehicleBreakdown.map((entry) => (
                    <div key={entry.label} className="flex items-center justify-between text-sm">
                      <span className="capitalize text-slate-700">{entry.label}</span>
                      <span className="font-semibold text-slate-900">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        </motion.section>
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <motion.section variants={item} className="rounded-[2rem] border border-card-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.28rem] text-slate-500">Hourly activity</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Reservation load by hour</h2>
            </div>
            <FileText className="h-5 w-5 text-slate-500" />
          </div>
          <div className="mt-6 grid gap-3">
            {report.hourlyLoad.map((entry, index) => {
              const width = maxHourlyLoad ? Math.max((entry.value / maxHourlyLoad) * 100, entry.value ? 8 : 0) : 0;
              return (
                <motion.div
                  key={entry.hour}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + index * 0.015 }}
                  className="grid grid-cols-[58px_minmax(0,1fr)_32px] items-center gap-3"
                >
                  <span className="text-xs font-semibold text-slate-500">{entry.hour}</span>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ delay: 0.1 + index * 0.015, duration: 0.4 }}
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{entry.value}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        <motion.section variants={item} className="rounded-[2rem] border border-card-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.28rem] text-slate-500">Recent records</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Detailed reservation activity</h2>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {report.items.length} visible rows
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-card-border">
            <div className="grid grid-cols-[1fr_0.9fr_0.9fr_0.8fr_0.8fr_1fr] gap-3 bg-slate-50 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.24rem] text-slate-500">
              <span>Driver</span>
              <span>Zone</span>
              <span>Vehicle</span>
              <span>Status</span>
              <span>Payment</span>
              <span>Reserved at</span>
            </div>
            <div>
              {report.items.map((entry, index) => (
                <motion.div
                  key={`${entry.driverEmail}-${index}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + index * 0.03 }}
                  className="grid grid-cols-[1fr_0.9fr_0.9fr_0.8fr_0.8fr_1fr] gap-3 border-t border-card-border px-5 py-4 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{entry.driver}</p>
                    <p className="truncate text-xs text-slate-500">{entry.driverEmail}</p>
                  </div>
                  <div className="min-w-0 truncate font-medium text-slate-900">{entry.zoneName}</div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{entry.vehicle}</p>
                    <p className="truncate text-xs capitalize text-slate-500">{entry.vehicleType}</p>
                  </div>
                  <div>
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusTone(entry.status)}`}>
                      {entry.status}
                    </span>
                  </div>
                  <div>
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getPaymentTone(entry.paymentStatus)}`}>
                      {entry.paymentStatus}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">{formatDate(entry.reservedAt)}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </section>
    </motion.div>
  );
}
