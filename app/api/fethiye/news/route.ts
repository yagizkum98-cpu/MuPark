import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/db/mongoose";
import { FethiyeNews } from "@/lib/models/fethiyeNews";

const createNewsSchema = z.object({
  title: z.string().min(3),
  category: z.enum(["announcement", "news", "event"]).optional(),
  publishedAt: z.coerce.date().optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  await connectDb();
  const news = await FethiyeNews.find({ isActive: true })
    .sort({ publishedAt: -1 })
    .limit(20)
    .lean();

  return NextResponse.json(news);
}

export async function POST(req: NextRequest) {
  await connectDb();
  try {
    const payload = createNewsSchema.parse(await req.json());
    const created = await FethiyeNews.create({
      title: payload.title,
      category: payload.category ?? "news",
      publishedAt: payload.publishedAt ?? new Date(),
      isActive: payload.isActive ?? true,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Could not create news item" },
      { status: 500 }
    );
  }
}
