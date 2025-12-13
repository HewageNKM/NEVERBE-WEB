import DealsHeader from "./components/DealsHeader";
import DealsProducts from "./components/DealsProducts";
import EmptyState from "@/components/EmptyState";
import { getDealsProducts } from "@/services/ProductService";
import { seoKeywords } from "@/constants";
import { Product } from "@/interfaces/Product";
import type { Metadata } from "next";

// OPTIMIZATION: Cache for 1 hour.
export const revalidate = 3600;

export const metadata: Metadata = {
  // SEO STRATEGY: Target "Sale", "Cheap", and "Offers"
  title: {
    default: "Shoe Sale Sri Lanka | Best Sneaker Deals & Discounts — NEVERBE",
    template: "%s | NEVERBE",
  },
  description:
    "Looking for cheap shoes in Sri Lanka? Shop the biggest shoe sale at NEVERBE. Get up to 50% off on sneakers, slides, and master copies. Island-wide delivery.",
  keywords: [
    "shoe sale sri lanka",
    "cheap shoes sri lanka",
    "sneakers low price",
    "discount shoes colombo",
    "buy shoes on sale",
    "shoe offers online",
    "clearance sale shoes",
    "budget friendly sneakers",
    "under 5000 shoes sri lanka", // Specific price intent often ranks well
    ...seoKeywords,
  ],
  alternates: {
    canonical: "https://neverbe.lk/collections/deals",
  },
  openGraph: {
    title: "Shoe Sale Sri Lanka | Huge Discounts on Sneakers",
    description:
      "Save big on premium footwear. The best place to buy affordable sneakers and shoes in Sri Lanka.",
    url: "https://neverbe.lk/collections/deals",
    siteName: "NEVERBE",
    type: "website",
    locale: "en_LK",
    images: [
      {
        url: "https://neverbe.lk/logo-og.png", // Ensure this image is generic/appealinge' themed image if possible
        width: 1200,
        height: 630,
        alt: "NEVERBE Shoe Sale",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://neverbe.lk"),
};

const Page = async () => {
  let items: { dataList: Product[] } = { dataList: [] };

  try {
    items = await getDealsProducts(undefined, undefined, 1, 20);
  } catch (e) {
    console.error("Error fetching deal items:", e);
  }

  const dealsList = items?.dataList || [];

  /* ✅ Structured Data: "SaleEvent" helps Google highlight discounts */
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
            // Schema trick: Explicitly showing it's a "SalePrice" isn't standard in basic Offer,
            // but we ensure the price reflects the discount here.
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
