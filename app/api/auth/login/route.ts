import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateCredentials, signToken } from "@/lib/services/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const { email, password } = loginSchema.parse(await req.json());
    const user = validateCredentials(email, password);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const token = signToken(user);
    const response = NextResponse.json({ token, user });
    response.cookies.set("mupark-token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8,
    });
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to sign in" }, { status: 500 });
  }
}
