"use client";

import { motion } from "framer-motion";
import { Search, CalendarCheck, Navigation, QrCode } from "lucide-react";

const steps = [
    {
        icon: Search,
        title: "1. Park Yeri Bul",
        description: "Uygulamadan bölgenizdeki müsait park alanlarını listeleyin."
    },
    {
        icon: CalendarCheck,
        title: "2. Rezervasyon Yap",
        description: "Size uygun yeri seçin ve saniyeler içinde rezervasyonu tamamlayın."
    },
    {
        icon: Navigation,
        title: "3. Rotanı Oluştur",
        description: "Navigasyon desteği ile zaman kaybetmeden park yerine ulaşın."
    },
    {
        icon: QrCode,
        title: "4. Park Et",
        description: "QR kodu okutarak dubayı indirin ve aracınızı güvenle park edin."
    }
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent -translate-y-1/2 hidden md:block" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Nasıl Çalışır?
                    </h2>
                    <p className="text-muted">
                        4 adımda sorunsuz park deneyimi.
                    </p>
                </div>

                <div className="grid md:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative pt-8 group"
                        >
                            {/* Connector Dot */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 md:-translate-y-1/2 w-4 h-4 rounded-full bg-black border-2 border-cyan-500 z-10 hidden md:block group-hover:bg-cyan-500 transition-colors" />

                            <div className="text-center bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all h-full">
                                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <step.icon className="w-8 h-8 text-cyan-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                                <p className="text-sm text-muted">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
