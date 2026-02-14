import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/db/mongoose";
import { FethiyeEvent } from "@/lib/models/fethiyeEvent";

const createEventSchema = z.object({
  title: z.string().min(3),
  location: z.string().min(2),
  startsAt: z.coerce.date(),
  category: z.enum(["culture", "sports", "youth", "environment"]).optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  await connectDb();
  const now = new Date();
  const events = await FethiyeEvent.find({
    isActive: true,
    startsAt: { $gte: now },
  })
    .sort({ startsAt: 1 })
    .limit(12)
    .lean();

  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  await connectDb();
  try {
    const payload = createEventSchema.parse(await req.json());
    const created = await FethiyeEvent.create({
      title: payload.title,
      location: payload.location,
      startsAt: payload.startsAt,
      category: payload.category ?? "culture",
      isActive: payload.isActive ?? true,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Could not create event" },
      { status: 500 }
    );
  }
}
