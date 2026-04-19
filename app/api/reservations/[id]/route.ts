import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/db/mongoose";
import { updateReservationStatus } from "@/lib/services/reservation";

const actionSchema = z.object({
  action: z.enum(["approve", "start", "end", "cancel"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDb();
  try {
    const { action } = actionSchema.parse(await req.json());
    const { id } = await params;
    const reservation = await updateReservationStatus(id, action);
    return NextResponse.json(reservation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update" },
      { status: 500 }
    );
  }
}
