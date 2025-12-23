import { Metadata } from "next";
import { getPaginatedCombos } from "@/services/PromotionService";
import { seoKeywords } from "@/constants";

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

const CombosPage = async ({
  searchParams,
}: {
  searchParams: { page?: string };
}) => {
  const page = Number(searchParams?.page) || 1;
  const pageSize = 6;
  let combos: any[] = [];
  let total = 0;
  let totalPages = 0;

  try {
    const data = await getPaginatedCombos(page, pageSize);
    combos = data.combos;
    total = data.total;
    totalPages = data.totalPages;
  } catch (e) {
    console.error("Error fetching combos:", e);
  }

  /* Structured Data for SEO */
  const combosSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Bundle Deals & Combo Offers",
    description:
      "Exclusive combo deals, BOGO offers, and bundle discounts on premium footwear in Sri Lanka.",
    url: `https://neverbe.lk/collections/combos?page=${page}`,
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
    <main className="w-full min-h-screen bg-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combosSchema) }}
      />

      {/* NEVERBE Performance Header */}
      <div className="w-full max-w-content mx-auto px-4 md:px-12 py-12 md:py-20 text-left">
        <h1 className="text-3xl md:text-5xl font-display font-black uppercase italic tracking-tighter text-primary leading-none mb-4">
          Bundle Deals
        </h1>
        <p className="text-muted max-w-xl text-sm md:text-base font-medium uppercase tracking-wide">
          BOGO Offers & Exclusive Combo Packs. Save more when you buy together.
        </p>
      </div>

      <div className="w-full max-w-content mx-auto px-4 md:px-12 pb-20">
        {combos.length > 0 ? (
          <CombosGrid
            combos={combos}
            currentPage={page}
            totalPages={totalPages}
          />
        ) : (
          <div className="pt-20">
            <EmptyState
              heading="No bundle deals active right now."
              subHeading="Check back later for new combo offers."
            />
          </div>
        )}
      </div>

      {/* SEO Footer / Brand Story */}
      <section className="bg-surface-2 py-16 mt-0">
        <div className="max-w-content mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-24">
            <div className="max-w-sm">
              <h2 className="text-sm font-display font-black uppercase tracking-tight text-primary mb-6">
                Stack & Save
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-4">
                Our bundle deals are designed to give you maximum value. Whether
                it&apos;s a BOGO (Buy One Get One) offer or a multi-buy
                discount, you always get premium quality for less.
              </p>
            </div>

            <div className="max-w-sm">
              <h3 className="text-sm font-display font-black uppercase tracking-tight text-primary mb-6">
                Popular Bundles
              </h3>
              <ul className="text-sm text-muted space-y-3 font-medium">
                <li className="hover:text-accent cursor-pointer transition-colors">
                  Buy 2 Pairs, Get 15% Off
                </li>
                <li className="hover:text-accent cursor-pointer transition-colors">
                  Essential Socks Packs
                </li>
                <li className="hover:text-accent cursor-pointer transition-colors">
                  Complete Gym Kits
                </li>
              </ul>
            </div>

            <div className="max-w-sm">
              <h3 className="text-sm font-display font-black uppercase tracking-tight text-primary mb-6">
                Limited Time Offers
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Most bundle deals are available for a limited time only. Grab
                your favorites before the campaign ends.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CombosPage;
