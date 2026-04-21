"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

const trKvkkSummary = [
  { title: "Veri Sorumlusu", value: "MU PARK Smart Parking Teknolojileri A.Ş." },
  {
    title: "İşlenen Kişisel Veri Türleri",
    value: "Ad, soyad, e-posta, telefon, kimlik bilgisi, sözleşme kayıtları, kullanım verileri.",
  },
  {
    title: "İşleme Amaçları",
    value: "Üyelik yönetimi, destek ve bildirimler, platform güvenliği, hizmet iyileştirme.",
  },
  { title: "Hukuki Dayanak", value: "KVKK Md.5/2 (sözleşmenin yerine getirilmesi, açık rıza)." },
  { title: "Saklama Süresi", value: "Üyelik süresi ve sonrasında 3 yıl boyunca saklanır." },
];

const enKvkkSummary = [
  { title: "Data Controller", value: "MU PARK Smart Parking Technologies Inc." },
  {
    title: "Processed Personal Data",
    value: "Name, surname, e-mail, phone, identity details, contract records, usage data.",
  },
  {
    title: "Processing Purposes",
    value: "Account management, support and notifications, platform security, service improvement.",
  },
  { title: "Legal Basis", value: "Data Protection Art.5/2 (contract performance, explicit consent)." },
  { title: "Retention Period", value: "Stored during membership and for 3 years after termination." },
];

export default function AccountForm() {
  const { lang } = useLanguage();
  const kvkkSummary = lang === "tr" ? trKvkkSummary : enKvkkSummary;

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
      return lang === "tr" ? "E-posta ve şifre ile devam edin." : "Continue with e-mail and password.";
    }
    if (mode === "register" && showRegisterDetails && hasMissingProfileField) {
      return lang === "tr" ? "Detaylı üye bilgilerini tamamlayın." : "Complete the detailed member profile.";
    }
    if (mode === "register" && !consent) {
      return lang === "tr" ? "KVKK onayı vermeden üye olunamaz." : "You cannot register without consent.";
    }
    return lang === "tr" ? `Hazır: ${mode === "register" ? "Yeni üyelik" : "Oturum açma"}.` : `Ready: ${mode === "register" ? "New registration" : "Sign in"}.`;
  }, [email, password, consent, mode, showRegisterDetails, hasMissingProfileField, lang]);

  const handleProfileChange = (key: keyof typeof profile, value: string) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (selectedMode: "register" | "login") => {
    setMode(selectedMode);

    if (!email || !password) {
      setFeedback(lang === "tr" ? "Lütfen önce e-posta ve şifrenizi girin." : "Please enter your e-mail and password first.");
      return;
    }

    if (selectedMode === "register" && !showRegisterDetails) {
      setShowRegisterDetails(true);
      setFeedback(lang === "tr" ? "Devam etmek için detaylı üye bilgilerini doldurun." : "Fill in detailed member information to continue.");
      return;
    }

    if (selectedMode === "register" && hasMissingProfileField) {
      setFeedback(lang === "tr" ? "Lütfen tüm detaylı üye bilgilerini doldurun." : "Please complete all detailed profile fields.");
      return;
    }

    if (selectedMode === "register" && !consent) {
      setFeedback(lang === "tr" ? "KVKK aydınlatma metnini okuyup onaylamalısınız." : "You must read and accept the data policy.");
      return;
    }

    setFeedback(
      selectedMode === "register"
        ? lang === "tr"
          ? "Yeni üyeliğiniz için e-posta adresinize doğrulama bağlantısı gönderildi."
          : "A verification link has been sent to your e-mail for your new membership."
        : lang === "tr"
        ? "Giriş bilgileri doğrulandı, sizi yönlendiriyoruz."
        : "Login details verified, redirecting you."
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
    <section id="account" className="py-24 bg-gradient-to-b from-cyan-50 via-white to-cyan-50/60 text-slate-900">
      <div id="account-register" />
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.5em] text-cyan-400">{lang === "tr" ? "Üyelik ve KVKK" : "Membership and Data Policy"}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{lang === "tr" ? "Giriş yapın veya kaydolun" : "Sign in or register"}</h2>
            <p className="text-muted text-sm md:text-base">
              {lang === "tr"
                ? "MU PARK platformuna erişmek için e-posta/şifre girin. Yeni kullanıcıysanız KVKK aydınlatma metnini onaylayıp detaylı üye bilgilerini doldurarak kayıt oluşturun."
                : "Use e-mail/password to access MU PARK. New users should review the data policy and complete detailed profile information to register."}
            </p>
            <div className="grid gap-3 rounded-2xl border border-cyan-100 bg-white p-4 text-sm text-slate-700">
              {kvkkSummary.map((item) => (
                <div key={item.title} className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-[0.3em] text-cyan-700">{item.title}</span>
                  <p className="text-slate-700">{item.value}</p>
                </div>
              ))}
              <p className="text-xs text-slate-500">
                {lang === "tr"
                  ? "KVKK kapsamındaki haklarınız (erişim, düzeltme, silme, itiraz) için support@mupark.local üzerinden destek alabilirsiniz."
                  : "For your data rights (access, correction, deletion, objection), contact support@mupark.local."}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-100 bg-white p-6 shadow-[0_20px_40px_rgba(20,184,166,0.12)]">
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-cyan-700">{lang === "tr" ? "E-posta" : "E-mail"}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-cyan-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500"
                  placeholder="info@mupark.local"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-cyan-700">{lang === "tr" ? "Şifre" : "Password"}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-cyan-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500"
                  placeholder={lang === "tr" ? "Güçlü bir şifre girin" : "Enter a strong password"}
                />
              </div>

              {showRegisterDetails && (
                <div className="rounded-2xl border border-cyan-200 bg-cyan-50/50 p-4 space-y-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-700">
                    {lang === "tr" ? "Detaylı Üyelik Bilgileri" : "Detailed Profile Information"}
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <input type="text" value={profile.firstName} onChange={(event) => handleProfileChange("firstName", event.target.value)} className="w-full rounded-xl border border-cyan-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500" placeholder={lang === "tr" ? "Ad" : "First Name"} />
                    <input type="text" value={profile.lastName} onChange={(event) => handleProfileChange("lastName", event.target.value)} className="w-full rounded-xl border border-cyan-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500" placeholder={lang === "tr" ? "Soyad" : "Last Name"} />
                    <input type="tel" value={profile.phone} onChange={(event) => handleProfileChange("phone", event.target.value)} className="w-full rounded-xl border border-cyan-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500" placeholder={lang === "tr" ? "Telefon" : "Phone"} />
                    <input type="text" value={profile.tcKimlik} onChange={(event) => handleProfileChange("tcKimlik", event.target.value)} className="w-full rounded-xl border border-cyan-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500" placeholder={lang === "tr" ? "TC Kimlik No" : "National ID"} />
                    <input type="text" value={profile.city} onChange={(event) => handleProfileChange("city", event.target.value)} className="w-full rounded-xl border border-cyan-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500" placeholder={lang === "tr" ? "İl" : "City"} />
                    <input type="text" value={profile.district} onChange={(event) => handleProfileChange("district", event.target.value)} className="w-full rounded-xl border border-cyan-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500" placeholder={lang === "tr" ? "İlçe" : "District"} />
                  </div>
                  <input type="text" value={profile.address} onChange={(event) => handleProfileChange("address", event.target.value)} className="w-full rounded-xl border border-cyan-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500" placeholder={lang === "tr" ? "Açık adres" : "Full address"} />
                  <input type="text" value={profile.emergencyContact} onChange={(event) => handleProfileChange("emergencyContact", event.target.value)} className="w-full rounded-xl border border-cyan-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500" placeholder={lang === "tr" ? "Acil durumda aranacak kişi" : "Emergency contact"} />
                </div>
              )}

              <label className="flex items-start gap-3 text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border border-cyan-300 bg-white text-cyan-600 focus:ring-cyan-500"
                />
                {lang === "tr"
                  ? "KVKK Aydınlatma Metni'ni okudum, açık rızam ile kişisel verilerimin işlenmesini kabul ediyorum."
                  : "I have read the data policy and consent to processing of my personal data."}
              </label>
              <p className="text-xs text-slate-500">{status}</p>
              {feedback && <p className="text-xs text-cyan-300">{feedback}</p>}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleSubmit("register")}
                className="flex-1 rounded-2xl bg-cyan-500 px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-cyan-400"
              >
                {lang === "tr" ? "Üye Ol" : "Register"}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit("login")}
                className="flex-1 rounded-2xl border border-cyan-300 px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.3em] text-cyan-900 transition hover:border-cyan-500 hover:bg-cyan-50"
              >
                {lang === "tr" ? "Giriş Yap" : "Sign In"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
