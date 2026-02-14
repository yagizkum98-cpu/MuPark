import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface FethiyeEventDocument extends mongoose.Document {
  title: string;
  location: string;
  startsAt: Date;
  category: "culture" | "sports" | "youth" | "environment";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const fethiyeEventSchema = new Schema<FethiyeEventDocument>(
  {
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    startsAt: { type: Date, required: true },
    category: {
      type: String,
      enum: ["culture", "sports", "youth", "environment"],
      default: "culture",
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const FethiyeEvent =
  models.FethiyeEvent || model<FethiyeEventDocument>("FethiyeEvent", fethiyeEventSchema);
