"use client";

import { FormEvent, useState } from "react";

interface Reservation {
  _id: string;
  status: "pending" | "approved" | "active" | "completed" | "cancelled";
  code: string;
  paymentStatus: "pending" | "paid" | "failed";
  totalAmount?: number;
}

interface Props {
  zoneId: string;
  hourlyRate: number;
}

interface FormState {
  driverName: string;
  driverEmail: string;
  vehiclePlate: string;
  vehicleType: string;
}

const initialForm: FormState = {
  driverName: "Pilot Driver",
  driverEmail: "pilot@mupark.local",
  vehiclePlate: "MUP-001",
  vehicleType: "Compact",
};

export default function ReservationPanel({ zoneId }: Props) {
  const [form, setForm] = useState(initialForm);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function readResponsePayload(response: Response) {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return response.json();
    }
    const text = await response.text();
    return { error: text.slice(0, 180) || "Unexpected non-JSON response" };
  }

  async function handleReserve(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setStatus("Creating reservation...");
    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, zoneId }),
    });
    setLoading(false);
    const payload = await readResponsePayload(response);
    if (!response.ok) {
      setError(payload.error ?? "Unable to create reservation");
      setStatus(null);
      return;
    }
    setReservation(payload);
    setStatus("Reservation created.");
  }

  async function handleAction(action: "start" | "end") {
    if (!reservation) return;
    setLoading(true);
    setError(null);
    setStatus(action === "start" ? "Starting session..." : "Ending session...");
    const response = await fetch(`/api/reservations/${reservation._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setLoading(false);
    const payload = await readResponsePayload(response);
    if (!response.ok) {
      setError(payload.error ?? "Unable to update reservation");
      return;
    }
    setReservation(payload);
    setStatus(action === "start" ? "Active parking session started." : "Parking ended. Ready for payment.");
  }

  async function handlePayment() {
    if (!reservation) return;
    setLoading(true);
    setError(null);
    setStatus("Capturing mock payment...");
    const response = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reservationId: reservation._id, method: "card-mock" }),
    });
    setLoading(false);
    const payload = await readResponsePayload(response);
    if (!response.ok) {
      setError(payload.error ?? "Payment failed");
      return;
    }
    setStatus("Payment captured");
    setReservation((prev) =>
      prev
        ? { ...prev, paymentStatus: payload.status ?? prev.paymentStatus, totalAmount: payload.amount }
        : prev
    );
  }

  const canStart = reservation && (reservation.status === "pending" || reservation.status === "approved");
  const canEnd = reservation && reservation.status === "active";
  const canPay = reservation && reservation.status === "completed" && reservation.paymentStatus !== "paid";

  return (
    <div className="space-y-6 rounded-3xl border border-card-border bg-white p-6 shadow-sm">
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleReserve}>
        {(Object.entries(form) as [keyof FormState, string][]).map(([key, value]) => (
          <label key={key} className="text-xs text-muted">
            {key.replace(/([A-Z])/g, " $1").replace(/\b\w/g, (l) => l.toUpperCase())}
            <input
              value={value}
              onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.currentTarget.value }))}
              className="mt-1 w-full rounded-2xl border border-card-border px-3 py-2 text-sm"
            />
          </label>
        ))}
        <div className="flex items-end">
          <button disabled={loading} type="submit" className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white">
            Reserve spot
          </button>
        </div>
      </form>

      {reservation && (
        <div className="grid gap-4">
          <div className="space-y-3 rounded-2xl border border-card-border bg-background p-4">
            <div className="flex justify-between items-center">
              <p className="text-xs uppercase tracking-[0.3rem] text-muted">Reservation</p>
              <span className="text-xs text-muted">{reservation.code}</span>
            </div>
            <p className="text-2xl font-semibold text-primary">{reservation.status}</p>
            <p className="text-xs text-muted">Payment: {reservation.paymentStatus} - ${reservation.totalAmount ?? "0.00"}</p>

            <div className="flex gap-2">
              <button
                onClick={() => handleAction("start")}
                type="button"
                disabled={!canStart || loading}
                className="flex-1 rounded-2xl border border-secondary px-4 py-2 text-sm font-semibold text-secondary disabled:opacity-50"
              >
                Start parking
              </button>
              <button
                onClick={() => handleAction("end")}
                type="button"
                disabled={!canEnd || loading}
                className="flex-1 rounded-2xl border border-danger px-4 py-2 text-sm font-semibold text-danger disabled:opacity-50"
              >
                End parking
              </button>
            </div>
            <button
              onClick={handlePayment}
              type="button"
              disabled={!canPay || loading}
              className="w-full rounded-2xl bg-secondary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Capture mock payment
            </button>
          </div>
        </div>
      )}
      {status && <p className="text-xs text-muted">{status}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
