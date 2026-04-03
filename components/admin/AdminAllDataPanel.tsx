import { connectDb } from "@/lib/db/mongoose";
import { Zone } from "@/lib/models/zone";
import { Reservation } from "@/lib/models/reservation";
import { Transaction } from "@/lib/models/transaction";
import { LiveSpot } from "@/lib/models/liveSpot";
import { FethiyeEvent } from "@/lib/models/fethiyeEvent";
import { FethiyeMessage } from "@/lib/models/fethiyeMessage";
import { FethiyeNews } from "@/lib/models/fethiyeNews";
import { FethiyeServiceRequest } from "@/lib/models/fethiyeServiceRequest";

function formatDate(value?: string | Date | null) {
  if (!value) return "-";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("tr-TR");
}

function PanelSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-card-border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-card-border px-5 py-4">
        <h2 className="text-lg font-semibold text-text">{title}</h2>
        <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-muted">
          {count} kayit
        </span>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

export default async function AdminAllDataPanel() {
  await connectDb();

  const [
    zones,
    reservations,
    transactions,
    liveSpots,
    events,
    messages,
    news,
    serviceRequests,
  ] = await Promise.all([
    Zone.find().sort({ createdAt: -1 }).lean(),
    Reservation.find()
      .populate("zone", "name slug")
      .sort({ createdAt: -1 })
      .lean(),
    Transaction.find()
      .populate("reservation", "code driverName vehiclePlate")
      .sort({ createdAt: -1 })
      .lean(),
    LiveSpot.find().populate("zone", "name slug").sort({ createdAt: -1 }).lean(),
    FethiyeEvent.find().sort({ createdAt: -1 }).lean(),
    FethiyeMessage.find().sort({ createdAt: -1 }).lean(),
    FethiyeNews.find().sort({ createdAt: -1 }).lean(),
    FethiyeServiceRequest.find().sort({ createdAt: -1 }).lean(),
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-card-border bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.22rem] text-muted">Admin Panel</p>
        <h1 className="mt-2 text-2xl font-bold text-text">Tum Veriler</h1>
        <p className="mt-2 text-sm text-muted">
          Sistemdeki tum koleksiyonlar tek sayfada listelenir. Veriler en yeni kayit ustte olacak
          sekilde siralanir.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-card-border bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Toplam Zone</p>
          <p className="mt-1 text-3xl font-bold text-primary">{zones.length}</p>
        </div>
        <div className="rounded-2xl border border-card-border bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Toplam Reservation</p>
          <p className="mt-1 text-3xl font-bold text-primary">{reservations.length}</p>
        </div>
        <div className="rounded-2xl border border-card-border bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Toplam Transaction</p>
          <p className="mt-1 text-3xl font-bold text-primary">{transactions.length}</p>
        </div>
        <div className="rounded-2xl border border-card-border bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Toplam LiveSpot</p>
          <p className="mt-1 text-3xl font-bold text-primary">{liveSpots.length}</p>
        </div>
      </section>

      <PanelSection title="Zones" count={zones.length}>
        <table className="min-w-full text-sm">
          <thead className="bg-background text-left text-muted">
            <tr>
              <th className="px-4 py-3">Ad</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Blok</th>
              <th className="px-4 py-3">Kapasite</th>
              <th className="px-4 py-3">Saatlik</th>
              <th className="px-4 py-3">Durum</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((item: any) => (
              <tr key={item._id.toString()} className="border-t border-card-border">
                <td className="px-4 py-3 font-semibold">{item.name}</td>
                <td className="px-4 py-3">{item.slug}</td>
                <td className="px-4 py-3">{item.block}</td>
                <td className="px-4 py-3">{item.capacity}</td>
                <td className="px-4 py-3">{item.hourlyRate}</td>
                <td className="px-4 py-3">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PanelSection>

      <PanelSection title="Reservations" count={reservations.length}>
        <table className="min-w-full text-sm">
          <thead className="bg-background text-left text-muted">
            <tr>
              <th className="px-4 py-3">Kod</th>
              <th className="px-4 py-3">Surucu</th>
              <th className="px-4 py-3">Plaka</th>
              <th className="px-4 py-3">Bolge</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Odeme</th>
              <th className="px-4 py-3">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((item: any) => (
              <tr key={item._id.toString()} className="border-t border-card-border">
                <td className="px-4 py-3 font-semibold">{item.code}</td>
                <td className="px-4 py-3">{item.driverName}</td>
                <td className="px-4 py-3">{item.vehiclePlate}</td>
                <td className="px-4 py-3">{item.zone?.name ?? "-"}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">{item.paymentStatus}</td>
                <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PanelSection>

      <PanelSection title="Transactions" count={transactions.length}>
        <table className="min-w-full text-sm">
          <thead className="bg-background text-left text-muted">
            <tr>
              <th className="px-4 py-3">Reservation</th>
              <th className="px-4 py-3">Tutar</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Islem Tarihi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item: any) => (
              <tr key={item._id.toString()} className="border-t border-card-border">
                <td className="px-4 py-3 font-semibold">{item.reservation?.code ?? "-"}</td>
                <td className="px-4 py-3">{item.amount}</td>
                <td className="px-4 py-3">{item.method}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">{formatDate(item.processedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PanelSection>

      <PanelSection title="Live Spots" count={liveSpots.length}>
        <table className="min-w-full text-sm">
          <thead className="bg-background text-left text-muted">
            <tr>
              <th className="px-4 py-3">Spot ID</th>
              <th className="px-4 py-3">Etiket</th>
              <th className="px-4 py-3">Zone</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Guncelleme</th>
            </tr>
          </thead>
          <tbody>
            {liveSpots.map((item: any) => (
              <tr key={item._id.toString()} className="border-t border-card-border">
                <td className="px-4 py-3 font-semibold">{item.spotId}</td>
                <td className="px-4 py-3">{item.label ?? "-"}</td>
                <td className="px-4 py-3">{item.zone?.name ?? "-"}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">{formatDate(item.lastUpdated)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PanelSection>

      <PanelSection title="Fethiye Service Requests" count={serviceRequests.length}>
        <table className="min-w-full text-sm">
          <thead className="bg-background text-left text-muted">
            <tr>
              <th className="px-4 py-3">Ad Soyad</th>
              <th className="px-4 py-3">Mahalle</th>
              <th className="px-4 py-3">Tip</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {serviceRequests.map((item: any) => (
              <tr key={item._id.toString()} className="border-t border-card-border">
                <td className="px-4 py-3 font-semibold">{item.fullName}</td>
                <td className="px-4 py-3">{item.neighborhood}</td>
                <td className="px-4 py-3">{item.type}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PanelSection>

      <PanelSection title="Fethiye News" count={news.length}>
        <table className="min-w-full text-sm">
          <thead className="bg-background text-left text-muted">
            <tr>
              <th className="px-4 py-3">Baslik</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Aktif</th>
              <th className="px-4 py-3">Yayin Tarihi</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item: any) => (
              <tr key={item._id.toString()} className="border-t border-card-border">
                <td className="px-4 py-3 font-semibold">{item.title}</td>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3">{item.isActive ? "Evet" : "Hayir"}</td>
                <td className="px-4 py-3">{formatDate(item.publishedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PanelSection>

      <PanelSection title="Fethiye Events" count={events.length}>
        <table className="min-w-full text-sm">
          <thead className="bg-background text-left text-muted">
            <tr>
              <th className="px-4 py-3">Baslik</th>
              <th className="px-4 py-3">Konum</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Aktif</th>
              <th className="px-4 py-3">Baslangic</th>
            </tr>
          </thead>
          <tbody>
            {events.map((item: any) => (
              <tr key={item._id.toString()} className="border-t border-card-border">
                <td className="px-4 py-3 font-semibold">{item.title}</td>
                <td className="px-4 py-3">{item.location}</td>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3">{item.isActive ? "Evet" : "Hayir"}</td>
                <td className="px-4 py-3">{formatDate(item.startsAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PanelSection>

      <PanelSection title="Fethiye Messages" count={messages.length}>
        <table className="min-w-full text-sm">
          <thead className="bg-background text-left text-muted">
            <tr>
              <th className="px-4 py-3">Ad Soyad</th>
              <th className="px-4 py-3">Telefon</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Mesaj</th>
              <th className="px-4 py-3">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((item: any) => (
              <tr key={item._id.toString()} className="border-t border-card-border align-top">
                <td className="px-4 py-3 font-semibold">{item.fullName}</td>
                <td className="px-4 py-3">{item.phone ?? "-"}</td>
                <td className="px-4 py-3">{item.email ?? "-"}</td>
                <td className="px-4 py-3 max-w-xl whitespace-pre-wrap break-words">{item.message}</td>
                <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PanelSection>
    </div>
  );
}

