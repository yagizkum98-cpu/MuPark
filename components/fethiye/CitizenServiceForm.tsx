"use client";

import { FormEvent, useState } from "react";

type FormState = {
  fullName: string;
  neighborhood: string;
  type: "infrastructure" | "cleaning" | "traffic" | "animal-care" | "social-support";
  description: string;
};

const initialState: FormState = {
  fullName: "",
  neighborhood: "",
  type: "infrastructure",
  description: "",
};

export default function CitizenServiceForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setStatus("Kayit gonderiliyor...");

    try {
      const response = await fetch("/api/fethiye/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setStatus("Talebiniz alindi. Belediye ekibi inceleyecek.");
      setForm(initialState);
    } catch (error) {
      setStatus("Talep gonderilemedi. Lutfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900">Vatandas Hizmet Talebi</h3>
      <input
        className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
        placeholder="Ad Soyad"
        value={form.fullName}
        onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
        required
      />
      <input
        className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
        placeholder="Mahalle"
        value={form.neighborhood}
        onChange={(event) => setForm((prev) => ({ ...prev, neighborhood: event.target.value }))}
        required
      />
      <select
        className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
        value={form.type}
        onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value as FormState["type"] }))}
      >
        <option value="infrastructure">Altyapi</option>
        <option value="cleaning">Temizlik</option>
        <option value="traffic">Trafik</option>
        <option value="animal-care">Sokak Hayvanlari</option>
        <option value="social-support">Sosyal Destek</option>
      </select>
      <textarea
        className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
        placeholder="Talep aciklamasi"
        value={form.description}
        onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
        rows={4}
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {isLoading ? "Gonderiliyor" : "Talep Olustur"}
      </button>
      <p className="text-xs text-slate-600 min-h-4">{status}</p>
    </form>
  );
}
