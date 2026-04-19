import CitizenServiceForm from "@/components/fethiye/CitizenServiceForm";
import FethiyeParkingMap from "@/components/fethiye/FethiyeParkingMap";
import { connectDb } from "@/lib/db/mongoose";
import { FethiyeNews } from "@/lib/models/fethiyeNews";
import { FethiyeEvent } from "@/lib/models/fethiyeEvent";
import { getFethiyeZonesWithStats } from "@/lib/services/zone";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(value);
}

export default async function FethiyePortalPage() {
  await connectDb();

  const [news, events, zones] = await Promise.all([
    FethiyeNews.find({ isActive: true }).sort({ publishedAt: -1 }).limit(6).lean(),
    FethiyeEvent.find({ isActive: true }).sort({ startsAt: 1 }).limit(6).lean(),
    getFethiyeZonesWithStats(),
  ]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-gradient-to-r from-sky-800 via-cyan-700 to-emerald-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-xs uppercase tracking-[0.3rem] opacity-90">Mugla Fethiye</p>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">Fethiye Belediyesi Dijital Platformu</h1>
          <p className="mt-4 max-w-3xl text-sm md:text-base opacity-95">
            Duyurular, etkinlik takvimi, vatandas talepleri ve yonetim paneli tek bir altyapida.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-10 lg:grid-cols-3">
        <article className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Duyurular ve Haberler</h2>
            <span className="text-xs text-slate-500">MongoDB koleksiyonu: FethiyeNews</span>
          </div>
          <div className="space-y-4">
            {news.length === 0 ? (
              <p className="text-sm text-slate-500">Henuz kayitli haber bulunmuyor.</p>
            ) : (
              news.map((item) => (
                <div key={String(item._id)} className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">{formatDate(new Date(item.publishedAt))}</p>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs uppercase text-sky-700">{item.category}</p>
                </div>
              ))
            )}
          </div>
        </article>

        <CitizenServiceForm />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <FethiyeParkingMap
          zones={zones}
          token={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          title="Fethiye akilli park haritasi"
          description="Mapbox uzerinde Karagozler, Cumhuriyet, Tuzla ve Babatasi akslarindaki gercek Fethiye referans koordinatlari ile otopark doluluk gorunumu sunuluyor."
        />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Etkinlik Takvimi</h2>
            <span className="text-xs text-slate-500">MongoDB koleksiyonu: FethiyeEvent</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.length === 0 ? (
              <p className="text-sm text-slate-500">Yaklasan etkinlik bulunmuyor.</p>
            ) : (
              events.map((event) => (
                <div key={String(event._id)} className="rounded-2xl bg-slate-100 p-4">
                  <p className="text-xs uppercase text-emerald-700">{event.category}</p>
                  <p className="mt-1 font-semibold">{event.title}</p>
                  <p className="text-sm text-slate-600">{event.location}</p>
                  <p className="mt-2 text-sm font-medium">{formatDate(new Date(event.startsAt))}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
