import React from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { Metadata } from "next";

export const metadata:Metadata = {
    title: "Page Not Found",
}
const NotFound = () => {
  return (
    <div className="min-h-screen w-full md:mt-10 mt-5 flex flex-col justify-center items-center bg-white text-center px-6 relative overflow-hidden">
      {/* Subtle Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(151,225,62,0.05),transparent_70%)] pointer-events-none" />

      {/* 404 Number */}
      <h1 className="text-8xl md:text-9xl font-extrabold text-primary drop-shadow-lg">
        404
      </h1>

      {/* Message */}
      <h2 className="mt-6 text-2xl md:text-4xl font-semibold">
        Oops! Page not found.
      </h2>
      <p className="mt-3 text-gray-400 max-w-md text-base md:text-lg">
        The page you’re looking for doesn’t exist or might have been moved.
      </p>

      {/* Return Button */}
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 bg-primary text-neutral-900 px-5 py-3 rounded-xl text-lg font-semibold hover:bg-primary-100 transition-all duration-300 shadow-custom"
      >
        <FaArrowLeft size={18} />
        Return to Home
      </Link>

      {/* Help Text */}
      <div className="absolute bottom-10 text-gray-500 text-sm">
        <p>
          Think this is a mistake?{" "}
          <Link
            href="/contact"
            className="text-primary hover:text-primary-100 underline transition"
          >
            Contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default NotFound;
