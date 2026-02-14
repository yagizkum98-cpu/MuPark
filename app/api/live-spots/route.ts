import { NextResponse } from "next/server";
import { getLiveZoneSnapshots, setLiveSpotStatus } from "@/lib/services/liveSpot";

function jsonError(message: string, status = 500) {
  return NextResponse.json({ message }, { status });
}

type SpotAction = "reserve" | "release";

const ACTION_STATUS_MAP: Record<SpotAction, "reserved" | "available"> = {
  reserve: "reserved",
  release: "available",
};

export async function GET() {
  try {
    const zones = await getLiveZoneSnapshots();
    return NextResponse.json({ zones });
  } catch (error) {
    console.error(error);
    return jsonError("Unable to fetch live parking data");
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { spotId?: string; action?: SpotAction };
    if (!payload?.spotId) {
      return jsonError("Missing spotId", 400);
    }

    const action: SpotAction = payload.action ?? "reserve";
    const targetStatus = ACTION_STATUS_MAP[action];

    const spot = await setLiveSpotStatus(payload.spotId, targetStatus);
    const zone = spot.zone as { slug?: string } | null;

    return NextResponse.json({
      success: true,
      spotId: spot.spotId,
      zoneSlug: zone?.slug ?? null,
      status: spot.status,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error && /not found|cannot be reserved/i.test(error.message)) {
      return jsonError(error.message, 409);
    }
    return jsonError("Unable to update the selected spot");
  }
}
