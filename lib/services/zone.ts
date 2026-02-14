import { Reservation } from "@/lib/models/reservation";
import { Zone } from "@/lib/models/zone";

export interface ZoneStats {
  id: string;
  slug: string;
  name: string;
  block: string;
  address: string;
  capacity: number;
  hourlyRate: number;
  status: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  mapPosition: {
    x: number;
    y: number;
  };
  color?: string;
  noShowPenalty: number;
  occupied: number;
  occupancyRate: number;
  availableSpots: number;
}

const occupancyStatuses = ["pending", "active"];

export async function getZonesWithStats(): Promise<ZoneStats[]> {
  const zones = await Zone.find().lean() as any[];
  const counts = await Reservation.aggregate([
    { $match: { status: { $in: occupancyStatuses } } },
    { $group: { _id: "$zone", occupied: { $sum: 1 } } },
  ]);

  const occupancyMap = counts.reduce<Record<string, number>>((acc, item) => {
    acc[item._id.toString()] = item.occupied;
    return acc;
  }, {});

  return zones.map((zone) => {
    const occupied = occupancyMap[zone._id.toString()] ?? 0;
    const available = Math.max(zone.capacity - occupied, 0);
    const occupancyRate = zone.capacity ? Math.min(100, Math.round((occupied / zone.capacity) * 100)) : 0;
    return {
      id: zone._id.toString(),
      slug: zone.slug,
      name: zone.name,
      block: zone.block,
      address: zone.address,
      capacity: zone.capacity,
      hourlyRate: zone.hourlyRate,
      status: zone.status,
      coordinates: zone.coordinates,
      mapPosition: zone.mapPosition,
      color: zone.color,
      noShowPenalty: zone.noShowPenalty ?? 0,
      occupied,
      occupancyRate,
      availableSpots: available,
    };
  });
}

export async function getZoneBySlug(slug: string): Promise<ZoneStats | null> {
  const zone = await Zone.findOne({ slug }).lean() as any;
  if (!zone) return null;
  const occupied = await Reservation.countDocuments({
    zone: zone._id,
    status: { $in: occupancyStatuses },
  });
  const available = Math.max(zone.capacity - occupied, 0);
  const occupancyRate = zone.capacity ? Math.min(100, Math.round((occupied / zone.capacity) * 100)) : 0;

  return {
    id: (zone as any)._id.toString(),
    slug: zone.slug,
    name: zone.name,
    block: zone.block,
    address: zone.address,
    capacity: zone.capacity,
    hourlyRate: zone.hourlyRate,
    status: zone.status,
    coordinates: zone.coordinates,
    mapPosition: zone.mapPosition,
    color: zone.color,
    noShowPenalty: zone.noShowPenalty ?? 0,
    occupied,
    occupancyRate,
    availableSpots: available,
  };
}
