import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function isAdminHostname(hostname: string) {
  return hostname === "admin.localhost" || hostname.startsWith("admin.");
}

function isBypassPath(pathname: string) {
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/api")) return true;
  if (pathname === "/favicon.ico") return true;
  return /\.[a-zA-Z0-9]+$/.test(pathname);
}

export function middleware(request: NextRequest) {
  const hostHeader = request.headers.get("host") ?? "";
  const hostname = hostHeader.split(":")[0].toLowerCase();

  if (!isAdminHostname(hostname)) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (isBypassPath(pathname) || pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = pathname === "/" ? "/admin/panel" : `/admin${pathname}`;
  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: ["/:path*"],
};

