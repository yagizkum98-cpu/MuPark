import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/db/mongoose";
import { capturePayment } from "@/lib/services/payment";

const paymentSchema = z.object({
  reservationId: z.string().min(1),
  method: z.string().min(1).optional(),
});

export async function POST(req: NextRequest) {
  await connectDb();
  try {
    const payload = paymentSchema.parse(await req.json());
    const transaction = await capturePayment(payload.reservationId, payload.method);
    return NextResponse.json(transaction);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not capture payment" },
      { status: 500 }
    );
  }
}
