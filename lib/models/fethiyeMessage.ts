import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface FethiyeMessageDocument extends mongoose.Document {
  fullName: string;
  phone?: string;
  email?: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const fethiyeMessageSchema = new Schema<FethiyeMessageDocument>(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

export const FethiyeMessage =
  models.FethiyeMessage || model<FethiyeMessageDocument>("FethiyeMessage", fethiyeMessageSchema);
