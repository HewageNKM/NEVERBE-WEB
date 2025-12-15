import { getDealsProducts } from "@/services/ProductService";
import { Product } from "@/interfaces/Product";
import type { Metadata } from "next";
import DealsHeader from "./components/DealsHeader";
import DealsProducts from "./components/DealsProducts";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Shoe Sale Sri Lanka | Best Sneaker Deals & Discounts — NEVERBE",
  description:
    "Shop the best shoe deals in Sri Lanka. Get up to 50% off on premium sneakers, running shoes, slides, and combo bundles. Limited time offers with island-wide delivery.",
  keywords: [
    "shoe sale Sri Lanka",
    "sneaker deals Colombo",
    "cheap shoes Sri Lanka",
    "discount sneakers",
    "Nike replica Sri Lanka",
    "Adidas replica Sri Lanka",
    "Jordan shoes Sri Lanka",
    "master copy shoes",
    "7A quality shoes",
    "online shoe store Sri Lanka",
    "buy shoes online Sri Lanka",
    "shoes under 5000 LKR",
    "clearance shoes",
    "combo deals shoes",
    "footwear sale",
    "NEVERBE deals",
  ],
  openGraph: {
    title: "Shoe Sale Sri Lanka | Best Sneaker Deals — NEVERBE",
    description:
      "Shop the best shoe deals in Sri Lanka. Premium sneakers, running shoes & combo bundles at unbeatable prices.",
    url: "https://neverbe.lk/collections/deals",
    siteName: "NEVERBE",
    images: [
      {
        url: "https://neverbe.lk/og-deals.jpg",
        width: 1200,
        height: 630,
        alt: "NEVERBE Shoe Deals & Discounts",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shoe Sale Sri Lanka | Best Sneaker Deals — NEVERBE",
    description:
      "Premium sneakers, running shoes & combo bundles at unbeatable prices. Island-wide delivery.",
    images: ["https://neverbe.lk/og-deals.jpg"],
  },
  alternates: {
    canonical: "https://neverbe.lk/collections/deals",
  },
};

const Page = async () => {
  let items: { dataList: Product[] } = { dataList: [] };

  try {
    const dealsResult = await getDealsProducts(undefined, undefined, 1, 20);
    items = dealsResult || { dataList: [] };
  } catch (e) {
    console.error("Error fetching deal items:", e);
  }

  const dealsList = items?.dataList || [];

  const dealsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Shoe Sales & Discounts Sri Lanka",
    description:
      "Find the best discounts on premium inspired sneakers in Sri Lanka.",
    url: "https://neverbe.lk/collections/deals",
    inLanguage: "en-LK",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: dealsList.map((product: Product, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product?.name,
          image: product?.thumbnail?.url || "https://neverbe.lk/logo-og.png",
          description:
            product?.description ||
            "Discounted premium footwear at NEVERBE Sri Lanka.",
          url: `https://neverbe.lk/collections/products/${product?.id}`,
          brand: {
            "@type": "Brand",
            name: "NEVERBE",
          },
          offers: {
            "@type": "Offer",
            priceCurrency: "LKR",
            price: product?.sellingPrice || "0.00",
            availability: "https://schema.org/InStock",
            priceValidUntil: new Date(
              Date.now() + 1000 * 60 * 60 * 24 * 30 // Valid for 30 days
            ).toISOString(),
          },
        },
      })),
    },
  };

  return (
    <main className="w-full relative mt-4 lg:mt-8 mb-10 min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dealsSchema) }}
      />
      <DealsHeader />

      <div className="w-full">
        {/* Link to Combos Page */}
        <div className="max-w-[1440px] mx-auto px-4 mb-8">
          <Link
            href="/collections/combos"
            className="block bg-gradient-to-r from-black to-gray-800 text-white p-6 hover:from-gray-800 hover:to-black transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Bundle & Save
                </p>
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                  Shop Combo Deals →
                </h3>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-sm text-gray-300">
                  Get more for less with our exclusive combo bundles
                </p>
              </div>
            </div>
          </Link>
        </div>

        {dealsList.length > 0 ? (
          <DealsProducts items={dealsList} />
        ) : (
          <EmptyState
            heading="No deals active right now."
            subHeading="Check back later for new drops."
          />
        )}
      </div>

      {/* SEO Footer - Fine Print Style */}
      <section className="max-w-[1440px] mx-auto px-4 py-12 border-t border-gray-100 mt-12">
        <article className="grid md:grid-cols-2 gap-8 text-xs text-gray-400 leading-relaxed text-justify md:text-left">
          <div>
            <h2 className="text-black font-bold uppercase tracking-wide mb-2">
              Best Sneaker Deals in Sri Lanka
            </h2>
            <p>
              NEVERBE hosts the most exciting shoe sale events in Colombo. Find
              high-quality Master Copy sneakers, running shoes, and slides at
              clearance prices. We ensure the lowest shoe prices in Sri Lanka
              without compromising on the premium look and feel.
            </p>
          </div>
          <div>
            <h3 className="text-black font-bold uppercase tracking-wide mb-2">
              Why Shop Our Sale?
            </h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Unbeatable Prices under LKR 5000</li>
              <li>Limited Time Offers on 7A Quality Shoes</li>
              <li>Island-wide Delivery on all discounted items</li>
            </ul>
          </div>
        </article>
      </section>
    </main>
  );
};

export default Page;
