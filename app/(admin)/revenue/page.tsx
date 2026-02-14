import { connectDb } from "@/lib/db/mongoose";
import { getRevenueAnalytics } from "@/lib/services/analytics";

export default async function RevenuePage() {
  await connectDb();
  const revenue = await getRevenueAnalytics();

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-white border border-card-border p-6 shadow-sm">
          <p className="text-xs text-muted uppercase tracking-[0.4rem] mb-2">Monthly revenue</p>
          <p className="text-3xl font-semibold text-secondary">${revenue.monthlyRevenue}</p>
          <p className="text-xs text-muted">Simulated via mock payments</p>
        </div>
        <div className="rounded-3xl bg-white border border-card-border p-6 shadow-sm">
          <p className="text-xs text-muted uppercase tracking-[0.4rem] mb-2">
            Per-vehicle average
          </p>
          <p className="text-3xl font-semibold text-primary">${revenue.perVehicleAverage}</p>
          <p className="text-xs text-muted">Paid vehicles only</p>
        </div>
        <div className="rounded-3xl bg-white border border-card-border p-6 shadow-sm">
          <p className="text-xs text-muted uppercase tracking-[0.4rem] mb-2">
            Trend
          </p>
          <p className="text-3xl font-semibold text-text">{revenue.chartTrend.length} days</p>
          <p className="text-xs text-muted">Daily entries visualized below</p>
        </div>
      </section>

      <section className="rounded-3xl bg-white border border-card-border p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-text mb-6">Daily revenue trend</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {revenue.chartTrend.map((point) => (
            <div key={point.date} className="rounded-2xl bg-background p-4 border border-card-border">
              <p className="text-xs text-muted">{point.date}</p>
              <p className="text-2xl font-bold">${point.amount}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
