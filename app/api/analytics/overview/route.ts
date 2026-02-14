import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/mongoose";
import { getDashboardMetrics, getUsageAnalytics, getRevenueAnalytics } from "@/lib/services/analytics";

export async function GET() {
  await connectDb();
  const dashboard = await getDashboardMetrics();
  const usage = await getUsageAnalytics();
  const revenue = await getRevenueAnalytics();
  return NextResponse.json({ dashboard, usage, revenue });
}
