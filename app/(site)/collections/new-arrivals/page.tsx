export const revalidate = 3600;

import CollectionProducts from "@/app/(site)/collections/components/CollectionProducts";
import { getNewArrivals } from "@/services/ProductService";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, Typography } from "antd";

const { Title, Text, Paragraph } = Typography;

export const metadata: Metadata = {
  title: "New Arrivals - Latest Shoes & Sneakers | NEVERBE Sri Lanka",
  description:
    "Shop the newest shoes in Sri Lanka. Discover latest sneakers, slides & footwear drops. Premium 7A quality at best prices. Cash on Delivery island-wide.",
  alternates: { canonical: "https://neverbe.lk/collections/new-arrivals" },
  keywords: [
    "new shoes sri lanka",
    "latest sneakers",
    "new arrivals footwear",
    "new shoes colombo",
    "latest shoe drops",
  ],
  openGraph: {
    title: "New Arrivals - Latest Shoes & Sneakers | NEVERBE",
    description:
      "Shop the newest shoes in Sri Lanka. Latest sneakers, slides & footwear at best prices.",
    url: "https://neverbe.lk/collections/new-arrivals",
    type: "website",
    siteName: "NEVERBE",
    locale: "en_LK",
    images: [
      {
        url: "https://neverbe.lk/logo-og.png",
        width: 1200,
        height: 630,
        alt: "NEVERBE New Arrivals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "New Arrivals - Latest Shoes | NEVERBE",
    description: "Shop the newest sneakers & footwear in Sri Lanka.",
    images: ["https://neverbe.lk/logo-og.png"],
  },
};

const NewArrivalsPage = async () => {
  const { total, dataList } = await getNewArrivals(1, 20);

  const structuredData = {
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
            name: "New Arrivals",
            item: "https://neverbe.lk/collections/new-arrivals",
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: "New Arrivals - Latest Shoes Sri Lanka",
        description:
          "Shop the newest shoes in Sri Lanka. Latest sneakers, slides & footwear.",
        url: "https://neverbe.lk/collections/new-arrivals",
        inLanguage: "en-LK",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: dataList.length,
          itemListElement: dataList
            .slice(0, 15)
            .map((product: any, index: number) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Product",
                name: product.name,
                image:
                  product.thumbnail?.url || "https://neverbe.lk/logo-og.png",
                url: `https://neverbe.lk/collections/products/${product.id}`,
                brand: { "@type": "Brand", name: product.brand || "NEVERBE" },
                offers: {
                  "@type": "Offer",
                  priceCurrency: "LKR",
                  price: product.sellingPrice || "0.00",
                  availability: product.inStock
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                  itemCondition: "https://schema.org/NewCondition",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Page Header */}
      <div className="w-full max-w-content mx-auto px-4 md:px-12 pt-8 pb-6">
        <Breadcrumb
          style={{ marginBottom: 16 }}
          items={[
            { title: <Link href="/">Home</Link> },
            { title: "New Arrivals" },
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
          New Arrivals
        </Title>
        <Text style={{ color: "#888", fontSize: 14 }}>
          Fresh styles just added to the collection.
        </Text>
      </div>

      <CollectionProducts
        initialItems={dataList}
        collectionType="new-arrivals"
        tagName="New Arrivals"
        total={total}
      />

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
                Fresh Drops Weekly
              </Text>
              <Paragraph style={{ fontSize: 13, color: "#777", margin: 0 }}>
                We update our collection with the latest releases from global
                sneaker culture. 7A quality guaranteed.
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
                Trending Now
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
                <li>Retro High Tops</li>
                <li>Chunky Dad Shoes</li>
                <li>Minimalist Slides</li>
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
                Limited Stock
              </Text>
              <Paragraph style={{ fontSize: 13, color: "#777", margin: 0 }}>
                Most new arrivals are limited runs. If you see your size, grab
                it before it&apos;s gone.
              </Paragraph>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NewArrivalsPage;
