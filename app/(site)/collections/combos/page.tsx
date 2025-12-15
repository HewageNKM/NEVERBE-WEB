import { Metadata } from "next";
import { getActiveCombosWithProducts } from "@/services/PromotionService";
import { seoKeywords } from "@/constants";
import CombosHeader from "./components/CombosHeader";
import CombosGrid from "./components/CombosGrid";
import EmptyState from "@/components/EmptyState";

// OPTIMIZATION: Cache for 1 hour (ISR)
export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    default: "Bundle Deals & Combo Offers | NEVERBE Sri Lanka",
    template: "%s | NEVERBE",
  },
  description:
    "Shop exclusive combo deals and save big! Bundle offers, BOGO deals, and multi-buy discounts on premium sneakers in Sri Lanka.",
  keywords: [
    "combo deals sri lanka",
    "bundle offers",
    "bogo shoes",
    "buy one get one free",
    "multi buy discount",
    "shoe deals sri lanka",
    ...seoKeywords,
  ],
  alternates: {
    canonical: "https://neverbe.lk/collections/combos",
  },
  openGraph: {
    title: "Bundle Deals & Combo Offers | NEVERBE",
    description:
      "Exclusive combo deals and bundle offers on premium sneakers. BOGO and multi-buy discounts.",
    url: "https://neverbe.lk/collections/combos",
    type: "website",
    siteName: "NEVERBE",
    locale: "en_LK",
  },
  metadataBase: new URL("https://neverbe.lk"),
};

const CombosPage = async () => {
  let combos: any[] = [];

  try {
    combos = await getActiveCombosWithProducts();
  } catch (e) {
    console.error("Error fetching combos:", e);
    combos = [];
  }

  /* Structured Data for SEO */
  const combosSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Bundle Deals & Combo Offers",
    description:
      "Exclusive combo deals, BOGO offers, and bundle discounts on premium footwear in Sri Lanka.",
    url: "https://neverbe.lk/collections/combos",
    inLanguage: "en-LK",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: combos.map((combo: any, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: combo?.name,
          image: combo?.previewThumbnail || "https://neverbe.lk/logo-og.png",
          description:
            combo?.description || "Bundle deal at NEVERBE Sri Lanka.",
          url: `https://neverbe.lk/collections/combos/${combo?.id}`,
          brand: {
            "@type": "Brand",
            name: "NEVERBE",
          },
          offers: {
            "@type": "Offer",
            priceCurrency: "LKR",
            price: combo?.comboPrice || "0.00",
            availability: "https://schema.org/InStock",
          },
        },
      })),
    },
  };

  return (
    <main className="w-full relative mt-4 lg:mt-8 mb-10 min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combosSchema) }}
      />

      <CombosHeader />

      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8">
        {combos.length > 0 ? (
          <CombosGrid combos={combos} itemsPerPage={6} />
        ) : (
          <EmptyState
            heading="No bundle deals active right now."
            subHeading="Check back later for new combo offers."
          />
        )}
      </div>

      {/* SEO Footer */}
      <section className="max-w-[1440px] mx-auto px-4 py-12 border-t border-gray-100 mt-12">
        <article className="grid md:grid-cols-2 gap-8 text-xs text-gray-400 leading-relaxed text-justify md:text-left">
          <div>
            <h2 className="text-black font-bold uppercase tracking-wide mb-2">
              Bundle Deals & Combo Offers
            </h2>
            <p>
              NEVERBE offers exclusive combo deals and bundle offers on premium
              footwear. Save more when you buy together with our BOGO deals,
              multi-buy discounts, and curated bundle packs. All combos include
              island-wide delivery.
            </p>
          </div>
          <div>
            <h3 className="text-black font-bold uppercase tracking-wide mb-2">
              Why Shop Combos?
            </h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Buy One Get One Free offers</li>
              <li>Multi-Buy discounts on select items</li>
              <li>Curated bundle packs for maximum savings</li>
            </ul>
          </div>
        </article>
      </section>
    </main>
  );
};

export default CombosPage;
