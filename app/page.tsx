import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EntryGamification from "@/components/EntryGamification";
import SmartCityStoryAnimation from "@/components/SmartCityStoryAnimation";
import CorporateHub from "@/components/CorporateHub";
import LiveDemo from "@/components/LiveDemo";
import Footer from "@/components/Footer";
import AccountForm from "@/components/AccountForm";
import GoogleMapsParkingFinder from "@/components/driver/GoogleMapsParkingFinder";
import { connectDb } from "@/lib/db/mongoose";
import { buildFallbackFethiyeZoneStats, getFethiyeZonesWithStats } from "@/lib/services/zone";

export default async function Home() {
  let zones = buildFallbackFethiyeZoneStats();

  try {
    await connectDb();
    zones = await getFethiyeZonesWithStats();
  } catch (error) {
    console.warn("Homepage map is using fallback Fethiye zones.", error);
  }

  return (
    <main className="min-h-screen bg-background text-foreground relative selection:bg-cyan-500/30">
      <Navbar />
      <EntryGamification />
      <Hero />
      <SmartCityStoryAnimation />
      <section id="demo" className="relative px-6 pb-6 pt-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <GoogleMapsParkingFinder zones={zones} />
        </div>
      </section>
      <CorporateHub />
      <LiveDemo />
      <AccountForm />
      <Footer />
    </main>
  );
}
