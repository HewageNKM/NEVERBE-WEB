import "@/app/globals.css";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | NEVERBE",
};

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-6">
      {/* Container */}
      <div className="text-center max-w-xl w-full">
        
        {/* 404 */}
        <h1 className="text-[110px] leading-none font-bold text-neutral-900 tracking-tight">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-neutral-800">
          This page can’t be found
        </h2>

        {/* Description */}
        <p className="mt-3 text-neutral-500 text-base md:text-lg leading-relaxed">
          The page you're looking for may have been moved, deleted, or never existed.
        </p>

        {/* Action */}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-neutral-300 bg-white text-neutral-900 font-medium hover:border-neutral-400 hover:bg-neutral-100 transition-all duration-200"
          >
            <FaArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Footer help text */}
      <p className="absolute bottom-10 text-neutral-400 text-sm">
        Need assistance?{" "}
        <Link
          href="/contact"
          className="underline text-neutral-700 hover:text-neutral-900 transition"
        >
          Contact support
        </Link>
        .
      </p>
    </div>
  );
};

export default NotFound;
