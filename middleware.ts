import { NextResponse } from "next/server";

const PRODUCTION_ALLOWED_ORIGINS = [
  "https://neverbe.lk",
  "https://www.neverbe.lk",
];

const DEVELOPMENT_ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://dev.neverbe.lk",
  "https://www.dev.neverbe.lk",
];

export function middleware(req: Request) {
  const origin = req.headers.get("origin");
  const url = new URL(req.url);

  const allowedOrigins =
    process.env.NODE_ENV === "production"
      ? PRODUCTION_ALLOWED_ORIGINS
      : [...PRODUCTION_ALLOWED_ORIGINS, ...DEVELOPMENT_ALLOWED_ORIGINS];

  // Allow same-origin (no Origin header)
  if (!origin) {
    console.log("Allowed: Same-origin request");
    return NextResponse.next();
  }

  // Always allow Koko/IPG routes regardless of origin
  if (
    url.pathname.startsWith("/api/v1/ipg")
  ) {
    console.log(`Allowed: IPG route from ${origin}`);
    return NextResponse.next();
  }

  // Check against allowed origins
  if (allowedOrigins.includes(origin)) {
    console.log(`Allowed: Cross-origin request from ${origin}`);
    const res = NextResponse.next();
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return res;
  }

  // Block everything else
  console.log(`Blocked: Request from unknown origin: ${origin}`);
  return new NextResponse("Forbidden", { status: 403 });
}

export const config = {
  matcher: "/api/:path*",
};
