import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  response.cookies.set("mupark-token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
