import { Metadata } from "next";
import { getActiveCombosWithProducts } from "@/services/PromotionService";
import ComboCard from "./components/ComboCard";
import { IoAlertCircleOutline } from "react-icons/io5";

export const metadata: Metadata = {
  title: "Combo Deals | NEVERBE",
  description:
    "Shop exclusive combo deals and save big! Bundle offers, BOGO deals, and multi-buy discounts on premium sneakers.",
  openGraph: {
    title: "Combo Deals | NEVERBE",
    description: "Exclusive combo deals and bundle offers on premium sneakers.",
    url: "https://neverbe.lk/collections/combos",
  },
};

const CombosPage = async () => {
  const combos = await getActiveCombosWithProducts();

  return (
    <main className="w-full min-h-screen bg-white text-black">
      {/* --- HERO HEADER --- */}
      <section className="w-full bg-black text-white py-20 px-4 border-b-4 border-white relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 text-[20vw] font-black leading-none opacity-5 select-none pointer-events-none italic uppercase">
          Deals
        </div>

        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="flex flex-col items-start md:items-center md:text-center">
            <span className="bg-white text-black px-2 py-1 text-[10px] font-black tracking-[0.2em] uppercase mb-4 inline-block">
              Limited Time Offers
            </span>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-[0.85] mb-6">
              Bundle
              <br className="md:hidden" /> & Save
            </h1>
            <p className="text-gray-400 font-medium text-xs md:text-sm uppercase tracking-wide max-w-lg mx-auto leading-relaxed">
              Unlock exclusive value with our curated combo packs. BOGO deals,
              Multi-Buys, and Essentials Kits designed for maximum performance.
            </p>
          </div>
        </div>
      </section>

      {/* --- COMBOS GRID --- */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-16">
        {/* Section Label */}
        <div className="flex items-center justify-between mb-8 border-b border-black pb-2">
          <h2 className="text-xl font-black uppercase tracking-tighter italic">
            Active Promotions ({combos.length})
          </h2>
          <div className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Secure your kit
          </div>
        </div>

        {combos.length === 0 ? (
          /* Industrial Empty State */
          <div className="flex flex-col items-center justify-center py-32 border border-dashed border-gray-300 bg-gray-50">
            <IoAlertCircleOutline className="text-6xl text-gray-300 mb-4" />
            <h2 className="text-3xl font-black text-gray-300 uppercase italic tracking-tighter">
              No Active Deals
            </h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">
              Inventory updating. Check back shortly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {combos.map((combo: any) => (
              <ComboCard key={combo.id} combo={combo} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default CombosPage;
