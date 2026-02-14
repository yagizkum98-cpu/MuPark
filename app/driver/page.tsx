import Link from "next/link";
import { connectDb } from "@/lib/db/mongoose";
import { getZonesWithStats } from "@/lib/services/zone";

export default async function DriverHomePage() {
  await connectDb();
  const zones = await getZonesWithStats();

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-white border border-card-border p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-text mb-4">Nearby parking zones</h2>
        <p className="text-sm text-muted mb-6">
          Manual mode shows occupancy. Future pilots can plug in camera/AI feeds.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {zones.map((zone) => (
            <Link
              key={zone.id}
              href={`/driver/zones/${zone.slug}`}
              className="block rounded-3xl border border-card-border bg-background p-5 hover:border-primary transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-text">{zone.name}</p>
                  <p className="text-xs text-muted">{zone.address}</p>
                </div>
                <span className="text-xs text-muted">{zone.availableSpots} avail.</span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-3xl font-bold text-primary">
                  {zone.capacity - zone.occupied}/{zone.capacity}
                </p>
                <p className="text-sm text-muted">${zone.hourlyRate}/hr</p>
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      background:
                        zone.occupancyRate > 80
                          ? "#D64545"
                          : zone.occupancyRate > 50
                          ? "#F3A712"
                          : "#159B58",
                    }}
                  />
                  {zone.occupancyRate}% occupied
                </span>
                <span>Block {zone.block}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
