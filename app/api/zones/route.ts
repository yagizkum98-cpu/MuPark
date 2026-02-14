import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/db/mongoose";
import { Zone } from "@/lib/models/zone";
import { getZonesWithStats } from "@/lib/services/zone";

const createZoneSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  block: z.string().min(1),
  address: z.string().min(1),
  capacity: z.number().min(1),
  hourlyRate: z.number().min(0),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  mapPosition: z.object({
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
  }),
  status: z.enum(["open", "maintenance", "full"]).optional(),
});

export async function GET() {
  await connectDb();
  const zones = await getZonesWithStats();
  return NextResponse.json(zones);
}

export async function POST(req: NextRequest) {
  await connectDb();
  try {
    const payload = createZoneSchema.parse(await req.json());
    const existing = await Zone.findOne({ slug: payload.slug });
    if (existing) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }
    const created = await Zone.create({
      ...payload,
      status: payload.status ?? "open",
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Could not create zone" },
      { status: 500 }
    );
  }
}
