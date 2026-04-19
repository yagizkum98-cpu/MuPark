"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

type TocItem = {
  href: string;
  label: string;
};

type Props = {
  src: string;
  openLabel: string;
  loadingLabel: string;
  errorLabel: string;
  previousLabel: string;
  nextLabel: string;
  contentsLabel: string;
};

export default function InvestorEpubViewer({
  src,
  openLabel,
  loadingLabel,
  errorLabel,
  previousLabel,
  nextLabel,
  contentsLabel,
}: Props) {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const bookRef = useRef<any>(null);
  const renditionRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [currentLocation, setCurrentLocation] = useState<string>("");

  useEffect(() => {
    let disposed = false;

    async function mountBook() {
      if (!viewerRef.current) return;

      try {
        setLoading(true);
        setError(null);

        const epubModule = await import("epubjs");
        const ePub = epubModule.default;

        const book = ePub(src);
        const rendition = book.renderTo(viewerRef.current, {
          width: "100%",
          height: "100%",
          flow: "paginated",
          spread: "auto",
          allowScriptedContent: true,
        });

        bookRef.current = book;
        renditionRef.current = rendition;

        await rendition.display();
        const navigation = await book.loaded.navigation;
        if (disposed) return;

        setToc(
          (navigation?.toc ?? []).map((item: any) => ({
            href: item.href,
            label: item.label,
          }))
        );

        rendition.on("relocated", (location: any) => {
          const href = location?.start?.href ?? "";
          setCurrentLocation(href);
        });
      } catch (mountError) {
        if (!disposed) {
          setError(errorLabel);
        }
      } finally {
        if (!disposed) {
          setLoading(false);
        }
      }
    }

    void mountBook();

    return () => {
      disposed = true;
      renditionRef.current?.destroy?.();
      bookRef.current?.destroy?.();
      renditionRef.current = null;
      bookRef.current = null;
    };
  }, [src, errorLabel]);

  const currentLabel = useMemo(
    () => toc.find((item) => item.href === currentLocation)?.label ?? "",
    [currentLocation, toc]
  );

  const handlePrev = () => {
    renditionRef.current?.prev?.();
  };

  const handleNext = () => {
    renditionRef.current?.next?.();
  };

  const handleChapterChange = (href: string) => {
    void renditionRef.current?.display?.(href);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:max-w-[60%]">
          <p className="text-xs font-semibold uppercase tracking-[0.2rem] text-cyan-700">{contentsLabel}</p>
          <p className="text-sm text-slate-600">
            {currentLabel || loadingLabel}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
          >
            <ChevronLeft className="h-4 w-4" />
            {previousLabel}
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
          >
            {nextLabel}
            <ChevronRight className="h-4 w-4" />
          </button>
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-300 bg-cyan-100 px-3 py-2 text-sm font-semibold text-cyan-900"
          >
            {openLabel}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {toc.length ? (
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">{contentsLabel}</span>
          <select
            value={currentLocation}
            onChange={(event) => handleChapterChange(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
          >
            {toc.map((item) => (
              <option key={item.href} value={item.href}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div className="relative h-[780px] overflow-hidden rounded-2xl border border-cyan-200 bg-white">
        <div ref={viewerRef} className="h-full w-full" />
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 text-sm text-slate-600">
            {loadingLabel}
          </div>
        ) : null}
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/95 px-6 text-center text-sm text-rose-600">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
}
