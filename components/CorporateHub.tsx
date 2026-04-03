"use client";

import { motion } from "framer-motion";
import {
  Brain,
  CalendarCheck,
  Eye,
  Flag,
  Gem,
  HeartHandshake,
  Navigation,
  QrCode,
  Search,
  ShieldCheck,
  Smartphone,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { useMemo } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export default function CorporateHub() {
  const { lang } = useLanguage();

  const copy = useMemo(
    () =>
      lang === "tr"
        ? {
            badge: "Kurumsal Kontrol Merkezi",
            title: "Kurumsal",
            subtitle:
              "Ozellikler ve Nasil Calisir akisini; misyon, vizyon, degerlerimiz ve stratejik hedeflerle tek bir oyunlastirilmis semada topladik.",
            featuresTitle: "Ozellikler",
            howTitle: "Nasil Calisir",
            missionTitle: "Misyon",
            visionTitle: "Vizyon",
            valuesTitle: "Degerlerimiz",
            goalsTitle: "Stratejik Hedefler",
            mission: "Sehir ici park deneyimini veri ve yapay zeka ile hizli, adil ve kesintisiz hale getirmek.",
            vision: "Turkiye'nin en guvenilir akilli park altyapisina donuserek sehirlerin ulasim zekasini guclendirmek.",
            values: ["Guvenlik", "Sadelik", "Olculebilir Etki", "Surdurulebilirlik"],
            featureItems: [
              { title: "AI Doluluk Takibi", desc: "Anlik doluluk analizi ve tahmin.", icon: Brain },
              { title: "Mobil Rezervasyon", desc: "Surucu tarafinda hizli rezervasyon.", icon: Smartphone },
              { title: "Akilli Guvenlik", desc: "Yetkisiz parki otomatik engelleme.", icon: ShieldCheck },
              { title: "Hizli Tepki", desc: "Operasyon panelinde aninda aksiyon.", icon: Zap },
            ],
            flowItems: [
              { title: "Park Yeri Bul", desc: "Müsait alanlari tara.", icon: Search },
              { title: "Rezervasyon Yap", desc: "Saniyeler icinde kilitle.", icon: CalendarCheck },
              { title: "Rotaya Basla", desc: "Navigasyonla ulas.", icon: Navigation },
              { title: "QR ile Park Et", desc: "Kod okut, giris tamam.", icon: QrCode },
            ],
            goalItems: [
              { label: "30+ Belediye Entegrasyonu", progress: 72 },
              { label: "%98+ Dogruluk", progress: 84 },
              { label: "Operasyon Maliyeti -%25", progress: 61 },
            ],
            xp: [
              { label: "Kurumsal Seviye", value: "Lv.4", icon: Trophy },
              { label: "Tamamlanan Faz", value: "12", icon: Target },
              { label: "Etki Puani", value: "8.9/10", icon: Gem },
            ],
          }
        : {
            badge: "Corporate Control Center",
            title: "Corporate",
            subtitle:
              "We combined Features and How It Works with mission, vision, values, and strategic goals in a single gamified infographic.",
            featuresTitle: "Features",
            howTitle: "How It Works",
            missionTitle: "Mission",
            visionTitle: "Vision",
            valuesTitle: "Our Values",
            goalsTitle: "Strategic Goals",
            mission: "Make urban parking faster, fairer, and always-on with data and AI.",
            vision: "Become Turkey's most trusted smart parking backbone and strengthen city mobility intelligence.",
            values: ["Safety", "Simplicity", "Measurable Impact", "Sustainability"],
            featureItems: [
              { title: "AI Occupancy Tracking", desc: "Live occupancy analysis and prediction.", icon: Brain },
              { title: "Mobile Reservation", desc: "Fast driver-side booking flow.", icon: Smartphone },
              { title: "Smart Security", desc: "Automatic prevention of unauthorized parking.", icon: ShieldCheck },
              { title: "Rapid Response", desc: "Instant action through operations panel.", icon: Zap },
            ],
            flowItems: [
              { title: "Find Spot", desc: "Scan available areas.", icon: Search },
              { title: "Reserve", desc: "Lock in seconds.", icon: CalendarCheck },
              { title: "Navigate", desc: "Reach with route guidance.", icon: Navigation },
              { title: "Park via QR", desc: "Scan and complete entry.", icon: QrCode },
            ],
            goalItems: [
              { label: "30+ Municipality Integrations", progress: 72 },
              { label: "98%+ Accuracy", progress: 84 },
              { label: "25% Lower Ops Cost", progress: 61 },
            ],
            xp: [
              { label: "Corporate Level", value: "Lv.4", icon: Trophy },
              { label: "Completed Phases", value: "12", icon: Target },
              { label: "Impact Score", value: "8.9/10", icon: Gem },
            ],
          },
    [lang]
  );

  return (
    <section id="corporate" className="py-24 bg-white/60 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(20,184,166,0.14),transparent_45%)]" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold uppercase tracking-wide mb-5 border border-cyan-200">
            <Flag className="w-4 h-4" />
            {copy.badge}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{copy.title}</h2>
          <p className="text-slate-600 text-lg">{copy.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {copy.xp.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-cyan-200/70 bg-gradient-to-br from-cyan-50 to-white p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">{item.label}</span>
                <item.icon className="w-4 h-4 text-cyan-700" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{item.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="rounded-3xl border border-cyan-200 bg-white/90 p-7">
            <h3 className="text-xl font-bold text-slate-900 mb-4">{copy.featuresTitle}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {copy.featureItems.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-cyan-100 bg-cyan-50/45 p-4">
                  <feature.icon className="w-5 h-5 text-cyan-700 mb-2" />
                  <p className="font-semibold text-slate-900">{feature.title}</p>
                  <p className="text-sm text-slate-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-200 bg-white/90 p-7">
            <h3 className="text-xl font-bold text-slate-900 mb-4">{copy.howTitle}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {copy.flowItems.map((step) => (
                <div key={step.title} className="rounded-2xl border border-cyan-100 bg-cyan-50/45 p-4 relative">
                  <step.icon className="w-5 h-5 text-cyan-700 mb-2" />
                  <p className="font-semibold text-slate-900">{step.title}</p>
                  <p className="text-sm text-slate-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="rounded-3xl border border-cyan-200 bg-white/90 p-6">
            <div className="flex items-center gap-2 mb-3">
              <HeartHandshake className="w-5 h-5 text-cyan-700" />
              <h3 className="font-bold text-slate-900">{copy.missionTitle}</h3>
            </div>
            <p className="text-slate-600">{copy.mission}</p>
          </div>
          <div className="rounded-3xl border border-cyan-200 bg-white/90 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-5 h-5 text-cyan-700" />
              <h3 className="font-bold text-slate-900">{copy.visionTitle}</h3>
            </div>
            <p className="text-slate-600">{copy.vision}</p>
          </div>
          <div className="rounded-3xl border border-cyan-200 bg-white/90 p-6">
            <h3 className="font-bold text-slate-900 mb-3">{copy.valuesTitle}</h3>
            <div className="flex flex-wrap gap-2">
              {copy.values.map((value) => (
                <span
                  key={value}
                  className="px-3 py-1.5 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-900 text-sm font-medium"
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-cyan-200 bg-white/90 p-6 mt-8">
          <h3 className="font-bold text-slate-900 mb-4">{copy.goalsTitle}</h3>
          <div className="grid md:grid-cols-3 gap-5">
            {copy.goalItems.map((goal) => (
              <div key={goal.label} className="rounded-2xl border border-cyan-100 bg-cyan-50/40 p-4">
                <p className="text-sm font-semibold text-slate-900 mb-3">{goal.label}</p>
                <div className="h-2 rounded-full bg-cyan-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-500" style={{ width: `${goal.progress}%` }} />
                </div>
                <p className="text-xs text-slate-500 mt-2">%{goal.progress}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
