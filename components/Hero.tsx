"use client";

import { motion } from "framer-motion";
import { ArrowRight, Car, MessageCircle, ShieldCheck, Zap } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export default function Hero() {
  const { lang } = useLanguage();
  const handleDemoScroll = useCallback(() => {
    const demoSection = document.getElementById("demo");
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const copy = useMemo(
    () =>
      lang === "tr"
        ? {
            badge: "Akilli Sehir Teknolojisi",
            titleA: "Park Yonetiminin",
            titleB: "Gelecegi Burada",
            desc: "Yapay zeka destekli goruntu isleme ile otopark dolulugunu anlik takip edin, rezervasyon yapin ve sehir ici trafigi azaltin.",
            demo: "Demo Paneli",
            whatsapp: "WhatsApp'tan Ulas",
            stats: [
              { label: "Park Alani", value: "20+", icon: ShieldCheck },
              { label: "AI Dogruluk", value: "%99", icon: Zap },
              { label: "Anlik Takip", value: "7/24", icon: Car },
              { label: "MVP Suresi", value: "6 Hafta", icon: ArrowRight },
            ],
          }
        : {
            badge: "Smart City Technology",
            titleA: "Future of Parking",
            titleB: "Management Is Here",
            desc: "Track parking occupancy in real time with AI-powered vision, make reservations, and reduce urban traffic.",
            demo: "Demo Panel",
            whatsapp: "Reach via WhatsApp",
            stats: [
              { label: "Parking Zones", value: "20+", icon: ShieldCheck },
              { label: "AI Accuracy", value: "99%", icon: Zap },
              { label: "Live Tracking", value: "24/7", icon: Car },
              { label: "MVP Timeline", value: "6 Weeks", icon: ArrowRight },
            ],
          },
    [lang]
  );

  const whatsappHref =
    lang === "tr"
      ? "https://wa.me/?text=Merhaba%2C%20MuPark%20belediye%20yonetim%20paneli%20hakkinda%20bilgi%20almak%20istiyorum."
      : "https://wa.me/?text=Hello%2C%20I%20would%20like%20to%20get%20information%20about%20the%20MuPark%20municipality%20management%20panel.";

  return (
    <section className="neon-grid relative flex min-h-[90vh] items-center justify-center overflow-hidden pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(6,182,212,0.18),transparent_40%)] animate-pulse-glow" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-[8%] top-28 hidden h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent md:block" />
      <div className="pointer-events-none absolute left-[12%] top-36 h-28 w-28 rounded-full border border-cyan-300/20 bg-cyan-300/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-24 right-[10%] h-40 w-40 rounded-full border border-emerald-300/20 bg-emerald-300/10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--panel-border)] bg-[var(--surface-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--accent-strong)] transition-colors">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            {copy.badge}
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-[color:var(--hero-title)] md:text-7xl">
            {copy.titleA} <br />
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
              {copy.titleB}
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-[color:var(--hero-subtle)] md:text-xl">
            {copy.desc}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={handleDemoScroll}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-cyan-300/40 bg-gradient-to-r from-cyan-400 to-sky-500 px-8 py-4 text-lg font-bold text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.26)] transition-all hover:scale-105 hover:shadow-[0_0_34px_rgba(34,211,238,0.45)] active:scale-95 sm:w-auto"
            >
              {copy.demo}
              <ArrowRight className="h-5 w-5" />
            </button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="group flex w-full items-center justify-center gap-2 rounded-full border border-[color:var(--panel-border)] bg-[var(--surface-soft)] px-8 py-4 text-lg font-semibold text-[color:var(--foreground)] transition-all hover:border-cyan-300/40 hover:bg-white/10 sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" />
              {copy.whatsapp}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {copy.stats.map((stat) => (
            <div key={stat.label} className="neon-card data-stream group cursor-default rounded-3xl p-6 transition-colors">
              <stat.icon className="mb-4 h-5 w-5 text-[color:var(--accent-text)]" />
              <h3 className="mb-1 text-3xl font-bold text-[color:var(--hero-title)] transition-colors group-hover:text-[color:var(--accent-text)]">
                {stat.value}
              </h3>
              <p className="text-sm text-[color:var(--muted)]">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
