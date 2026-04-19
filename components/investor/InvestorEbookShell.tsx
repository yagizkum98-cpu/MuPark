"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Building2,
  CheckCircle2,
  FileText,
  Film,
  Globe2,
  MapPinned,
  Presentation,
  Sparkles,
  TimerReset,
  TrendingUp,
  Users,
  Video,
  Wallet,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import InvestorEpubViewer from "@/components/investor/InvestorEpubViewer";
import InvestorRevenueChart from "@/components/investor/InvestorRevenueChart";
import InvestorEuropeMap from "@/components/investor/InvestorEuropeMap";

export type PresentationEmbedConfig = {
  title: string;
  pdfUrl?: string;
  pptUrl?: string;
  ebookUrl?: string;
  downloadUrl?: string;
};

export type VideoEmbedItem = {
  id: string;
  title: string;
  provider: "youtube" | "vimeo" | "mp4";
  videoId?: string;
  url?: string;
  status: "draft" | "review" | "published";
  visibility: "private" | "unlisted" | "public";
  language: "tr" | "en";
};

type Props = {
  runPath: string;
  presentation: PresentationEmbedConfig;
  videos: VideoEmbedItem[];
};

type ViewerMode = "pdf" | "ppt" | "ebook";

type InvestorCity = {
  city: string;
  country: string;
  status: "pilot" | "active" | "scaling";
  revenue: number;
  growth: number;
  coordinates: {
    lat: number;
    lng: number;
  };
};

const cities: InvestorCity[] = [
  {
    city: "Fethiye",
    country: "Turkiye",
    status: "pilot",
    revenue: 42350,
    growth: 18,
    coordinates: { lat: 36.6213, lng: 29.1157 },
  },
  {
    city: "Berlin",
    country: "Almanya",
    status: "active",
    revenue: 68120,
    growth: 22,
    coordinates: { lat: 52.52, lng: 13.405 },
  },
  {
    city: "Amsterdam",
    country: "Hollanda",
    status: "scaling",
    revenue: 51140,
    growth: 31,
    coordinates: { lat: 52.3676, lng: 4.9041 },
  },
  {
    city: "Barselona",
    country: "Ispanya",
    status: "active",
    revenue: 59480,
    growth: 24,
    coordinates: { lat: 41.3874, lng: 2.1686 },
  },
];

const kpis = [
  { label: "Aylik Gelir", value: 42350, prefix: "€", suffix: "", delta: "+%18", icon: Wallet },
  { label: "Gunluk Islem", value: 1284, prefix: "", suffix: "", delta: "+%11", icon: TrendingUp },
  { label: "Aktif Sehir", value: 3, prefix: "", suffix: "", delta: "+1 pipeline", icon: Globe2 },
  { label: "Aktif Kullanici", value: 18720, prefix: "", suffix: "", delta: "+%27", icon: Users },
  { label: "Ortalama Kazanilan Sure", value: 14, prefix: "", suffix: " dk", delta: "-%32 arama suresi", icon: TimerReset },
];

const aiInsights = [
  {
    title: "Peak demand algilandi",
    text: "Sehir merkezi aksinda 18:00-20:00 araliginda rezervasyon yogunlugu esit dagilim yerine iki koridorda toplanıyor.",
  },
  {
    title: "Verimlilik +%18",
    text: "Dinamik yonlendirme ve doluluk gorunurlugu ile saha rotalarinda operasyonel verimlilik pilot donemde belirgin sekilde artti.",
  },
  {
    title: "Gelir projeksiyonu +%25",
    text: "Iki yeni belediye ve tek bir mobility operatoru entegrasyonu ile sonraki 2 ceyrekte tekrarli gelir carpani bekleniyor.",
  },
];

const economics = [
  { label: "CAC", value: "€148", note: "Belediye + operator bazli edinim" },
  { label: "LTV", value: "€2.480", note: "36 ay kontrat varsayimi" },
  { label: "Geri Donus", value: "4.6 ay", note: "Pozitif unit economics" },
  { label: "LTV / CAC", value: "16.7x", note: "Yuksek marjli kamu SaaS modeli" },
];

const timeline = [
  { label: "Pilot", detail: "Fethiye saha validasyonu", progress: true },
  { label: "AB Acilim", detail: "3 sehirlik rollout hazirligi", progress: true },
  { label: "MaaS", detail: "Mobilite platformu entegrasyonu", progress: true },
  { label: "Global", detail: "Cok sehirli lisanslama modeli", progress: false },
];

const partners = [
  { name: "Fethiye Belediyesi", group: "Sehir" },
  { name: "Berlin Mobility Lab", group: "Sehir" },
  { name: "Mapbox", group: "Teknoloji" },
  { name: "AWS", group: "Teknoloji" },
  { name: "Urban OS", group: "Teknoloji" },
  { name: "MaaS Connect", group: "Mobilite" },
  { name: "EuroPark Ops", group: "Mobilite" },
  { name: "Smart Curb Alliance", group: "Partner" },
];

function providerLabel(provider: VideoEmbedItem["provider"]) {
  if (provider === "youtube") return "YouTube";
  if (provider === "vimeo") return "Vimeo";
  return "MP4";
}

function statusClass(status: VideoEmbedItem["status"]) {
  if (status === "published") return "bg-emerald-100 text-emerald-800 border-emerald-300";
  if (status === "review") return "bg-amber-100 text-amber-800 border-amber-300";
  return "bg-slate-100 text-slate-700 border-slate-300";
}

function videoEmbedUrl(video: VideoEmbedItem) {
  if (video.provider === "youtube" && video.videoId) return `https://www.youtube.com/embed/${video.videoId}`;
  if (video.provider === "vimeo" && video.videoId) return `https://player.vimeo.com/video/${video.videoId}`;
  return "";
}

function powerPointEmbedUrl(url?: string) {
  if (!url) return "";
  if (url.includes("view.officeapps.live.com/op/embed.aspx")) return url;

  if (typeof window === "undefined") return "";

  try {
    const absoluteUrl = /^https?:\/\//i.test(url) ? url : new URL(url, window.location.origin).toString();
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absoluteUrl)}`;
  } catch {
    return "";
  }
}

function canRenderPowerPointEmbed(url?: string) {
  if (!url) return false;
  if (url.includes("view.officeapps.live.com/op/embed.aspx")) return true;
  if (typeof window === "undefined") return false;

  try {
    const absoluteUrl = /^https?:\/\//i.test(url) ? url : new URL(url, window.location.origin).toString();
    return Boolean(absoluteUrl);
  } catch {
    return false;
  }
}

function AnimatedValue({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const duration = 1400;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <span>
      {prefix}
      {display.toLocaleString("tr-TR")}
      {suffix}
    </span>
  );
}

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-3xl bg-white/6 ${className}`} />;
}

export default function InvestorEbookShell({ runPath, presentation, videos }: Props) {
  const { lang } = useLanguage();
  const [mode, setMode] = useState<ViewerMode>("pdf");
  const [activeVideoId, setActiveVideoId] = useState(videos[0]?.id ?? "");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const copy = useMemo(
    () => ({
      studioBadge: lang === "tr" ? "Yatirimci Paneli" : "Investor Panel",
      dashboardTitle: "MU PARK+ Investor Dashboard",
      dashboardSubtitle:
        "Bu panel, MU PARK+ platformunun tek bir pilot sahadan cok sehirli gelir ureten, veri odakli ve olceklenebilir bir modele nasil donustugunu gosterir.",
      impact:
        "This dashboard demonstrates how MU PARK+ scales from a single pilot to a multi-city revenue-generating platform.",
      chartTitle: "Gelir Buyume Egrisi",
      chartDesc: "Aylik gelir ivmesi ve tekrarli gelir ritmi tek bakista izlenebilir.",
      mapTitle: "Olceklenme Haritasi",
      mapDesc: "Pilot, aktif ve scaling sehirler Avrupa genelinde konumlandirildi.",
      insightsTitle: "AI Insight Katmani",
      economicsTitle: "Unit Economics",
      expansionTitle: "Expansion Tracker",
      partnersTitle: "Stratejik Partnerler",
      docsTitle: "Sunum ve Dokuman Merkezi",
      docsDesc: "PDF, PowerPoint ve E-Kitap kaynaklari ayni panel uzerinden yonetiliyor.",
      pdfTab: "PDF Gomme",
      pptTab: "PowerPoint Gomme",
      ebookTab: "E-Kitap Gomme",
      openDownload: "Deck Dosyasini Ac",
      pdfPlaceholder: "PDF baglandiginda burada gosterilir.",
      pptPlaceholder: "PowerPoint baglandiginda burada gosterilir.",
      pptOpen: "PowerPoint'i Ac",
      pptEmbedUnavailable:
        "PowerPoint iframe'i olusturulamadi. Sunumu yeni sekmede acabilirsiniz.",
      ebookPlaceholder: "E-kitap baglandiginda burada gosterilir.",
      ebookLoading: "E-kitap yukleniyor...",
      ebookError: "E-kitap goruntulenemedi. Dosyayi yeni sekmede acabilirsiniz.",
      ebookPrev: "Onceki",
      ebookNext: "Sonraki",
      ebookContents: "Icindekiler",
      ebookOpen: "E-Kitabi Ac",
      videoTitle: "Video Yayin Merkezi",
      videoPlaceholder: "Video bilgisi baglandiginda burada oynatilir.",
    }),
    [lang]
  );

  const activeVideo = useMemo(
    () => videos.find((video) => video.id === activeVideoId) ?? videos[0],
    [activeVideoId, videos]
  );

  const canEmbedPpt = canRenderPowerPointEmbed(presentation.pptUrl);
  const pptEmbed = canEmbedPpt ? powerPointEmbedUrl(presentation.pptUrl) : "";

  return (
    <main className="min-h-screen bg-[#050816] text-white pt-28 pb-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_28%),linear-gradient(180deg,#050816_0%,#0b1120_100%)]" />

      <section className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl"
        >
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28rem] text-sky-200">
                <Sparkles className="h-3.5 w-3.5" />
                {copy.studioBadge}
              </p>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-6xl">
                {copy.dashboardTitle}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">{copy.dashboardSubtitle}</p>
              <div className="mt-6 rounded-[1.5rem] border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-100">
                {copy.impact}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:w-[420px]">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs uppercase tracking-[0.2rem] text-slate-400">ARR Run-Rate</p>
                <p className="mt-3 text-3xl font-semibold text-white">€584K</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs uppercase tracking-[0.2rem] text-slate-400">Gross Margin</p>
                <p className="mt-3 text-3xl font-semibold text-white">%74</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs uppercase tracking-[0.2rem] text-slate-400">Pipeline</p>
                <p className="mt-3 text-3xl font-semibold text-white">11</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="container mx-auto px-6 mt-8">
        {ready ? (
          <div className="grid gap-4 xl:grid-cols-5">
            {kpis.map((kpi, index) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{kpi.label}</p>
                    <p className="mt-4 text-3xl font-bold text-white">
                      <AnimatedValue value={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} />
                    </p>
                  </div>
                  <div className="rounded-2xl bg-sky-400/10 p-3 text-sky-300">
                    <kpi.icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-4 text-xs font-semibold text-emerald-300">{kpi.delta}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-36" />
            ))}
          </div>
        )}
      </section>

      <section className="container mx-auto px-6 mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24rem] text-slate-400">Revenue Growth</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{copy.chartTitle}</h2>
              <p className="mt-2 text-sm text-slate-400">{copy.chartDesc}</p>
            </div>
            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">
              +%18 MoM
            </div>
          </div>
          <div className="mt-6 h-[360px]">
            {ready ? <InvestorRevenueChart /> : <SkeletonBlock className="h-full" />}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <BrainCircuit className="h-5 w-5 text-sky-300" />
              <h2 className="text-2xl font-semibold text-white">{copy.insightsTitle}</h2>
            </div>
            <div className="mt-5 space-y-3">
              {ready
                ? aiInsights.map((item) => (
                    <div key={item.title} className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
                    </div>
                  ))
                : Array.from({ length: 3 }).map((_, index) => <SkeletonBlock key={index} className="h-28" />)}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-sky-500/12 to-violet-500/12 p-6 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.24rem] text-slate-400">Narrative</p>
            <p className="mt-4 text-lg leading-8 text-slate-100">
              MU PARK+, bir otopark pilotundan cikarak belediye SaaS, mobilite entegrasyonu ve veri bazli gelir motorunu ayni platformda birlestiren olceklenebilir bir urban intelligence katmani kuruyor.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_420px]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <MapPinned className="h-5 w-5 text-sky-300" />
            <div>
              <h2 className="text-2xl font-semibold text-white">{copy.mapTitle}</h2>
              <p className="mt-1 text-sm text-slate-400">{copy.mapDesc}</p>
            </div>
          </div>
          <div className="mt-6">
            {ready ? (
              <InvestorEuropeMap cities={cities} token={process.env.NEXT_PUBLIC_MAPBOX_TOKEN} />
            ) : (
              <SkeletonBlock className="h-[420px]" />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Wallet className="h-5 w-5 text-sky-300" />
              <h2 className="text-2xl font-semibold text-white">{copy.economicsTitle}</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {economics.map((item) => (
                <div key={item.label} className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-slate-400">{item.label}</p>
                    <p className="text-xl font-semibold text-white">{item.value}</p>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <ArrowRight className="h-5 w-5 text-sky-300" />
              <h2 className="text-2xl font-semibold text-white">{copy.expansionTitle}</h2>
            </div>
            <div className="mt-6 space-y-5">
              {timeline.map((item, index) => (
                <div key={item.label} className="relative pl-8">
                  {index !== timeline.length - 1 ? (
                    <span className="absolute left-[11px] top-6 h-full w-px bg-white/10" />
                  ) : null}
                  <span
                    className={`absolute left-0 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                      item.progress
                        ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300"
                        : "border-white/10 bg-white/[0.05] text-slate-400"
                    }`}
                  >
                    {item.progress ? <CheckCircle2 className="h-3.5 w-3.5" /> : index + 1}
                  </span>
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 mt-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-sky-300" />
            <h2 className="text-2xl font-semibold text-white">{copy.partnersTitle}</h2>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.07]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400/25 to-violet-400/25 text-lg font-bold text-white">
                  {partner.name
                    .split(" ")
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")}
                </div>
                <p className="mt-4 text-sm font-semibold text-white">{partner.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18rem] text-slate-500">{partner.group}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 mt-10">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2rem] text-sky-200">
                <BookOpen className="h-3.5 w-3.5" />
                {copy.docsTitle}
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">{presentation.title}</h2>
              <p className="mt-2 text-sm text-slate-400">{copy.docsDesc} <code>{runPath}</code></p>
            </div>
            {presentation.downloadUrl ? (
              <a
                href={presentation.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-100"
              >
                {copy.openDownload}
              </a>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setMode("pdf")}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                mode === "pdf"
                  ? "border-sky-400/30 bg-sky-400/10 text-sky-100"
                  : "border-white/10 bg-white/[0.04] text-slate-300"
              }`}
            >
              <FileText className="h-4 w-4" />
              {copy.pdfTab}
            </button>
            <button
              onClick={() => setMode("ppt")}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                mode === "ppt"
                  ? "border-sky-400/30 bg-sky-400/10 text-sky-100"
                  : "border-white/10 bg-white/[0.04] text-slate-300"
              }`}
            >
              <Presentation className="h-4 w-4" />
              {copy.pptTab}
            </button>
            <button
              onClick={() => setMode("ebook")}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                mode === "ebook"
                  ? "border-sky-400/30 bg-sky-400/10 text-sky-100"
                  : "border-white/10 bg-white/[0.04] text-slate-300"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              {copy.ebookTab}
            </button>
          </div>

          <div className="mt-6">
            {mode === "pdf" ? (
              presentation.pdfUrl ? (
                <iframe
                  title="MuPark Investor PDF"
                  src={presentation.pdfUrl}
                  className="h-[780px] w-full rounded-2xl border border-white/10 bg-white"
                />
              ) : (
                <div className="flex h-[420px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-400">
                  {copy.pdfPlaceholder}
                </div>
              )
            ) : mode === "ppt" ? (
              canEmbedPpt && pptEmbed ? (
                <div className="space-y-4">
                  <iframe
                    title="MuPark Investor PowerPoint"
                    src={pptEmbed}
                    className="h-[780px] w-full rounded-2xl border border-white/10 bg-white"
                  />
                  {presentation.pptUrl ? (
                    <div className="flex justify-end">
                      <a
                        href={presentation.pptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-100"
                      >
                        {copy.pptOpen}
                      </a>
                    </div>
                  ) : null}
                </div>
              ) : presentation.pptUrl ? (
                <div className="flex h-[420px] flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-6 text-center text-slate-300">
                  <p className="max-w-2xl">{copy.pptEmbedUnavailable}</p>
                  <a
                    href={presentation.pptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-100"
                  >
                    {copy.pptOpen}
                  </a>
                </div>
              ) : (
                <div className="flex h-[420px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-400">
                  {copy.pptPlaceholder}
                </div>
              )
            ) : presentation.ebookUrl ? (
              <InvestorEpubViewer
                src={presentation.ebookUrl}
                openLabel={copy.ebookOpen}
                loadingLabel={copy.ebookLoading}
                errorLabel={copy.ebookError}
                previousLabel={copy.ebookPrev}
                nextLabel={copy.ebookNext}
                contentsLabel={copy.ebookContents}
              />
            ) : (
              <div className="flex h-[420px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-400">
                {copy.ebookPlaceholder}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 mt-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl md:p-8">
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-sky-300" />
            <h2 className="text-2xl font-semibold text-white">{copy.videoTitle}</h2>
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="space-y-2">
              {videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => setActiveVideoId(video.id)}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                    video.id === activeVideo?.id
                      ? "border-sky-400/30 bg-sky-400/10"
                      : "border-white/10 bg-white/[0.04] hover:bg-white/[0.06]"
                  }`}
                >
                  <p className="font-semibold text-white">{video.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {providerLabel(video.provider)} | {video.language.toUpperCase()} | {video.visibility}
                  </p>
                  <span className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusClass(video.status)}`}>
                    {video.status}
                  </span>
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:p-5">
              {activeVideo ? (
                <>
                  <div className="mb-3 flex items-center gap-2 text-white">
                    <Video className="h-4 w-4 text-sky-300" />
                    <p className="font-semibold">{activeVideo.title}</p>
                  </div>

                  {activeVideo.provider === "mp4" && activeVideo.url ? (
                    <video
                      className="aspect-video w-full rounded-xl border border-white/10 bg-slate-950"
                      controls
                      preload="metadata"
                      src={activeVideo.url}
                    />
                  ) : videoEmbedUrl(activeVideo) ? (
                    <iframe
                      title={activeVideo.title}
                      src={videoEmbedUrl(activeVideo)}
                      className="aspect-video w-full rounded-xl border border-white/10 bg-slate-950"
                      allow="autoplay; fullscreen; picture-in-picture"
                    />
                  ) : (
                    <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-400">
                      {copy.videoPlaceholder}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-slate-400">Video kaydi bulunamadi.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
