import { connectDb } from "@/lib/db/mongoose";
import { LiveSpot, type LiveSpotDocument, type SpotStatus } from "@/lib/models/liveSpot";
import { type ZoneDocument, Zone } from "@/lib/models/zone";

export interface LiveZoneSnapshot {
  slug: string;
  name: string;
  block: string;
  capacity: number;
  hourlyRate: number;
  status: ZoneDocument["status"];
  color?: string;
  noShowPenalty: number;
  spots: Array<{
    spotId: string;
    status: SpotStatus;
    label?: string;
    isEv: boolean;
    lastUpdated: string;
  }>;
}

async function ensureDb() {
  await connectDb();
}

type ZoneLean = {
  _id: ZoneDocument["_id"];
  slug: string;
  name: string;
  block: string;
  capacity: number;
  hourlyRate: number;
  status: ZoneDocument["status"];
  color?: string;
  noShowPenalty?: number;
};

function isElectricSpot(spot: Pick<LiveSpotDocument, "spotId" | "label">) {
  if (spot.label?.toUpperCase().startsWith("EV-")) {
    return true;
  }
  return spot.spotId.endsWith("-1") || spot.spotId.endsWith("-2");
}

export async function getLiveZoneSnapshots(): Promise<LiveZoneSnapshot[]> {
  await ensureDb();

  const [zones, liveSpots] = await Promise.all([
    Zone.find().lean<ZoneLean[]>(),
    LiveSpot.find()
      .populate<{ zone: ZoneDocument }>("zone")
      .lean<LiveSpotDocument[]>(),
  ]);

  const zoneMap = new Map<string, LiveZoneSnapshot>();
  zones.forEach((zone) => {
    zoneMap.set(zone.slug, {
      slug: zone.slug,
      name: zone.name,
      block: zone.block,
      capacity: zone.capacity,
      hourlyRate: zone.hourlyRate,
      status: zone.status,
      color: zone.color,
      noShowPenalty: zone.noShowPenalty ?? 0,
      spots: [],
    });
  });

  liveSpots.forEach((spot) => {
    const zoneDoc = spot.zone as ZoneDocument | null;
    if (!zoneDoc) return;
    const entry = zoneMap.get(zoneDoc.slug);
    if (!entry) return;
    entry.spots.push({
      spotId: spot.spotId,
      status: spot.status,
      label: spot.label,
      isEv: isElectricSpot(spot),
      lastUpdated: spot.lastUpdated ? spot.lastUpdated.toISOString() : new Date().toISOString(),
    });
  });

  return Array.from(zoneMap.values()).map((zone) => ({
    ...zone,
    spots: zone.spots.sort((a, b) => a.spotId.localeCompare(b.spotId)),
  }));
}

export async function setLiveSpotStatus(
  spotId: string,
  status: SpotStatus
): Promise<LiveSpotDocument> {
  await ensureDb();
  const spot = await LiveSpot.findOne({ spotId }).populate("zone");
  if (!spot) {
    throw new Error(`Spot ${spotId} not found`);
  }

  if (spot.status === status) {
    return spot;
  }

  spot.status = status;
  spot.lastUpdated = new Date();
  await spot.save();

  return spot;
}

export async function reserveLiveSpot(spotId: string): Promise<LiveSpotDocument> {
  return setLiveSpotStatus(spotId, "reserved");
}
