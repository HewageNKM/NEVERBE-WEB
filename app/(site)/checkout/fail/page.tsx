import Link from "next/link";
import { IoHelpCircleOutline, IoRefresh } from "react-icons/io5";
import FailAnimationComponent from "@/app/(site)/checkout/fail/components/FailAnimationComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transaction Failed | NEVERBE",
};

const Page = ({
  searchParams,
}: {
  searchParams: { orderId?: string; error?: string };
}) => {
  const errorMsg = searchParams.error
    ? decodeURIComponent(searchParams.error)
    : "Transaction_Declined";

  return (
    <main className="w-full min-h-screen bg-white pt-32 pb-20 px-4 md:px-8 flex flex-col items-center justify-center text-center">
      <div className="w-full max-w-xl animate-fadeIn">
        {/* Animation */}
        <FailAnimationComponent />

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4 text-black">
          Order Failed
        </h1>

        <p className="text-lg text-gray-500 font-medium mb-8 leading-relaxed">
          We couldn’t process your transaction. This might be due to a network
          issue or a declined payment.
        </p>

        {/* Error Code Decoration */}
        <div className="inline-block px-4 py-1 bg-red-50 border border-red-100 rounded-sm mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-red-600">
            Error: {errorMsg}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
          {/* Retry Action */}
          <Link
            href="/checkout"
            className="flex-1 sm:flex-none py-4 px-8 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 transition-all rounded-sm flex items-center justify-center gap-2"
          >
            <IoRefresh size={18} />
            Try Again
          </Link>

          {/* Support Action */}
          <Link
            href="/pages/contact"
            className="flex-1 sm:flex-none py-4 px-8 border border-black text-black font-bold uppercase tracking-widest hover:bg-gray-50 transition-all rounded-sm flex items-center justify-center gap-2"
          >
            <IoHelpCircleOutline size={20} />
            Contact Support
          </Link>
        </div>

        {/* Footer Link */}
        <div className="mt-12">
          <Link
            href="/"
            className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5"
          >
            Return to Home Page
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Page;
