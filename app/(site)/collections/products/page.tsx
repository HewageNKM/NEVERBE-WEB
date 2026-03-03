import Products from "@/app/(site)/collections/products/components/Products";
import { getProducts } from "@/services/ProductService";
import type { Metadata } from "next";
import Link from "next/link";

const sectionLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  color: "#aaa",
  display: "block",
  marginBottom: 12,
};

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Shop Sneakers, Slides & Apparel | NEVERBE Sri Lanka",
  description:
    "Browse the full NEVERBE collection — sneakers, activewear, slides, accessories and more. Premium 7A quality. Cash on Delivery island-wide.",
  keywords: [
    "buy shoes online sri lanka",
    "sneakers colombo",
    "mens shoes sri lanka",
    "womens shoes sri lanka",
    "running shoes sri lanka",
    "slides sri lanka",
    "activewear sri lanka",
    "accessories sri lanka",
    "shoes under 5000",
    "shoes under 10000",
    "neverbe collection",
  ],
  alternates: { canonical: "https://neverbe.lk/collections/products" },
  openGraph: {
    title: "Shop Sneakers, Slides & Apparel | NEVERBE Sri Lanka",
    description:
      "Browse the full NEVERBE collection. Sneakers, activewear, slides and more at best prices. Cash on Delivery island-wide.",
    url: "https://neverbe.lk/collections/products",
    type: "website",
    siteName: "NEVERBE",
    locale: "en_LK",
    images: [
      {
        url: "https://neverbe.lk/shoes-og.jpg",
        width: 1200,
        height: 630,
        alt: "NEVERBE Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop NEVERBE | Sneakers, Slides & More",
    description: "Premium 7A quality. Cash on Delivery island-wide.",
    images: ["https://neverbe.lk/shoes-og.jpg"],
  },
  metadataBase: new URL("https://neverbe.lk"),
};

const Page = async () => {
  let items: any = {};

  try {
    // Increased initial fetch to 30 for a fuller, more premium grid
    items = await getProducts({ page: 1, size: 30 });
  } catch (e) {
    console.error("Error fetching items:", e);
    items = { dataList: [] };
  }

  const productList = items?.dataList || [];

  const productListingSchema = {
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
            name: "Products",
            item: "https://neverbe.lk/collections/products",
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: "Buy Shoes Online Sri Lanka | NEVERBE Collection",
        description:
          "Shop sneakers, running shoes, slides & sandals in Sri Lanka. Cash on Delivery available.",
        url: "https://neverbe.lk/collections/products",
        inLanguage: "en-LK",
        isPartOf: {
          "@id": "https://neverbe.lk/#website",
        },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: productList.length,
          itemListElement: productList
            .slice(0, 20)
            .map((product: any, index: number) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Product",
                name: product?.name,
                image: product?.thumbnail?.url,
                url: `https://neverbe.lk/collections/products/${product?.id}`,
                brand: { "@type": "Brand", name: product?.brand || "NEVERBE" },
                offers: {
                  "@type": "Offer",
                  priceCurrency: "LKR",
                  price: product?.sellingPrice || "0.00",
                  availability: product?.inStock
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                  itemCondition: "https://schema.org/NewCondition",
                  seller: {
                    "@type": "Organization",
                    name: "NEVERBE",
                  },
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productListingSchema),
        }}
      />

      {/* Page Header */}
      <div className="w-full max-w-content mx-auto px-4 md:px-12 pt-8 pb-6">
        <nav style={{ fontSize: 12, color: "#aaa", marginBottom: 16 }}>
          <Link href="/" style={{ color: "#aaa" }}>
            Home
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span>Collection</span>
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
            color: "#1a1a1a",
          }}
        >
          All Products
        </h1>
        <p style={{ color: "#888", fontSize: 14, margin: 0 }}>
          Sneakers, activewear, slides, accessories and more.
        </p>
      </div>

      {/* Product Grid */}
      <div className="max-w-content mx-auto px-4 md:px-12 pb-20">
        <Products items={productList} />
      </div>

      {/* SEO Footer */}
      <div
        style={{ borderTop: "1px solid rgba(0,0,0,0.06)", padding: "48px 0" }}
      >
        <div className="max-w-content mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <span style={sectionLabel}>Premium Fashion in Sri Lanka</span>
              <p style={{ fontSize: 13, color: "#777", margin: 0 }}>
                NEVERBE offers shoes, clothing, activewear, and accessories —
                all with island-wide Cash on Delivery.
              </p>
            </div>
            <div>
              <span style={sectionLabel}>Popular Collections</span>
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
                <li>Men&apos;s Sneakers</li>
                <li>Women&apos;s Activewear</li>
                <li>Slides &amp; Sandals</li>
                <li>High-Ankle Boots</li>
              </ul>
            </div>
            <div>
              <span style={sectionLabel}>Quality Guaranteed</span>
              <p style={{ fontSize: 13, color: "#777", margin: 0 }}>
                Size exchanges within 7 days. Every product is 7A Grade quality
                — durability and comfort guaranteed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
