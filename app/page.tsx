"use client"
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import LiveDemo from "@/components/LiveDemo";
import Footer from "@/components/Footer";
import AccountForm from "@/components/AccountForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground relative selection:bg-cyan-500/30">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <LiveDemo />
      <AccountForm />
      <Footer />
    </main>
  );
}
