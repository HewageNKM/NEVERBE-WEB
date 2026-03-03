import { Metadata } from "next";
import { getPaginatedCombos } from "@/services/PromotionService";
import { seoKeywords } from "@/constants";
import Link from "next/link";
import { Breadcrumb, Typography } from "antd";

const { Title, Text, Paragraph } = Typography;

import CombosGrid from "./components/CombosGrid";
import EmptyState from "@/components/EmptyState";

// OPTIMIZATION: Cache for 1 hour (ISR)
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Bundle Deals & Combo Offers | NEVERBE Sri Lanka",
  description:
    "Shop exclusive combo deals and save big! Bundle offers, BOGO deals, and multi-buy discounts on premium sneakers in Sri Lanka. Cash on Delivery available.",
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
    images: [
      {
        url: "https://neverbe.lk/logo-og.png",
        width: 1200,
        height: 630,
        alt: "NEVERBE Bundle Deals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bundle Deals & Combo Offers | NEVERBE",
    description: "BOGO deals & bundle discounts on sneakers in Sri Lanka.",
    images: ["https://neverbe.lk/logo-og.png"],
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
    const data = await getPaginatedCombos({ page, pageSize });
    combos = data.combos || data.dataList || [];
    total = data.total || 0;
    totalPages = data.totalPages || Math.ceil(total / pageSize);
  } catch (e) {
    console.error("Error fetching combos:", e);
    combos = [];
  }

  /* Structured Data with BreadcrumbList for SEO */
  const combosSchema = {
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
            name: "Bundle Deals",
            item: "https://neverbe.lk/collections/combos",
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: "Bundle Deals & Combo Offers",
        description:
          "Exclusive combo deals, BOGO offers, and bundle discounts on premium footwear in Sri Lanka.",
        url: `https://neverbe.lk/collections/combos`,
        inLanguage: "en-LK",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: combos.length,
          itemListElement: combos.map((combo: any, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Product",
              name: combo?.name,
              image:
                combo?.previewThumbnail || "https://neverbe.lk/logo-og.png",
              description:
                combo?.description || "Bundle deal at NEVERBE Sri Lanka.",
              url: `https://neverbe.lk/collections/combos/${combo?.id}`,
              brand: { "@type": "Brand", name: "NEVERBE" },
              offers: {
                "@type": "Offer",
                priceCurrency: "LKR",
                price: combo?.comboPrice || "0.00",
                availability: "https://schema.org/InStock",
              },
            },
          })),
        },
      },
    ],
  };

  return (
    <main className="w-full min-h-screen" style={{ background: "#f8faf5" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combosSchema) }}
      />

      {/* Page Header */}
      <div className="w-full max-w-content mx-auto px-4 md:px-12 pt-8 pb-6">
        <Breadcrumb
          style={{ marginBottom: 16 }}
          items={[
            { title: <Link href="/">Home</Link> },
            { title: "Bundle Deals" },
          ]}
        />
        <Title
          level={1}
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            margin: 0,
            marginBottom: 8,
          }}
        >
          Bundle Deals
        </Title>
        <Text style={{ color: "#888", fontSize: 14 }}>
          BOGO offers &amp; exclusive combo packs — save more when you buy
          together.
        </Text>
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

      {/* SEO Footer */}
      <div
        style={{ borderTop: "1px solid rgba(0,0,0,0.06)", padding: "48px 0" }}
      >
        <div className="max-w-content mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <Text
                strong
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#aaa",
                  display: "block",
                  marginBottom: 12,
                }}
              >
                Stack &amp; Save
              </Text>
              <Paragraph style={{ fontSize: 13, color: "#777", margin: 0 }}>
                Our bundle deals give you maximum value — BOGO or multi-buy, you
                always get premium quality for less.
              </Paragraph>
            </div>
            <div>
              <Text
                strong
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#aaa",
                  display: "block",
                  marginBottom: 12,
                }}
              >
                Popular Bundles
              </Text>
              <ul
                style={{
                  fontSize: 13,
                  color: "#777",
                  lineHeight: 2,
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                <li>Buy 2 Pairs, Get 15% Off</li>
                <li>Essential Socks Packs</li>
                <li>Complete Gym Kits</li>
              </ul>
            </div>
            <div>
              <Text
                strong
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#aaa",
                  display: "block",
                  marginBottom: 12,
                }}
              >
                Limited Time
              </Text>
              <Paragraph style={{ fontSize: 13, color: "#777", margin: 0 }}>
                Most bundle deals are available for a limited time only. Grab
                your favorites before the campaign ends.
              </Paragraph>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CombosPage;
