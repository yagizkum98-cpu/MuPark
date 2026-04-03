"use client";

import { useMemo, useState } from "react";
import { BookOpen, FileText, Film, Presentation, Video } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

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
  if (video.provider === "youtube" && video.videoId) {
    return `https://www.youtube.com/embed/${video.videoId}`;
  }
  if (video.provider === "vimeo" && video.videoId) {
    return `https://player.vimeo.com/video/${video.videoId}`;
  }
  return "";
}

function powerPointEmbedUrl(url?: string) {
  if (!url) return "";
  const isOfficeEmbed = url.includes("view.officeapps.live.com/op/embed.aspx");
  if (isOfficeEmbed) return url;
  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
}

export default function InvestorEbookShell({ runPath, presentation, videos }: Props) {
  const { lang } = useLanguage();
  const [mode, setMode] = useState<ViewerMode>("pdf");
  const [activeVideoId, setActiveVideoId] = useState(videos[0]?.id ?? "");

  const copy = useMemo(
    () =>
      lang === "tr"
        ? {
            studioBadge: "Yatirimci Sunum Stüdyosu",
            studioDesc: "Entegre yayin yapisi: PowerPoint, PDF ve E-Kitap tek ekranda. Kaynak run:",
            pdfTab: "PDF Gomme",
            pptTab: "PowerPoint Gomme",
            ebookTab: "E-Kitap Gomme",
            openDownload: "Sunumu Ac / Indir",
            pdfPlaceholder: "PDF URL baglandiginda burada gosterilir.",
            pptPlaceholder: "PowerPoint URL baglandiginda burada gosterilir.",
            ebookPlaceholder: "E-kitap URL baglandiginda burada gosterilir.",
            videoTitle: "Video Yayin Merkezi",
            videoPlaceholder: "Video yayin bilgisi baglandiginda burada oynatilir.",
          }
        : {
            studioBadge: "Investor Presentation Studio",
            studioDesc: "Integrated publishing structure: PowerPoint, PDF, and E-Book in one screen. Source run:",
            pdfTab: "Embed PDF",
            pptTab: "Embed PowerPoint",
            ebookTab: "Embed E-Book",
            openDownload: "Open / Download Deck",
            pdfPlaceholder: "The PDF will be shown here once a URL is connected.",
            pptPlaceholder: "The PowerPoint will be shown here once a URL is connected.",
            ebookPlaceholder: "The e-book will be shown here once a URL is connected.",
            videoTitle: "Video Publishing Center",
            videoPlaceholder: "The video will play here once publishing info is connected.",
          },
    [lang]
  );

  const activeVideo = useMemo(
    () => videos.find((video) => video.id === activeVideoId) ?? videos[0],
    [activeVideoId, videos]
  );

  const pptEmbed = powerPointEmbedUrl(presentation.pptUrl);

  return (
    <main className="min-h-screen bg-background text-foreground pt-28 pb-16">
      <section className="container mx-auto px-6">
        <div className="rounded-3xl border border-cyan-200 bg-white/90 p-6 md:p-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-800">
            <BookOpen className="h-3.5 w-3.5" />
            {copy.studioBadge}
          </p>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight text-slate-900">{presentation.title}</h1>
          <p className="mt-3 text-slate-600">
            {copy.studioDesc} <code>{runPath}</code>
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 mt-8">
        <div className="rounded-3xl border border-cyan-200 bg-white/95 p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setMode("pdf")}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                mode === "pdf" ? "border-cyan-500 bg-cyan-100 text-cyan-900" : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              <FileText className="h-4 w-4" />
              {copy.pdfTab}
            </button>
            <button
              onClick={() => setMode("ppt")}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                mode === "ppt" ? "border-cyan-500 bg-cyan-100 text-cyan-900" : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              <Presentation className="h-4 w-4" />
              {copy.pptTab}
            </button>
            <button
              onClick={() => setMode("ebook")}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                mode === "ebook" ? "border-cyan-500 bg-cyan-100 text-cyan-900" : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              {copy.ebookTab}
            </button>
            {presentation.downloadUrl && (
              <a
                href={presentation.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="ml-auto inline-flex items-center gap-2 rounded-xl border border-cyan-300 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-900"
              >
                {copy.openDownload}
              </a>
            )}
          </div>

          <div className="mt-4">
            {mode === "pdf" ? (
              presentation.pdfUrl ? (
                <iframe
                  title="MuPark Investor PDF"
                  src={presentation.pdfUrl}
                  className="h-[780px] w-full rounded-2xl border border-cyan-200 bg-white"
                />
              ) : (
                <div className="h-[420px] w-full rounded-2xl border border-cyan-200 bg-cyan-50 flex items-center justify-center text-slate-600">
                  {copy.pdfPlaceholder}
                </div>
              )
            ) : mode === "ppt" ? (
              pptEmbed ? (
                <iframe
                  title="MuPark Investor PowerPoint"
                  src={pptEmbed}
                  className="h-[780px] w-full rounded-2xl border border-cyan-200 bg-white"
                />
              ) : (
                <div className="h-[420px] w-full rounded-2xl border border-cyan-200 bg-cyan-50 flex items-center justify-center text-slate-600">
                  {copy.pptPlaceholder}
                </div>
              )
            ) : presentation.ebookUrl ? (
              <iframe
                title="MuPark Investor E-Book"
                src={presentation.ebookUrl}
                className="h-[780px] w-full rounded-2xl border border-cyan-200 bg-white"
              />
            ) : (
              <div className="h-[420px] w-full rounded-2xl border border-cyan-200 bg-cyan-50 flex items-center justify-center text-slate-600">
                {copy.ebookPlaceholder}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 mt-8">
        <div className="rounded-3xl border border-cyan-200 bg-white/95 p-6 md:p-8">
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-cyan-700" />
            <h2 className="text-2xl font-bold text-slate-900">{copy.videoTitle}</h2>
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="space-y-2">
              {videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => setActiveVideoId(video.id)}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                    video.id === activeVideo?.id
                      ? "border-cyan-400 bg-cyan-100"
                      : "border-slate-200 bg-white hover:bg-cyan-50"
                  }`}
                >
                  <p className="font-semibold text-slate-900">{video.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {providerLabel(video.provider)} | {video.language.toUpperCase()} | {video.visibility}
                  </p>
                  <span className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusClass(video.status)}`}>
                    {video.status}
                  </span>
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-cyan-100 bg-cyan-50/40 p-4 md:p-5">
              {activeVideo ? (
                <>
                  <div className="mb-3 flex items-center gap-2 text-slate-800">
                    <Video className="h-4 w-4 text-cyan-700" />
                    <p className="font-semibold">{activeVideo.title}</p>
                  </div>

                  {activeVideo.provider === "mp4" && activeVideo.url ? (
                    <video
                      className="aspect-video w-full rounded-xl border border-cyan-200 bg-slate-900"
                      controls
                      preload="metadata"
                      src={activeVideo.url}
                    />
                  ) : videoEmbedUrl(activeVideo) ? (
                    <iframe
                      title={activeVideo.title}
                      src={videoEmbedUrl(activeVideo)}
                      className="aspect-video w-full rounded-xl border border-cyan-200 bg-slate-900"
                      allow="autoplay; fullscreen; picture-in-picture"
                    />
                  ) : (
                    <div className="aspect-video w-full rounded-xl border border-cyan-200 bg-white flex items-center justify-center text-slate-500">
                      {copy.videoPlaceholder}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-slate-600">Video kaydi bulunamadi.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
