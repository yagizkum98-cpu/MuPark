import { connectDb } from "@/lib/db/mongoose";
import { getReportSummary } from "@/lib/services/analytics";

export default async function ReportsPage() {
  await connectDb();
  const report = await getReportSummary(30);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white border border-card-border p-6 shadow-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4rem] text-muted">30-day summary</p>
          <h2 className="text-2xl font-semibold text-text">
            {report.totalReservations} reservations
          </h2>
          <p className="text-xs text-muted">Revenue ${report.totalRevenue}</p>
        </div>
        <div className="flex gap-3">
          <a
            href="/api/reports/summary?days=30&format=pdf"
            className="px-4 py-2 rounded-2xl border border-card-border text-sm font-semibold text-primary"
          >
            Export PDF (stub)
          </a>
          <a
            href="/api/reports/summary?days=30&format=excel"
            className="px-4 py-2 rounded-2xl border border-card-border text-sm font-semibold text-primary"
          >
            Export Excel (stub)
          </a>
        </div>
      </section>

      <section className="rounded-3xl bg-white border border-card-border p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.3rem] text-muted">
              <tr>
                <th className="py-3 px-2">Zone</th>
                <th className="py-3 px-2">Driver</th>
                <th className="py-3 px-2">Vehicle</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Amount</th>
              </tr>
            </thead>
            <tbody className="border-t border-card-border">
              {report.items.map((entry, index) => (
                <tr key={`${entry.driver}-${index}`} className="text-xs">
                  <td className="py-3 px-2 font-semibold">{entry.zoneName}</td>
                  <td className="py-3 px-2">{entry.driver}</td>
                  <td className="py-3 px-2">{entry.vehicle}</td>
                  <td className="py-3 px-2">{entry.status}</td>
                  <td className="py-3 px-2">${entry.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
