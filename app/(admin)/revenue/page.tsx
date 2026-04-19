import { connectDb } from "@/lib/db/mongoose";
import { getRevenueAnalytics } from "@/lib/services/analytics";
import AdminRevenueExperience from "@/components/admin/AdminRevenueExperience";

export default async function RevenuePage() {
  await connectDb();
  const revenue = await getRevenueAnalytics();

  return <AdminRevenueExperience revenue={revenue} />;
}
