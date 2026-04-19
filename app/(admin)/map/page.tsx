import { connectDb } from "@/lib/db/mongoose";
import { getFethiyeZonesWithStats } from "@/lib/services/zone";
import AdminMapExperience from "@/components/admin/AdminMapExperience";

export default async function AdminMapPage() {
  await connectDb();
  const zones = await getFethiyeZonesWithStats();

  return <AdminMapExperience zones={zones} token={process.env.NEXT_PUBLIC_MAPBOX_TOKEN} />;
}
