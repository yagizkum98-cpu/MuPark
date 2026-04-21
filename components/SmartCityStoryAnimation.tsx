"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export default function SmartCityStoryAnimation() {
  const { lang } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

  const copy = useMemo(
    () => ({
      tr: {
        badge: "Akıllı Şehir Teknolojisi",
        title: "Ok tuşlarıyla ilerleyen akıllı park hikâyesi",
        desc:
          "Bu sahne, akıllı şehir teknolojisi içinde akıllı park sisteminin nasıl çalıştığını çizgi film tadında adım adım anlatır. Sağa ve sola basarak hikâyeyi ilerletebilirsiniz.",
        steps: [
          {
            title: "Sürücü park arıyor",
            detail: "Araç şehir içinde uygun park yeri bulmak için zaman kaybediyor.",
            note: "Sorun: zaman, trafik ve yakıt kaybı",
          },
          {
            title: "Kamera karakterleri doluluğu okuyor",
            detail: "Akıllı kameralar boş ve dolu alanları sahada anlık tespit ediyor.",
            note: "Algılama: doluluk, ihlal, hareket",
          },
          {
            title: "Yapay zekâ en uygun yeri seçip yönlendiriyor",
            detail: "Yapay zekâ boş yeri seçip sürücüyü rezervasyon akışına taşıyor.",
            note: "Karar: en yakın ve en verimli park noktası",
          },
          {
            title: "Belediye şehri veriyle yönetiyor",
            detail: "Yönetim paneli doluluk, rezervasyon ve saha verisini tek ekranda görüyor.",
            note: "Sonuç: daha akıcı, ölçülebilir, akıllı şehir",
          },
        ],
        panelLabel: "Belediye kontrol merkezi",
        panelInfo: "Doluluk, rezervasyon ve yönlendirme aynı panelde.",
        parkingLabel: "Akıllı park slotları",
        parkingState: ["Dolu", "Boş", "Rezerve"],
        cityLabel: "Akıllı şehir akışı",
        reservationPopup: "Rezervasyon Onaylandı",
        reservationSub: "P-03 sizin için ayrıldı",
        prev: "Geri",
        next: "İleri",
        progress: "Adım",
      },
      en: {
        badge: "Smart City Technology",
        title: "A smart parking story controlled by arrows",
        desc:
          "This scene explains step by step, in a cartoon-like way, how a smart parking system operates inside a smart city technology stack. Use the arrows to move through the story.",
        steps: [
          {
            title: "Driver searches for parking",
            detail: "The vehicle loses time while looking for an available parking spot in the city.",
            note: "Problem: time, traffic, and fuel waste",
          },
          {
            title: "Camera characters read occupancy",
            detail: "Smart cameras detect available and occupied spaces in real time on the field.",
            note: "Detection: occupancy, violations, movement",
          },
          {
            title: "AI selects the best spot and routes",
            detail: "Artificial intelligence picks the best slot and pushes the driver into the reservation flow.",
            note: "Decision: nearest and most efficient parking slot",
          },
          {
            title: "Municipality manages the city with data",
            detail: "The control center watches occupancy, reservations, and field data in one place.",
            note: "Outcome: smoother, measurable, smarter city",
          },
        ],
        panelLabel: "Municipality control center",
        panelInfo: "Occupancy, reservation, and routing in one dashboard.",
        parkingLabel: "Smart parking slots",
        parkingState: ["Occupied", "Available", "Reserved"],
        cityLabel: "Smart city flow",
        reservationPopup: "Reservation Confirmed",
        reservationSub: "P-03 reserved for you",
        prev: "Back",
        next: "Next",
        progress: "Step",
      },
    }),
    []
  );

  const t = lang === "tr" ? copy.tr : copy.en;
  const totalSteps = t.steps.length;
  const carPositions = [0, 52, 148, 214];
  const aiPositions = [90, 118, 168, 224];
  const beamWidths = [0, 48, 112, 140];
  const panelGlows = [0.18, 0.28, 0.45, 0.72];
  const cityShifts = [0, 6, 12, 18];

  return (
    <section className="relative px-6 py-10 md:px-8">
      <div className="neon-shell mx-auto max-w-7xl overflow-hidden rounded-[2rem] p-6 md:p-8">
        <div className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--accent-strong)]">
              {t.badge}
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[color:var(--hero-title)] md:text-5xl">{t.title}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted)] md:text-base">{t.desc}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
                disabled={activeStep === 0}
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--panel-border)] bg-[var(--surface-soft)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
              >
                <ChevronLeft className="h-4 w-4" />
                {t.prev}
              </button>
              <button
                type="button"
                onClick={() => setActiveStep((prev) => Math.min(prev + 1, totalSteps - 1))}
                disabled={activeStep === totalSteps - 1}
                className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.24)] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {t.next}
                <ChevronRight className="h-4 w-4" />
              </button>
              <span className="rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--accent-strong)]">
                {t.progress} {activeStep + 1}/{totalSteps}
              </span>
            </div>

            <div className="mt-8 space-y-3">
              {t.steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  animate={{
                    opacity: activeStep === index ? 1 : 0.52,
                    x: activeStep === index ? 0 : 10,
                    scale: activeStep === index ? 1 : 0.985,
                  }}
                  transition={{ duration: 0.35 }}
                  className="neon-card rounded-[1.6rem] p-4 md:p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-sm font-black text-[color:var(--accent-text)]">
                      0{index + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[color:var(--hero-title)] md:text-lg">{step.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">{step.detail}</p>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--accent-strong)]">
                        {step.note}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[440px] overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-[linear-gradient(180deg,#081222_0%,#0d1f38_38%,#0b1220_100%)] p-6 shadow-[inset_0_0_60px_rgba(34,211,238,0.08)]">
            <motion.div
              animate={{ y: cityShifts[activeStep] }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.18),transparent_60%)]"
            />
            <div className="absolute inset-x-6 bottom-20 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
            <div className="absolute inset-x-10 bottom-[4.6rem] h-[1px] bg-cyan-200/30" />
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-[linear-gradient(180deg,transparent_0%,rgba(5,12,24,0.25)_20%,rgba(4,10,20,0.95)_100%)]" />

            <div className="absolute left-8 top-14 flex items-end gap-2">
              {[46, 72, 88, 58].map((height, index) => (
                <motion.div
                  key={height}
                  animate={{ y: index === activeStep ? -5 : 0, opacity: index === activeStep ? 1 : 0.7 }}
                  transition={{ duration: 0.4 }}
                  className="w-9 rounded-t-xl border border-cyan-300/20 bg-white/10"
                  style={{ height }}
                />
              ))}
            </div>

            <div className="absolute right-7 top-8 h-36 w-40 rounded-[1.8rem] border border-cyan-300/20 bg-white/10 p-4 backdrop-blur-sm">
              <div className="mx-auto h-10 w-16 rounded-t-full border border-cyan-200/20 bg-cyan-200/10" />
              <div className="mt-2 grid grid-cols-3 gap-2">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="h-5 rounded border border-cyan-200/20 bg-cyan-50/10" />
                ))}
              </div>
              <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-50">
                {t.panelLabel}
              </p>
            </div>

            <div className="absolute right-8 top-[13.1rem] rounded-xl border border-emerald-300/25 bg-emerald-300/12 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-50">
              {t.panelInfo}
            </div>

            <div className="absolute left-[33%] top-8 flex items-end gap-6">
              {[0, 1].map((camera) => (
                <motion.div
                  key={camera}
                  animate={{ y: activeStep === 1 ? [-2, 2, -2] : 0 }}
                  transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
                  className="relative"
                >
                  <div className="mx-auto h-12 w-12 rounded-2xl border border-cyan-200/40 bg-cyan-100/10 backdrop-blur-sm">
                    <div className="absolute left-3 top-3 h-2.5 w-2.5 rounded-full bg-white" />
                    <div className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-white" />
                    <div className="absolute left-[15px] top-[14px] h-1 w-1 rounded-full bg-slate-950" />
                    <div className="absolute right-[15px] top-[14px] h-1 w-1 rounded-full bg-slate-950" />
                    <div className="absolute left-1/2 top-8 h-1.5 w-5 -translate-x-1/2 rounded-full bg-cyan-200/50" />
                  </div>
                  <div className="mx-auto h-16 w-1 rounded-full bg-cyan-200/40" />
                  {activeStep >= 1 && (
                    <motion.div
                      animate={{ opacity: [0.15, 0.7, 0.15] }}
                      transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, delay: camera * 0.2 }}
                      className="absolute left-1/2 top-12 h-28 w-20 -translate-x-1/2 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.22),transparent_68%)]"
                    />
                  )}
                </motion.div>
              ))}
            </div>

            <div className="absolute left-[28%] bottom-[8.8rem] flex gap-5">
              {[0, 1].map((sign) => (
                <motion.div
                  key={`sign-${sign}`}
                  animate={{
                    y: activeStep < 3 ? [0, 2, 0] : [0, -3, 0],
                    rotate: activeStep < 3 ? [0, -1, 0] : [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 1.8,
                    delay: sign * 0.18,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="relative flex flex-col items-center"
                >
                  <div className="relative h-14 w-12 rounded-2xl border border-cyan-200/30 bg-white/12 backdrop-blur-sm">
                    <div className="absolute left-3 top-4 h-2.5 w-2.5 rounded-full bg-white" />
                    <div className="absolute right-3 top-4 h-2.5 w-2.5 rounded-full bg-white" />
                    <div className="absolute left-[13px] top-[17px] h-1 w-1 rounded-full bg-slate-950" />
                    <div className="absolute right-[13px] top-[17px] h-1 w-1 rounded-full bg-slate-950" />
                    <div
                      className={`absolute left-1/2 top-8 h-3 w-6 -translate-x-1/2 rounded-full border-2 border-cyan-100/70 ${
                        activeStep < 3 ? "border-t-0" : "border-b-0"
                      }`}
                    />
                  </div>
                  <div className="h-8 w-1 rounded-full bg-cyan-200/40" />
                </motion.div>
              ))}
            </div>

            <div className="absolute left-8 bottom-8">
              <motion.div
                animate={{ x: carPositions[activeStep] }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute left-0 top-0"
              >
                <motion.div
                  animate={{ y: [0, -2, 0], rotate: [0, -1.2, 0] }}
                  transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="relative h-12 w-[5.2rem]"
                >
                  <div className="absolute bottom-2 left-1 right-1 h-7 rounded-[1.4rem] border border-emerald-100/40 bg-gradient-to-r from-emerald-200 via-cyan-200 to-sky-300 shadow-[0_0_24px_rgba(45,212,191,0.32)]" />
                  <div className="absolute left-3 top-1 h-5 w-8 rounded-t-[1rem] rounded-b-md border border-cyan-100/40 bg-white/55" />
                  <div className="absolute right-2 top-3 h-2.5 w-2.5 rounded-full bg-amber-200 shadow-[0_0_12px_rgba(253,224,71,0.55)]" />
                  <div className="absolute left-2 top-3 h-2.5 w-1.5 rounded-full bg-white/80" />
                  <div className="absolute right-5 top-[1.15rem] h-1.5 w-3 rounded-full bg-slate-900/20" />
                  <div className="absolute bottom-0 left-2 h-4 w-4 rounded-full border-2 border-slate-700 bg-slate-950" />
                  <div className="absolute bottom-0 right-2 h-4 w-4 rounded-full border-2 border-slate-700 bg-slate-950" />
                  <div className="absolute bottom-1 left-[0.95rem] h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <div className="absolute bottom-1 right-[0.95rem] h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <div className="absolute bottom-[1.1rem] left-2 right-2 h-1 rounded-full bg-slate-950/20" />
                </motion.div>
              </motion.div>
              <p className="mt-16 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-100">{t.cityLabel}</p>
            </div>

            <motion.div
              animate={{ x: aiPositions[activeStep] }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute bottom-[7.7rem] left-24 rounded-full border border-cyan-300/35 bg-cyan-300/14 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-50"
            >
              AI
            </motion.div>

            <motion.div
              animate={{ width: beamWidths[activeStep] }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute bottom-[7.95rem] left-[9.7rem] h-[2px] bg-gradient-to-r from-cyan-300/0 via-cyan-300 to-cyan-300/0"
            />

            <div className="absolute bottom-[5.9rem] left-[36%] rounded-xl border border-cyan-300/25 bg-white/12 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-50">
              {t.parkingLabel}
            </div>
            <div className="absolute bottom-[4rem] left-[35%] flex gap-2">
              {[
                "bg-red-300/90 border-red-200/60",
                "bg-emerald-300/90 border-emerald-200/60",
                "bg-sky-300/90 border-sky-200/60",
              ].map((slotClass, index) => (
                <motion.div
                  key={slotClass}
                  animate={{
                    y: activeStep >= 2 ? [0, -3, 0] : 0,
                    scale: activeStep >= 2 && index === 2 ? [1, 1.08, 1] : 1,
                    opacity: activeStep >= 1 ? 1 : 0.72,
                  }}
                  transition={{ duration: 1.6, delay: index * 0.18, repeat: Number.POSITIVE_INFINITY }}
                  className={`h-9 w-11 rounded-lg border ${slotClass} shadow-[0_0_16px_rgba(255,255,255,0.08)]`}
                />
              ))}
            </div>
            <motion.div
              animate={{
                opacity: activeStep >= 2 ? [0.4, 1, 0.4] : 0,
                y: activeStep >= 2 ? [6, 0, 6] : 6,
                scale: activeStep >= 2 ? [0.96, 1, 0.96] : 0.96,
              }}
              transition={{ duration: 2.1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="absolute bottom-[7.9rem] left-[44%] rounded-2xl border border-emerald-300/40 bg-emerald-300/16 px-4 py-3 text-emerald-50 shadow-[0_0_22px_rgba(52,211,153,0.18)] backdrop-blur-sm"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-300/20 text-xs font-black text-emerald-100">
                  ?
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                    {t.reservationPopup}
                  </p>
                  <p className="mt-1 text-xs text-emerald-50">{t.reservationSub}</p>
                </div>
              </div>
            </motion.div>
            <div className="absolute bottom-[2rem] left-[34.5%] flex gap-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-50">
              {t.parkingState.map((item) => (
                <span key={item} className="w-11 text-center">
                  {item}
                </span>
              ))}
            </div>

            <motion.div
              animate={{ opacity: panelGlows[activeStep] }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-y-0 right-0 w-44 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_70%)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
