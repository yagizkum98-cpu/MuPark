"use client";

import { useMemo } from "react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/components/LanguageProvider";

export default function CanliYayinPage() {
  const { lang } = useLanguage();
  const copy = useMemo(
    () =>
      lang === "tr"
        ? {
            badge: "Canli Yayin",
            title: "7/24 Anlik Park Takip Merkezi",
            desc:
              "Bu ekran, sonraki asamada baglanacak kamera veya kamera gruplari ile park alanlarinin canli olarak izlenmesi icin hazirlandi.",
            waiting: "Baglanti bekleniyor",
          }
        : {
            badge: "Live Stream",
            title: "24/7 Real-Time Parking Monitoring Center",
            desc:
              "This screen is prepared for live monitoring of parking areas through camera feeds or camera groups that will be connected in the next phase.",
            waiting: "Waiting for connection",
          },
    [lang]
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground pt-28 pb-16">
        <section className="container mx-auto px-6">
          <div className="rounded-3xl border border-cyan-300/60 bg-cyan-50 p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-700">{copy.badge}</p>
            <h1 className="mt-2 text-3xl md:text-5xl font-bold text-slate-900">
              {copy.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm md:text-base text-slate-700">
              {copy.desc}
            </p>
          </div>
        </section>

        <section className="container mx-auto mt-8 px-6">
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-3xl border border-cyan-200 bg-white/90 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-800">Kamera 1</p>
              <div className="mt-3 flex aspect-video items-center justify-center rounded-2xl border border-cyan-300 bg-cyan-50">
                <p className="text-sm font-semibold text-cyan-900">{copy.waiting}</p>
              </div>
            </article>
            <article className="rounded-3xl border border-cyan-200 bg-white/90 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-800">Kamera 2</p>
              <div className="mt-3 flex aspect-video items-center justify-center rounded-2xl border border-cyan-300 bg-cyan-50">
                <p className="text-sm font-semibold text-cyan-900">{copy.waiting}</p>
              </div>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
