import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/db/mongoose";
import { MunicipalityDemoRequest } from "@/lib/models/municipalityDemoRequest";
import {
  MUNICIPALITY_ACCESS_COOKIE,
  signMunicipalityAccessToken,
} from "@/lib/services/municipalityAccess";

const demoAccessSchema = z.object({
  requestId: z.string().min(1),
  pricingPlan: z.enum(["pilot", "operations", "enterprise"]),
});

export async function POST(req: NextRequest) {
  await connectDb();
  try {
    const payload = demoAccessSchema.parse(await req.json());
    const request = await MunicipalityDemoRequest.findById(payload.requestId);

    if (!request) {
      return NextResponse.json({ error: "Talep kaydi bulunamadi." }, { status: 404 });
    }

    request.pricingPlan = payload.pricingPlan;
    request.status = "demo-granted";
    await request.save();

    const token = signMunicipalityAccessToken({
      requestId: request._id.toString(),
      pricingPlan: payload.pricingPlan,
    });

    const response = NextResponse.json({
      success: true,
      requestId: request._id.toString(),
      pricingPlan: payload.pricingPlan,
    });

    response.cookies.set(MUNICIPALITY_ACCESS_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/municipality",
      maxAge: 60 * 60 * 6,
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: "Demo erisimi olusturulamadi." }, { status: 500 });
  }
}
