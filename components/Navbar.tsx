"use client";

import { useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";
import BrandLogo from "@/components/BrandLogo";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<"day" | "night">("day");
  const { lang } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme-mode");
    const initialTheme = savedTheme === "night" ? "night" : "day";
    setThemeMode(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, []);

  const handleThemeChange = (mode: "day" | "night") => {
    setThemeMode(mode);
    document.documentElement.dataset.theme = mode;
    window.localStorage.setItem("theme-mode", mode);
  };

  const copy = useMemo(
    () =>
      lang === "tr"
        ? {
            srHome: "MU Park ana sayfa",
            download: "Uygulamayi Indir",
            live: "Canli Yayin",
            corporate: "Kurumsal",
            demo: "Demo",
            day: "Gunduz",
            night: "Gece",
          }
        : {
            srHome: "MU Park home page",
            download: "Download App",
            live: "Live Stream",
            corporate: "Corporate",
            demo: "Demo",
            day: "Day",
            night: "Night",
          },
    [lang]
  );

  const navLinks = [
    { name: copy.corporate, href: "#corporate" },
    { name: copy.demo, href: "#demo" },
    { name: copy.live, href: "/canli-yayin" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? themeMode === "night"
            ? "py-4 bg-black/80 backdrop-blur-lg border-b border-white/10"
            : "py-4 bg-white/85 backdrop-blur-lg border-b border-cyan-900/10"
          : "py-6 bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <BrandLogo compact className="transition-transform duration-300 group-hover:scale-[1.02]" />
          <span className="sr-only">{copy.srHome}</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors relative group",
                themeMode === "night" ? "text-slate-200 hover:text-cyan-300" : "text-slate-700 hover:text-cyan-800"
              )}
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-600 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleThemeChange("day")}
              className={cn(
                "px-3 py-1 rounded-full border text-xs font-semibold transition",
                themeMode === "day"
                  ? "border-cyan-500 text-cyan-800 bg-cyan-500/15"
                  : themeMode === "night"
                    ? "border-white/20 text-slate-200 hover:bg-white/10"
                    : "border-cyan-900/20 text-slate-700 hover:bg-cyan-100"
              )}
            >
              {copy.day}
            </button>
            <button
              type="button"
              onClick={() => handleThemeChange("night")}
                className={cn(
                  "px-3 py-1 rounded-full border text-xs font-semibold transition",
                  themeMode === "night"
                    ? "border-cyan-400 text-cyan-200 bg-cyan-400/10"
                    : "border-cyan-900/20 text-slate-700 hover:bg-cyan-100"
                )}
              >
                {copy.night}
            </button>
          </div>
          <button className="px-5 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-700 border border-cyan-700/40 text-white text-sm font-semibold transition-all hover:scale-105 active:scale-95 backdrop-blur-md">
            {copy.download}
          </button>
        </div>

        <button
          className={cn("md:hidden p-2", themeMode === "night" ? "text-cyan-200" : "text-cyan-900")}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          className={cn(
            "md:hidden absolute top-full left-0 right-0 backdrop-blur-xl p-6 animate-in slide-in-from-top-5",
            themeMode === "night" ? "bg-black/90 border-b border-white/10" : "bg-white/95 border-b border-cyan-900/10"
          )}
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-lg font-medium",
                  themeMode === "night" ? "text-slate-200 hover:text-cyan-300" : "text-slate-700 hover:text-cyan-800"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleThemeChange("day")}
                className={cn(
                  "px-3 py-2 rounded-xl border text-xs font-semibold transition",
                  themeMode === "day"
                    ? "border-cyan-500 text-cyan-800 bg-cyan-500/15"
                    : themeMode === "night"
                      ? "border-white/20 text-slate-200 hover:bg-white/10"
                      : "border-cyan-900/20 text-slate-700 hover:bg-cyan-100"
                )}
              >
                {copy.day}
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange("night")}
                className={cn(
                  "px-3 py-2 rounded-xl border text-xs font-semibold transition",
                  themeMode === "night"
                    ? "border-cyan-400 text-cyan-200 bg-cyan-400/10"
                    : "border-cyan-900/20 text-slate-700 hover:bg-cyan-100"
                )}
              >
                {copy.night}
              </button>
            </div>
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold">
              {copy.download}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
