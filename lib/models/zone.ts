import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export type ZoneStatus = "open" | "maintenance" | "full";

export interface ZoneDocument extends mongoose.Document {
  name: string;
  slug: string;
  block: string;
  address: string;
  capacity: number;
  hourlyRate: number;
  status: ZoneStatus;
  color?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  mapPosition: {
    x: number;
    y: number;
  };
  noShowPenalty?: number;
  createdAt: Date;
  updatedAt: Date;
}

const zoneSchema = new Schema<ZoneDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    block: { type: String, required: true },
    address: { type: String, required: true },
    capacity: { type: Number, required: true },
    hourlyRate: { type: Number, required: true },
    status: { type: String, enum: ["open", "maintenance", "full"], default: "open" },
    color: { type: String },
    noShowPenalty: { type: Number, default: 35 },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    mapPosition: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
  },
  {
    timestamps: true,
  }
);

export const Zone = models.Zone || model<ZoneDocument>("Zone", zoneSchema);
