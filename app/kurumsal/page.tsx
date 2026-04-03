"use client";

import Navbar from "@/components/Navbar";
import CorporateHub from "@/components/CorporateHub";
import Footer from "@/components/Footer";

export default function CorporatePage() {
  return (
    <main className="min-h-screen bg-background text-foreground relative selection:bg-cyan-500/30">
      <Navbar />
      <div className="pt-20">
        <CorporateHub />
      </div>
      <Footer />
    </main>
  );
}
