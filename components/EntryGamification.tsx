"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Flag, Lightbulb, ShieldCheck, Target, X } from "lucide-react";
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
    subtitle: "Sürücü park yeri ararken zaman kaybediyor",
    detail:
      "Pik saatlerde sürücüler park yeri bulmak için ortalama 12-18 dakika dolaşıyor. Bu trafik ve yakıt kaybını büyütüyor.",
    reward: "+25 XP Sorun Tespiti",
    icon: Target,
  },
  {
    id: 2,
    title: "2. Etki",
    subtitle: "Belediye geç veri ile yönetim yapıyor",
    detail:
      "Doluluk ve ihlal verisi geç geldiğinde yönlendirme, fiyatlama ve saha kararları reaktif kalıyor.",
    reward: "+25 XP Etki Analizi",
    icon: Flag,
  },
  {
    id: 3,
    title: "3. Çözüm",
    subtitle: "Canlı doluluk + rezervasyon + akıllı yönlendirme",
    detail:
      "Sürücü uygulamadan boş yeri görür, rezervasyon yapar ve rotayı takip ederek doğrudan hedefe gider.",
    reward: "+25 XP Çözüm Tasarımı",
    icon: Lightbulb,
  },
  {
    id: 4,
    title: "4. Sonuç Doğrulama",
    subtitle: "KPI ile sonuç kanıtlanır",
    detail:
      "Pilot bölgede arama süresi düşer, doluluk tahmini stabil kalır, no-show ve ihlal oranları ölçülebilir şekilde azalır.",
    reward: "+25 XP Doğrulama",
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

type EntryGamificationProps = {
  variant?: "section" | "modal";
  onClose?: () => void;
};

export default function EntryGamification({ variant = "section", onClose }: EntryGamificationProps) {
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
      onClose?.();
      const demoSection = document.getElementById("demo");
      if (demoSection) {
        demoSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, storySteps.length - 1));
  };

  return (
    <section
      id="gorev-akisi"
      className={cn(
        "relative overflow-hidden",
        variant === "section" ? "neon-grid py-20" : "max-h-[85vh] overflow-y-auto rounded-3xl border border-[color:var(--panel-border)] bg-[var(--surface)] p-5 md:p-7"
      )}
    >
      {variant === "section" && <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.12),transparent_45%)]" />}
      <div className={cn("relative z-10", variant === "section" ? "container mx-auto px-6" : "") }>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={cn(
            "rounded-3xl",
            variant === "section" ? "neon-shell mx-auto max-w-5xl p-6 md:p-8" : ""
          )}
        >
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--accent-strong)]">
                {lang === "tr" ? "Girişte Oyunlaştırma" : "Gamified Entry"}
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[color:var(--hero-title)] md:text-4xl">
                {lang === "tr" ? "4 Adımlı Girişim Hikâyesi" : "4-Step Venture Story"}
              </h2>
              <p className="mt-2 text-sm text-[color:var(--muted)] md:text-base">
                {lang === "tr"
                  ? "Sayfa açıldığında sistem problemi, etkisini, çözümü ve sonuç doğrulamasını adım adım anlatır."
                  : "On page load, the system narrates the problem, impact, solution, and KPI validation step by step."}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="min-w-56 rounded-2xl border border-cyan-300/30 bg-cyan-400/10 p-4 shadow-[0_0_32px_rgba(34,211,238,0.12)]">
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--accent-strong)]">
                  {lang === "tr" ? "Giriş Durumu" : "Entry Progress"}
                </p>
                <p className="mt-2 text-3xl font-extrabold text-[color:var(--hero-title)]">%{completionRate}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-cyan-950/20">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 0.35 }}
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                  />
                </div>
              </div>
              {variant === "modal" && onClose && (
                <button
                  type="button"
                  aria-label={lang === "tr" ? "Kapat" : "Close"}
                  onClick={onClose}
                  className="rounded-xl border border-[color:var(--panel-border)] p-2 text-[color:var(--foreground)] transition hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-4">
            {storySteps.map((step, index) => {
              const done = index < currentStep;
              const activeStep = index === currentStep;
              return (
                <div
                  key={step.id}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-xs transition-colors md:text-sm",
                    activeStep && "border-cyan-400/70 bg-cyan-400/10 text-[color:var(--accent-text)]",
                    done && "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
                    !activeStep && !done && "border-[color:var(--panel-border)] bg-[var(--surface-soft)] text-[color:var(--muted)]"
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
              className="neon-card rounded-2xl p-5 md:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[color:var(--accent-strong)]">
                    <active.icon className="h-3.5 w-3.5" />
                    {lang === "tr" ? `Adım ${active.id}` : `Step ${active.id}`}
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-[color:var(--hero-title)] md:text-3xl">{active.subtitle}</h3>
                  <p className="mt-3 max-w-3xl text-sm text-[color:var(--muted)] md:text-base">{active.detail}</p>
                </div>
                <span className="shrink-0 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  {active.reward}
                </span>
              </div>
            </motion.article>
          </AnimatePresence>

          <div className="neon-card mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-4">
            <p className="text-sm text-[color:var(--muted)]">
              {isLast
                ? lang === "tr"
                  ? "Girişim hikâyesi tamamlandı. Ziyaretçi şimdi demo ve özelliklere geçmeye hazır."
                  : "Venture story completed. The visitor is now ready to move to demo and features."
                : lang === "tr"
                  ? "Sonraki adım ile hikâyeyi ilerlet."
                  : "Proceed to the next step to advance the story."}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                disabled={currentStep === 0}
                className="rounded-xl border border-[color:var(--panel-border)] px-4 py-2 text-sm text-[color:var(--foreground)] transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {lang === "tr" ? "Geri" : "Back"}
              </button>
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.24)] transition hover:bg-cyan-300"
              >
                {isLast ? (lang === "tr" ? "Tamamlandı" : "Completed") : lang === "tr" ? "Sonraki Adım" : "Next Step"}
                {!isLast && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--accent-strong)]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              XP: {totalXp}/100
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
