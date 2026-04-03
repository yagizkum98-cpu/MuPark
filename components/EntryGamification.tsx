"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Flag, Lightbulb, ShieldCheck, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";

const trSteps: Array<{
  id: number;
  title: string;
  subtitle: string;
  detail: string;
  reward: string;
  icon: typeof Target;
}> = [
  {
    id: 1,
    title: "1. Problem",
    subtitle: "Surucu park yeri ararken zaman kaybediyor",
    detail:
      "Pik saatlerde suruculer park yeri bulmak icin ortalama 12-18 dakika dolasiyor. Bu trafik ve yakit kaybini buyutuyor.",
    reward: "+25 XP Sorun Tespiti",
    icon: Target,
  },
  {
    id: 2,
    title: "2. Etki",
    subtitle: "Belediye gec veri ile yonetim yapiyor",
    detail:
      "Doluluk ve ihlal verisi gec geldiginde yonlendirme, fiyatlama ve saha kararlari reaktif kaliyor.",
    reward: "+25 XP Etki Analizi",
    icon: Flag,
  },
  {
    id: 3,
    title: "3. Cozum",
    subtitle: "Canli doluluk + rezervasyon + akilli yonlendirme",
    detail:
      "Surucu uygulamadan bos yeri gorur, rezervasyon yapar ve rotayi takip ederek dogrudan hedefe gider.",
    reward: "+25 XP Cozum Tasarimi",
    icon: Lightbulb,
  },
  {
    id: 4,
    title: "4. Problem Dogrulama",
    subtitle: "KPI ile sonuc kanitlanir",
    detail:
      "Pilot bolgede arama suresi duser, doluluk tahmini stabil kalir, no-show ve ihlal oranlari olculebilir sekilde azalir.",
    reward: "+25 XP Dogrulama",
    icon: ShieldCheck,
  },
];

const enSteps: Array<{
  id: number;
  title: string;
  subtitle: string;
  detail: string;
  reward: string;
  icon: typeof Target;
}> = [
  {
    id: 1,
    title: "1. Problem",
    subtitle: "Drivers lose time while searching for parking",
    detail:
      "At peak hours drivers spend an average of 12-18 minutes searching for a spot, increasing traffic and fuel waste.",
    reward: "+25 XP Problem Discovery",
    icon: Target,
  },
  {
    id: 2,
    title: "2. Impact",
    subtitle: "Municipality operates with delayed data",
    detail:
      "When occupancy and violation data arrive late, routing, pricing, and field decisions remain reactive.",
    reward: "+25 XP Impact Analysis",
    icon: Flag,
  },
  {
    id: 3,
    title: "3. Solution",
    subtitle: "Live occupancy + reservation + smart routing",
    detail:
      "Drivers see available spots, reserve instantly, and follow direct navigation to the target location.",
    reward: "+25 XP Solution Design",
    icon: Lightbulb,
  },
  {
    id: 4,
    title: "4. Validation",
    subtitle: "Results are proven with KPI metrics",
    detail:
      "In pilot zones, search time decreases, occupancy prediction stays stable, and no-show violations drop measurably.",
    reward: "+25 XP Validation",
    icon: ShieldCheck,
  },
];

export default function EntryGamification() {
  const { lang } = useLanguage();
  const storySteps = lang === "tr" ? trSteps : enSteps;
  const [currentStep, setCurrentStep] = useState(0);
  const active = storySteps[currentStep];
  const completionRate = useMemo(
    () => Math.round(((currentStep + 1) / storySteps.length) * 100),
    [currentStep, storySteps.length]
  );
  const isLast = currentStep === storySteps.length - 1;
  const totalXp = (currentStep + 1) * 25;

  const handleNext = () => {
    if (isLast) {
      const demoSection = document.getElementById("demo");
      if (demoSection) {
        demoSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, storySteps.length - 1));
  };

  return (
    <section id="gorev-akisi" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.12),transparent_45%)]" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto rounded-3xl border border-cyan-100 bg-white/85 backdrop-blur-sm p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-700">
                {lang === "tr" ? "Giriste Oyunlastirma" : "Gamified Entry"}
              </p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900">
                {lang === "tr" ? "4 Adimli Girisim Hikayesi" : "4-Step Venture Story"}
              </h2>
              <p className="mt-2 text-sm md:text-base text-slate-600">
                {lang === "tr"
                  ? "Sayfa acildiginda sistem problemi, etkisini, cozumu ve sonuc dogrulamasini adim adim anlatir."
                  : "On page load, the system narrates the problem, impact, solution, and KPI validation step by step."}
              </p>
            </div>
            <div className="min-w-56 rounded-2xl border border-cyan-300 bg-cyan-100/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-700">
                {lang === "tr" ? "Giris Durumu" : "Entry Progress"}
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">%{completionRate}</p>
              <div className="mt-3 h-2 rounded-full bg-cyan-200/70 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 0.35 }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4 mb-6">
            {storySteps.map((step, index) => {
              const done = index < currentStep;
              const activeStep = index === currentStep;
              return (
                <div
                  key={step.id}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-xs md:text-sm transition-colors",
                    activeStep && "border-cyan-400/70 bg-cyan-100 text-cyan-900",
                    done && "border-emerald-400/60 bg-emerald-100 text-emerald-800",
                    !activeStep && !done && "border-slate-200 bg-white text-slate-500"
                  )}
                >
                  {step.title}
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.article
              key={active.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-cyan-100 bg-white p-5 md:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-cyan-100 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-800">
                    <active.icon className="w-3.5 h-3.5" />
                    {lang === "tr" ? `Adim ${active.id}` : `Step ${active.id}`}
                  </div>
                  <h3 className="mt-4 text-2xl md:text-3xl font-bold text-slate-900">{active.subtitle}</h3>
                  <p className="mt-3 max-w-3xl text-sm md:text-base text-slate-700">{active.detail}</p>
                </div>
                <span className="shrink-0 rounded-full border border-emerald-400/50 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  {active.reward}
                </span>
              </div>
            </motion.article>
          </AnimatePresence>

          <div className="mt-6 rounded-2xl border border-cyan-100 bg-white p-4 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-slate-700">
              {isLast
                ? lang === "tr"
                  ? "Girisim hikayesi tamamlandi. Ziyaretci simdi demo ve ozelliklere gecmeye hazir."
                  : "Venture story completed. The visitor is now ready to move to demo and features."
                : lang === "tr"
                ? "Sonraki adim ile hikayeyi ilerlet."
                : "Proceed to the next step to advance the story."}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                disabled={currentStep === 0}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {lang === "tr" ? "Geri" : "Back"}
              </button>
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-400"
              >
                {isLast ? (lang === "tr" ? "Tamamlandi" : "Completed") : lang === "tr" ? "Sonraki Adim" : "Next Step"}
                {!isLast && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              XP: {totalXp}/100
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
