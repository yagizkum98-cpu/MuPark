import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export type NewsCategory = "announcement" | "news" | "event";

export interface FethiyeNewsDocument extends mongoose.Document {
  title: string;
  category: NewsCategory;
  publishedAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const fethiyeNewsSchema = new Schema<FethiyeNewsDocument>(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["announcement", "news", "event"],
      default: "news",
    },
    publishedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const FethiyeNews =
  models.FethiyeNews || model<FethiyeNewsDocument>("FethiyeNews", fethiyeNewsSchema);
