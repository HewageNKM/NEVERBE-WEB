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
    "Explore exclusive deals, active promotions, and discount coupons.",
  openGraph: {
    title: "Offers & Rewards | NEVERBE",
    description:
      "Explore exclusive deals, active promotions, and discount coupons.",
    url: "https://neverbe.lk/collections/offers",
    type: "website",
    siteName: "NEVERBE",
    images: [
      {
        url: "https://neverbe.lk/deals-og.jpg",
        width: 1200,
        height: 630,
        alt: "NEVERBE Offers",
      },
    ],
  },
};

export const revalidate = 600;

const OffersPage = async () => {
  const [promotions, coupons] = await Promise.all([
    getActivePromotions(),
    getActiveCoupons(),
  ]);

  const bannerPromotions = promotions.filter(
    (p: any) => p.bannerUrl && p.status === "ACTIVE"
  );

  let dealsList: any[] = [];
  try {
    const dealsResult = await getDealsProducts(1, 30); // Increased count for full grid
    dealsList = dealsResult?.dataList || [];
  } catch (e) {
    console.error("Error fetching deal items:", e);
  }

  const offersSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Offers & Rewards - NEVERBE",
    description:
      "Exclusive deals and discounts on premium footwear at NEVERBE.",
    url: "https://neverbe.lk/collections/offers",
    inLanguage: "en-LK",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: dealsList.map((product: any, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product?.name,
          image: product?.thumbnail?.url,
          url: `https://neverbe.lk/collections/products/${product?.id}`,
          offers: {
            "@type": "Offer",
            priceCurrency: "LKR",
            price: product?.sellingPrice || "0.00",
            availability: "https://schema.org/InStock",
          },
        },
      })),
    },
  };

  return (
    <main className="w-full min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersSchema) }}
      />

      {/* 1. NIKE STYLE HEADER */}
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 py-12 md:py-20 text-left">
        <h1 className="text-[28px] md:text-[42px] font-medium tracking-tight text-[#111] leading-none mb-4">
          Member Rewards & Offers
        </h1>
        <p className="text-[#707072] max-w-xl text-[16px] md:text-[18px] font-normal">
          Unlock exclusive campaigns, seasonal coupons, and the best markdown
          deals on premium footwear.
        </p>
      </div>

      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 space-y-24 pb-20">
        {/* 2. ACTIVE CAMPAIGNS (Nike-style high-quality banners) */}
        {bannerPromotions.length > 0 && (
          <section>
            <div className="mb-10">
              <h2 className="text-[20px] font-medium text-[#111] tracking-tight">
                Active Campaigns
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bannerPromotions.map((promo: any) => (
                <div
                  key={promo.id}
                  className="group block relative aspect-[4/5] bg-[#f5f5f5] overflow-hidden cursor-pointer"
                >
                  <Image
                    src={promo.bannerUrl}
                    alt={promo.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-10 left-10 right-10">
                    <h3 className="text-white text-[24px] font-medium tracking-tight mb-2">
                      {promo.name}
                    </h3>
                    <button className="px-6 py-2 bg-white text-black text-[15px] font-medium rounded-full hover:bg-[#e5e5e5] transition-all">
                      Shop Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. COUPONS SECTION (Clean grid, no dividers) */}
        {coupons.length > 0 && (
          <section>
            <div className="mb-10">
              <h2 className="text-[20px] font-medium text-[#111] tracking-tight">
                Your Available Coupons
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          </section>
        )}

        {/* 4. MARKDOWN DEALS (Utilizes the previously redesigned DealsProducts) */}
        <section className="pt-16 border-t border-gray-100">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-[24px] md:text-[32px] font-medium text-[#111] tracking-tight leading-none">
                Shop Markdown Deals
              </h2>
              <p className="text-[#707072] text-[16px] mt-2">
                Highest performance footwear at our best prices.
              </p>
            </div>
            <Link
              href="/collections/combos"
              className="text-[16px] font-medium text-[#111] underline underline-offset-4 hover:opacity-70 transition-all"
            >
              View Bundles & Combos
            </Link>
          </div>

          {/* Ensure DealsProducts matches the Collection Page redesign with the sticky toolbar */}
          <DealsProducts items={dealsList} />
        </section>
      </div>

      {/* PREMIUM BRAND STORY FOOTER */}
      <section className="bg-[#f5f5f5] py-16 mt-0">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-24">
            <div className="max-w-sm">
              <h2 className="text-[16px] font-medium text-[#111] mb-6">
                Member Benefits
              </h2>
              <p className="text-[14px] text-[#707072] leading-relaxed mb-4">
                Unlock exclusive deals and early access to new drops. Sign up
                for NEVERBE membership to get the best prices on premium
                footwear in Sri Lanka.
              </p>
            </div>

            <div className="max-w-sm">
              <h3 className="text-[16px] font-medium text-[#111] mb-6">
                Ways to Save
              </h3>
              <ul className="text-[14px] text-[#707072] space-y-3 font-medium">
                <li className="hover:text-black cursor-pointer transition-colors">
                  Seasonal Markdown Deals
                </li>
                <li className="hover:text-black cursor-pointer transition-colors">
                  Exclusive Coupon Codes
                </li>
                <li className="hover:text-black cursor-pointer transition-colors">
                  Bundle & Save Combos
                </li>
              </ul>
            </div>

            <div className="max-w-sm">
              <h3 className="text-[16px] font-medium text-[#111] mb-6">
                Price Match Promise
              </h3>
              <p className="text-[14px] text-[#707072] leading-relaxed">
                We offer the best prices on 7A quality footwear. If you find a
                better price elsewhere, let us know and we&apos;ll do our best
                to match it.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default OffersPage;
