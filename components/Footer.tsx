"use client";

import { Github, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="border-t border-[color:var(--panel-border)] bg-[var(--surface-soft)] py-12 backdrop-blur-lg">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-lg font-bold text-[color:var(--accent-strong)]">MUPark</span>

          <div className="flex flex-col items-center gap-4 text-center text-sm text-[color:var(--muted)] md:items-end md:text-right">
            <div className="flex flex-col items-center gap-3 md:items-end">
              <Link
                href="/municipality"
                className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-cyan-500/20"
              >
                {lang === "tr" ? "Belediye Yonetim Paneli" : "Municipality Panel"}
              </Link>
              <Link
                href="/yatirimci-sunumu"
                className="rounded-full border border-[color:var(--panel-border)] bg-[var(--surface-strong)] px-5 py-2.5 text-sm font-semibold text-[color:var(--foreground)] transition-all hover:border-cyan-300/40 hover:bg-white/10"
              >
                {lang === "tr" ? "Yatirimci Paneli" : "Investor Panel"}
              </Link>
            </div>
            <p>
              &copy; {new Date().getFullYear()} MUPark. {lang === "tr" ? "Tum haklari saklidir." : "All rights reserved."}
            </p>
            <div className="flex items-center justify-center md:justify-end gap-4">
              <a href="#" className="hover:text-cyan-400 transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors" aria-label="Github">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
