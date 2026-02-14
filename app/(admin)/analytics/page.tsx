import { connectDb } from "@/lib/db/mongoose";
import { getUsageAnalytics, getRevenueAnalytics } from "@/lib/services/analytics";

const barColors = ["#13629F", "#159B58", "#1EA3D2"];

export default async function AnalyticsPage() {
  await connectDb();
  const usage = await getUsageAnalytics();
  const revenue = await getRevenueAnalytics();

  const entryPairs = Object.entries(usage.dailyEntries).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  const totalLegend = revenue.legend.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white border border-card-border p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-text mb-6">Daily entries (last 14 days)</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {entryPairs.map(([day, count], index) => (
            <div key={day} className="rounded-2xl bg-background p-4 space-y-1">
              <p className="text-xs text-muted">{day}</p>
              <div className="h-2 rounded-full bg-card-border overflow-hidden">
                <div
                  className="h-2"
                  style={{
                    width: `${Math.min(count * 10, 100)}%`,
                    backgroundColor: barColors[index % barColors.length],
                  }}
                />
              </div>
              <p className="text-sm font-semibold">{count} entries</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl bg-white border border-card-border p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-text mb-4">Revenue trend</h2>
          <div className="space-y-2">
            {revenue.chartTrend.map((point) => (
              <div key={point.date} className="flex items-center justify-between text-xs text-muted">
                <span>{point.date}</span>
                <span>${point.amount}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-white border border-card-border p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-text mb-4">Revenue breakdown</h2>
          <div className="space-y-2">
            {revenue.legend.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm font-semibold">{item.label}</span>
                <span className="text-xl font-bold">{item.value}</span>
              </div>
            ))}
            <div className="h-32 w-full rounded-2xl border border-card-border bg-background relative overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full"
                style={{
                  width: `${Math.min(100, (revenue.legend[0].value / Math.max(1, totalLegend)) * 100)}%`,
                  backgroundColor: "#13629F",
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
