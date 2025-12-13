"use client";
import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { User, ArrowRight } from "lucide-react";

const AnonymousConversionBanner: React.FC = () => {
  const user = useSelector((state: RootState) => state.authSlice.user);

  if (user && !user.isAnonymous) return null;

  return (
    <div className="bg-neutral-900 text-white px-4 py-3 flex items-center justify-center animate-fadeIn relative">
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
        <div className="flex items-center gap-2">
          <User size={16} className="text-gray-400" />
          <p>
            Shopping as a guest?{" "}
            <span className="text-gray-400">Save your order or log in.</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/account/register?redirect=/checkout"
            className="flex items-center gap-1 font-bold uppercase tracking-wider text-xs border-b border-white pb-0.5 hover:text-gray-300 hover:border-gray-300 transition-colors"
          >
            Sign Up <ArrowRight size={12} />
          </Link>
          <span className="text-gray-600 text-xs">|</span>
          <Link
            href="/account/login?redirect=/checkout"
            className="font-bold uppercase tracking-wider text-xs text-gray-400 hover:text-white transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnonymousConversionBanner;
