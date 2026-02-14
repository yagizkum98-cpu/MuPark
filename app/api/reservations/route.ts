import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/db/mongoose";
import { reserveSpot } from "@/lib/services/reservation";
import { Reservation } from "@/lib/models/reservation";

const reservationSchema = z.object({
  zoneId: z.string().min(1),
  driverName: z.string().min(1),
  driverEmail: z.string().email(),
  vehiclePlate: z.string().min(1),
  vehicleType: z.string().min(1),
});

export async function GET(req: NextRequest) {
  await connectDb();
  const status = req.nextUrl.searchParams.get("status");
  const query: Record<string, unknown> = {};
  if (status) {
    query.status = status;
  }
  const list = await Reservation.find(query)
    .sort({ reservedAt: -1 })
    .limit(50)
    .lean();
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  await connectDb();
  try {
    const payload = reservationSchema.parse(await req.json());
    const reservation = await reserveSpot(payload);
    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}
