import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/db/mongoose";
import { MunicipalityDemoRequest } from "@/lib/models/municipalityDemoRequest";

const demoRequestSchema = z.object({
  municipalityName: z.string().min(2).max(120),
  contactName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(7).max(30),
  city: z.string().min(2).max(80),
  parkingSpaces: z.number().int().min(1).max(500000),
  goals: z.string().min(10).max(1500),
});

export async function POST(req: NextRequest) {
  await connectDb();
  try {
    const payload = demoRequestSchema.parse(await req.json());
    const created = await MunicipalityDemoRequest.create(payload);

    return NextResponse.json(
      {
        id: created._id.toString(),
        status: created.status,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: "Demo talebi olusturulamadi." }, { status: 500 });
  }
}
