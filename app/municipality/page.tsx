"use client";

import { useEffect, useState } from "react";

export default function MunicipalityDashboard() {
    const [occupancy, setOccupancy] = useState(68);
    const [revenue, setRevenue] = useState(94200);
    const [active, setActive] = useState(312);

    useEffect(() => {
        const interval = setInterval(() => {
            setOccupancy(Math.floor(55 + Math.random() * 30));
            setRevenue(70000 + Math.floor(Math.random() * 40000));
            setActive(250 + Math.floor(Math.random() * 120));
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen font-sans bg-slate-50 text-slate-900 selection:bg-blue-100">
            {/* Header */}
            <header className="bg-gradient-to-br from-blue-800 to-green-600 text-white px-10 py-6 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold tracking-tight">MU PARK – Belediye Yönetim Paneli</h1>
                    <p className="mt-1.5 opacity-90 text-blue-50 font-medium">Fethiye Pilot | Canlı Demo (Simülasyon)</p>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-10">
                {/* KPI Cards */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    <div className="bg-white rounded-[18px] p-6 shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-slate-100 hover:shadow-xl transition-shadow">
                        <span className="text-slate-500 text-sm font-medium">Toplam Park Alanı</span>
                        <b className="block text-4xl mt-1.5 text-blue-800 tracking-tight">1.250</b>
                    </div>
                    <div className="bg-white rounded-[18px] p-6 shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-slate-100 hover:shadow-xl transition-shadow">
                        <span className="text-slate-500 text-sm font-medium">Doluluk Oranı</span>
                        <b className="block text-4xl mt-1.5 text-blue-800 tracking-tight">%{occupancy}</b>
                    </div>
                    <div className="bg-white rounded-[18px] p-6 shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-slate-100 hover:shadow-xl transition-shadow">
                        <span className="text-slate-500 text-sm font-medium">Günlük Gelir</span>
                        <b className="block text-4xl mt-1.5 text-blue-800 tracking-tight">₺{revenue.toLocaleString("tr-TR")}</b>
                    </div>
                    <div className="bg-white rounded-[18px] p-6 shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-slate-100 hover:shadow-xl transition-shadow">
                        <span className="text-slate-500 text-sm font-medium">Aktif Rezervasyon</span>
                        <b className="block text-4xl mt-1.5 text-blue-800 tracking-tight">{active}</b>
                    </div>
                </section>

                {/* Status Table */}
                <section className="bg-white rounded-[18px] p-8 shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-slate-100">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                        <span>📍</span> Bölge Bazlı Park Durumu
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="py-4 px-4 text-slate-500 text-sm font-semibold uppercase tracking-wider">Bölge</th>
                                    <th className="py-4 px-4 text-slate-500 text-sm font-semibold uppercase tracking-wider">Toplam Alan</th>
                                    <th className="py-4 px-4 text-slate-500 text-sm font-semibold uppercase tracking-wider">Dolu</th>
                                    <th className="py-4 px-4 text-slate-500 text-sm font-semibold uppercase tracking-wider">Doluluk</th>
                                    <th className="py-4 px-4 text-slate-500 text-sm font-semibold uppercase tracking-wider">Durum</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-4 font-medium text-slate-700">Merkez Çarşı</td>
                                    <td className="py-4 px-4 text-slate-600">300</td>
                                    <td className="py-4 px-4 text-slate-600">255</td>
                                    <td className="py-4 px-4 text-slate-600">%85</td>
                                    <td className="py-4 px-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">
                                            Yoğun
                                        </span>
                                    </td>
                                </tr>
                                <tr className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-4 font-medium text-slate-700">Sahil Yolu</td>
                                    <td className="py-4 px-4 text-slate-600">420</td>
                                    <td className="py-4 px-4 text-slate-600">260</td>
                                    <td className="py-4 px-4 text-slate-600">%62</td>
                                    <td className="py-4 px-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-100">
                                            Orta
                                        </span>
                                    </td>
                                </tr>
                                <tr className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-4 font-medium text-slate-700">Otogar Bölgesi</td>
                                    <td className="py-4 px-4 text-slate-600">280</td>
                                    <td className="py-4 px-4 text-slate-600">140</td>
                                    <td className="py-4 px-4 text-slate-600">%50</td>
                                    <td className="py-4 px-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                                            Uygun
                                        </span>
                                    </td>
                                </tr>
                                <tr className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-4 font-medium text-slate-700">Hastane Çevresi</td>
                                    <td className="py-4 px-4 text-slate-600">250</td>
                                    <td className="py-4 px-4 text-slate-600">190</td>
                                    <td className="py-4 px-4 text-slate-600">%76</td>
                                    <td className="py-4 px-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-100">
                                            Orta
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Footer */}
                <footer className="mt-12 text-center text-slate-500 text-sm">
                    <p className="font-semibold">MU PARK · Smart Parking for Smart Cities</p>
                    <p className="mt-1 opacity-75">Demo panel – gerçek zamanlı sistem simülasyonu</p>
                </footer>
            </div>
        </div>
    );
}
