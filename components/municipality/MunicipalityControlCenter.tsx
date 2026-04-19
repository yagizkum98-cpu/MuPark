"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BadgeDollarSign,
  CalendarClock,
  CarFront,
  CheckCircle2,
  ClipboardList,
  CloudCog,
  Coins,
  FileBarChart2,
  Gauge,
  LayoutDashboard,
  Mail,
  MapPinned,
  Megaphone,
  MessageSquareText,
  PauseCircle,
  Route,
  Send,
  ShieldCheck,
  Sparkles,
  TimerReset,
  TrendingUp,
  TrafficCone,
  Trees,
  WalletCards,
} from "lucide-react";

interface MunicipalityData {
  metrics: {
    totalSpots: number;
    occupancyPercent: number;
    activeVehicles: number;
    emptySpots: number;
  };
  usage: {
    averageDurationMinutes: number;
    busiestWindow: string;
    dailyEntries: Record<string, number>;
  };
  revenue: {
    monthlyRevenue: number;
    perVehicleAverage: number;
    legend: Array<{ label: string; value: number }>;
  };
  zones: Array<{
    id: string;
    slug: string;
    name: string;
    block: string;
    address: string;
    capacity: number;
    hourlyRate: number;
    status: string;
    noShowPenalty: number;
    occupied: number;
    occupancyRate: number;
    availableSpots: number;
  }>;
  citizen: {
    requestCount: number;
    messageCount: number;
    requests: Array<{
      id: string;
      fullName: string;
      neighborhood: string;
      type: string;
      description: string;
      status: string;
      createdAt: string | null;
    }>;
    messages: Array<{
      id: string;
      fullName: string;
      phone: string | null;
      email: string | null;
      message: string;
      createdAt: string | null;
    }>;
  };
  content: {
    news: Array<{
      id: string;
      title: string;
      category: string;
      isActive: boolean;
      publishedAt: string | null;
    }>;
    events: Array<{
      id: string;
      title: string;
      location: string;
      category: string;
      isActive: boolean;
      startsAt: string | null;
    }>;
  };
}

type DemoRequestForm = {
  municipalityName: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  parkingSpaces: string;
  goals: string;
};

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("tr-TR");
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
  }).format(value);
}

function zoneStatusClass(rate: number) {
  if (rate >= 80) return "bg-rose-100 text-rose-700 border-rose-200";
  if (rate >= 60) return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-emerald-100 text-emerald-700 border-emerald-200";
}

const initialNewsForm = { title: "", category: "announcement", isActive: true };
const initialEventForm = {
  title: "",
  location: "",
  startsAt: "",
  category: "culture",
  isActive: true,
};

type AccessStage = "landing" | "proposal" | "pricing" | "dashboard";

const initialDemoRequestForm: DemoRequestForm = {
  municipalityName: "",
  contactName: "",
  email: "",
  phone: "",
  city: "",
  parkingSpaces: "",
  goals: "",
};

export default function MunicipalityControlCenter({
  data,
  accessGranted,
}: {
  data?: MunicipalityData;
  accessGranted: boolean;
}) {
  const [news, setNews] = useState(data?.content.news ?? []);
  const [events, setEvents] = useState(data?.content.events ?? []);
  const [newsForm, setNewsForm] = useState(initialNewsForm);
  const [eventForm, setEventForm] = useState(initialEventForm);
  const [publishing, setPublishing] = useState<"news" | "event" | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [accessStage, setAccessStage] = useState<AccessStage>(accessGranted ? "dashboard" : "landing");
  const [demoRequestForm, setDemoRequestForm] = useState(initialDemoRequestForm);
  const [demoRequestId, setDemoRequestId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<"pilot" | "operations" | "enterprise">("pilot");
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [unlockingDemo, setUnlockingDemo] = useState(false);
  const [accessFeedback, setAccessFeedback] = useState<string | null>(null);

  const openRequests = useMemo(
    () => data?.citizen.requests.filter((item) => item.status === "open").length ?? 0,
    [data?.citizen.requests]
  );

  const hourlyDensity = useMemo(
    () => [
      { label: "08:00", value: 42 },
      { label: "11:00", value: 58 },
      { label: "14:00", value: 67 },
      { label: "17:00", value: 88 },
      { label: "19:00", value: 79 },
    ],
    []
  );

  const districtOccupancy = useMemo(
    () =>
      (data?.zones ?? []).slice(0, 4).map((zone) => ({
        label: zone.name,
        value: zone.occupancyRate,
      })),
    [data?.zones]
  );

  const managementModules = [
    {
      icon: LayoutDashboard,
      title: "Park Alani Yonetimi",
      text: "Park alani ekleme, kapasite duzenleme, fiyat ve saha kurallari yonetimi.",
    },
    {
      icon: Route,
      title: "Trafik Yonlendirme",
      text: "Yogunluk analizi ile alternatif yonlendirme ve rota optimizasyonu.",
    },
    {
      icon: FileBarChart2,
      title: "Raporlama ve Export",
      text: "Haftalik / aylik raporlar, PDF export ve yonetici dashboard ozetleri.",
    },
    {
      icon: Coins,
      title: "Dinamik Fiyatlandirma",
      text: "Talep yogunluguna gore gelir optimizasyonu ve akilli tarife yonetimi.",
    },
  ];

  const benefits = [
    "Trafik yogunlugunu azaltir ve merkezde akisi rahatlatir",
    "Belediye icin yeni ve olculebilir gelir kanali olusturur",
    "Sehir genelinde karar destek icin surekli veri katmani kurar",
    "Vatandas memnuniyetini ve erisilebilirligi artirir",
  ];

  const pricingPlans = [
    {
      name: "Pilot Baslangic",
      price: "Aylik 49.000 TL",
      items: ["1 pilot bolge", "Kurulum ve saha kalibrasyonu", "Temel dashboard ve raporlama"],
    },
    {
      name: "Sehir Operasyon",
      price: "Aylik 119.000 TL",
      items: ["4 bolgeye kadar aktif yonetim", "Dinamik fiyatlandirma", "PDF export ve AI oneriler"],
    },
    {
      name: "Kurumsal Olcek",
      price: "Ozel fiyatlandirma",
      items: ["Tum sehir roll-out", "MaaS / operator entegrasyonu", "Veri servisleri ve ozel SLA"],
    },
  ];

  const heatmapPreview = useMemo(
    () =>
      ((data?.zones as any[]) ??
        [
          { id: "preview-a", block: "A", name: "Merkez", occupancyRate: 84 },
          { id: "preview-b", block: "B", name: "Sahil", occupancyRate: 72 },
          { id: "preview-c", block: "C", name: "Meydan", occupancyRate: 63 },
          { id: "preview-d", block: "D", name: "Otogar", occupancyRate: 58 },
          { id: "preview-e", block: "E", name: "Marina", occupancyRate: 76 },
          { id: "preview-f", block: "F", name: "Kultur", occupancyRate: 47 },
        ]
      )
        .slice(0, 6)
        .map((zone, index) => ({
          ...zone,
          col: (index % 3) + 1,
        })),
    [data?.zones]
  );

  async function handleNewsSubmit(event: FormEvent<HTMLFormElement>) {
    if (!data) return;
    event.preventDefault();
    setPublishing("news");
    setFeedback(null);
    try {
      const response = await fetch("/api/fethiye/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newsForm),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Duyuru yayinlanamadi.");
      }

      setNews((current) => [
        {
          id: payload._id ?? crypto.randomUUID(),
          title: payload.title,
          category: payload.category,
          isActive: payload.isActive,
          publishedAt: payload.publishedAt,
        },
        ...current,
      ]);
      setNewsForm(initialNewsForm);
      setFeedback("Duyuru/haber kaydi olusturuldu.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Duyuru kaydi basarisiz.");
    } finally {
      setPublishing(null);
    }
  }

  async function handleEventSubmit(event: FormEvent<HTMLFormElement>) {
    if (!data) return;
    event.preventDefault();
    setPublishing("event");
    setFeedback(null);
    try {
      const response = await fetch("/api/fethiye/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventForm),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Etkinlik kaydi olusturulamadi.");
      }

      setEvents((current) => [
        {
          id: payload._id ?? crypto.randomUUID(),
          title: payload.title,
          location: payload.location,
          category: payload.category,
          isActive: payload.isActive,
          startsAt: payload.startsAt,
        },
        ...current,
      ]);
      setEventForm(initialEventForm);
      setFeedback("Etkinlik kaydi olusturuldu.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Etkinlik kaydi basarisiz.");
    } finally {
      setPublishing(null);
    }
  }

  async function handleDemoRequestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestSubmitting(true);
    setAccessFeedback(null);

    try {
      const response = await fetch("/api/municipality/demo-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          municipalityName: demoRequestForm.municipalityName,
          contactName: demoRequestForm.contactName,
          email: demoRequestForm.email,
          phone: demoRequestForm.phone,
          city: demoRequestForm.city,
          parkingSpaces: Number(demoRequestForm.parkingSpaces),
          goals: demoRequestForm.goals,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error?.[0]?.message ?? payload.error ?? "Demo talebi gonderilemedi.");
      }

      setDemoRequestId(payload.id);
      setAccessStage("pricing");
      setAccessFeedback("Teklif talebiniz kaydedildi. Simdi fiyatlandirma adimina gecebilirsiniz.");
    } catch (error) {
      setAccessFeedback(error instanceof Error ? error.message : "Demo talebi gonderilemedi.");
    } finally {
      setRequestSubmitting(false);
    }
  }

  async function handleUnlockDemo() {
    if (!demoRequestId) {
      setAccessFeedback("Once teklif talebi olusturulmalidir.");
      return;
    }

    setUnlockingDemo(true);
    setAccessFeedback(null);

    try {
      const response = await fetch("/api/municipality/demo-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: demoRequestId,
          pricingPlan: selectedPlan,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error?.[0]?.message ?? payload.error ?? "Demo erisimi olusturulamadi.");
      }

      setAccessFeedback("Yetkili demo erisimi tanimlandi. Panel yukleniyor...");
      window.location.reload();
    } catch (error) {
      setAccessFeedback(error instanceof Error ? error.message : "Demo erisimi olusturulamadi.");
    } finally {
      setUnlockingDemo(false);
    }
  }

  const landingPage = (
    <main className="min-h-screen bg-[#05101c] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.25),transparent_34%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_32%),linear-gradient(180deg,#06111d_0%,#0a1727_100%)]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28rem] text-sky-200">
                <Sparkles className="h-3.5 w-3.5" />
                MU PARK+ Municipality Intelligence
              </p>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-6xl">
                Smarter Parking, Smarter Cities
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                AI-powered system to reduce congestion, emissions, and optimize urban space. Belediye ekipleri icin anlik analiz, karar destek ve gelir odakli sehir yonetimi tek platformda.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setAccessStage("proposal")}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-7 py-4 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
                >
                  Request Pilot
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setAccessStage("proposal")}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  See Live Dashboard
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-xs uppercase tracking-[0.22rem] text-slate-400">Canli KPI</p>
                  <p className="mt-3 text-3xl font-bold">%71</p>
                  <p className="mt-2 text-sm text-slate-400">Anlik doluluk orani</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-xs uppercase tracking-[0.22rem] text-slate-400">CO2 Tasarrufu</p>
                  <p className="mt-3 text-3xl font-bold">-%22</p>
                  <p className="mt-2 text-sm text-slate-400">Trafik azalimi potansiyeli</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-xs uppercase tracking-[0.22rem] text-slate-400">Gunluk Arac</p>
                  <p className="mt-3 text-3xl font-bold">
                    1284
                  </p>
                  <p className="mt-2 text-sm text-slate-400">AI ile yonetilen park akis hacmi</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-xs uppercase tracking-[0.22rem] text-slate-400">Ortalama Sure</p>
                  <p className="mt-3 text-3xl font-bold">14 dk</p>
                  <p className="mt-2 text-sm text-slate-400">Park arama suresi</p>
                </div>
              </div>
              <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-gradient-to-r from-sky-500/10 to-emerald-400/10 p-4">
                <p className="text-sm font-medium text-sky-100">
                  Premium belediye gorunumu: trafik, doluluk, saha operasyonu ve karar destek katmani ayni ekranda.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-16 lg:grid-cols-2">
        <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.24rem] text-slate-400">Problem</p>
          <h2 className="mt-3 text-3xl font-semibold">Belediye diliyle dogrudan sorun tanimi</h2>
          <div className="mt-6 grid gap-4">
            {[
              { icon: AlertTriangle, title: "Trafik yogunlugu", value: "%31", note: "Merkez akslarda pik saat baskisi" },
              { icon: TimerReset, title: "Park arama suresi", value: "14 dk", note: "Vatandasin zaman ve yakit kaybi" },
              { icon: Trees, title: "CO2 artisi", value: "%18", note: "Bos yer arama kaynakli ek emisyon" },
              { icon: PauseCircle, title: "Verimsiz altyapi", value: "4 bolge", note: "Atil kapasite ve dengesiz kullanim" },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-rose-400/10 p-3 text-rose-300">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="text-sm text-slate-400">{item.note}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.24rem] text-slate-400">Solution</p>
          <h2 className="mt-3 text-3xl font-semibold">MU PARK+ cozum katmanlari</h2>
          <div className="mt-6 grid gap-4">
            {[
              { icon: CloudCog, title: "AI tahminleme", text: "Pik saat ve talep yogunlugunu onceden tahminler." },
              { icon: Gauge, title: "Gercek zamanli veri", text: "Bolge bazli doluluk ve saha hareketi canli akar." },
              { icon: Route, title: "Yonlendirme sistemi", text: "Arac akisini uygun noktalara dagitir." },
              { icon: ShieldCheck, title: "Karar destek paneli", text: "Belediye yoneticisine eyleme donuk oneriler sunar." },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-sky-400/10 p-3 text-sky-300">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24rem] text-slate-400">Canli Belediye Paneli</p>
              <h2 className="mt-3 text-3xl font-semibold">Karar destek ve operasyon gorunumu</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                Dashboard, mahalle bazli doluluk, saatlik yogunluk, gunluk kullanim, AI onerileri ve belediye yonetim modullerini tek akis halinde birlestirir.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAccessStage("proposal")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-6 py-3 text-sm font-semibold text-sky-100"
            >
              Demo talep et ve erisim ac
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.7rem] border border-white/10 bg-slate-950/50 p-5">
              <div className="grid gap-4 md:grid-cols-5">
                {[
                  { label: "Toplam park alani", value: 248, icon: LayoutDashboard },
                  { label: "Doluluk", value: `%71`, icon: Gauge },
                  { label: "Park arama suresi", value: `14 dk`, icon: TimerReset },
                  {
                    label: "Gunluk arac sayisi",
                    value: 1284,
                    icon: CarFront,
                  },
                  { label: "CO2 tasarrufu", value: "%22", icon: Trees },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.3rem] border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-400">{item.label}</p>
                      <item.icon className="h-4 w-4 text-sky-300" />
                    </div>
                    <p className="mt-4 text-2xl font-bold text-white">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm font-semibold text-white">Saatlik yogunluk</p>
                  <div className="mt-4 flex h-40 items-end gap-3">
                    {hourlyDensity.map((item) => (
                      <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                        <div className="flex w-full items-end justify-center rounded-t-full bg-sky-400/15" style={{ height: `${item.value}%` }}>
                          <div className="w-full rounded-t-full bg-gradient-to-t from-sky-500 to-cyan-300" style={{ height: `${item.value}%` }} />
                        </div>
                        <span className="text-[11px] text-slate-500">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm font-semibold text-white">Bolge bazli doluluk</p>
                  <div className="mt-4 space-y-3">
                    {districtOccupancy.map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>{item.label}</span>
                          <span>%{item.value}</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-emerald-400" style={{ width: `${item.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm font-semibold text-white">AI onerileri</p>
                  <div className="mt-4 space-y-3 text-sm text-slate-300">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                      “Bu bolgede yeni otopark onerilir.”
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                      “Yogun saat 17:00–19:00 araliginda.”
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                      “%22 trafik azalimi potansiyeli goruluyor.”
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.7rem] border border-white/10 bg-slate-950/50 p-5">
              <p className="text-sm font-semibold text-white">Mahalle bazli doluluk heatmap onizleme</p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {heatmapPreview.map((zone) => (
                  <div
                    key={zone.id}
                    className="flex aspect-square flex-col justify-between rounded-[1.2rem] border border-white/10 p-3"
                    style={{
                      background:
                        zone.occupancyRate >= 80
                          ? "linear-gradient(180deg, rgba(239,68,68,0.38), rgba(127,29,29,0.22))"
                          : zone.occupancyRate >= 60
                          ? "linear-gradient(180deg, rgba(245,158,11,0.34), rgba(120,53,15,0.22))"
                          : "linear-gradient(180deg, rgba(16,185,129,0.28), rgba(6,78,59,0.18))",
                    }}
                  >
                    <span className="text-[11px] uppercase tracking-[0.16rem] text-white/80">{zone.block}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{zone.name}</p>
                      <p className="mt-1 text-2xl font-bold text-white">%{zone.occupancyRate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-16 lg:grid-cols-2">
        <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.24rem] text-slate-400">Sehir Yonetimi Modulleri</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {managementModules.map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                <div className="rounded-2xl bg-sky-400/10 p-3 text-sky-300 w-fit">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.24rem] text-slate-400">Belediyeye Fayda</p>
          <div className="mt-6 space-y-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3 rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
                <div className="rounded-full bg-emerald-400/15 p-2 text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <p className="text-sm leading-6 text-slate-300">{benefit}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { title: "Gelir Modeli", desc: "Gelir paylasimi + SaaS + veri servisleri", icon: WalletCards },
              { title: "Pilot Model", desc: "Kucuk olcekli hizli kurulum ve dusuk maliyet", icon: Gauge },
              { title: "Scaling", desc: "Sehir geneli, bolgesel ve uluslararasi acilim", icon: TrendingUp },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
                <item.icon className="h-5 w-5 text-sky-300" />
                <p className="mt-3 font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      {accessStage !== "landing" && accessStage !== "dashboard" ? (
        <section className="mx-auto max-w-7xl px-6 pb-16">
          {accessStage === "proposal" ? (
            <div className="rounded-[2rem] border border-sky-400/15 bg-sky-400/10 p-8 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.24rem] text-sky-200">Adim 1</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Pilot teklif ve demo kapsami</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                Canli belediye verilerine gecmeden once pilot kapsam, hedef bolge, saha kurulumu ve beklenen KPI seti netlestirilir. Bu adim kurum icin teklif yapisini olusturur.
              </p>
              <form onSubmit={handleDemoRequestSubmit} className="mt-6 grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    value={demoRequestForm.municipalityName}
                    onChange={(event) => setDemoRequestForm((prev) => ({ ...prev, municipalityName: event.currentTarget.value }))}
                    placeholder="Belediye / kurum adi"
                    className="rounded-[1.2rem] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                  />
                  <input
                    value={demoRequestForm.contactName}
                    onChange={(event) => setDemoRequestForm((prev) => ({ ...prev, contactName: event.currentTarget.value }))}
                    placeholder="Yetkili kisi"
                    className="rounded-[1.2rem] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                  />
                  <input
                    value={demoRequestForm.email}
                    onChange={(event) => setDemoRequestForm((prev) => ({ ...prev, email: event.currentTarget.value }))}
                    placeholder="Kurumsal e-posta"
                    className="rounded-[1.2rem] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                  />
                  <input
                    value={demoRequestForm.phone}
                    onChange={(event) => setDemoRequestForm((prev) => ({ ...prev, phone: event.currentTarget.value }))}
                    placeholder="Telefon"
                    className="rounded-[1.2rem] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                  />
                  <input
                    value={demoRequestForm.city}
                    onChange={(event) => setDemoRequestForm((prev) => ({ ...prev, city: event.currentTarget.value }))}
                    placeholder="Sehir"
                    className="rounded-[1.2rem] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                  />
                  <input
                    value={demoRequestForm.parkingSpaces}
                    onChange={(event) => setDemoRequestForm((prev) => ({ ...prev, parkingSpaces: event.currentTarget.value }))}
                    placeholder="Tahmini park alani sayisi"
                    className="rounded-[1.2rem] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </div>
                <textarea
                  value={demoRequestForm.goals}
                  onChange={(event) => setDemoRequestForm((prev) => ({ ...prev, goals: event.currentTarget.value }))}
                  placeholder="Pilot hedefleri, mevcut trafik problemi ve beklenen kazanimi yazin"
                  className="min-h-32 rounded-[1.2rem] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                />
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={requestSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 disabled:opacity-60"
                  >
                    {requestSubmitting ? "Gonderiliyor..." : "Teklif talebini gonder"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccessStage("landing")}
                    className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white"
                  >
                    Geri don
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-emerald-400/15 bg-emerald-400/10 p-8 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.24rem] text-emerald-200">Adim 2</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Fiyatlandirma ve erisim modeli</h2>
              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {pricingPlans.map((plan) => (
                  <button
                    type="button"
                    key={plan.name}
                    onClick={() =>
                      setSelectedPlan(
                        plan.name === "Pilot Baslangic"
                          ? "pilot"
                          : plan.name === "Sehir Operasyon"
                          ? "operations"
                          : "enterprise"
                      )
                    }
                    className={`rounded-[1.5rem] border bg-white/[0.05] p-5 text-left ${
                      (selectedPlan === "pilot" && plan.name === "Pilot Baslangic") ||
                      (selectedPlan === "operations" && plan.name === "Sehir Operasyon") ||
                      (selectedPlan === "enterprise" && plan.name === "Kurumsal Olcek")
                        ? "border-white/30"
                        : "border-white/10"
                    }`}
                  >
                    <p className="text-lg font-semibold text-white">{plan.name}</p>
                    <p className="mt-2 text-2xl font-bold text-emerald-200">{plan.price}</p>
                    <div className="mt-4 space-y-2">
                      {plan.items.map((item) => (
                        <p key={item} className="text-sm text-slate-300">
                          • {item}
                        </p>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleUnlockDemo}
                  disabled={unlockingDemo}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 disabled:opacity-60"
                >
                  {unlockingDemo ? "Yetki olusturuluyor..." : "Demo verilere eris"}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setAccessStage("proposal")}
                  className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white"
                >
                  Teklife geri don
                </button>
              </div>
            </div>
          )}
          {accessFeedback ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white">
              {accessFeedback}
            </div>
          ) : null}
        </section>
      ) : null}
    </main>
  );

  if (!accessGranted) {
    return landingPage;
  }

  if (!data) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7fafc_0%,#eef6ff_45%,#f8fbfd_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        <section className="rounded-[2rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800 shadow-sm">
          Demo talep ve fiyatlandirma akisi tamamlandi. Asagida belediye paneli verilerine erisiyorsunuz.
        </section>
        <section className="rounded-[2rem] border border-sky-100 bg-[linear-gradient(135deg,#0f3d7a_0%,#0f766e_100%)] p-8 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.32rem] text-sky-100/90">Belediye Yonetim Merkezi</p>
              <h1 className="mt-3 text-3xl font-bold md:text-5xl">Akilli park, vatandas talebi ve dijital yayin operasyonu</h1>
              <p className="mt-4 text-sm text-sky-50/90 md:text-base">
                Bu panel belediye ekipleri icin park altyapisi, saha performansi, vatandas geri
                bildirimi ve duyuru yonetimini tek ekranda birlestirir.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-wide text-sky-100">Acik talep</p>
                <p className="mt-2 text-3xl font-bold">{openRequests}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-wide text-sky-100">Aylik gelir</p>
                  <p className="mt-2 text-3xl font-bold">{formatMoney(data.revenue.monthlyRevenue)}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-wide text-sky-100">Anlik doluluk</p>
                  <p className="mt-2 text-3xl font-bold">%{data.metrics.occupancyPercent}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Toplam park noktasi", value: data.metrics.totalSpots, hint: "Pilot saha kapasitesi", icon: LayoutDashboard },
            { label: "Aktif rezervasyon", value: data.metrics.activeVehicles, hint: "Onayli ve aktif akis", icon: CarFront },
            { label: "Bos nokta", value: data.metrics.emptySpots, hint: "Operasyonel esneklik", icon: TrafficCone },
            { label: "Vatandas mesaji", value: data.citizen.messageCount, hint: "Inceleme kutusu", icon: Mail },
          ].map((item) => (
            <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-wide text-slate-500">{item.label}</p>
                <item.icon className="h-5 w-5 text-sky-700" />
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">{item.value}</p>
              <p className="mt-2 text-xs text-slate-500">{item.hint}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <MapPinned className="h-5 w-5 text-sky-700" />
              <h2 className="text-xl font-semibold">Bolge performansi ve saha yogunlugu</h2>
            </div>
            <div className="mt-5 grid gap-4">
              {data.zones.map((zone) => (
                <div key={zone.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{zone.name}</p>
                      <p className="text-sm text-slate-600">{zone.address}</p>
                    </div>
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${zoneStatusClass(zone.occupancyRate)}`}>
                      %{zone.occupancyRate}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Kapasite</p>
                      <p className="mt-1 text-2xl font-bold">{zone.capacity}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Dolu</p>
                      <p className="mt-1 text-2xl font-bold text-rose-600">{zone.occupied}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Musait</p>
                      <p className="mt-1 text-2xl font-bold text-emerald-600">{zone.availableSpots}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">No-show cezasi</p>
                      <p className="mt-1 text-2xl font-bold">{formatMoney(zone.noShowPenalty)}</p>
                    </div>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500"
                      style={{ width: `${Math.min(zone.occupancyRate, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <div className="space-y-6">
            <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <TimerReset className="h-5 w-5 text-sky-700" />
                <h2 className="text-xl font-semibold">Operasyon Ozetleri</h2>
              </div>
              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Ortalama park suresi</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{data.usage.averageDurationMinutes} dk</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">En yogun zaman araligi</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{data.usage.busiestWindow}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Arac basi ortalama gelir</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{formatMoney(data.revenue.perVehicleAverage)}</p>
                </div>
              </div>
            </article>

            <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <BadgeDollarSign className="h-5 w-5 text-sky-700" />
                <h2 className="text-xl font-semibold">Gelir Dagilimi</h2>
              </div>
              <div className="mt-5 space-y-3">
                {data.revenue.legend.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span className="text-sm text-slate-700">{item.label}</span>
                    <span className="text-sm font-semibold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-sky-700" />
              <h2 className="text-xl font-semibold">Vatandas hizmet talepleri</h2>
            </div>
            <div className="mt-5 space-y-3">
              {data.citizen.requests.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{item.fullName}</p>
                      <p className="text-sm text-slate-600">{item.neighborhood} • {item.type}</p>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-700">{item.description}</p>
                  <p className="mt-3 text-xs text-slate-500">{formatDate(item.createdAt)}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-sky-700" />
              <h2 className="text-xl font-semibold">Vatandas mesaj kutusu</h2>
            </div>
            <div className="mt-5 space-y-3">
              {data.citizen.messages.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{item.fullName}</p>
                      <p className="text-xs text-slate-500">{item.email ?? item.phone ?? "-"}</p>
                    </div>
                    <Mail className="mt-1 h-4 w-4 text-sky-700" />
                  </div>
                  <p className="mt-3 text-sm text-slate-700">{item.message}</p>
                  <p className="mt-3 text-xs text-slate-500">{formatDate(item.createdAt)}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-sky-700" />
              <h2 className="text-xl font-semibold">Duyuru ve haber yonetimi</h2>
            </div>

            <form onSubmit={handleNewsSubmit} className="mt-5 grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <input
                value={newsForm.title}
                onChange={(event) => setNewsForm((prev) => ({ ...prev, title: event.currentTarget.value }))}
                placeholder="Yeni duyuru basligi"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={newsForm.category}
                  onChange={(event) => setNewsForm((prev) => ({ ...prev, category: event.currentTarget.value }))}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                >
                  <option value="announcement">announcement</option>
                  <option value="news">news</option>
                  <option value="event">event</option>
                </select>
                <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={newsForm.isActive}
                    onChange={(event) => setNewsForm((prev) => ({ ...prev, isActive: event.currentTarget.checked }))}
                  />
                  Yayinda tut
                </label>
              </div>
              <button
                type="submit"
                disabled={publishing === "news"}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {publishing === "news" ? "Yayinlaniyor..." : "Duyuru Olustur"}
              </button>
            </form>

            <div className="mt-5 space-y-3">
              {news.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.category}</p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${item.isActive ? "border-emerald-200 bg-emerald-100 text-emerald-700" : "border-slate-200 bg-slate-100 text-slate-700"}`}>
                      {item.isActive ? "active" : "passive"}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">{formatDate(item.publishedAt)}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-sky-700" />
              <h2 className="text-xl font-semibold">Etkinlik planlama merkezi</h2>
            </div>

            <form onSubmit={handleEventSubmit} className="mt-5 grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <input
                value={eventForm.title}
                onChange={(event) => setEventForm((prev) => ({ ...prev, title: event.currentTarget.value }))}
                placeholder="Etkinlik basligi"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              />
              <input
                value={eventForm.location}
                onChange={(event) => setEventForm((prev) => ({ ...prev, location: event.currentTarget.value }))}
                placeholder="Konum"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="datetime-local"
                  value={eventForm.startsAt}
                  onChange={(event) => setEventForm((prev) => ({ ...prev, startsAt: event.currentTarget.value }))}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                />
                <select
                  value={eventForm.category}
                  onChange={(event) => setEventForm((prev) => ({ ...prev, category: event.currentTarget.value }))}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                >
                  <option value="culture">culture</option>
                  <option value="sports">sports</option>
                  <option value="youth">youth</option>
                  <option value="environment">environment</option>
                </select>
              </div>
              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={eventForm.isActive}
                  onChange={(event) => setEventForm((prev) => ({ ...prev, isActive: event.currentTarget.checked }))}
                />
                Takvimde aktif tut
              </label>
              <button
                type="submit"
                disabled={publishing === "event"}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                <CheckCircle2 className="h-4 w-4" />
                {publishing === "event" ? "Kaydediliyor..." : "Etkinlik Ekle"}
              </button>
            </form>

            <div className="mt-5 space-y-3">
              {events.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-600">{item.location}</p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${item.isActive ? "border-emerald-200 bg-emerald-100 text-emerald-700" : "border-slate-200 bg-slate-100 text-slate-700"}`}>
                      {item.category}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">{formatDate(item.startsAt)}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        {feedback && (
          <section className="rounded-3xl border border-sky-200 bg-sky-50 px-5 py-4 text-sm font-medium text-sky-800 shadow-sm">
            {feedback}
          </section>
        )}
      </div>
    </main>
  );
}
