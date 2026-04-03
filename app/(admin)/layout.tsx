import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/services/auth";

const sections = [
  { label: "Tum Veriler", href: "/admin/panel" },
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "Revenue", href: "/admin/revenue" },
  { label: "Reports", href: "/admin/reports" },
  { label: "Map overlay", href: "/admin/map" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get("mupark-token")?.value;
  const user = token ? verifyToken(token) : null;

  return (
    <div className="min-h-screen bg-background text-text">
      <header className="flex justify-between items-center px-6 py-4 border-b border-card-border bg-white shadow-sm sticky top-0 z-20">
        <div>
          <p className="text-xs uppercase tracking-[0.3rem] text-muted font-semibold">
            MU PARK Admin
          </p>
          <p className="text-xl font-semibold text-text">Smart Parking Pilot</p>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-xs text-muted">
                {user.email} · {user.role}
              </span>
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="px-4 py-2 border border-primary rounded-full text-primary text-sm font-semibold hover:bg-primary/10 transition"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/admin/login"
              className="px-4 py-2 border border-primary rounded-full text-primary text-sm font-semibold hover:bg-primary/10 transition"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>
      <div className="flex min-h-[calc(100vh-72px)]">
        <nav className="w-60 hidden md:block border-r border-card-border bg-white">
          <ul className="space-y-1 mt-6 px-4">
            {sections.map((section) => (
              <li key={section.href}>
                <Link
                  href={section.href}
                  className="block rounded-2xl px-3 py-2 text-sm font-semibold text-muted hover:bg-background hover:text-text transition"
                >
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="flex-1 px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
