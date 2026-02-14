import AccountForm from "@/components/AccountForm";

const inventory = [
  {
    id: "B-101",
    type: "Bisiklet",
    model: "City Ride 7V",
    available: 18,
    total: 30,
    spec: "7 vites",
    location: "Merkez Istasyon",
  },
  {
    id: "B-204",
    type: "Bisiklet",
    model: "Urban Flex 21V",
    available: 11,
    total: 20,
    spec: "21 vites",
    location: "Sahil Park Alani",
  },
  {
    id: "E-310",
    type: "Elektrikli Bisiklet",
    model: "E-Move 250",
    available: 9,
    total: 15,
    spec: "65 km menzil",
    location: "Universite Duragi",
  },
  {
    id: "E-412",
    type: "Elektrikli Bisiklet",
    model: "Volt City Pro",
    available: 6,
    total: 12,
    spec: "80 km menzil",
    location: "Kent Meydani",
  },
];

const pricing = [
  {
    title: "Bisiklet",
    hourly: "35 TL / saat",
    daily: "180 TL / gun",
    weekly: "990 TL / hafta",
    deposit: "250 TL depozito",
  },
  {
    title: "Elektrikli Bisiklet",
    hourly: "65 TL / saat",
    daily: "340 TL / gun",
    weekly: "1.890 TL / hafta",
    deposit: "500 TL depozito",
  },
];

export default function BikePage() {
  const standardCount = inventory
    .filter((item) => item.type === "Bisiklet")
    .reduce((sum, item) => sum + item.available, 0);

  const electricCount = inventory
    .filter((item) => item.type === "Elektrikli Bisiklet")
    .reduce((sum, item) => sum + item.available, 0);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-emerald-500/30">
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 to-black text-white">
        <div className="container mx-auto px-6 py-20 space-y-6">
          <p className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-emerald-300">MUBike</p>
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">Bisiklet Kiralama</p>
          <h1 className="text-4xl md:text-6xl font-extrabold">Envanterden aninda kiralanabilir araclar</h1>
          <p className="text-white/80 max-w-3xl">
            Bu sayfa sadece kiralama icin envanterdeki bisiklet ve elektrikli bisikletleri gosterir.
            Uygun araci secip saatlik, gunluk veya haftalik fiyatla kiralayabilirsiniz.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Musait Bisiklet</p>
              <p className="mt-2 text-3xl font-bold">{standardCount}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Musait E-Bisiklet</p>
              <p className="mt-2 text-3xl font-bold">{electricCount}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <p className="text-sm text-emerald-100">
            Kiralama islemi icin once uyelik olusturmaniz ve giris yapmaniz gerekir. KVKK onayi olmadan kiralama
            baslatilamaz.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="#account-register"
              className="inline-block rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-emerald-400"
            >
              Uye Ol
            </a>
            <a
              href="#account"
              className="inline-block rounded-xl border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white/40"
            >
              Giris Yap
            </a>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Kiralama Envanteri</h2>
          <p className="text-muted mt-2">Anlik musaitlik ve lokasyon bilgisi ile kiralanabilir arac listesi.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {inventory.map((item) => (
            <article key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{item.type}</p>
                  <h3 className="text-xl font-semibold mt-1">{item.model}</h3>
                </div>
                <span className="text-xs rounded-full bg-emerald-500/15 text-emerald-300 px-3 py-1">{item.id}</span>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-white/80">
                <p>Musait: {item.available} / {item.total}</p>
                <p>Ozellik: {item.spec}</p>
                <p>Lokasyon: {item.location}</p>
              </div>
              <a
                href="#account-register"
                className="mt-5 block w-full rounded-xl bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-emerald-400"
              >
                Uye Ol ve Kirala
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 pb-16">
        <div className="mb-6 rounded-2xl border border-amber-400/40 bg-amber-300/10 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-300">�lk Kullan�m Kampanyas�</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Ama�: Yeni kullan�c� kazan�m�</h3>
          <div className="mt-3 space-y-1 text-sm text-amber-100">
            <p>�lk rezervasyona %50 indirim</p>
            <p>�lk 30 dk �cretsiz</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Fiyatlandirma</h2>
          <p className="text-muted mt-2">Arac tipine gore net kiralama tarifesi.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {pricing.map((plan) => (
            <article key={plan.title} className="rounded-2xl border border-emerald-500/30 bg-black/30 p-5">
              <h3 className="text-xl font-semibold">{plan.title}</h3>
              <div className="mt-4 space-y-2 text-sm text-white/85">
                <p>{plan.hourly}</p>
                <p>{plan.daily}</p>
                <p>{plan.weekly}</p>
                <p className="text-emerald-300">{plan.deposit}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <AccountForm />
    </div>
  );
}






