import { Reservation } from "@/lib/models/reservation";
import { Transaction } from "@/lib/models/transaction";

export async function capturePayment(reservationId: string, method = "mock-card") {
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) {
    throw new Error("Reservation not found");
  }

  const amount = reservation.totalAmount ?? 0;
  const transaction = await Transaction.create({
    reservation: reservation._id,
    amount,
    method,
    status: amount > 0 ? "success" : "pending",
    processedAt: new Date(),
    notes: "Simulated payment for pilot parking reservation",
  });

  reservation.paymentStatus = amount > 0 ? "paid" : "pending";
  await reservation.save();

  return transaction;
}
