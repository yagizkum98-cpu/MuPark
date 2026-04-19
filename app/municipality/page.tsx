import { cookies } from "next/headers";
import { connectDb } from "@/lib/db/mongoose";
import { FethiyeEvent } from "@/lib/models/fethiyeEvent";
import { FethiyeMessage } from "@/lib/models/fethiyeMessage";
import { FethiyeNews } from "@/lib/models/fethiyeNews";
import { FethiyeServiceRequest } from "@/lib/models/fethiyeServiceRequest";
import MunicipalityControlCenter from "@/components/municipality/MunicipalityControlCenter";
import { getDashboardMetrics, getRevenueAnalytics, getUsageAnalytics } from "@/lib/services/analytics";
import { getZonesWithStats } from "@/lib/services/zone";
import {
  MUNICIPALITY_ACCESS_COOKIE,
  verifyMunicipalityAccessToken,
} from "@/lib/services/municipalityAccess";

function toDateString(value?: string | Date | null) {
  if (!value) return null;
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export default async function MunicipalityDashboard() {
  const cookieStore = await cookies();
  const access = verifyMunicipalityAccessToken(cookieStore.get(MUNICIPALITY_ACCESS_COOKIE)?.value);

  if (!access) {
    return <MunicipalityControlCenter accessGranted={false} />;
  }

  await connectDb();

  const [metrics, usage, revenue, zones, requests, messages, news, events, requestCount, messageCount] =
    await Promise.all([
      getDashboardMetrics(),
      getUsageAnalytics(),
      getRevenueAnalytics(),
      getZonesWithStats(),
      FethiyeServiceRequest.find({}).sort({ createdAt: -1 }).limit(8).lean(),
      FethiyeMessage.find({}).sort({ createdAt: -1 }).limit(8).lean(),
      FethiyeNews.find({}).sort({ publishedAt: -1 }).limit(8).lean(),
      FethiyeEvent.find({}).sort({ startsAt: 1 }).limit(8).lean(),
      FethiyeServiceRequest.countDocuments({}),
      FethiyeMessage.countDocuments({}),
    ]);

  return (
    <MunicipalityControlCenter
      accessGranted
      data={{
        metrics,
        usage,
        revenue,
        zones,
        citizen: {
          requestCount,
          messageCount,
          requests: requests.map((item: any) => ({
            id: item._id.toString(),
            fullName: item.fullName,
            neighborhood: item.neighborhood,
            type: item.type,
            description: item.description,
            status: item.status,
            createdAt: toDateString(item.createdAt),
          })),
          messages: messages.map((item: any) => ({
            id: item._id.toString(),
            fullName: item.fullName,
            phone: item.phone ?? null,
            email: item.email ?? null,
            message: item.message,
            createdAt: toDateString(item.createdAt),
          })),
        },
        content: {
          news: news.map((item: any) => ({
            id: item._id.toString(),
            title: item.title,
            category: item.category,
            isActive: item.isActive,
            publishedAt: toDateString(item.publishedAt),
          })),
          events: events.map((item: any) => ({
            id: item._id.toString(),
            title: item.title,
            location: item.location,
            category: item.category,
            isActive: item.isActive,
            startsAt: toDateString(item.startsAt),
          })),
        },
      }}
    />
  );
}
