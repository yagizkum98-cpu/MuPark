import { randomUUID } from "crypto";
import { connectDb } from "../lib/db/mongoose";
import { Reservation } from "../lib/models/reservation";
import { Transaction } from "../lib/models/transaction";
import { Zone } from "../lib/models/zone";
import { LiveSpot, type SpotStatus } from "../lib/models/liveSpot";
import { fethiyeZoneSeeds } from "../lib/data/fethiyeZones";

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

  const createdZones = await Zone.create(fethiyeZoneSeeds);

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
      status: liveSpotPattern[(idx + zone.capacity) % liveSpotPattern.length],
      label: `P-${idx + 1}`,
      lastUpdated: new Date(Date.now() - idx * 60 * 1000),
    }))
  );

  await LiveSpot.create(liveSpotDocs);

  console.log(
    "Seeded MuPark data with",
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
