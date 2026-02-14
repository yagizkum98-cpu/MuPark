import { Zone } from "@/lib/models/zone";
import { Reservation } from "@/lib/models/reservation";
import { Transaction } from "@/lib/models/transaction";

function formatCurrency(value: number) {
  return Number(value.toFixed(2));
}

export async function getDashboardMetrics() {
  const zones = await Zone.find();
  const totalSpots = zones.reduce((sum, zone) => sum + zone.capacity, 0);
  const activeReservations = await Reservation.countDocuments({
    status: { $in: ["pending", "active"] },
  });
  const occupancyPercent = totalSpots
    ? Math.round((activeReservations / totalSpots) * 100)
    : 0;

  return {
    totalSpots,
    occupancyPercent,
    activeVehicles: activeReservations,
    emptySpots: Math.max(totalSpots - activeReservations, 0),
  };
}

export async function getUsageAnalytics() {
  const completed = await Reservation.find({ status: "completed" }).lean();
  const durations = completed
    .map((reservation) => {
      if (!reservation.startTime || !reservation.endTime) return 0;
      return (reservation.endTime.getTime() - reservation.startTime.getTime()) / 1000 / 60;
    })
    .filter((minutes) => minutes > 0);

  const avgDurationMinutes =
    durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

  const entriesByHour: Record<number, number> = {};
  completed.forEach(({ startTime }) => {
    if (!startTime) return;
    const hour = startTime.getHours();
    entriesByHour[hour] = (entriesByHour[hour] ?? 0) + 1;
  });

  const busiestHour =
    Object.keys(entriesByHour).reduce(
      (prev, curr) => (entriesByHour[+curr] > (entriesByHour[+prev] ?? 0) ? curr : prev),
      "0"
    ) ?? "0";

  const dailyEntries = completed.reduce<Record<string, number>>((acc, reservation) => {
    if (!reservation.startTime) return acc;
    const day = reservation.startTime.toISOString().split("T")[0];
    acc[day] = (acc[day] ?? 0) + 1;
    return acc;
  }, {});

  return {
    averageDurationMinutes: avgDurationMinutes,
    busiestWindow: `${busiestHour}:00 - ${Number(busiestHour) + 1}:00`,
    dailyEntries,
  };
}

export async function getRevenueAnalytics() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);

  const transactions = await Transaction.find({ status: "success" }).lean();
  const dailyRevenueMap: Record<string, number> = {};
  let monthlyRevenue = 0;
  let paidCount = 0;
  let freeCount = 0;

  transactions.forEach((txn) => {
    const key = txn.processedAt.toISOString().split("T")[0];
    dailyRevenueMap[key] = (dailyRevenueMap[key] ?? 0) + txn.amount;
    monthlyRevenue += txn.amount;
    paidCount += txn.amount > 0 ? 1 : 0;
    freeCount += txn.amount === 0 ? 1 : 0;
  });

  const perVehicleAverage =
    transactions.length > 0
      ? formatCurrency(monthlyRevenue / transactions.length)
      : 0;

  const trend = Object.entries(dailyRevenueMap)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([date, amount]) => ({ date, amount: formatCurrency(amount) }));

  return {
    dailyRevenue: trend,
    monthlyRevenue: formatCurrency(monthlyRevenue),
    perVehicleAverage: formatCurrency(perVehicleAverage),
    chartTrend: trend,
    legend: [
      { label: "Paid", value: paidCount },
      { label: "Free", value: freeCount },
    ],
  };
}

export async function getReportSummary(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const reservations = await Reservation.find({
    reservedAt: { $gte: since },
    status: { $in: ["completed", "active", "pending"] },
  })
    .populate("zone")
    .lean();

  const aggregated = reservations.map((reservation) => ({
    zoneName: (reservation.zone as { name?: string })?.name ?? "Unknown",
    driver: reservation.driverName,
    vehicle: reservation.vehiclePlate,
    status: reservation.status,
    totalAmount: reservation.totalAmount ?? 0,
  }));

  const totalRevenue = aggregated.reduce((sum, item) => sum + item.totalAmount, 0);

  return {
    days,
    totalReservations: aggregated.length,
    totalRevenue: formatCurrency(totalRevenue),
    items: aggregated.slice(0, 10),
  };
}
