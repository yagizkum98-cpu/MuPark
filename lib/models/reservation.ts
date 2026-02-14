import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export type ReservationStatus = "pending" | "active" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed";

export interface ReservationDocument extends mongoose.Document {
  zone: mongoose.Types.ObjectId;
  driverName: string;
  driverEmail: string;
  vehiclePlate: string;
  vehicleType: string;
  reservedAt: Date;
  startTime?: Date;
  endTime?: Date;
  totalAmount?: number;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  qrCode: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

const reservationSchema = new Schema<ReservationDocument>(
  {
    zone: { type: Schema.Types.ObjectId, ref: "Zone", required: true },
    driverName: { type: String, required: true },
    driverEmail: { type: String, required: true },
    vehiclePlate: { type: String, required: true },
    vehicleType: { type: String, required: true },
    reservedAt: { type: Date, default: () => new Date() },
    startTime: { type: Date },
    endTime: { type: Date },
    totalAmount: { type: Number },
    status: {
      type: String,
      enum: ["pending", "active", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    qrCode: { type: String, required: true },
    code: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

reservationSchema.index({ code: 1 });

export const Reservation =
  models.Reservation || model<ReservationDocument>("Reservation", reservationSchema);
