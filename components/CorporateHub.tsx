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
              "Özellikler ve Nasıl Çalışır akışını; misyon, vizyon, değerlerimiz ve stratejik hedeflerle tek bir oyunlaştırılmış şemada topladık.",
            featuresTitle: "Özellikler",
            howTitle: "Nasıl Çalışır",
            missionTitle: "Misyon",
            visionTitle: "Vizyon",
            valuesTitle: "Değerlerimiz",
            goalsTitle: "Stratejik Hedefler",
            mission: "Şehir içi park deneyimini veri ve yapay zekâ ile hızlı, adil ve kesintisiz hâle getirmek.",
            vision: "Türkiye'nin en güvenilir akıllı park altyapısına dönüşerek şehirlerin ulaşım zekâsını güçlendirmek.",
            values: ["Güvenlik", "Sadelik", "Ölçülebilir Etki", "Sürdürülebilirlik"],
            featureItems: [
              { title: "AI Doluluk Takibi", desc: "Anlık doluluk analizi ve tahmin.", icon: Brain },
              { title: "Mobil Rezervasyon", desc: "Sürücü tarafında hızlı rezervasyon.", icon: Smartphone },
              { title: "Akıllı Güvenlik", desc: "Yetkisiz parkı otomatik engelleme.", icon: ShieldCheck },
              { title: "Hızlı Tepki", desc: "Operasyon panelinde anında aksiyon.", icon: Zap },
            ],
            flowItems: [
              { title: "Park Yeri Bul", desc: "Müsait alanları tara.", icon: Search },
              { title: "Rezervasyon Yap", desc: "Saniyeler içinde kilitle.", icon: CalendarCheck },
              { title: "Rotaya Başla", desc: "Navigasyonla ulaş.", icon: Navigation },
              { title: "QR ile Park Et", desc: "Kod okut, giriş tamam.", icon: QrCode },
            ],
            goalItems: [
              { label: "30+ Belediye Entegrasyonu", progress: 72 },
              { label: "%98+ Doğruluk", progress: 84 },
              { label: "Operasyon Maliyeti -%25", progress: 61 },
            ],
            xp: [
              { label: "Kurumsal Seviye", value: "Lv.4", icon: Trophy },
              { label: "Tamamlanan Faz", value: "12", icon: Target },
              { label: "Etki Puanı", value: "8.9/10", icon: Gem },
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
    <section id="corporate" className="neon-grid relative overflow-hidden bg-white/60 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(20,184,166,0.14),transparent_45%)]" />
      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-[color:var(--accent-strong)]">
            <Flag className="h-4 w-4" />
            {copy.badge}
          </div>
          <h2 className="mb-4 text-3xl font-bold text-[color:var(--hero-title)] md:text-4xl">{copy.title}</h2>
          <p className="text-lg text-[color:var(--muted)]">{copy.subtitle}</p>
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-3">
          {copy.xp.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="neon-card rounded-2xl p-5"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-[color:var(--muted)]">{item.label}</span>
                <item.icon className="h-4 w-4 text-[color:var(--accent-text)]" />
              </div>
              <p className="text-2xl font-extrabold text-[color:var(--hero-title)]">{item.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="neon-shell rounded-3xl p-7">
            <h3 className="mb-4 text-xl font-bold text-[color:var(--hero-title)]">{copy.featuresTitle}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {copy.featureItems.map((feature) => (
                <div key={feature.title} className="neon-card data-stream rounded-2xl p-4">
                  <feature.icon className="mb-2 h-5 w-5 text-[color:var(--accent-text)]" />
                  <p className="font-semibold text-[color:var(--hero-title)]">{feature.title}</p>
                  <p className="text-sm text-[color:var(--muted)]">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="neon-shell rounded-3xl p-7">
            <h3 className="mb-4 text-xl font-bold text-[color:var(--hero-title)]">{copy.howTitle}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {copy.flowItems.map((step) => (
                <div key={step.title} className="neon-card data-stream rounded-2xl p-4">
                  <step.icon className="mb-2 h-5 w-5 text-[color:var(--accent-text)]" />
                  <p className="font-semibold text-[color:var(--hero-title)]">{step.title}</p>
                  <p className="text-sm text-[color:var(--muted)]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="neon-card rounded-3xl p-6">
            <div className="mb-3 flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-[color:var(--accent-text)]" />
              <h3 className="font-bold text-[color:var(--hero-title)]">{copy.missionTitle}</h3>
            </div>
            <p className="text-[color:var(--muted)]">{copy.mission}</p>
          </div>
          <div className="neon-card rounded-3xl p-6">
            <div className="mb-3 flex items-center gap-2">
              <Eye className="h-5 w-5 text-[color:var(--accent-text)]" />
              <h3 className="font-bold text-[color:var(--hero-title)]">{copy.visionTitle}</h3>
            </div>
            <p className="text-[color:var(--muted)]">{copy.vision}</p>
          </div>
          <div className="neon-card rounded-3xl p-6">
            <h3 className="mb-3 font-bold text-[color:var(--hero-title)]">{copy.valuesTitle}</h3>
            <div className="flex flex-wrap gap-2">
              {copy.values.map((value) => (
                <span
                  key={value}
                  className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1.5 text-sm font-medium text-[color:var(--accent-text)]"
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="neon-shell mt-8 rounded-3xl p-6">
          <h3 className="mb-4 font-bold text-[color:var(--hero-title)]">{copy.goalsTitle}</h3>
          <div className="grid gap-5 md:grid-cols-3">
            {copy.goalItems.map((goal) => (
              <div key={goal.label} className="neon-card rounded-2xl p-4">
                <p className="mb-3 text-sm font-semibold text-[color:var(--hero-title)]">{goal.label}</p>
                <div className="h-2 overflow-hidden rounded-full bg-cyan-950/20">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-500" style={{ width: `${goal.progress}%` }} />
                </div>
                <p className="mt-2 text-xs text-[color:var(--muted)]">%{goal.progress}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
