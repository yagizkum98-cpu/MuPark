import { connectDb } from "@/lib/db/mongoose";
import { getDashboardMetrics, getUsageAnalytics } from "@/lib/services/analytics";
import { getZonesWithStats } from "@/lib/services/zone";

const kpiStyles = "rounded-2xl bg-white border border-card-border p-6 shadow-sm";

export default async function AdminDashboardPage() {
  await connectDb();
  const metrics = await getDashboardMetrics();
  const usage = await getUsageAnalytics();
  const zones = await getZonesWithStats();

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-4">
        <div className={kpiStyles}>
          <p className="text-sm text-muted uppercase tracking-wide">Total spots</p>
          <p className="text-3xl font-bold text-primary">{metrics.totalSpots}</p>
          <p className="text-xs text-muted mt-2">Pilot coverage</p>
        </div>
        <div className={kpiStyles}>
          <p className="text-sm text-muted uppercase tracking-wide">Occupancy</p>
          <p className="text-3xl font-bold text-secondary">{metrics.occupancyPercent}%</p>
          <p className="text-xs text-muted mt-2">Active reservations vs capacity</p>
        </div>
        <div className={kpiStyles}>
          <p className="text-sm text-muted uppercase tracking-wide">Active vehicles</p>
          <p className="text-3xl font-bold">{metrics.activeVehicles}</p>
          <p className="text-xs text-muted mt-2">In-transit/checked-in</p>
        </div>
        <div className={kpiStyles}>
          <p className="text-sm text-muted uppercase tracking-wide">Empty spots</p>
          <p className="text-3xl font-bold">{metrics.emptySpots}</p>
          <p className="text-xs text-muted mt-2">Manual overrides available</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-white border border-card-border p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-text">Usage insights</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-background p-4">
              <p className="text-sm text-muted">Avg. park duration</p>
              <p className="text-2xl font-semibold">{usage.averageDurationMinutes} min</p>
            </div>
            <div className="rounded-2xl bg-background p-4">
              <p className="text-sm text-muted">Busiest window</p>
              <p className="text-2xl font-semibold">{usage.busiestWindow}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted uppercase tracking-wide mb-2">Daily entries</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {Object.entries(usage.dailyEntries).map(([day, count]) => (
                <div
                  key={day}
                  className="rounded-xl border border-card-border bg-background p-2 text-center"
                >
                  <p className="font-semibold">{count}</p>
                  <p className="text-muted">{day}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-3xl bg-white border border-card-border p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-text">Zones snapshot</h2>
          <div className="space-y-3">
            {zones.slice(0, 4).map((zone) => (
              <div key={zone.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{zone.name}</p>
                  <p className="text-xs text-muted">{zone.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold">{zone.occupancyRate}%</p>
                  <p className="text-xs text-muted">{zone.availableSpots} avail.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white border border-card-border p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-text">Active zones</h2>
            <p className="text-sm text-muted">Manual occupancy updates allowed</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {zones.map((zone) => (
            <div key={zone.id} className="rounded-2xl bg-background p-4 border border-card-border">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">{zone.name}</span>
                <span className="text-muted">{zone.block}</span>
              </div>
              <p className="text-xs text-muted">{zone.address}</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{zone.occupancyRate}%</p>
                  <p className="text-xs text-muted">{zone.availableSpots} spots free</p>
                </div>
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xs font-semibold bg-white border border-card-border">
                  {zone.capacity} cap
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
