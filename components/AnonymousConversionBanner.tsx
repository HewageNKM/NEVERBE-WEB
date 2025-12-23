"use client";
import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { User } from "lucide-react";

const AnonymousConversionBanner: React.FC = () => {
  const user = useSelector((state: RootState) => state.authSlice.user);

  // Only show for anonymous/guest users
  if (user && !user.isAnonymous) return null;

  return (
    <div className="bg-surface-2 text-primary px-4 py-3 md:py-2.5 border-b border-default flex items-center justify-center animate-fade transition-all">
      <div className="flex flex-col sm:row items-center gap-2 sm:gap-6 max-w-content w-full justify-center">
        {/* Guest Message */}
        <div className="flex items-center gap-2">
          {/* Using text-accent for the brand green icon */}
          <User size={14} className="text-accent" />
          <p className="text-base font-medium tracking-tight">
            Shopping as a guest?{" "}
            <span className="text-secondary font-normal">
              Join us to save your orders and favorites.
            </span>
          </p>
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-4">
          <Link
            href="/account/register?redirect=/checkout"
            className="flex items-center gap-1 text-base font-bold text-accent underline underline-offset-4 hover:text-accent-hover transition-colors"
          >
            Join Us
          </Link>
          <span className="text-muted text-xs">|</span>
          <Link
            href="/account/login?redirect=/checkout"
            className="text-base font-medium text-secondary hover:text-primary transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnonymousConversionBanner;
