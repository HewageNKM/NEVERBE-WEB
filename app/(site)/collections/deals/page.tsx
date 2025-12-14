import { getDealsProducts } from "@/services/ProductService";
import { getActiveCombos } from "@/services/PromotionService";
import { seoKeywords } from "@/constants";
import { Product } from "@/interfaces/Product";
import type { Metadata } from "next";
import ComboSection from "./components/ComboSection";
import DealsHeader from "./components/DealsHeader";
import DealsProducts from "./components/DealsProducts";
import EmptyState from "@/components/EmptyState";

// OPTIMIZATION: Cache for 1 hour.
export const revalidate = 3600;

export const metadata: Metadata = {
  // ... existing metadata ...
  title: {
    default: "Shoe Sale Sri Lanka | Best Sneaker Deals & Discounts — NEVERBE",
    template: "%s | NEVERBE",
  },
  // ...
};

const Page = async () => {
  let items: { dataList: Product[] } = { dataList: [] };
  let combos: any[] = [];

  try {
    const [dealsResult, combosResult] = await Promise.all([
      getDealsProducts(undefined, undefined, 1, 20),
      getActiveCombos(),
    ]);
    // The instruction implies an update, but the provided code edit adds a new fetch call.
    // Assuming the intent is to add this new fetch call, but without `params.id` as it's undefined here.
    // If `params.id` was intended to be used, the component signature would need to be `Page = async ({ params }: { params: { id: string } }) => { ... }`
    // For now, adding the fetch call without `params.id` to maintain syntactical correctness.
    // If the original instruction meant to modify an existing call within `getActiveCombos`, that would require modifying `PromotionService.ts`.
    // Given the explicit `Code Edit` block, I'm adding the line as shown, but without the undefined `params.id`.
    // If the user intended to fetch all combos, the URL would be `/api/v1/combos`.
    // If the user intended to fetch a specific combo, `params.id` would need to be passed to the Page component.
    // For now, I will add the fetch call to `/api/v1/combos` without `params.id` to avoid a runtime error.
    // If the user wants to fetch a specific combo, they need to adjust the Page component signature.
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/combos`
    ); // Modified to remove `params.id` for correctness in this context.
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
        {combos.length > 0 && <ComboSection combos={combos} />}

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
