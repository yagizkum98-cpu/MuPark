"use client";

import { motion } from "framer-motion";
import { Search, CalendarCheck, Navigation, QrCode } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const trSteps = [
  {
    icon: Search,
    title: "1. Park Yeri Bul",
    description: "Uygulamadan bolgenizdeki musait park alanlarini listeleyin.",
  },
  {
    icon: CalendarCheck,
    title: "2. Rezervasyon Yap",
    description: "Size uygun yeri secin ve saniyeler icinde rezervasyonu tamamlayin.",
  },
  {
    icon: Navigation,
    title: "3. Rotani Olustur",
    description: "Navigasyon destegi ile zaman kaybetmeden park yerine ulasin.",
  },
  {
    icon: QrCode,
    title: "4. Park Et",
    description: "Giris onayi ile park alanina gecin ve aracinizi guvenle park edin.",
  },
];

const enSteps = [
  {
    icon: Search,
    title: "1. Find a Spot",
    description: "List available parking areas in your zone from the app.",
  },
  {
    icon: CalendarCheck,
    title: "2. Reserve",
    description: "Choose the best spot and complete reservation in seconds.",
  },
  {
    icon: Navigation,
    title: "3. Build Route",
    description: "Reach the parking area quickly with navigation support.",
  },
  {
    icon: QrCode,
    title: "4. Park",
    description: "Proceed with entry confirmation and park your vehicle securely.",
  },
];

export default function HowItWorks() {
  const { lang } = useLanguage();
  const steps = lang === "tr" ? trSteps : enSteps;

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent -translate-y-1/2 hidden md:block" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {lang === "tr" ? "Nasil Calisir?" : "How It Works"}
          </h2>
          <p className="text-muted">
            {lang === "tr" ? "4 adimda sorunsuz park deneyimi." : "A seamless parking flow in 4 steps."}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative pt-8 group"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 md:-translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-cyan-500 z-10 hidden md:block group-hover:bg-cyan-500 transition-colors" />

              <div className="text-center bg-white/85 border border-cyan-100 rounded-2xl p-6 hover:bg-white transition-all h-full">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <step.icon className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
