import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/db/mongoose";
import { FethiyeMessage } from "@/lib/models/fethiyeMessage";

const createMessageSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(7).max(20).optional(),
  email: z.string().email().optional(),
  message: z.string().min(10).max(1000),
});

export async function POST(req: NextRequest) {
  await connectDb();
  try {
    const payload = createMessageSchema.parse(await req.json());
    const created = await FethiyeMessage.create(payload);
    return NextResponse.json(
      { id: created._id, message: "Message saved" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Could not save message" },
      { status: 500 }
    );
  }
}
