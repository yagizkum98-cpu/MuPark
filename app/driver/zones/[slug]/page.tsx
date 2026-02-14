import { notFound } from "next/navigation";
import { connectDb } from "@/lib/db/mongoose";
import { getZoneBySlug } from "@/lib/services/zone";
import ReservationPanel from "./ReservationPanel";
import ZoneLiveStreamPanel from "@/components/ZoneLiveStreamPanel";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ZoneDetailPage({ params }: PageProps) {
  await connectDb();
  const { slug } = await params;
  const zone = await getZoneBySlug(slug);
  if (!zone) {
    notFound();
  }
  const streamBaseUrl = process.env.NEXT_PUBLIC_ZONE_STREAM_BASE_URL?.trim();
  const streamUrl = streamBaseUrl
    ? `${streamBaseUrl.replace(/\/$/, "")}/${zone.slug}`
    : null;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-card-border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4rem] text-muted">Zone</p>
            <h1 className="text-2xl font-semibold text-text">{zone.name}</h1>
            <p className="text-sm text-muted">{zone.address}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted">Block {zone.block}</p>
            <p className="text-3xl font-bold">{zone.availableSpots} spots free</p>
            <p className="text-xs text-muted">{zone.occupancyRate}% occupied</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-background p-4 text-center">
            <p className="text-xs text-muted uppercase tracking-[0.3rem]">Capacity</p>
            <p className="text-2xl font-semibold">{zone.capacity}</p>
          </div>
          <div className="rounded-2xl bg-background p-4 text-center">
            <p className="text-xs text-muted uppercase tracking-[0.3rem]">Hourly rate</p>
            <p className="text-2xl font-semibold">${zone.hourlyRate}</p>
          </div>
          <div className="rounded-2xl bg-background p-4 text-center">
            <p className="text-xs text-muted uppercase tracking-[0.3rem]">Status</p>
            <p className="text-2xl font-semibold">{zone.status}</p>
          </div>
        </div>
      </section>
      <ZoneLiveStreamPanel zoneName={zone.name} zoneSlug={zone.slug} streamUrl={streamUrl} />
      <ReservationPanel zoneId={zone.id} hourlyRate={zone.hourlyRate} />
    </div>
  );
}
