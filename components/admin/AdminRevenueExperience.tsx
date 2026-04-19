"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, BadgeDollarSign, CalendarRange, CircleDollarSign, TrendingUp } from "lucide-react";

type RevenueTrendPoint = {
  date: string;
  amount: number;
};

type RevenueLegendItem = {
  label: string;
  value: number;
};

type RevenueData = {
  monthlyRevenue: number;
  perVehicleAverage: number;
  chartTrend: RevenueTrendPoint[];
  legend: RevenueLegendItem[];
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}

export default function AdminRevenueExperience({ revenue }: { revenue: RevenueData }) {
  const maxAmount = Math.max(...revenue.chartTrend.map((point) => point.amount), 1);
  const totalTransactions = revenue.legend.reduce((sum, item) => sum + item.value, 0);
  const latestPoint = revenue.chartTrend[revenue.chartTrend.length - 1];
  const averageDailyRevenue =
    revenue.chartTrend.length > 0
      ? revenue.chartTrend.reduce((sum, point) => sum + point.amount, 0) / revenue.chartTrend.length
      : 0;

  const summaryCards = [
    {
      label: "Monthly revenue",
      value: formatMoney(revenue.monthlyRevenue),
      helper: "Total successful payment volume",
      icon: BadgeDollarSign,
      tone: "from-emerald-500/20 via-teal-500/15 to-white",
    },
    {
      label: "Per-vehicle average",
      value: formatMoney(revenue.perVehicleAverage),
      helper: "Average revenue per processed vehicle",
      icon: CircleDollarSign,
      tone: "from-sky-500/20 via-cyan-500/15 to-white",
    },
    {
      label: "Tracked days",
      value: String(revenue.chartTrend.length),
      helper: latestPoint ? `Latest entry ${latestPoint.date}` : "No recent trend data",
      icon: CalendarRange,
      tone: "from-violet-500/20 via-indigo-500/15 to-white",
    },
    {
      label: "Daily average",
      value: formatMoney(averageDailyRevenue),
      helper: "Mean daily income across current trend window",
      icon: TrendingUp,
      tone: "from-amber-500/20 via-orange-500/15 to-white",
    },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.section
        variants={item}
        className="overflow-hidden rounded-[2rem] border border-card-border bg-white shadow-sm"
      >
        <div className="bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(59,130,246,0.18),transparent_30%),linear-gradient(135deg,#ffffff_0%,#f0fdfa_48%,#eff6ff_100%)] p-7 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35rem] text-teal-700">Revenue Intelligence</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl">
                Gelir akislarini hareketli finans panoramasi ile izle
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
                Basarili odemeler, gunluk trend ve islem karmasi tek bakista okunuyor. Kartlar ve grafik yapisi
                kademeli gecislerle finans ekranini daha canli ve yorumlanabilir hale getiriyor.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-white/70 bg-white/70 px-5 py-4 shadow-sm backdrop-blur">
              <p className="text-xs uppercase tracking-[0.28rem] text-slate-500">Live snapshot</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{formatMoney(revenue.monthlyRevenue)}</p>
              <p className="mt-1 text-sm text-slate-600">{totalTransactions} processed transactions</p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section variants={container} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <motion.div
            key={card.label}
            variants={item}
            whileHover={{ y: -6, scale: 1.01 }}
            className={`rounded-[1.75rem] border border-card-border bg-gradient-to-br ${card.tone} p-6 shadow-sm`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28rem] text-slate-500">{card.label}</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{card.value}</p>
                <p className="mt-2 text-sm text-slate-600">{card.helper}</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-3 shadow-sm">
                <card.icon className="h-5 w-5 text-slate-800" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_380px]">
        <motion.section variants={item} className="rounded-[2rem] border border-card-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.28rem] text-slate-500">Daily trend</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Animated revenue bars</h2>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {revenue.chartTrend.length} data points
            </div>
          </div>

          <div className="mt-8">
            <div className="flex h-[320px] items-end gap-3 overflow-x-auto pb-2">
              {revenue.chartTrend.map((point, index) => {
                const height = Math.max((point.amount / maxAmount) * 100, 8);
                return (
                  <motion.div
                    key={point.date}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.04, duration: 0.35 }}
                    className="flex min-w-[88px] flex-1 flex-col items-center justify-end"
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 0.18 + index * 0.04, duration: 0.55, ease: "easeOut" }}
                      className="relative flex w-full items-end overflow-hidden rounded-t-[1.5rem] bg-gradient-to-t from-teal-500 via-cyan-500 to-sky-300 px-3 py-4 shadow-[0_18px_40px_rgba(34,211,238,0.22)]"
                    >
                      <span className="text-sm font-bold text-white">{formatMoney(point.amount)}</span>
                    </motion.div>
                    <p className="mt-3 text-center text-xs text-slate-500">{point.date}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        <motion.aside variants={container} className="space-y-6">
          <motion.section variants={item} className="rounded-[2rem] border border-card-border bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.28rem] text-slate-500">Transaction mix</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Payment composition</h2>
            <div className="mt-6 space-y-4">
              {revenue.legend.map((entry, index) => {
                const percentage = totalTransactions ? Math.round((entry.value / totalTransactions) * 100) : 0;
                return (
                  <motion.div
                    key={entry.label}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.08 }}
                    className="rounded-[1.5rem] border border-card-border bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-900">{entry.label}</span>
                      <span className="text-slate-500">{entry.value}</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.3 + index * 0.08, duration: 0.55 }}
                        className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">%{percentage} of total flow</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          <motion.section variants={item} className="rounded-[2rem] border border-card-border bg-slate-950 p-6 text-white shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.28rem] text-cyan-300">Insight</p>
                <h3 className="mt-2 text-xl font-semibold">Revenue momentum note</h3>
              </div>
              <ArrowUpRight className="h-5 w-5 text-cyan-300" />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Bu ekran artik yalnizca rakam gostermiyor; gelirin ritmini, islem karmasini ve gunluk yogunluk desenini
              katmanli gecislerle one cikariyor.
            </p>
            <div className="mt-6 grid gap-3">
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22rem] text-slate-400">Current average</p>
                <p className="mt-2 text-2xl font-bold">{formatMoney(averageDailyRevenue)}</p>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22rem] text-slate-400">Last captured day</p>
                <p className="mt-2 text-lg font-semibold">{latestPoint?.date ?? "No data"}</p>
              </div>
            </div>
          </motion.section>
        </motion.aside>
      </section>
    </motion.div>
  );
}
