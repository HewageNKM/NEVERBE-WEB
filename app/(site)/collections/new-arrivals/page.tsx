export const revalidate = 3600;

import CollectionProducts from "@/app/(site)/collections/components/CollectionProducts";
import { getNewArrivals } from "@/actions/productAction";
import type { Metadata } from "next";
import Link from "next/link";

const sectionLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--color-primary-dark)",
  display: "block",
  marginBottom: 12,
};

export const metadata: Metadata = {
  title: "New Arrivals | Fresh Sneakers & Apparel | NEVERBE Sri Lanka",
  description:
    "Shop the latest shoe drops and fresh apparel at NEVERBE. New sneakers, slides & activewear added weekly. Authentic Premium quality. Cash on Delivery island-wide.",
  alternates: { canonical: "https://neverbe.lk/collections/new-arrivals" },
  keywords: [
    "new sneakers sri lanka",
    "latest shoe drops sri lanka",
    "new arrivals footwear 2025",
    "fresh shoes colombo",
    "new slides sri lanka",
    "new activewear sri lanka",
  ],
  openGraph: {
    title: "New Arrivals | Fresh Sneakers & Apparel | NEVERBE",
    description:
      "Latest shoe drops and fresh apparel added weekly at NEVERBE Sri Lanka.",
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
    title: "New Arrivals | NEVERBE Sri Lanka",
    description: "Fresh shoe drops & apparel added weekly in Sri Lanka.",
    images: ["https://neverbe.lk/logo-og.png"],
  },
};

const NewArrivalsPage = async () => {
  const { total, dataList } = await getNewArrivals(20);

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
        <nav
          style={{
            fontSize: 12,
            color: "var(--color-primary-dark)",
            marginBottom: 16,
          }}
        >
          <Link href="/" style={{ color: "var(--color-primary-dark)" }}>
            Home
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span>New Arrivals</span>
        </nav>
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            margin: 0,
            marginBottom: 8,
            color: "var(--color-primary-dark)",
          }}
        >
          New Arrivals
        </h1>
        <p
          style={{ color: "var(--color-primary-dark)", fontSize: 14, margin: 0 }}
        >
          Fresh styles just added to the collection.
        </p>
      </div>

      <CollectionProducts
        initialItems={dataList}
        collectionType="new-arrivals"
        tagName="New Arrivals"
        total={total}
      />

      {/* SEO Footer */}
      <div
        style={{
          borderTop: "1px solid var(--color-default)",
          padding: "48px 0",
        }}
      >
        <div className="max-w-content mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <span style={sectionLabel}>Fresh Drops Weekly</span>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-primary-dark)",
                  margin: 0,
                }}
              >
                We update our collection with the latest releases from global
                sneaker culture. Premium quality guaranteed.
              </p>
            </div>
            <div>
              <span style={sectionLabel}>Trending Now</span>
              <ul
                style={{
                  fontSize: 13,
                  color: "var(--color-primary-dark)",
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
              <span style={sectionLabel}>Limited Stock</span>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-primary-dark)",
                  margin: 0,
                }}
              >
                Most new arrivals are limited runs. If you see your size, grab
                it before it&apos;s gone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NewArrivalsPage;
