import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/db/mongoose";
import { FethiyeServiceRequest } from "@/lib/models/fethiyeServiceRequest";

const createServiceRequestSchema = z.object({
  fullName: z.string().min(2),
  neighborhood: z.string().min(2),
  type: z.enum(["infrastructure", "cleaning", "traffic", "animal-care", "social-support"]),
  description: z.string().min(10).max(1500),
});

export async function GET() {
  await connectDb();
  const requests = await FethiyeServiceRequest.find({})
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return NextResponse.json(requests);
}

export async function POST(req: NextRequest) {
  await connectDb();
  try {
    const payload = createServiceRequestSchema.parse(await req.json());
    const created = await FethiyeServiceRequest.create(payload);
    return NextResponse.json(
      { id: created._id, status: created.status },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Could not create service request" },
      { status: 500 }
    );
  }
}
