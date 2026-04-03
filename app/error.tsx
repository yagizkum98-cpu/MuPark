"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-md w-full rounded-2xl border border-card-border bg-white p-6 text-center">
        <h2 className="text-xl font-semibold">Bir hata olustu</h2>
        <p className="mt-2 text-sm text-muted">{error.message || "Beklenmeyen bir hata olustu."}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Tekrar dene
        </button>
      </div>
    </div>
  );
}
