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
        url: "https://neverbe.lk/api/v1/og", // Ensure this is a 'Sale' themed image if possible
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
          image: product?.thumbnail?.url || "https://neverbe.lk/api/v1/og",
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
    <main className="w-full relative lg:mt-28 mt-16 mb-5 overflow-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dealsSchema) }}
      />

      <DealsHeader />

      <div className="px-4">
        {dealsList.length > 0 ? (
          <DealsProducts items={dealsList} />
        ) : (
          <EmptyState heading="No deals available at this time." />
        )}
      </div>

      {/* ✅ SEO STRATEGY: CAPTURING THE "CHEAP/BUDGET" INTENT
          This section is crucial for ranking for "Price" related queries.
      */}
      <section className="container mx-auto px-4 py-12 border-t border-gray-100 mt-12 bg-gray-50 rounded-xl">
        <article className="prose prose-sm max-w-none text-gray-600">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Best Shoe Sale in Sri Lanka - Discounts & Offers
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p>
                Everyone loves a bargain! At NEVERBE, we host the most exciting
                <strong> shoe sale in Sri Lanka</strong>. If you are looking for
                <strong> cheap shoes</strong> that do not compromise on quality,
                our deals section is updated daily with the latest offers.
              </p>
              <p className="mt-2">
                Get the premium look for less. We offer massive discounts on
                <strong> Master Copy sneakers</strong>, running shoes, and
                slides. Why pay full price when you can get the best
                <strong> sneaker deals in Colombo</strong> right here?
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Why Shop Our Sale?
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Unbeatable Prices:</strong> We monitor the market to
                  ensure our <strong>shoe prices</strong> are the lowest in Sri
                  Lanka.
                </li>
                <li>
                  <strong>Limited Time Offers:</strong> Grab high-quality
                  <strong> 7A quality shoes</strong> at clearance rates before
                  stocks run out.
                </li>
                <li>
                  <strong>Budget Friendly:</strong> Find amazing footwear under
                  LKR 5000 and LKR 8000.
                </li>
              </ul>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
};

export default Page;
