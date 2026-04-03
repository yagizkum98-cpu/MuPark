"use client";

import { motion } from "framer-motion";
import { ArrowRight, Car, Download, ShieldCheck, Zap } from "lucide-react";
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
            download: "Uygulamayi Indir",
            demo: "Demo Paneli Gor",
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
            download: "Download App",
            demo: "View Demo Panel",
            stats: [
              { label: "Parking Zones", value: "20+", icon: ShieldCheck },
              { label: "AI Accuracy", value: "99%", icon: Zap },
              { label: "Live Tracking", value: "24/7", icon: Car },
              { label: "MVP Timeline", value: "6 Weeks", icon: ArrowRight },
            ],
          },
    [lang]
  );

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.15),transparent_50%)] animate-pulse-glow" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-700 text-xs font-semibold uppercase tracking-wider mb-6 hover:bg-cyan-200 transition-colors">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {copy.badge}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6">
            {copy.titleA} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {copy.titleB}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            {copy.desc}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              {copy.download}
            </button>
            <button
              onClick={handleDemoScroll}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-cyan-200 text-cyan-900 font-semibold text-lg hover:bg-cyan-50 transition-all flex items-center justify-center gap-2 group"
            >
              {copy.demo}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
        >
          {copy.stats.map((stat) => (
            <div
              key={stat.label}
              className="p-6 rounded-2xl bg-white/80 border border-cyan-100 backdrop-blur-sm hover:bg-white transition-colors group cursor-default"
            >
              <h3 className="text-3xl font-bold text-slate-900 mb-1 group-hover:text-cyan-700 transition-colors">
                {stat.value}
              </h3>
              <p className="text-sm text-slate-600">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
