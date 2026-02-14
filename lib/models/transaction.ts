import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export type TransactionStatus = "pending" | "success" | "failed";

export interface TransactionDocument extends mongoose.Document {
  reservation: mongoose.Types.ObjectId;
  amount: number;
  method: string;
  status: TransactionStatus;
  processedAt: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<TransactionDocument>(
  {
    reservation: { type: Schema.Types.ObjectId, ref: "Reservation", required: true },
    amount: { type: Number, required: true },
    method: { type: String, default: "mock" },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    processedAt: { type: Date, default: () => new Date() },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Transaction =
  models.Transaction || model<TransactionDocument>("Transaction", transactionSchema);
