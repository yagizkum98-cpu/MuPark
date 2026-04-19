"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";

export default function GlobalLanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="fixed right-4 top-24 z-[70] md:right-6">
      <div className="flex items-center gap-2 rounded-full border border-[color:var(--panel-border)] bg-[var(--surface-strong)] px-2 py-2 shadow-[0_12px_36px_rgba(2,8,23,0.14)] backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setLang("tr")}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-semibold transition",
            lang === "tr"
              ? "bg-cyan-500 text-white shadow-[0_0_16px_rgba(6,182,212,0.28)]"
              : "text-[color:var(--foreground)] hover:bg-cyan-500/10"
          )}
        >
          TR
        </button>
        <button
          type="button"
          onClick={() => setLang("en")}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-semibold transition",
            lang === "en"
              ? "bg-cyan-500 text-white shadow-[0_0_16px_rgba(6,182,212,0.28)]"
              : "text-[color:var(--foreground)] hover:bg-cyan-500/10"
          )}
        >
          EN
        </button>
      </div>
    </div>
  );
}
