"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const defaultAdminEmail = process.env.NEXT_PUBLIC_MUPARK_ADMIN_EMAIL ?? "admin@mupark.local";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(defaultAdminEmail);
  const [password, setPassword] = useState("AdminPass123!");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload.error || "Unable to sign in");
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white border border-card-border rounded-3xl shadow-card p-8 space-y-6">
      <h1 className="text-2xl font-semibold text-text">Admin sign in</h1>
      <p className="text-sm text-muted">
        Default credentials are shown for pilots. Update env variables to customize.
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-semibold">
          Email
          <input
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            type="email"
            className="mt-2 w-full border border-card-border rounded-2xl px-4 py-3 text-sm"
          />
        </label>
        <label className="block text-sm font-semibold">
          Password
          <input
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            type="password"
            className="mt-2 w-full border border-card-border rounded-2xl px-4 py-3 text-sm"
          />
        </label>
        {error && <p className="text-xs text-danger">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-primary text-white font-semibold px-4 py-3 hover:bg-primary/90 transition"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
