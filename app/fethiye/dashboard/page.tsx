import { connectDb } from "@/lib/db/mongoose";
import { FethiyeEvent } from "@/lib/models/fethiyeEvent";
import { FethiyeMessage } from "@/lib/models/fethiyeMessage";
import { FethiyeNews } from "@/lib/models/fethiyeNews";
import { FethiyeServiceRequest } from "@/lib/models/fethiyeServiceRequest";

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

const cardClass = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";

export default async function FethiyeDashboardPage() {
  await connectDb();

  const [newsCount, eventCount, requestCount, messageCount, recentRequests, recentMessages] =
    await Promise.all([
      FethiyeNews.countDocuments({ isActive: true }),
      FethiyeEvent.countDocuments({ isActive: true }),
      FethiyeServiceRequest.countDocuments({}),
      FethiyeMessage.countDocuments({}),
      FethiyeServiceRequest.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      FethiyeMessage.find({}).sort({ createdAt: -1 }).limit(5).lean(),
    ]);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.28rem] text-slate-500">Fethiye Belediyesi</p>
          <h1 className="text-3xl font-bold">Yonetim Dashboard</h1>
          <p className="text-sm text-slate-600">
            Duyuru, etkinlik ve vatandas talep verileri MongoDB uzerinden canli okunuyor.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className={cardClass}>
            <p className="text-xs uppercase text-slate-500">Aktif Haber</p>
            <p className="mt-2 text-3xl font-bold text-sky-700">{newsCount}</p>
          </div>
          <div className={cardClass}>
            <p className="text-xs uppercase text-slate-500">Yaklasan Etkinlik</p>
            <p className="mt-2 text-3xl font-bold text-emerald-700">{eventCount}</p>
          </div>
          <div className={cardClass}>
            <p className="text-xs uppercase text-slate-500">Hizmet Talebi</p>
            <p className="mt-2 text-3xl font-bold text-amber-700">{requestCount}</p>
          </div>
          <div className={cardClass}>
            <p className="text-xs uppercase text-slate-500">Vatandas Mesaji</p>
            <p className="mt-2 text-3xl font-bold text-violet-700">{messageCount}</p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className={cardClass}>
            <h2 className="text-lg font-semibold">Son Hizmet Talepleri</h2>
            <div className="mt-4 space-y-3">
              {recentRequests.length === 0 ? (
                <p className="text-sm text-slate-500">Kayit bulunmuyor.</p>
              ) : (
                recentRequests.map((item) => (
                  <div key={String(item._id)} className="rounded-xl bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{item.fullName}</p>
                      <p className="text-xs uppercase text-slate-600">{item.status}</p>
                    </div>
                    <p className="text-sm text-slate-600">{item.neighborhood}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDateTime(new Date(item.createdAt))}
                    </p>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className={cardClass}>
            <h2 className="text-lg font-semibold">Son Vatandas Mesajlari</h2>
            <div className="mt-4 space-y-3">
              {recentMessages.length === 0 ? (
                <p className="text-sm text-slate-500">Kayit bulunmuyor.</p>
              ) : (
                recentMessages.map((item) => (
                  <div key={String(item._id)} className="rounded-xl bg-slate-50 p-3">
                    <p className="font-semibold">{item.fullName}</p>
                    <p className="text-sm text-slate-600">{item.message}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDateTime(new Date(item.createdAt))}
                    </p>
                  </div>
                ))
              )}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
