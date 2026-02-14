import { Github, Twitter, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="py-12 border-t border-white/10 bg-black/50 backdrop-blur-lg">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <span className="text-lg font-bold text-white">MUPark</span>

                    <div className="text-muted text-sm text-center md:text-right">
                        <p>&copy; {new Date().getFullYear()} MUPark. Tum haklari saklidir.</p>
                        <div className="flex items-center justify-center md:justify-end gap-4 mt-4">
                            <a href="#" className="hover:text-cyan-400 transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-cyan-400 transition-colors"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-cyan-400 transition-colors"><Github className="w-5 h-5" /></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
