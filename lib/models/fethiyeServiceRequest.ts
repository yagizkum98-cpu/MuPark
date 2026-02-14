import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export type ServiceRequestType =
  | "infrastructure"
  | "cleaning"
  | "traffic"
  | "animal-care"
  | "social-support";

export type ServiceRequestStatus = "open" | "in-review" | "resolved";

export interface FethiyeServiceRequestDocument extends mongoose.Document {
  fullName: string;
  neighborhood: string;
  type: ServiceRequestType;
  description: string;
  status: ServiceRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

const fethiyeServiceRequestSchema = new Schema<FethiyeServiceRequestDocument>(
  {
    fullName: { type: String, required: true, trim: true },
    neighborhood: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["infrastructure", "cleaning", "traffic", "animal-care", "social-support"],
      required: true,
    },
    description: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["open", "in-review", "resolved"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

export const FethiyeServiceRequest =
  models.FethiyeServiceRequest ||
  model<FethiyeServiceRequestDocument>("FethiyeServiceRequest", fethiyeServiceRequestSchema);
