import { connectDb } from "@/lib/db/mongoose";
import { getZonesWithStats } from "@/lib/services/zone";

const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const mapCenter = "15.5,45"; // placeholder center
const mapZoom = 13;

const occupancyColor = (occupied: number) => {
  if (occupied >= 80) return "bg-danger";
  if (occupied >= 50) return "bg-warning";
  return "bg-secondary";
};

export default async function AdminMapPage() {
  await connectDb();
  const zones = await getZonesWithStats();
  const mapUrl = token
    ? `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${mapCenter},${mapZoom}/1100x600?access_token=${token}`
    : undefined;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white border border-card-border p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text">Occupancy heat map</h2>
            <p className="text-xs text-muted">Color indicates current load per zone</p>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-secondary block" />
              Low
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-warning block" />
              Medium
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-danger block" />
              High
            </span>
          </div>
        </div>
        <div className="mt-6 relative rounded-3xl overflow-hidden border border-card-border bg-black">
          {mapUrl ? (
            <img
              src={mapUrl}
              alt="Mapbox preview"
              className="h-[420px] w-full object-cover"
            />
          ) : (
            <div className="flex h-[420px] w-full items-center justify-center text-white text-sm">
              Provide NEXT_PUBLIC_MAPBOX_TOKEN to render a satellite map preview
            </div>
          )}
          <div className="absolute inset-0 pointer-events-none">
            {zones.map((zone) => (
              <div
                key={zone.id}
                className={`absolute -translate-x-1/2 -translate-y-1/2 text-[10px] font-semibold text-white px-2 py-1 rounded-full ${occupancyColor(
                  zone.occupancyRate
                )} bg-opacity-90`}
                style={{
                  top: `${zone.mapPosition.y}%`,
                  left: `${zone.mapPosition.x}%`,
                }}
              >
                {zone.name} · {zone.occupancyRate}%
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white border border-card-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-text mb-4">Zone clusters</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {zones.map((zone) => (
            <div key={zone.id} className="rounded-2xl border border-card-border bg-background p-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold">{zone.name}</p>
                <span className="text-xs text-muted">{zone.block}</span>
              </div>
              <p className="text-xs text-muted">{zone.address}</p>
              <p className="text-2xl font-bold mt-3">{zone.occupancyRate}%</p>
              <p className="text-xs text-muted">Available: {zone.availableSpots}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
