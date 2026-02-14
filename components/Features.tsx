"use client";

import { motion } from "framer-motion";
import { Brain, Smartphone, CreditCard, LayoutGrid, Map, Zap } from "lucide-react";

const features = [
    {
        icon: Brain,
        title: "Yapay Zeka Destekli Takip",
        description: "Tek bir kamera ile geniş alanlardaki doluluk oranını %99 doğrulukla analiz eder."
    },
    {
        icon: Smartphone,
        title: "Mobil Uygulama Entegrasyonu",
        description: "Sürücüler boş park yerlerini cebinden görür, anında rezervasyon yapar."
    },
    {
        icon: CreditCard,
        title: "Kolay Ödeme & Check-in",
        description: "QR kod ile giriş-çıkış yapılır, ödemeler uygulama üzerinden otomatik tahsil edilir."
    },
    {
        icon: LayoutGrid,
        title: "Anlık Doluluk Paneli",
        description: "Yöneticiler için detaylı dashboard ile tüm park hareketlerini izleyin."
    },
    {
        icon: Map,
        title: "Navigasyon Desteği",
        description: "Google Maps entegrasyonu ile boş park yerine en kısa rotadan ulaşın."
    },
    {
        icon: Zap,
        title: "Elektronik Duba Yönetimi",
        description: "Rezerve edilen alanlar için dubalar otomatik kontrol edilir, yetkisiz parkı önler."
    }
];

export default function Features() {
    return (
        <section id="features" className="py-24 relative bg-black/40">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Akıllı Otoparkın <span className="text-cyan-400">Güçlü Özellikleri</span>
                    </h2>
                    <p className="text-muted text-lg">
                        Geleneksel otopark sorunlarını modern teknoloji ile çözüyoruz.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-cyan-500/30 hover:bg-white/10 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <feature.icon className="w-6 h-6 text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-muted leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
