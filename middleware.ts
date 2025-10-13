import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const origin = req.headers.get("origin");

  const allowedOrigins = ["https://neverbe.lk", "https://dev.neverbe.lk"];

  if (process.env.NODE_ENV === "development")
    allowedOrigins.push("http://localhost:3000");

  if (!origin) {
    // No Origin header indicates a same-origin request
    console.log("Allowed: Same-origin request");
    return NextResponse.next();
  }

  if (allowedOrigins.includes(origin)) {
    // Cross-origin request from allowed origin
    console.log(`Allowed: Cross-origin request from ${origin}`);
    return NextResponse.next();
  }

  // if path include api/v1/koko and api/v1/ipg allow
  if (req.url.includes("/api/v1/koko") || req.url.includes("/api/v1/ipg")) {
    console.log(`Allowed: Koko or IPG API request from ${origin}`);
    return NextResponse.next();
  }

  // Block requests from other origins
  console.log(`Blocked: Request from unknown origin: ${origin}`);
  return new NextResponse("Forbidden", { status: 403 });
}

export const config = {
  matcher: "/api/:path*",
};
