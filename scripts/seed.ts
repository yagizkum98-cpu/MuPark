import { randomUUID } from "crypto";
import { connectDb } from "../lib/db/mongoose.ts";
import { Reservation } from "../lib/models/reservation.ts";
import { Transaction } from "../lib/models/transaction.ts";
import { Zone } from "../lib/models/zone.ts";
import { LiveSpot, type SpotStatus } from "../lib/models/liveSpot.ts";

const zones = [
  {
    name: "Atatürk Caddesi",
    slug: "atatürk-caddesi",
    block: "A",
    address: "Atatürk Caddesi 12",
    capacity: 12,
    hourlyRate: 4.2,
    status: "open",
    coordinates: { lat: 38.953, lng: 35.242 },
    mapPosition: { x: 30, y: 45 },
    color: "#13629F",
    noShowPenalty: 35,
  },
  {
    name: "Karagözler",
    slug: "karagozler",
    block: "B",
    address: "Karagözler Sokak 8",
    capacity: 14,
    hourlyRate: 4.8,
    status: "open",
    coordinates: { lat: 38.949, lng: 35.231 },
    mapPosition: { x: 65, y: 65 },
    color: "#159B58",
    noShowPenalty: 40,
  },
  {
    name: "Çarşı Caddesi",
    slug: "carsi-caddesi",
    block: "C",
    address: "Çarşı Caddesi 27",
    capacity: 10,
    hourlyRate: 5,
    status: "open",
    coordinates: { lat: 38.964, lng: 35.243 },
    mapPosition: { x: 55, y: 35 },
    color: "#1EA3D2",
    noShowPenalty: 45,
  },
];

function makeCode() {
  return `MP-${randomUUID().split("-")[0].toUpperCase()}`;
}

async function run() {
  await connectDb();
  await Promise.all([
    Zone.deleteMany({}),
    Reservation.deleteMany({}),
    Transaction.deleteMany({}),
    LiveSpot.deleteMany({}),
  ]);

  const createdZones = await Zone.create(zones);

  const reservations = await Reservation.create([
    {
      zone: createdZones[0]._id,
      driverName: "Pilot One",
      driverEmail: "pilot1@mupark.local",
      vehiclePlate: "MUP-101",
      vehicleType: "Sedan",
      status: "pending",
      paymentStatus: "pending",
      qrCode: `https://mupark.local/qr/${makeCode()}`,
      code: makeCode(),
    },
    {
      zone: createdZones[1]._id,
      driverName: "Pilot Two",
      driverEmail: "pilot2@mupark.local",
      vehiclePlate: "MUP-102",
      vehicleType: "SUV",
      status: "active",
      paymentStatus: "pending",
      qrCode: `https://mupark.local/qr/${makeCode()}`,
      code: makeCode(),
      startTime: new Date(Date.now() - 20 * 60 * 1000),
    },
    {
      zone: createdZones[2]._id,
      driverName: "Pilot Three",
      driverEmail: "pilot3@mupark.local",
      vehiclePlate: "MUP-103",
      vehicleType: "Compact",
      status: "completed",
      paymentStatus: "paid",
      startTime: new Date(Date.now() - 90 * 60 * 1000),
      endTime: new Date(Date.now() - 30 * 60 * 1000),
      totalAmount: 5.5,
      qrCode: `https://mupark.local/qr/${makeCode()}`,
      code: makeCode(),
    },
  ]);

  await Transaction.create(
    reservations
      .filter((reservation) => reservation.status === "completed")
      .map((reservation) => ({
        reservation: reservation._id,
        amount: reservation.totalAmount ?? 0,
        status: "success",
        method: "mock",
        notes: "Seeded transaction",
      }))
  );

  const liveSpotPattern: SpotStatus[] = ["available", "occupied", "reserved"];
  const liveSpotDocs = createdZones.flatMap((zone) =>
    Array.from({ length: zone.capacity }, (_, idx) => ({
      spotId: `${zone.slug.toUpperCase()}-${idx + 1}`,
      zone: zone._id,
      status:
        liveSpotPattern[(idx + zone.capacity) % liveSpotPattern.length],
      label: idx < 2 ? `EV-${idx + 1}` : `P-${idx + 1}`,
      lastUpdated: new Date(Date.now() - idx * 60 * 1000),
    }))
  );

  await LiveSpot.create(liveSpotDocs);

  console.log(
    "Seeded ÂµPark data with",
    createdZones.length,
    "zones and",
    liveSpotDocs.length,
    "live spots."
  );
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
