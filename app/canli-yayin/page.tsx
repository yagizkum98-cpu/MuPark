export default function CanliYayinPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pt-28 pb-16">
      <section className="container mx-auto px-6">
        <div className="rounded-3xl border border-cyan-300/60 bg-cyan-50 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-700">Canli Yayin</p>
          <h1 className="mt-2 text-3xl md:text-5xl font-bold text-slate-900">
            7/24 Anlik Park Takip Merkezi
          </h1>
          <p className="mt-3 max-w-3xl text-sm md:text-base text-slate-700">
            Bu ekran, sonraki asamada baglanacak kamera veya kamera gruplari ile park
            alanlarinin canli olarak izlenmesi icin hazirlandi.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 mt-8">
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-3xl border border-cyan-200 bg-white/90 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-800">Kamera 1</p>
            <div className="mt-3 aspect-video rounded-2xl border border-cyan-300 bg-cyan-50 flex items-center justify-center">
              <p className="text-sm font-semibold text-cyan-900">Baglanti bekleniyor</p>
            </div>
          </article>
          <article className="rounded-3xl border border-cyan-200 bg-white/90 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-800">Kamera 2</p>
            <div className="mt-3 aspect-video rounded-2xl border border-cyan-300 bg-cyan-50 flex items-center justify-center">
              <p className="text-sm font-semibold text-cyan-900">Baglanti bekleniyor</p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
