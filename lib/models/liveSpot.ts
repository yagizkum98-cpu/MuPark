import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
import type { ZoneDocument } from "./zone.ts";

export type SpotStatus = "available" | "occupied" | "reserved";

export interface LiveSpotDocument extends mongoose.Document {
  spotId: string;
  zone: mongoose.Types.ObjectId | ZoneDocument;
  status: SpotStatus;
  label?: string;
  lastUpdated: Date;
}

const liveSpotSchema = new Schema<LiveSpotDocument>(
  {
    spotId: { type: String, required: true },
    zone: { type: Schema.Types.ObjectId, ref: "Zone", required: true },
    status: {
      type: String,
      enum: ["available", "occupied", "reserved"],
      default: "available",
    },
    label: { type: String },
    lastUpdated: { type: Date, default: () => new Date() },
  },
  {
    timestamps: true,
  }
);

liveSpotSchema.index({ zone: 1, spotId: 1 }, { unique: true });

export const LiveSpot =
  models.LiveSpot || model<LiveSpotDocument>("LiveSpot", liveSpotSchema);
