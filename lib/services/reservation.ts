import { randomUUID } from "crypto";
import { Reservation, ReservationStatus } from "@/lib/models/reservation";
import { Zone } from "@/lib/models/zone";

const occupancyStatuses: ReservationStatus[] = ["pending", "active"];

export interface ReservationInput {
  zoneId: string;
  driverName: string;
  driverEmail: string;
  vehiclePlate: string;
  vehicleType: string;
}

function formatCode() {
  return `MP-${randomUUID().split("-")[0].toUpperCase()}`;
}

export async function reserveSpot(data: ReservationInput) {
  const zone = await Zone.findById(data.zoneId);
  if (!zone) {
    throw new Error("Zone not found");
  }

  const occupied = await Reservation.countDocuments({
    zone: zone._id,
    status: { $in: occupancyStatuses },
  });

  if (occupied >= zone.capacity) {
    throw new Error("No spots currently available");
  }

  const code = formatCode();
  const qrCode = `https://mupark.local/qr/${code}`;

  const created = await Reservation.create({
    zone: zone._id,
    driverName: data.driverName,
    driverEmail: data.driverEmail,
    vehiclePlate: data.vehiclePlate,
    vehicleType: data.vehicleType,
    qrCode,
    code,
  });

  return created;
}

export async function findReservationById(id: string) {
  return Reservation.findById(id);
}

export async function updateReservationStatus(id: string, action: "start" | "end") {
  const reservation = await Reservation.findById(id);
  if (!reservation) throw new Error("Reservation not found");

  if (action === "start") {
    if (reservation.status === "active") return reservation;
    reservation.status = "active";
    reservation.startTime = reservation.startTime ?? new Date();
  } else {
    reservation.status = "completed";
    reservation.endTime = new Date();
    if (!reservation.startTime) {
      reservation.startTime = reservation.reservedAt;
    }
    const hours = Math.max(
      ((reservation.endTime.getTime() - reservation.startTime.getTime()) / 1000 / 60) / 60,
      0.25
    );
    const zone = await Zone.findById(reservation.zone);
    const rate = zone?.hourlyRate ?? 0;
    reservation.totalAmount = Number((hours * rate).toFixed(2));
  }

  await reservation.save();
  return reservation;
}
