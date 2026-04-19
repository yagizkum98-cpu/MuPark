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
    status: { $in: ["pending", "approved", "active"] },
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
  const transactions = await Transaction.find({ status: "success" }).lean();
  const dailyRevenueMap: Record<string, number> = {};
  let monthlyRevenue = 0;
  let paidCount = 0;
  let freeCount = 0;

  transactions.forEach((txn) => {
    const processedAt = txn.processedAt ?? txn.createdAt;
    const key =
      processedAt instanceof Date && !Number.isNaN(processedAt.getTime())
        ? processedAt.toISOString().split("T")[0]
        : null;

    if (key) {
      dailyRevenueMap[key] = (dailyRevenueMap[key] ?? 0) + txn.amount;
    }
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
  })
    .populate("zone")
    .lean();

  const transactions = await Transaction.find({
    createdAt: { $gte: since },
  }).lean();

  const items = reservations
    .map((reservation) => ({
      zoneName: (reservation.zone as { name?: string })?.name ?? "Unknown",
      driver: reservation.driverName,
      driverEmail: reservation.driverEmail,
      vehicle: reservation.vehiclePlate,
      vehicleType: reservation.vehicleType,
      status: reservation.status,
      paymentStatus: reservation.paymentStatus,
      totalAmount: reservation.totalAmount ?? 0,
      reservedAt: reservation.reservedAt,
      startTime: reservation.startTime ?? null,
      endTime: reservation.endTime ?? null,
    }))
    .sort((a, b) => new Date(b.reservedAt).getTime() - new Date(a.reservedAt).getTime());

  const totalRevenue = items.reduce((sum, item) => sum + item.totalAmount, 0);
  const completedCount = items.filter((item) => item.status === "completed").length;
  const activeCount = items.filter((item) => ["active", "approved", "pending"].includes(item.status)).length;
  const cancelledCount = items.filter((item) => item.status === "cancelled").length;
  const uniqueDrivers = new Set(items.map((item) => item.driverEmail)).size;
  const averageTicket = items.length ? formatCurrency(totalRevenue / items.length) : 0;

  const statusBreakdown = Object.entries(
    items.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] ?? 0) + 1;
      return acc;
    }, {})
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  const paymentBreakdown = Object.entries(
    items.reduce<Record<string, number>>((acc, item) => {
      acc[item.paymentStatus] = (acc[item.paymentStatus] ?? 0) + 1;
      return acc;
    }, {})
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  const vehicleBreakdown = Object.entries(
    items.reduce<Record<string, number>>((acc, item) => {
      acc[item.vehicleType] = (acc[item.vehicleType] ?? 0) + 1;
      return acc;
    }, {})
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  const zonePerformance = Object.values(
    items.reduce<
      Record<
        string,
        {
          zoneName: string;
          reservations: number;
          revenue: number;
          completed: number;
          active: number;
        }
      >
    >((acc, item) => {
      const key = item.zoneName;
      if (!acc[key]) {
        acc[key] = {
          zoneName: item.zoneName,
          reservations: 0,
          revenue: 0,
          completed: 0,
          active: 0,
        };
      }

      acc[key].reservations += 1;
      acc[key].revenue += item.totalAmount;
      if (item.status === "completed") acc[key].completed += 1;
      if (["active", "approved", "pending"].includes(item.status)) acc[key].active += 1;
      return acc;
    }, {})
  )
    .map((zone) => ({
      ...zone,
      revenue: formatCurrency(zone.revenue),
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const dailyTrend = Object.entries(
    items.reduce<Record<string, { reservations: number; revenue: number }>>((acc, item) => {
      const key = new Date(item.reservedAt).toISOString().split("T")[0];
      if (!acc[key]) {
        acc[key] = { reservations: 0, revenue: 0 };
      }
      acc[key].reservations += 1;
      acc[key].revenue += item.totalAmount;
      return acc;
    }, {})
  )
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([date, data]) => ({
      date,
      reservations: data.reservations,
      revenue: formatCurrency(data.revenue),
    }));

  const hourlyLoad = Array.from({ length: 24 }, (_, hour) => {
    const value = items.filter((item) => new Date(item.reservedAt).getHours() === hour).length;
    return {
      hour: `${hour.toString().padStart(2, "0")}:00`,
      value,
    };
  });

  const successfulTransactions = transactions.filter((txn) => txn.status === "success").length;
  const paymentSuccessRate = transactions.length
    ? Math.round((successfulTransactions / transactions.length) * 100)
    : 0;

  return {
    days,
    totalReservations: items.length,
    totalRevenue: formatCurrency(totalRevenue),
    averageTicket,
    completedCount,
    activeCount,
    cancelledCount,
    uniqueDrivers,
    paymentSuccessRate,
    statusBreakdown,
    paymentBreakdown,
    vehicleBreakdown,
    zonePerformance,
    dailyTrend,
    hourlyLoad,
    items: items.slice(0, 18),
  };
}
