"use client";

import { motion } from "framer-motion";
import { Brain, Smartphone, CreditCard, LayoutGrid, Map, Zap } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const trFeatures = [
  {
    icon: Brain,
    title: "Yapay Zeka Destekli Takip",
    description: "Tek bir kamera ile genis alanlardaki doluluk oranini yuksek dogrulukla analiz eder.",
  },
  {
    icon: Smartphone,
    title: "Mobil Uygulama Entegrasyonu",
    description: "Suruculer bos park yerlerini cebinden gorur, aninda rezervasyon yapar.",
  },
  {
    icon: CreditCard,
    title: "Kolay Odeme ve Check-in",
    description: "Dijital giris-cikis ile odemeler uygulama uzerinden otomatik tahsil edilir.",
  },
  {
    icon: LayoutGrid,
    title: "Anlik Doluluk Paneli",
    description: "Yoneticiler icin detayli dashboard ile tum park hareketlerini izleyin.",
  },
  {
    icon: Map,
    title: "Navigasyon Destegi",
    description: "Harita entegrasyonu ile bos park yerine en kisa rotadan ulasin.",
  },
  {
    icon: Zap,
    title: "Elektronik Duba Yonetimi",
    description: "Rezerve edilen alanlar icin dubalar otomatik kontrol edilir, yetkisiz parki onler.",
  },
];

const enFeatures = [
  {
    icon: Brain,
    title: "AI-Powered Monitoring",
    description: "A single camera analyzes occupancy across wide areas with high accuracy.",
  },
  {
    icon: Smartphone,
    title: "Mobile App Integration",
    description: "Drivers see available spots on mobile and reserve instantly.",
  },
  {
    icon: CreditCard,
    title: "Easy Payment and Check-in",
    description: "Entry-exit runs with QR code and payments are collected automatically.",
  },
  {
    icon: LayoutGrid,
    title: "Live Occupancy Panel",
    description: "Monitor all parking activity from a detailed management dashboard.",
  },
  {
    icon: Map,
    title: "Navigation Support",
    description: "Reach available parking spots via the fastest route with map integration.",
  },
  {
    icon: Zap,
    title: "Electronic Bollard Control",
    description: "Reserved areas are controlled automatically to prevent unauthorized parking.",
  },
];

export default function Features() {
  const { lang } = useLanguage();
  const features = lang === "tr" ? trFeatures : enFeatures;

  return (
    <section id="features" className="py-24 relative bg-cyan-50/40">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {lang === "tr" ? (
              <>
                Akilli Otoparkin <span className="text-cyan-400">Guclu Ozellikleri</span>
              </>
            ) : (
              <>
                Core <span className="text-cyan-400">Smart Parking Features</span>
              </>
            )}
          </h2>
          <p className="text-muted text-lg">
            {lang === "tr"
              ? "Geleneksel otopark sorunlarini modern teknoloji ile cozuyoruz."
              : "We solve traditional parking problems with modern technology."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-white/85 border border-cyan-100 hover:border-cyan-400/50 hover:bg-white transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
