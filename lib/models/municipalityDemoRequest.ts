import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export type MunicipalityDemoRequestStatus = "proposal-requested" | "pricing-reviewed" | "demo-granted";
export type MunicipalityPricingPlan = "pilot" | "operations" | "enterprise";

export interface MunicipalityDemoRequestDocument extends mongoose.Document {
  municipalityName: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  parkingSpaces: number;
  goals: string;
  status: MunicipalityDemoRequestStatus;
  pricingPlan?: MunicipalityPricingPlan;
  createdAt: Date;
  updatedAt: Date;
}

const municipalityDemoRequestSchema = new Schema<MunicipalityDemoRequestDocument>(
  {
    municipalityName: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    parkingSpaces: { type: Number, required: true, min: 1 },
    goals: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["proposal-requested", "pricing-reviewed", "demo-granted"],
      default: "proposal-requested",
    },
    pricingPlan: {
      type: String,
      enum: ["pilot", "operations", "enterprise"],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const MunicipalityDemoRequest =
  models.MunicipalityDemoRequest ||
  model<MunicipalityDemoRequestDocument>("MunicipalityDemoRequest", municipalityDemoRequestSchema);
