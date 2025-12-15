import { Metadata } from "next";
import { getActiveCombosWithProducts } from "@/services/PromotionService";
import ComboCard from "./components/ComboCard";

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
    <main className="w-full min-h-screen bg-white">
      {/* Hero Header */}
      <section className="w-full bg-black text-white py-16 px-4">
        <div className="max-w-[1440px] mx-auto text-center">
          <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-2 block">
            Limited Time Offers
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            Combo Deals
          </h1>
          <p className="text-gray-400 mt-4 max-w-md mx-auto text-sm">
            Bundle up and save big with our exclusive combo offers, BOGO deals,
            and multi-buy discounts.
          </p>
        </div>
      </section>

      {/* Combos Grid */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-12">
        {combos.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-tight">
              No Active Deals
            </h2>
            <p className="text-gray-500 mt-2">
              Check back soon for exclusive combo offers!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
