"use client";

import { useEffect, useMemo, useState } from "react";

const kvkkSummary = [
  {
    title: "Veri Sorumlusu",
    value: "MU PARK Smart Parking Teknolojileri A.S.",
  },
  {
    title: "Islenen Kisisel Veri Turleri",
    value: "Ad, soyad, e-posta, telefon, kimlik bilgisi, sozlesme kayitlari, kullanim verileri.",
  },
  {
    title: "Isleme Amaclari",
    value: "Uyelik yonetimi, destek ve bildirimler, platform guvenligi, hizmet iyilestirme.",
  },
  {
    title: "Hukuki Dayanak",
    value: "KVKK Md.5/2 (sozlesmenin yerine getirilmesi, acik riza).",
  },
  {
    title: "Saklama Suresi",
    value: "Uyelik suresi ve sonrasinda 3 yil boyunca saklanir.",
  },
];

export default function AccountForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [mode, setMode] = useState<"register" | "login">("register");
  const [showRegisterDetails, setShowRegisterDetails] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    tcKimlik: "",
    city: "",
    district: "",
    address: "",
    emergencyContact: "",
  });

  const hasMissingProfileField = Object.values(profile).some((value) => !value.trim());

  const status = useMemo(() => {
    if (!email || !password) {
      return "E-posta ve sifre ile devam edin.";
    }
    if (mode === "register" && showRegisterDetails && hasMissingProfileField) {
      return "Detayli uye bilgilerini tamamlayin.";
    }
    if (mode === "register" && !consent) {
      return "KVKK onayi vermeden uye olunamaz.";
    }
    return `Hazir: ${mode === "register" ? "Yeni uyelik" : "Oturum acma"}.`;
  }, [email, password, consent, mode, showRegisterDetails, hasMissingProfileField]);

  const handleProfileChange = (key: keyof typeof profile, value: string) => {
    setProfile((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = (selectedMode: "register" | "login") => {
    setMode(selectedMode);

    if (!email || !password) {
      setFeedback("Lutfen once e-posta ve sifrenizi girin.");
      return;
    }

    if (selectedMode === "register" && !showRegisterDetails) {
      setShowRegisterDetails(true);
      setFeedback("Devam etmek icin detayli uye bilgilerini doldurun.");
      return;
    }

    if (selectedMode === "register" && hasMissingProfileField) {
      setFeedback("Lutfen tum detayli uye bilgilerini doldurun.");
      return;
    }

    if (selectedMode === "register" && !consent) {
      setFeedback("KVKK aydinlatma metnini okuyup onaylamalisiniz.");
      return;
    }

    setFeedback(
      selectedMode === "register"
        ? "Yeni uyeliginiz icin e-posta adresinize dogrulama baglantisi gonderildi."
        : "Giris bilgileri dogrulandi, sizi yonlendiriyoruz."
    );
  };

  useEffect(() => {
    const openDetailsFromHash = () => {
      if (window.location.hash === "#account-register") {
        setMode("register");
        setShowRegisterDetails(true);
      }
    };

    openDetailsFromHash();
    window.addEventListener("hashchange", openDetailsFromHash);
    return () => window.removeEventListener("hashchange", openDetailsFromHash);
  }, []);

  return (
    <section id="account" className="py-24 bg-gradient-to-b from-[#020409] via-[#030712] to-[#05060d] text-white">
      <div id="account-register" />
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.5em] text-cyan-400">Uyelik & KVKK</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Giris yapin veya kaydolun</h2>
            <p className="text-muted text-sm md:text-base">
              MU PARK platformuna erismek icin e-posta/sifre girin. Yeni kullaniciysaniz KVKK aydinlatma metnini
              onaylayip detayli uye bilgilerini doldurarak kayit olusturun.
            </p>
            <div className="grid gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white/80">
              {kvkkSummary.map((item) => (
                <div key={item.title} className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-[0.3em] text-cyan-200">{item.title}</span>
                  <p className="text-white/80">{item.value}</p>
                </div>
              ))}
              <p className="text-xs text-white/60">
                KVKK kapsamindaki haklariniz (erisim, duzeltme, silme, itiraz) icin support@mupark.local uzerinden
                destek alabilirsiniz.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/5 bg-white/10 p-6 shadow-[0_20px_60px_rgba(2,12,28,0.8)]">
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-cyan-200">E-posta</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                  placeholder="info@mupark.local"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-cyan-200">Sifre</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                  placeholder="Guclu bir sifre girin"
                />
              </div>

              {showRegisterDetails && (
                <div className="rounded-2xl border border-cyan-500/20 bg-black/40 p-4 space-y-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">Detayli Ozel Bilgiler</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(event) => handleProfileChange("firstName", event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                      placeholder="Ad"
                    />
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(event) => handleProfileChange("lastName", event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                      placeholder="Soyad"
                    />
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(event) => handleProfileChange("phone", event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                      placeholder="Telefon"
                    />
                    <input
                      type="text"
                      value={profile.tcKimlik}
                      onChange={(event) => handleProfileChange("tcKimlik", event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                      placeholder="TC Kimlik No"
                    />
                    <input
                      type="text"
                      value={profile.city}
                      onChange={(event) => handleProfileChange("city", event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                      placeholder="Il"
                    />
                    <input
                      type="text"
                      value={profile.district}
                      onChange={(event) => handleProfileChange("district", event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                      placeholder="Ilce"
                    />
                  </div>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(event) => handleProfileChange("address", event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                    placeholder="Acik adres"
                  />
                  <input
                    type="text"
                    value={profile.emergencyContact}
                    onChange={(event) => handleProfileChange("emergencyContact", event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                    placeholder="Acil durumda aranacak kisi"
                  />
                </div>
              )}

              <label className="flex items-start gap-3 text-xs text-white/80">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border border-white/20 bg-black/60 text-cyan-500 focus:ring-cyan-500"
                />
                KVKK Aydinlatma Metni'ni okudum, acik rizam ile kisisel verilerimin islenmesini kabul ediyorum.
              </label>
              <p className="text-xs text-white/60">{status}</p>
              {feedback && <p className="text-xs text-cyan-300">{feedback}</p>}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleSubmit("register")}
                className="flex-1 rounded-2xl bg-cyan-500 px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-cyan-400"
              >
                Uye Ol
              </button>
              <button
                type="button"
                onClick={() => handleSubmit("login")}
                className="flex-1 rounded-2xl border border-white/10 px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/40"
              >
                Giris Yap
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
