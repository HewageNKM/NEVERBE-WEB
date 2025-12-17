import React from "react";
import {
  getActivePromotions,
  getActiveCoupons,
} from "@/services/PromotionService";
import { getDealsProducts } from "@/services/ProductService";
import CouponCard from "./components/CouponCard";
import DealsProducts from "./components/DealsProducts";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offers & Rewards | NEVERBE",
  description:
    "Explore exclusive deals, active promotions, and discount coupons for your next pair of kicks.",
};

export const revalidate = 600; // Revalidate every 10 minutes

const OffersPage = async () => {
  const [promotions, coupons] = await Promise.all([
    getActivePromotions(),
    getActiveCoupons(),
  ]);

  // Filter promotions that have banners to show in the gallery
  const bannerPromotions = promotions.filter(
    (p: any) => p.bannerUrl && p.status === "ACTIVE"
  );

  // Fetch discounted products for the grid
  let dealsList: any[] = [];
  try {
    const dealsResult = await getDealsProducts(1, 20);
    dealsList = dealsResult?.dataList || [];
  } catch (e) {
    console.error("Error fetching deal items:", e);
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-16 md:py-24 border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            Offers & Rewards
          </h1>
          <p className="text-gray-400 font-medium">
            Get the most out of your shopping with our latest campaigns,
            exclusive coupons, and markdown deals.
          </p>
        </div>
      </div>

      <div className="w-full space-y-20 py-12 md:py-20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-20">
          {/* Active Campaigns Section */}
          {bannerPromotions.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter">
                  Active Campaigns
                </h2>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bannerPromotions.map((promo: any) => (
                  <div
                    key={promo.id}
                    className="group block relative aspect-video bg-gray-100 overflow-hidden rounded-lg cursor-pointer"
                  >
                    <Image
                      src={promo.bannerUrl}
                      alt={promo.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-90" />
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                      <h3 className="text-white text-xl font-black uppercase tracking-tight mb-2">
                        {promo.name}
                      </h3>
                      {promo.bannerDescription && (
                        <p className="text-white/80 text-sm font-medium line-clamp-2 mb-4">
                          {promo.bannerDescription}
                        </p>
                      )}
                      <span className="inline-block px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest rounded hover:bg-gray-200 transition-colors">
                        Shop Offer
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Coupons Section */}
          {coupons.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter">
                  Available Coupons
                </h2>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map((coupon) => (
                  <CouponCard key={coupon.id} coupon={coupon} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Markdown Deals Grid */}
        <section className="bg-gray-50 py-16 border-t border-gray-200">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter">
                  Shop Markdown Deals
                </h2>
                <p className="text-gray-500 font-medium text-sm mt-1">
                  Limited time offers on premium footwear.
                </p>
              </div>
              <Link
                href="/collections/combos"
                className="text-sm font-bold uppercase tracking-widest underline hover:text-gray-600"
              >
                View Bundles & Combos →
              </Link>
            </div>
          </div>
          <DealsProducts items={dealsList} />
        </section>
      </div>
    </main>
  );
};

export default OffersPage;
