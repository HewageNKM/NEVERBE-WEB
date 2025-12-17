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
  openGraph: {
    title: "Offers & Rewards | NEVERBE",
    description:
      "Explore exclusive deals, active promotions, and discount coupons for your next pair of kicks.",
    url: "https://neverbe.lk/collections/offers",
    type: "website",
    siteName: "NEVERBE",
    images: [
      {
        url: "https://neverbe.lk/deals-og.jpg",
        width: 1200,
        height: 630,
        alt: "NEVERBE Offers & Rewards",
      },
    ],
  },
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

  /* ✅ Structured Data for Offers */
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
          image: product?.thumbnail?.url || "https://neverbe.lk/logo-og.png",
          description: product?.description || "Discounted footwear.",
          url: `https://neverbe.lk/collections/products/${product?.id}`,
          brand: {
            "@type": "Brand",
            name: "NEVERBE",
          },
          offers: {
            "@type": "Offer",
            priceCurrency: "LKR",
            price: product?.sellingPrice || product?.price || "0.00",
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
          },
        },
      })),
    },
  };

  return (
    <main className="w-full min-h-screen bg-white pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersSchema) }}
      />
      {/* Header */}
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 mb-8 text-left">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
          Offers & Rewards
        </h1>
        <p className="text-gray-500 max-w-xl text-sm md:text-base">
          Get the most out of your shopping with our latest campaigns, exclusive
          coupons, and markdown deals.
        </p>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 space-y-20 pb-20">
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
              {coupons.map((coupon) => {
                if (coupon.bannerUrl) {
                  return (
                    <div
                      key={coupon.id}
                      className="group block relative aspect-video bg-gray-100 overflow-hidden rounded-lg"
                    >
                      <Image
                        src={coupon.bannerUrl}
                        alt={coupon.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-90" />
                      <div className="absolute bottom-0 left-0 p-6 w-full">
                        <h3 className="text-white text-xl font-black uppercase tracking-tight mb-1">
                          {coupon.code.toUpperCase()}
                        </h3>
                        <p className="text-white/80 text-sm font-medium line-clamp-2 mb-2">
                          {coupon.description}
                        </p>
                        <span className="inline-block px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded hover:bg-gray-200 cursor-pointer">
                          Copy Code
                        </span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={coupon.id}
                    className="bg-gray-50 border border-gray-200 p-6 rounded-lg flex flex-col justify-center text-center"
                  >
                    <h3 className="text-3xl font-black uppercase tracking-tight mb-2 text-black">
                      {coupon.code.toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                      {coupon.description || "Apply this code at checkout."}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Markdown Deals Grid */}
        <section className="pt-8 border-t border-gray-100">
          <div className="mb-8">
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
