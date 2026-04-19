export interface FethiyeZoneSeed {
  name: string;
  slug: string;
  block: string;
  address: string;
  capacity: number;
  hourlyRate: number;
  status: "open" | "maintenance" | "full";
  coordinates: {
    lat: number;
    lng: number;
  };
  mapPosition: {
    x: number;
    y: number;
  };
  color: string;
  noShowPenalty: number;
}

export const fethiyeZoneSeeds: FethiyeZoneSeed[] = [
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
