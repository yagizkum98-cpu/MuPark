import { connectDb } from "@/lib/db/mongoose";
import { getReportSummary } from "@/lib/services/analytics";
import AdminReportsExperience from "@/components/admin/AdminReportsExperience";

export default async function ReportsPage() {
  await connectDb();
  const report = await getReportSummary(30);

  return <AdminReportsExperience report={report} />;
}
