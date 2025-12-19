"use client";
import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { User, ArrowRight } from "lucide-react";

const AnonymousConversionBanner: React.FC = () => {
  const user = useSelector((state: RootState) => state.authSlice.user);

  // Only show for anonymous/guest users
  if (user && !user.isAnonymous) return null;

  return (
    <div className="bg-[#f5f5f5] text-[#111] px-4 py-3 md:py-2.5 border-b border-gray-100 flex items-center justify-center animate-fadeIn transition-all">
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 max-w-[1440px] w-full justify-center">
        {/* Guest Message */}
        <div className="flex items-center gap-2">
          <User size={14} className="text-[#111]" />
          <p className="text-[13px] md:text-[14px] font-medium tracking-tight">
            Shopping as a guest?{" "}
            <span className="text-[#707072] font-normal">
              Join us to save your orders and favorites.
            </span>
          </p>
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-4">
          <Link
            href="/account/register?redirect=/checkout"
            className="flex items-center gap-1 text-[13px] md:text-[14px] font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            Join Us
          </Link>
          <span className="text-gray-300 text-xs">|</span>
          <Link
            href="/account/login?redirect=/checkout"
            className="text-[13px] md:text-[14px] font-medium hover:opacity-70 transition-opacity"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnonymousConversionBanner;
