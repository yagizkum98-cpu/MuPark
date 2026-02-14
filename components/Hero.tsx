 "use client";

 import { motion } from "framer-motion";
 import { ArrowRight, Car, Download, ShieldCheck, Zap } from "lucide-react";
 import { useCallback } from "react";

 export default function Hero() {
    const handleDemoScroll = useCallback(() => {
        const demoSection = document.getElementById("demo");
        if (demoSection) {
            demoSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, []);

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center pt-24 overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.15),transparent_50%)] animate-pulse-glow" />
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6 hover:bg-white/10 transition-colors">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        Akıllı Şehir Teknolojisi
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                        Park Yönetiminin <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                            Geleceği Burada
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
                        Yapay zeka destekli görüntü işleme ile otopark doluluğunu anlık takip edin,
                        rezervasyon yapın ve şehir içi trafiği azaltın.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                            <Download className="w-5 h-5" />
                            Uygulamayı İndir
                        </button>
                        <button
                            onClick={handleDemoScroll}
                            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 group"
                        >
                            Demo Paneli Gör
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
                >
                    {[
                        { label: "Park Alanı", value: "20+", icon: ShieldCheck },
                        { label: "AI Doğruluk", value: "%99", icon: Zap },
                        { label: "Anlık Takip", value: "7/24", icon: Car }, // Replaced Camera with Car for now as Camera might not be imported or available in icons list I checked mentally. Wait,lucide has Camera. I'll use simple imports for now.
                        { label: "MVP Süresi", value: "6 Hafta", icon: ArrowRight },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors group cursor-default"
                        >
                            <h3 className="text-3xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                                {stat.value}
                            </h3>
                            <p className="text-sm text-gray-400">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
