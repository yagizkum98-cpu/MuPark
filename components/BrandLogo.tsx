import { cn } from "@/lib/utils";

type BrandLogoProps = {
  compact?: boolean;
  className?: string;
};

export default function BrandLogo({ compact = false, className }: BrandLogoProps) {
  return (
    <div
      className={cn(
        "relative inline-flex flex-col items-center justify-center",
        compact ? "h-12 w-[150px]" : "h-24 w-[280px]",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute rounded-full border border-cyan-300/55",
          compact ? "bottom-1 h-6 w-[136px]" : "bottom-2 h-11 w-[252px]"
        )}
        style={{ boxShadow: "0 0 18px rgba(103,232,249,0.55), inset 0 0 12px rgba(45,212,191,0.18)" }}
      />
      <div
        className={cn(
          "pointer-events-none absolute rounded-full border border-cyan-200/30",
          compact ? "bottom-0.5 h-7 w-[146px]" : "bottom-1 h-12 w-[268px]"
        )}
        style={{ boxShadow: "0 0 22px rgba(34,211,238,0.2)" }}
      />
      <div
        className={cn(
          "pointer-events-none absolute rounded-full bg-cyan-300/90 blur-sm",
          compact ? "bottom-[13px] left-[12px] h-1.5 w-1.5" : "bottom-[26px] left-[22px] h-2.5 w-2.5"
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute rounded-full bg-emerald-300/80 blur-sm",
          compact ? "bottom-[11px] right-[14px] h-1.5 w-1.5" : "bottom-[24px] right-[24px] h-2.5 w-2.5"
        )}
      />
      <span
        className={cn(
          "relative z-10 font-black uppercase tracking-tight leading-none",
          compact ? "text-[1.85rem] leading-none" : "text-[3.8rem] leading-none"
        )}
      >
        <span className="bg-gradient-to-r from-emerald-200 via-cyan-200 to-sky-300 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(34,211,238,0.24)]">
          MU
        </span>{" "}
        <span className="bg-gradient-to-r from-slate-100 via-slate-300 to-slate-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(148,163,184,0.18)]">
          PARK+
        </span>
      </span>
    </div>
  );
}
