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
  title: "Offers & Deals | NEVERBE Sri Lanka - Shoe Discounts",
  description:
    "Explore exclusive shoe deals, active promotions, and discount coupons at NEVERBE. Best prices on sneakers & footwear in Sri Lanka. Cash on Delivery available.",
  alternates: { canonical: "https://neverbe.lk/collections/offers" },
  keywords: [
    "shoe offers sri lanka",
    "discount shoes",
    "shoe deals colombo",
    "cheap sneakers",
    "footwear sale",
    "coupons neverbe",
  ],
  openGraph: {
    title: "Offers & Deals | NEVERBE Sri Lanka",
    description:
      "Exclusive shoe deals, promotions & discount coupons. Best prices on sneakers & footwear.",
    url: "https://neverbe.lk/collections/offers",
    type: "website",
    siteName: "NEVERBE",
    locale: "en_LK",
    images: [
      {
        url: "https://neverbe.lk/logo-og.png",
        width: 1200,
        height: 630,
        alt: "NEVERBE Offers & Deals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Offers & Deals | NEVERBE Sri Lanka",
    description:
      "Exclusive shoe deals & discount coupons. Best prices in Sri Lanka.",
    images: ["https://neverbe.lk/logo-og.png"],
  },
};

export const revalidate = 600;

const OffersPage = async () => {
  const [promotions, coupons] = await Promise.all([
    getActivePromotions(),
    getActiveCoupons(),
  ]);

  const bannerPromotions = promotions.filter(
    (p: any) => p.bannerUrl && p.isActive
  );

  let dealsList: any[] = [];
  try {
    const dealsResult = await getDealsProducts(1, 30);
    dealsList = dealsResult?.dataList || [];
  } catch (e) {
    console.error("Error fetching deal items:", e);
  }

  const offersSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://neverbe.lk",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Offers",
            item: "https://neverbe.lk/collections/offers",
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: "Offers & Deals - NEVERBE Sri Lanka",
        description:
          "Exclusive deals and discounts on premium footwear at NEVERBE.",
        url: "https://neverbe.lk/collections/offers",
        inLanguage: "en-LK",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: dealsList.length,
          itemListElement: dealsList
            .slice(0, 15)
            .map((product: any, index: number) => ({
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
      },
    ],
  };

  return (
    <main className="w-full min-h-screen bg-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersSchema) }}
      />

      {/* NEVERBE Performance Header */}
      <div className="w-full max-w-content mx-auto px-4 md:px-12 py-12 md:py-20 text-left">
        <h1 className="text-3xl md:text-5xl font-display font-black uppercase italic tracking-tighter text-primary leading-none mb-4">
          Member Rewards & Offers
        </h1>
        <p className="text-muted max-w-xl text-sm md:text-base font-medium uppercase tracking-wide">
          Unlock exclusive campaigns, seasonal coupons, and the best markdown
          deals on premium footwear.
        </p>
      </div>

      <div className="w-full max-w-content mx-auto px-4 md:px-12 space-y-24 pb-20">
        {/* Active Campaigns */}
        {bannerPromotions.length > 0 && (
          <section>
            <div className="mb-10">
              <h2 className="text-lg font-display font-black uppercase tracking-tight text-primary">
                Active Campaigns
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bannerPromotions.map((promo: any) => (
                <div
                  key={promo.id}
                  className="group block relative aspect-4/5 bg-surface-2 overflow-hidden cursor-pointer rounded-2xl shadow-custom hover:shadow-hover transition-all"
                >
                  <Image
                    src={promo.bannerUrl}
                    alt={promo.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-10 left-10 right-10">
                    <h3 className="text-inverse text-xl font-display font-black uppercase italic tracking-tight mb-3">
                      {promo.name}
                    </h3>
                    <button className="px-6 py-3 bg-surface text-primary text-xs font-display font-black uppercase tracking-widest rounded-full hover:bg-accent hover:text-dark transition-all shadow-custom">
                      Shop Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Coupons Section */}
        {coupons.length > 0 && (
          <section>
            <div className="mb-10">
              <h2 className="text-lg font-display font-black uppercase tracking-tight text-primary">
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

        {/* Markdown Deals */}
        <section className="pt-16 border-t border-default">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-4xl font-display font-black uppercase italic tracking-tighter text-primary leading-none">
                Shop Markdown Deals
              </h2>
              <p className="text-muted text-sm mt-3 uppercase tracking-wide">
                Highest performance footwear at our best prices.
              </p>
            </div>
            <Link
              href="/collections/combos"
              className="text-xs font-black uppercase tracking-widest text-primary hover:text-accent transition-colors border-b-2 border-transparent hover:border-accent pb-1"
            >
              View Bundles & Combos
            </Link>
          </div>

          <DealsProducts items={dealsList} />
        </section>
      </div>

      {/* SEO Footer */}
      <section className="bg-surface-2 py-16 mt-0">
        <div className="max-w-content mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-24">
            <div className="max-w-sm">
              <h2 className="text-sm font-display font-black uppercase tracking-tight text-primary mb-6">
                Member Benefits
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-4">
                Unlock exclusive deals and early access to new drops. Sign up
                for NEVERBE membership to get the best prices on premium
                footwear in Sri Lanka.
              </p>
            </div>

            <div className="max-w-sm">
              <h3 className="text-sm font-display font-black uppercase tracking-tight text-primary mb-6">
                Ways to Save
              </h3>
              <ul className="text-sm text-muted space-y-3 font-medium">
                <li className="hover:text-accent cursor-pointer transition-colors">
                  Seasonal Markdown Deals
                </li>
                <li className="hover:text-accent cursor-pointer transition-colors">
                  Exclusive Coupon Codes
                </li>
                <li className="hover:text-accent cursor-pointer transition-colors">
                  Bundle & Save Combos
                </li>
              </ul>
            </div>

            <div className="max-w-sm">
              <h3 className="text-sm font-display font-black uppercase tracking-tight text-primary mb-6">
                Price Match Promise
              </h3>
              <p className="text-sm text-muted leading-relaxed">
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
