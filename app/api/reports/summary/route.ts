import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/mongoose";
import { getReportSummary } from "@/lib/services/analytics";

export async function GET(req: NextRequest) {
  await connectDb();
  const days = Number(req.nextUrl.searchParams.get("days") ?? "30");
  const summary = await getReportSummary(days);
  return NextResponse.json(summary);
}
