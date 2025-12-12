import "@/app/globals.css";
import Link from "next/link";
import { Metadata } from "next";

export const metadata = {
  title: "404 - Page Not Found | NEVERBE",
};

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-black font-sans selection:bg-gray-200">
      {/* Container */}
      <div className="text-center max-w-lg w-full space-y-6">
        {/* 404 - Massive & Tight */}
        <h1 className="text-[120px] md:text-[160px] leading-none font-bold tracking-tighter select-none">
          404
        </h1>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-medium uppercase tracking-tight">
            We can't find that page.
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-md mx-auto">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-black text-white text-sm font-bold uppercase tracking-wider rounded-full hover:bg-gray-800 transition-colors"
          >
            Return Home
          </Link>
          <Link
            href="/collections/new-arrivals"
            className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-black text-sm font-bold uppercase tracking-wider rounded-full hover:border-black transition-colors"
          >
            Shop New Arrivals
          </Link>
        </div>
      </div>

      {/* Footer link */}
      <p className="absolute bottom-10 text-xs text-gray-400 font-medium uppercase tracking-wide">
        Need help?{" "}
        <Link
          href="/contact"
          className="text-black underline underline-offset-4 hover:text-gray-600"
        >
          Contact Us
        </Link>
      </p>
    </div>
  );
};

export default NotFound;
