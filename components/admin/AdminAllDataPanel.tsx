import { connectDb } from "@/lib/db/mongoose";
import { Zone } from "@/lib/models/zone";
import { Reservation } from "@/lib/models/reservation";
import { Transaction } from "@/lib/models/transaction";
import { LiveSpot } from "@/lib/models/liveSpot";
import { FethiyeEvent } from "@/lib/models/fethiyeEvent";
import { FethiyeMessage } from "@/lib/models/fethiyeMessage";
import { FethiyeNews } from "@/lib/models/fethiyeNews";
import { FethiyeServiceRequest } from "@/lib/models/fethiyeServiceRequest";
import AdminControlCenter from "@/components/admin/AdminControlCenter";

function toDateString(value?: string | Date | null) {
  if (!value) return null;
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export default async function AdminAllDataPanel() {
  await connectDb();

  const [zones, reservations, transactions, liveSpots, events, messages, news, serviceRequests] =
    await Promise.all([
      Zone.find().sort({ createdAt: -1 }).lean(),
      Reservation.find().populate("zone", "name slug block hourlyRate").sort({ createdAt: -1 }).lean(),
      Transaction.find().populate("reservation", "code driverName vehiclePlate").sort({ createdAt: -1 }).lean(),
      LiveSpot.find().populate("zone", "name slug").sort({ createdAt: -1 }).lean(),
      FethiyeEvent.find().sort({ createdAt: -1 }).lean(),
      FethiyeMessage.find().sort({ createdAt: -1 }).lean(),
      FethiyeNews.find().sort({ createdAt: -1 }).lean(),
      FethiyeServiceRequest.find().sort({ createdAt: -1 }).lean(),
    ]);

  return (
    <AdminControlCenter
      data={{
        zones: zones.map((item: any) => ({
          id: item._id.toString(),
          name: item.name,
          slug: item.slug,
          block: item.block,
          address: item.address,
          capacity: item.capacity,
          hourlyRate: item.hourlyRate,
          status: item.status,
          color: item.color ?? null,
          noShowPenalty: item.noShowPenalty ?? 0,
          createdAt: toDateString(item.createdAt),
        })),
        reservations: reservations.map((item: any) => ({
          id: item._id.toString(),
          code: item.code,
          driverName: item.driverName,
          driverEmail: item.driverEmail,
          vehiclePlate: item.vehiclePlate,
          vehicleType: item.vehicleType,
          status: item.status,
          paymentStatus: item.paymentStatus,
          qrCode: item.qrCode,
          totalAmount: item.totalAmount ?? 0,
          reservedAt: toDateString(item.reservedAt),
          startTime: toDateString(item.startTime),
          endTime: toDateString(item.endTime),
          createdAt: toDateString(item.createdAt),
          zone: item.zone
            ? {
                id: item.zone._id.toString(),
                name: item.zone.name,
                slug: item.zone.slug,
                block: item.zone.block ?? null,
                hourlyRate: item.zone.hourlyRate ?? 0,
              }
            : null,
        })),
        transactions: transactions.map((item: any) => ({
          id: item._id.toString(),
          amount: item.amount,
          method: item.method,
          status: item.status,
          notes: item.notes ?? null,
          processedAt: toDateString(item.processedAt),
          reservation: item.reservation
            ? {
                code: item.reservation.code,
                driverName: item.reservation.driverName,
                vehiclePlate: item.reservation.vehiclePlate,
              }
            : null,
        })),
        liveSpots: liveSpots.map((item: any) => ({
          id: item._id.toString(),
          spotId: item.spotId,
          label: item.label ?? null,
          status: item.status,
          lastUpdated: toDateString(item.lastUpdated),
          zone: item.zone ? { name: item.zone.name, slug: item.zone.slug } : null,
        })),
        serviceRequests: serviceRequests.map((item: any) => ({
          id: item._id.toString(),
          fullName: item.fullName,
          neighborhood: item.neighborhood,
          type: item.type,
          status: item.status,
          createdAt: toDateString(item.createdAt),
        })),
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
        messages: messages.map((item: any) => ({
          id: item._id.toString(),
          fullName: item.fullName,
          phone: item.phone ?? null,
          email: item.email ?? null,
          message: item.message,
          createdAt: toDateString(item.createdAt),
        })),
      }}
    />
  );
}
