import Products from "@/app/(site)/collections/products/components/Products";
import ProductsHeader from "@/app/(site)/collections/products/components/ProductsHeader";
import { getProducts } from "@/services/ProductService";
import { seoKeywords } from "@/constants";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Buy Shoes Online Sri Lanka | Men's & Women's Footwear Collection",
  description:
    "Browse sneakers, running shoes, slides, sandals & casual footwear in Sri Lanka. Cash on Delivery available island-wide. Best prices on premium 7A quality shoes.",
  keywords: [
    "buy shoes online sri lanka",
    "shoes price in sri lanka",
    "mens shoes sri lanka",
    "womens shoes sri lanka",
    "sneakers colombo",
    "running shoes sri lanka",
    ...seoKeywords,
  ],
  alternates: { canonical: "https://neverbe.lk/collections/products" },
  openGraph: {
    title: "Buy Shoes Online in Sri Lanka | NEVERBE Collection",
    description:
      "Shop the largest footwear collection in Sri Lanka. Sneakers, running shoes, slides & sandals at best prices. Cash on Delivery island-wide.",
    url: "https://neverbe.lk/collections/products",
    type: "website",
    siteName: "NEVERBE",
    locale: "en_LK",
    images: [
      {
        url: "https://neverbe.lk/shoes-og.jpg",
        width: 1200,
        height: 630,
        alt: "NEVERBE - Buy Shoes Online Sri Lanka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Shoes Online in Sri Lanka | NEVERBE",
    description: "Shop sneakers & footwear. Cash on Delivery island-wide.",
    images: ["https://neverbe.lk/shoes-og.jpg"],
  },
  metadataBase: new URL("https://neverbe.lk"),
};

const Page = async () => {
  let items: any = {};

  try {
    // Increased initial fetch to 30 for a fuller, more premium grid
    items = await getProducts(undefined, undefined, 1, 30);
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
    <main className="w-full bg-surface min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productListingSchema),
        }}
      />

      {/* Page Header */}
      <div className="w-full max-w-content mx-auto px-4 md:px-12 pt-10 pb-6 text-left">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          All Products
        </p>
        <h1 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tighter text-gray-900 leading-none mb-3">
          Collection
        </h1>
        <p
          className="text-muted max-w-xl text-sm font-medium"
          style={{ color: "#888" }}
        >
          Browse sneakers, apparel, accessories and more.
        </p>
      </div>

      {/* Product Grid */}
      <div className="max-w-content mx-auto px-4 md:px-12 pb-20">
        <div className="w-full">
          <Products items={productList} />
        </div>
      </div>

      {/* SEO Footer */}
      <section className="py-12 mt-8 border-t border-gray-100">
        <div className="max-w-content mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
                Premium Fashion in Sri Lanka
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                NEVERBE offers shoes, clothing, activewear, and accessories —
                all with island-wide Cash on Delivery.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
                Popular Collections
              </h3>
              <ul className="text-sm text-gray-500 space-y-2 font-medium">
                <li>Men&apos;s Sneakers</li>
                <li>Women&apos;s Activewear</li>
                <li>Slides &amp; Sandals</li>
                <li>High-Ankle Boots</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
                Quality Guaranteed
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Size exchanges within 7 days. Every product is 7A Grade quality
                — durability and comfort guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
