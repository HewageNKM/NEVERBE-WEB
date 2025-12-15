import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = ["https://neverbe.lk", "https://www.neverbe.lk"];

// ✅ FIX: Export as 'default' or named 'proxy' to satisfy Next.js 16 rules
export default async function proxy(req: NextRequest) {
  const origin = req.headers.get("origin");
  const url = new URL(req.url);

  // ----------------------------------------------------------------------
  // 1. Maintenance Mode Logic
  // ----------------------------------------------------------------------

  const isExcluded =
    url.pathname.startsWith("/api/v1/settings") ||
    url.pathname === "/maintenance" || // Don't block the maintenance page itself!
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/static") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.match(/\.(png|jpg|jpeg|gif|svg|css|js)$/);

  if (!isExcluded) {
    try {
      // Check your DB/API setting
      const settingsUrl = new URL("/api/v1/settings", req.url);
      const settingsRes = await fetch(settingsUrl.toString());

      if (settingsRes.ok) {
        const settings = await settingsRes.json();

        // If maintenance is ON
        if (settings && settings.enable === false) {
          // Step A: Fetch the content of your /maintenance page
          const maintenanceUrl = new URL("/maintenance", req.url);
          const maintenancePageRes = await fetch(maintenanceUrl.toString());

          if (maintenancePageRes.ok) {
            const maintenanceHtml = await maintenancePageRes.text();

            // Step B: Serve that HTML with a 503 Status Code
            // This is better than a Redirect (307) because it tells Google "Try again later"
            return new NextResponse(maintenanceHtml, {
              status: 503,
              headers: {
                "Retry-After": "3600",
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "no-store, no-cache, must-revalidate",
              },
            });
          }
        }
      }
    } catch (error) {
      console.error("Maintenance check failed:", error);
    }
  }

  // ----------------------------------------------------------------------
  // 2. Proxy / CORS Logic
  // ----------------------------------------------------------------------

  if (!origin) return NextResponse.next();

  if (
    url.pathname.startsWith("/api/v1/ipg/kok/notify") ||
    url.pathname.startsWith("/api/v1/ipg/payhere/notify")
  ) {
    return NextResponse.next();
  }

  if (ALLOWED_ORIGINS.includes(origin)) {
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

  // return new NextResponse("Forbidden", { status: 403 });
  return NextResponse.next();
}

// Optional: Config is usually the same
export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
