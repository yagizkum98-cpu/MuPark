import { Camera, Radio, ShieldCheck } from "lucide-react";

interface ZoneLiveStreamPanelProps {
  zoneName: string;
  zoneSlug: string;
  streamUrl?: string | null;
}

export default function ZoneLiveStreamPanel({
  zoneName,
  zoneSlug,
  streamUrl,
}: ZoneLiveStreamPanelProps) {
  const hasLiveStream = Boolean(streamUrl);

  return (
    <section className="rounded-3xl border border-card-border bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3rem] text-muted">Live Camera</p>
          <h2 className="text-xl font-semibold text-text">24/7 Parking Broadcast</h2>
          <p className="text-sm text-muted">{zoneName} zone live visibility area</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Radio className="h-3.5 w-3.5" />
          Always-on ready
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-card-border bg-background">
        {hasLiveStream ? (
          <iframe
            title={`${zoneName} live stream`}
            src={streamUrl ?? undefined}
            className="aspect-video w-full"
            allow="autoplay; fullscreen; picture-in-picture"
          />
        ) : (
          <div className="aspect-video w-full bg-slate-950/95 p-6 text-white">
            <div className="flex h-full flex-col justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <Camera className="h-4 w-4" />
                Camera not connected yet
              </div>
              <div>
                <p className="text-2xl font-semibold">Live feed placeholder is ready</p>
                <p className="mt-2 max-w-2xl text-sm text-slate-300">
                  As soon as the camera is installed for this zone, this area can stream the
                  parking lot 24/7 without any UI changes.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-3 py-1">
                  Zone: {zoneSlug}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-3 py-1">
                  Stream source: pending
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-3 py-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Monitoring enabled
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
