"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BadgeDollarSign,
  CalendarRange,
  CarFront,
  ClipboardList,
  Download,
  Eye,
  MapPinned,
  MessageSquareText,
  ShieldAlert,
  X,
} from "lucide-react";

type ReservationStatus = "pending" | "approved" | "active" | "completed" | "cancelled";
type PaymentStatus = "pending" | "paid" | "failed";

interface ReservationItem {
  id: string;
  code: string;
  driverName: string;
  driverEmail: string;
  vehiclePlate: string;
  vehicleType: string;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  qrCode: string;
  totalAmount: number;
  reservedAt: string | null;
  startTime: string | null;
  endTime: string | null;
  createdAt: string | null;
  zone: {
    id: string;
    name: string;
    slug: string;
    block: string | null;
    hourlyRate: number;
  } | null;
}

interface AdminData {
  zones: Array<{
    id: string;
    name: string;
    slug: string;
    block: string;
    address: string;
    capacity: number;
    hourlyRate: number;
    status: string;
    color: string | null;
    noShowPenalty: number;
    createdAt: string | null;
  }>;
  reservations: ReservationItem[];
  transactions: Array<{
    id: string;
    amount: number;
    method: string;
    status: string;
    notes: string | null;
    processedAt: string | null;
    reservation: {
      code: string;
      driverName: string;
      vehiclePlate: string;
    } | null;
  }>;
  liveSpots: Array<{
    id: string;
    spotId: string;
    label: string | null;
    status: string;
    lastUpdated: string | null;
    zone: { name: string; slug: string } | null;
  }>;
  serviceRequests: Array<{
    id: string;
    fullName: string;
    neighborhood: string;
    type: string;
    status: string;
    createdAt: string | null;
  }>;
  news: Array<{
    id: string;
    title: string;
    category: string;
    isActive: boolean;
    publishedAt: string | null;
  }>;
  events: Array<{
    id: string;
    title: string;
    location: string;
    category: string;
    isActive: boolean;
    startsAt: string | null;
  }>;
  messages: Array<{
    id: string;
    fullName: string;
    phone: string | null;
    email: string | null;
    message: string;
    createdAt: string | null;
  }>;
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("tr-TR");
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
  }).format(value);
}

function badgeClass(status: string) {
  if (status === "approved" || status === "completed" || status === "success") {
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  }
  if (status === "pending") {
    return "bg-amber-100 text-amber-800 border-amber-200";
  }
  if (status === "active") {
    return "bg-cyan-100 text-cyan-800 border-cyan-200";
  }
  if (status === "cancelled" || status === "failed") {
    return "bg-rose-100 text-rose-800 border-rose-200";
  }
  return "bg-slate-100 text-slate-700 border-slate-200";
}

function toCsvValue(value: string | number) {
  const escaped = String(value).replace(/"/g, '""');
  return `"${escaped}"`;
}

export default function AdminControlCenter({ data }: { data: AdminData }) {
  const [reservations, setReservations] = useState(data.reservations);
  const [filter, setFilter] = useState<ReservationStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalReservationId, setModalReservationId] = useState<string | null>(null);

  const metrics = useMemo(() => {
    const counts = { pending: 0, approved: 0, active: 0, completed: 0, cancelled: 0 };
    reservations.forEach((item) => {
      counts[item.status] += 1;
    });

    const revenue = data.transactions
      .filter((item) => item.status === "success")
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      ...counts,
      totalRevenue: revenue,
      availableSpots: data.liveSpots.filter((item) => item.status === "available").length,
      occupiedSpots: data.liveSpots.filter((item) => item.status === "occupied").length,
    };
  }, [data.liveSpots, data.transactions, reservations]);

  const filteredReservations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return reservations.filter((item) => {
      const statusMatch = filter === "all" ? true : item.status === filter;
      const queryMatch =
        !normalized ||
        item.code.toLowerCase().includes(normalized) ||
        item.driverName.toLowerCase().includes(normalized) ||
        item.driverEmail.toLowerCase().includes(normalized) ||
        item.vehiclePlate.toLowerCase().includes(normalized) ||
        (item.zone?.name ?? "").toLowerCase().includes(normalized);
      return statusMatch && queryMatch;
    });
  }, [filter, query, reservations]);

  const zoneMetrics = useMemo(
    () =>
      data.zones.map((zone) => {
        const inFlow = reservations.filter(
          (item) => item.zone?.id === zone.id && ["pending", "approved", "active"].includes(item.status)
        ).length;
        const occupancy = zone.capacity ? Math.round((inFlow / zone.capacity) * 100) : 0;
        return {
          ...zone,
          inFlow,
          occupancy,
          available: Math.max(zone.capacity - inFlow, 0),
        };
      }),
    [data.zones, reservations]
  );

  const modalReservation = useMemo(
    () => reservations.find((item) => item.id === modalReservationId) ?? null,
    [modalReservationId, reservations]
  );

  const visibleSelectableIds = useMemo(
    () => filteredReservations.map((item) => item.id),
    [filteredReservations]
  );

  const selectedReservations = useMemo(
    () => reservations.filter((item) => selectedIds.includes(item.id)),
    [reservations, selectedIds]
  );

  const allVisibleSelected =
    visibleSelectableIds.length > 0 && visibleSelectableIds.every((id) => selectedIds.includes(id));

  function updateReservationState(id: string, payload: Partial<ReservationItem>) {
    setReservations((current) =>
      current.map((item) => (item.id === id ? { ...item, ...payload } : item))
    );
  }

  async function patchReservation(id: string, action: "approve" | "cancel") {
    setBusyId(id);
    setFeedback(null);
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Islem basarisiz");
      }
      updateReservationState(id, {
        status: payload.status,
        startTime: payload.startTime ?? undefined,
        endTime: payload.endTime ?? undefined,
        totalAmount: payload.totalAmount ?? undefined,
      });
      setFeedback(action === "approve" ? "Rezervasyon onaylandi." : "Rezervasyon iptal edildi.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Islem tamamlanamadi.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleBulkAction(action: "approve" | "cancel") {
    if (selectedIds.length === 0) {
      setFeedback("Toplu islem icin en az bir rezervasyon secin.");
      return;
    }

    const ids = [...selectedIds];
    let successCount = 0;
    let errorCount = 0;

    setFeedback(null);

    for (const id of ids) {
      const response = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const payload = await response.json();

      if (!response.ok) {
        errorCount += 1;
        continue;
      }

      updateReservationState(id, {
        status: payload.status,
        startTime: payload.startTime ?? undefined,
        endTime: payload.endTime ?? undefined,
        totalAmount: payload.totalAmount ?? undefined,
      });
      successCount += 1;
    }

    setSelectedIds([]);
    setFeedback(
      `${successCount} rezervasyon ${action === "approve" ? "onaylandi" : "iptal edildi"}${
        errorCount ? `, ${errorCount} kayit atlandi.` : "."
      }`
    );
  }

  function toggleReservationSelection(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function toggleSelectAllVisible() {
    setSelectedIds((current) => {
      if (allVisibleSelected) {
        return current.filter((id) => !visibleSelectableIds.includes(id));
      }

      return Array.from(new Set([...current, ...visibleSelectableIds]));
    });
  }

  function exportCsv() {
    const source = selectedReservations.length > 0 ? selectedReservations : filteredReservations;
    const rows = source.map((item) =>
      [
        item.code,
        item.driverName,
        item.driverEmail,
        item.vehiclePlate,
        item.vehicleType,
        item.zone?.name ?? "-",
        item.status,
        item.paymentStatus,
        item.totalAmount ?? 0,
        item.reservedAt ?? "",
        item.startTime ?? "",
        item.endTime ?? "",
      ]
        .map((value) => toCsvValue(value))
        .join(",")
    );

    const csv = [
      [
        "Kod",
        "Surucu",
        "Eposta",
        "Plaka",
        "Arac Tipi",
        "Bolge",
        "Durum",
        "Odeme",
        "Tutar",
        "Rezervasyon Tarihi",
        "Baslangic",
        "Bitis",
      ].join(","),
      ...rows,
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mupark-rezervasyonlar-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setFeedback(
      selectedReservations.length > 0
        ? "Secili rezervasyonlar CSV olarak indirildi."
        : "Filtrelenen rezervasyonlar CSV olarak indirildi."
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-card-border bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.28rem] text-muted">Admin Control Center</p>
        <h1 className="mt-2 text-3xl font-bold text-text">Kapsamli akilli park yonetim paneli</h1>
        <p className="mt-3 max-w-3xl text-sm text-muted">
          Rezervasyon onay kuyrugu, saha dolulugu, zone performansi, finans akisi ve belediye
          modullerini tek merkezden yonetebilirsiniz.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Bekleyen onay", value: metrics.pending, hint: "Admin islemi bekliyor", icon: ShieldAlert },
          { label: "Toplam gelir", value: formatMoney(metrics.totalRevenue), hint: "Basarili islemler", icon: BadgeDollarSign },
          { label: "Musait spot", value: metrics.availableSpots, hint: "Canli doluluk", icon: CarFront },
          { label: "Dolu spot", value: metrics.occupiedSpots, hint: "Saha hareketi", icon: Activity },
        ].map((item) => (
          <div key={item.label} className="rounded-3xl border border-card-border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-wide text-muted">{item.label}</p>
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <p className="mt-4 text-3xl font-bold text-text">{item.value}</p>
            <p className="mt-2 text-xs text-muted">{item.hint}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[2rem] border border-card-border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24rem] text-muted">Rezervasyon Operasyonu</p>
              <h2 className="mt-1 text-xl font-semibold text-text">Toplu secim, CSV ve detay aksiyonlari</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["all", "pending", "approved", "active", "completed", "cancelled"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    filter === item ? "bg-primary text-white" : "border border-card-border bg-background text-muted"
                  }`}
                >
                  {item === "all" ? "Tumu" : item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto]">
            <input
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder="Kod, surucu, plaka veya bolge ara"
              className="w-full rounded-2xl border border-card-border bg-background px-4 py-3 text-sm outline-none"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleBulkAction("approve")}
                disabled={selectedIds.length === 0}
                className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700 disabled:opacity-50"
              >
                Secilileri Onayla
              </button>
              <button
                type="button"
                onClick={() => handleBulkAction("cancel")}
                disabled={selectedIds.length === 0}
                className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 disabled:opacity-50"
              >
                Secilileri Iptal Et
              </button>
              <button
                type="button"
                onClick={exportCsv}
                className="inline-flex items-center gap-2 rounded-2xl border border-card-border bg-background px-4 py-3 text-xs font-semibold text-text"
              >
                <Download className="h-4 w-4" />
                CSV Disa Aktar
              </button>
            </div>
          </div>

          {feedback && (
            <p className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
              {feedback}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
            <span>{selectedIds.length} kayit secili</span>
            <button type="button" onClick={toggleSelectAllVisible} className="font-semibold text-primary">
              {allVisibleSelected ? "Gorunen secimi kaldir" : "Gorunenleri sec"}
            </button>
            {selectedIds.length > 0 && (
              <button type="button" onClick={() => setSelectedIds([])} className="font-semibold text-primary">
                Secimi temizle
              </button>
            )}
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-background text-left text-muted">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAllVisible}
                      className="h-4 w-4 rounded border-card-border"
                    />
                  </th>
                  <th className="px-4 py-3">Onay</th>
                  <th className="px-4 py-3">Kod</th>
                  <th className="px-4 py-3">Surucu</th>
                  <th className="px-4 py-3">Bolge</th>
                  <th className="px-4 py-3">Durum</th>
                  <th className="px-4 py-3">Odeme</th>
                  <th className="px-4 py-3">Tutar</th>
                  <th className="px-4 py-3">Detay</th>
                  <th className="px-4 py-3">Islem</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((item) => {
                  const checked = ["approved", "active", "completed"].includes(item.status);
                  const approveDisabled = item.status !== "pending" || busyId === item.id;
                  const cancelDisabled = ["completed", "cancelled"].includes(item.status) || busyId === item.id;

                  return (
                    <tr key={item.id} className="border-t border-card-border align-top">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => toggleReservationSelection(item.id)}
                          className="h-4 w-4 rounded border-card-border"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <label className="inline-flex items-center gap-2 text-xs text-muted">
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={approveDisabled}
                            onChange={() => patchReservation(item.id, "approve")}
                            className="h-4 w-4 rounded border-card-border"
                          />
                          Onayla
                        </label>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-text">{item.code}</p>
                        <p className="text-xs text-muted">{formatDate(item.createdAt)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-text">{item.driverName}</p>
                        <p className="text-xs text-muted">{item.driverEmail}</p>
                        <p className="text-xs text-muted">{item.vehiclePlate} • {item.vehicleType}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-text">{item.zone?.name ?? "-"}</p>
                        <p className="text-xs text-muted">{item.zone?.block ?? "-"}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeClass(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeClass(item.paymentStatus)}`}>
                          {item.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-semibold text-text">{formatMoney(item.totalAmount ?? 0)}</td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => setModalReservationId(item.id)}
                          className="inline-flex items-center gap-2 rounded-xl border border-card-border bg-background px-3 py-2 text-xs font-semibold text-text"
                        >
                          <Eye className="h-4 w-4" />
                          Detay
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => patchReservation(item.id, "cancel")}
                          disabled={cancelDisabled}
                          className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                        >
                          Iptal Et
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-card-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-text">Durum Ozetleri</h2>
            </div>
            <div className="mt-4 grid gap-3">
              {[
                { label: "Pending", value: metrics.pending },
                { label: "Approved", value: metrics.approved },
                { label: "Active", value: metrics.active },
                { label: "Completed", value: metrics.completed },
                { label: "Cancelled", value: metrics.cancelled },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-card-border bg-background px-4 py-3">
                  <span className="text-sm text-text">{item.label}</span>
                  <span className="text-sm font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-card-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-text">Belediye Modulu</h2>
            </div>
            <div className="mt-4 grid gap-3">
              <div className="flex items-center justify-between rounded-2xl bg-background px-4 py-3">
                <span className="text-sm text-text">Servis talepleri</span>
                <span className="text-sm font-semibold">{data.serviceRequests.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-background px-4 py-3">
                <span className="text-sm text-text">Mesajlar</span>
                <span className="text-sm font-semibold">{data.messages.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-background px-4 py-3">
                <span className="text-sm text-text">Etkinlikler</span>
                <span className="text-sm font-semibold">{data.events.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-background px-4 py-3">
                <span className="text-sm text-text">Haberler</span>
                <span className="text-sm font-semibold">{data.news.length}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-card-border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <MapPinned className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-text">Zone Performansi</h2>
          </div>
          <div className="mt-4 grid gap-4">
            {zoneMetrics.map((zone) => (
              <div key={zone.id} className="rounded-3xl border border-card-border bg-background p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-text">{zone.name}</p>
                    <p className="text-xs text-muted">{zone.address}</p>
                  </div>
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeClass(zone.status)}`}>
                    {zone.status}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted">Doluluk</p>
                    <p className="mt-1 text-xl font-bold text-text">%{zone.occupancy}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted">Kapasite</p>
                    <p className="mt-1 text-xl font-bold text-text">{zone.capacity}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted">Akis</p>
                    <p className="mt-1 text-xl font-bold text-cyan-700">{zone.inFlow}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted">Musait</p>
                    <p className="mt-1 text-xl font-bold text-emerald-600">{zone.available}</p>
                  </div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${Math.min(zone.occupancy, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-card-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-text">Canli Spot Akisi</h2>
            </div>
            <div className="mt-4 space-y-3">
              {data.liveSpots.slice(0, 8).map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-card-border bg-background px-4 py-3">
                  <div>
                    <p className="font-semibold text-text">{item.label ?? item.spotId}</p>
                    <p className="text-xs text-muted">{item.zone?.name ?? "-"}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeClass(item.status)}`}>
                      {item.status}
                    </span>
                    <p className="mt-1 text-xs text-muted">{formatDate(item.lastUpdated)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-card-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <CalendarRange className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-text">Son Kayitlar</h2>
            </div>
            <div className="mt-4 space-y-3">
              {data.messages.slice(0, 3).map((item) => (
                <div key={item.id} className="rounded-2xl border border-card-border bg-background p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-text">{item.fullName}</p>
                      <p className="text-xs text-muted">{item.email ?? item.phone ?? "-"}</p>
                    </div>
                    <MessageSquareText className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {modalReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-8">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-card-border bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24rem] text-muted">Rezervasyon Detayi</p>
                <h3 className="mt-2 text-2xl font-bold text-text">{modalReservation.code}</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalReservationId(null)}
                className="rounded-full border border-card-border p-2 text-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-background p-4">
                <p className="text-xs uppercase tracking-wide text-muted">Surucu</p>
                <p className="mt-2 text-lg font-semibold text-text">{modalReservation.driverName}</p>
                <p className="text-sm text-muted">{modalReservation.driverEmail}</p>
              </div>
              <div className="rounded-2xl bg-background p-4">
                <p className="text-xs uppercase tracking-wide text-muted">Arac</p>
                <p className="mt-2 text-lg font-semibold text-text">{modalReservation.vehiclePlate}</p>
                <p className="text-sm text-muted">{modalReservation.vehicleType}</p>
              </div>
              <div className="rounded-2xl bg-background p-4">
                <p className="text-xs uppercase tracking-wide text-muted">Bolge</p>
                <p className="mt-2 text-lg font-semibold text-text">{modalReservation.zone?.name ?? "-"}</p>
                <p className="text-sm text-muted">{modalReservation.zone?.slug ?? "-"}</p>
              </div>
              <div className="rounded-2xl bg-background p-4">
                <p className="text-xs uppercase tracking-wide text-muted">Finans</p>
                <p className="mt-2 text-lg font-semibold text-text">{formatMoney(modalReservation.totalAmount ?? 0)}</p>
                <p className="text-sm text-muted">Odeme: {modalReservation.paymentStatus}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-card-border p-4">
                <p className="text-xs uppercase tracking-wide text-muted">Durum</p>
                <div className="mt-2 flex gap-2">
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeClass(modalReservation.status)}`}>
                    {modalReservation.status}
                  </span>
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeClass(modalReservation.paymentStatus)}`}>
                    {modalReservation.paymentStatus}
                  </span>
                </div>
              </div>
              <div className="rounded-2xl border border-card-border p-4">
                <p className="text-xs uppercase tracking-wide text-muted">QR</p>
                <p className="mt-2 break-all text-sm text-slate-600">{modalReservation.qrCode}</p>
              </div>
              <div className="rounded-2xl border border-card-border p-4">
                <p className="text-xs uppercase tracking-wide text-muted">Olusturma</p>
                <p className="mt-2 text-sm text-text">{formatDate(modalReservation.createdAt)}</p>
              </div>
              <div className="rounded-2xl border border-card-border p-4">
                <p className="text-xs uppercase tracking-wide text-muted">Rezervasyon Zamani</p>
                <p className="mt-2 text-sm text-text">{formatDate(modalReservation.reservedAt)}</p>
              </div>
              <div className="rounded-2xl border border-card-border p-4">
                <p className="text-xs uppercase tracking-wide text-muted">Park Baslangici</p>
                <p className="mt-2 text-sm text-text">{formatDate(modalReservation.startTime)}</p>
              </div>
              <div className="rounded-2xl border border-card-border p-4">
                <p className="text-xs uppercase tracking-wide text-muted">Park Bitisi</p>
                <p className="mt-2 text-sm text-text">{formatDate(modalReservation.endTime)}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => patchReservation(modalReservation.id, "approve")}
                disabled={modalReservation.status !== "pending" || busyId === modalReservation.id}
                className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 disabled:opacity-50"
              >
                Onayla
              </button>
              <button
                type="button"
                onClick={() => patchReservation(modalReservation.id, "cancel")}
                disabled={["completed", "cancelled"].includes(modalReservation.status) || busyId === modalReservation.id}
                className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 disabled:opacity-50"
              >
                Iptal Et
              </button>
              <button
                type="button"
                onClick={() => setModalReservationId(null)}
                className="rounded-2xl border border-card-border bg-background px-4 py-3 text-sm font-semibold text-text"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
