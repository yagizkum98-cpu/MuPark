"use client";

import { Github, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="py-12 border-t border-cyan-900/10 bg-white/70 backdrop-blur-lg">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-lg font-bold text-cyan-900">MUPark</span>

          <div className="flex flex-col items-center md:items-end gap-4 text-muted text-sm text-center md:text-right">
            <Link
              href="/yatirimci-sunumu"
              className="text-sm font-semibold text-cyan-800 hover:text-cyan-600 transition-colors"
            >
              {lang === "tr" ? "Yatirimci" : "Investor"}
            </Link>
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
