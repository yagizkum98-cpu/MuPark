import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-text">
      <header className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-card-border bg-white shadow-sm">
        <div>
          <p className="text-xs uppercase tracking-[0.4rem] text-muted">Driver app</p>
          <p className="text-xl font-semibold text-text">MU PARK</p>
        </div>
        <nav className="flex gap-4 text-sm font-semibold">
          <Link href="/" className="text-primary hover:underline">
            Overview
          </Link>
          <Link href="/admin/dashboard" className="text-muted hover:text-primary">
            Admin
          </Link>
        </nav>
      </header>
      <main className="px-6 py-6">{children}</main>
    </div>
  );
}
