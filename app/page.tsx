"use client"
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EntryGamification from "@/components/EntryGamification";
import CorporateHub from "@/components/CorporateHub";
import LiveDemo from "@/components/LiveDemo";
import Footer from "@/components/Footer";
import AccountForm from "@/components/AccountForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground relative selection:bg-cyan-500/30">
      <Navbar />
      <EntryGamification />
      <Hero />
      <CorporateHub />
      <LiveDemo />
      <AccountForm />
      <Footer />
    </main>
  );
}
