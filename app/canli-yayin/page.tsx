export default function CanliYayinPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pt-28 pb-16">
      <section className="container mx-auto px-6">
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-red-300">Canli Yayin</p>
          <h1 className="mt-2 text-3xl md:text-5xl font-bold text-white">
            7/24 Anlik Park Takip Merkezi
          </h1>
          <p className="mt-3 max-w-3xl text-sm md:text-base text-white/80">
            Bu ekran, sonraki asamada baglanacak kamera veya kamera gruplari ile park
            alanlarinin canli olarak izlenmesi icin hazirlandi.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 mt-8">
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Kamera 1</p>
            <div className="mt-3 aspect-video rounded-2xl border border-cyan-400/30 bg-black/40 flex items-center justify-center">
              <p className="text-sm text-cyan-100">Baglanti bekleniyor</p>
            </div>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Kamera 2</p>
            <div className="mt-3 aspect-video rounded-2xl border border-cyan-400/30 bg-black/40 flex items-center justify-center">
              <p className="text-sm text-cyan-100">Baglanti bekleniyor</p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
