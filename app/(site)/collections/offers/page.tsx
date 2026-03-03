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
import { Breadcrumb, Typography, Divider, Button } from "antd";

const { Title, Text, Paragraph } = Typography;

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
        url: "https://neverbe.lk/deals-og.jpg",
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
    images: ["https://neverbe.lk/deals-og.jpg"],
  },
};

export const revalidate = 600;

const OffersPage = async () => {
  const [promotions, coupons] = await Promise.all([
    getActivePromotions(),
    getActiveCoupons(),
  ]);

  const bannerPromotions = promotions.filter(
    (p: any) => p.bannerUrl && p.isActive,
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
    <main className="w-full min-h-screen" style={{ background: "#f8faf5" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersSchema) }}
      />

      {/* Page Header */}
      <div className="w-full max-w-content mx-auto px-4 md:px-12 pt-8 pb-6">
        <Breadcrumb
          style={{ marginBottom: 16 }}
          items={[{ title: <Link href="/">Home</Link> }, { title: "Offers" }]}
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
          Offers & Deals
        </Title>
        <Text style={{ color: "#888", fontSize: 14 }}>
          Exclusive campaigns, seasonal coupons &amp; markdown deals.
        </Text>
      </div>

      <div
        className="w-full max-w-content mx-auto px-4 md:px-12 pb-20"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(2rem, 4vw, 4rem)",
        }}
      >
        {/* Active Campaigns */}
        {bannerPromotions.length > 0 && (
          <section>
            <Title
              level={5}
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#999",
                fontWeight: 800,
                marginBottom: 20,
              }}
            >
              Active Campaigns
            </Title>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bannerPromotions.map((promo: any) => (
                <div
                  key={promo.id}
                  className="group block relative bg-gray-100 overflow-hidden cursor-pointer rounded-2xl hover:shadow-lg transition-all"
                  style={{ aspectRatio: "4/5" }}
                >
                  <Image
                    src={promo.bannerUrl}
                    alt={promo.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-white text-lg font-black uppercase tracking-tight mb-3">
                      {promo.name}
                    </h3>
                    <Button
                      style={{
                        borderRadius: 99,
                        background: "#fff",
                        color: "#1a1a1a",
                        border: "none",
                        fontWeight: 800,
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        height: 36,
                        padding: "0 20px",
                      }}
                    >
                      Shop Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Coupons */}
        {coupons.length > 0 && (
          <section>
            <Title
              level={5}
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#999",
                fontWeight: 800,
                marginBottom: 20,
              }}
            >
              Available Coupons
            </Title>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          </section>
        )}

        {/* Markdown Deals */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <Title
                level={2}
                style={{
                  textTransform: "uppercase",
                  letterSpacing: "-0.02em",
                  fontWeight: 900,
                  margin: 0,
                  marginBottom: 4,
                }}
              >
                Markdown Deals
              </Title>
              <Text style={{ color: "#888", fontSize: 13 }}>
                Best prices on premium products.
              </Text>
            </div>
            <Link
              href="/collections/combos"
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: "#5a9a1a",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                whiteSpace: "nowrap",
              }}
            >
              View Bundle Deals →
            </Link>
          </div>
          <DealsProducts items={dealsList} />
        </section>
      </div>

      {/* SEO Footer */}
      <div
        style={{
          borderTop: "1px solid rgba(0,0,0,0.06)",
          padding: "48px 0",
          marginTop: 24,
        }}
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
                Member Benefits
              </Text>
              <Paragraph style={{ fontSize: 13, color: "#777", margin: 0 }}>
                Sign up to unlock early access, exclusive deals, and the best
                prices on premium products in Sri Lanka.
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
                Ways to Save
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
                <li>Seasonal Markdown Deals</li>
                <li>Exclusive Coupon Codes</li>
                <li>Bundle &amp; Save Combos</li>
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
                Price Match Promise
              </Text>
              <Paragraph style={{ fontSize: 13, color: "#777", margin: 0 }}>
                Found a better price elsewhere? Let us know and we&apos;ll do
                our best to match it.
              </Paragraph>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OffersPage;
