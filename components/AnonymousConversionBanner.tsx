import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { User, ArrowRight } from "lucide-react";

const AnonymousConversionBanner: React.FC = () => {
  const user = useSelector((state: RootState) => state.authSlice.user);

  if (user && !user.isAnonymous) return null;

  return (
    <div className="bg-neutral-900 text-white px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm text-center animate-fadeIn relative z-40">
      <div className="flex items-center gap-2">
        <User size={16} className="text-gray-400" />
        <p>
          You are shopping as a guest.{" "}
          <span className="text-gray-400">
            Create an account to save your orders and info.
          </span>
        </p>
      </div>
      <Link
        href="/account/login" // Or register if separate
        className="flex items-center gap-1 font-bold uppercase tracking-wider text-xs border-b border-white pb-0.5 hover:text-gray-300 hover:border-gray-300 transition-colors"
      >
        Sign Up Now <ArrowRight size={12} />
      </Link>
    </div>
  );
};

export default AnonymousConversionBanner;
