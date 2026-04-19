const { randomUUID } = require("crypto");
const { existsSync, readFileSync } = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const zones = [
  {
    name: "Karagozler Marina",
    slug: "karagozler-marina",
    block: "A",
    address: "Karagozler Mahallesi sahil bandi, Fethiye",
    capacity: 24,
    hourlyRate: 70,
    status: "open",
    coordinates: { lat: 36.6206, lng: 29.09584 },
    mapPosition: { x: 16, y: 56 },
    color: "#0f766e",
    noShowPenalty: 120,
  },
  {
    name: "Cumhuriyet Meydani",
    slug: "cumhuriyet-meydani",
    block: "B",
    address: "Cumhuriyet Mahallesi merkez aks, Fethiye",
    capacity: 32,
    hourlyRate: 80,
    status: "open",
    coordinates: { lat: 36.62127, lng: 29.11122 },
    mapPosition: { x: 36, y: 54 },
    color: "#0284c7",
    noShowPenalty: 130,
  },
  {
    name: "Tuzla Otogar Baglantisi",
    slug: "tuzla-otogar-baglantisi",
    block: "C",
    address: "Tuzla Mahallesi otogar cephesi, Fethiye",
    capacity: 28,
    hourlyRate: 75,
    status: "open",
    coordinates: { lat: 36.627087, lng: 29.127911 },
    mapPosition: { x: 58, y: 43 },
    color: "#7c3aed",
    noShowPenalty: 115,
  },
  {
    name: "Babatasi Sahil Koridoru",
    slug: "babatasi-sahil-koridoru",
    block: "D",
    address: "Babatasi Mahallesi sahil koridoru, Fethiye",
    capacity: 30,
    hourlyRate: 85,
    status: "open",
    coordinates: { lat: 36.634026, lng: 29.13142 },
    mapPosition: { x: 72, y: 32 },
    color: "#ea580c",
    noShowPenalty: 140,
  },
];

function readEnv(name) {
  if (process.env[name]) return process.env[name];

  const envPath = path.join(process.cwd(), ".env");
  if (!existsSync(envPath)) return undefined;

  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    if (key !== name) continue;
    return trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");
  }

  return undefined;
}

function makeCode() {
  return `MP-${randomUUID().split("-")[0].toUpperCase()}`;
}

async function run() {
  const uri = readEnv("MONGODB_URI");
  if (!uri) {
    throw new Error("MONGODB_URI bulunamadi");
  }

  await mongoose.connect(uri);

  const now = new Date();
  const db = mongoose.connection.db;

  await Promise.all([
    db.collection("zones").deleteMany({}),
    db.collection("reservations").deleteMany({}),
    db.collection("transactions").deleteMany({}),
    db.collection("livespots").deleteMany({}),
  ]);

  const zoneDocs = zones.map((zone) => ({
    ...zone,
    createdAt: now,
    updatedAt: now,
  }));

  const zoneResult = await db.collection("zones").insertMany(zoneDocs);
  const createdZones = Object.values(zoneResult.insertedIds).map((id, index) => ({
    _id: id,
    ...zones[index],
  }));

  const reservations = [
    {
      zone: createdZones[0]._id,
      driverName: "Pilot One",
      driverEmail: "pilot1@mupark.local",
      vehiclePlate: "MUP-101",
      vehicleType: "Sedan",
      reservedAt: now,
      status: "pending",
      paymentStatus: "pending",
      qrCode: `https://mupark.local/qr/${makeCode()}`,
      code: makeCode(),
      createdAt: now,
      updatedAt: now,
    },
    {
      zone: createdZones[1]._id,
      driverName: "Pilot Two",
      driverEmail: "pilot2@mupark.local",
      vehiclePlate: "MUP-102",
      vehicleType: "SUV",
      reservedAt: now,
      status: "active",
      paymentStatus: "pending",
      qrCode: `https://mupark.local/qr/${makeCode()}`,
      code: makeCode(),
      startTime: new Date(Date.now() - 20 * 60 * 1000),
      createdAt: now,
      updatedAt: now,
    },
    {
      zone: createdZones[2]._id,
      driverName: "Pilot Three",
      driverEmail: "pilot3@mupark.local",
      vehiclePlate: "MUP-103",
      vehicleType: "Compact",
      reservedAt: now,
      status: "completed",
      paymentStatus: "paid",
      startTime: new Date(Date.now() - 90 * 60 * 1000),
      endTime: new Date(Date.now() - 30 * 60 * 1000),
      totalAmount: 140,
      qrCode: `https://mupark.local/qr/${makeCode()}`,
      code: makeCode(),
      createdAt: now,
      updatedAt: now,
    },
  ];

  const reservationResult = await db.collection("reservations").insertMany(reservations);
  const reservationIds = Object.values(reservationResult.insertedIds);

  await db.collection("transactions").insertMany([
    {
      reservation: reservationIds[2],
      amount: 140,
      status: "success",
      method: "mock",
      processedAt: now,
      notes: "Seeded transaction",
      createdAt: now,
      updatedAt: now,
    },
  ]);

  const liveSpotPattern = ["available", "occupied", "reserved"];
  const liveSpotDocs = createdZones.flatMap((zone) =>
    Array.from({ length: zone.capacity }, (_, idx) => ({
      spotId: `${zone.slug.toUpperCase()}-${idx + 1}`,
      zone: zone._id,
      status: liveSpotPattern[(idx + zone.capacity) % liveSpotPattern.length],
      label: `P-${idx + 1}`,
      lastUpdated: new Date(Date.now() - idx * 60 * 1000),
      createdAt: now,
      updatedAt: now,
    }))
  );

  await db.collection("livespots").insertMany(liveSpotDocs);

  console.log("Seeded MuPark data with", createdZones.length, "zones and", liveSpotDocs.length, "live spots.");
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error(error);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
