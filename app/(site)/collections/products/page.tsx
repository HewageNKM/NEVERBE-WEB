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
        url: "https://neverbe.lk/logo-og.png",
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
    images: ["https://neverbe.lk/logo-og.png"],
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

      {/* NEVERBE Performance Header */}
      <div className="w-full max-w-content mx-auto px-4 md:px-12 py-12 md:py-20 text-left">
        <h1 className="text-3xl md:text-5xl font-display font-black uppercase italic tracking-tighter text-primary leading-none mb-4">
          Products
        </h1>
        <p className="text-muted max-w-xl text-sm md:text-base font-medium uppercase tracking-wide">
          Browse our complete collection. Sneakers, slides, and more for every
          style.
        </p>
      </div>

      {/* Product Grid */}
      <div className="max-w-content mx-auto px-4 md:px-12 pb-20">
        <div className="w-full">
          <Products items={productList} />
        </div>
      </div>

      {/* SEO Footer */}
      <section className="bg-surface-2 py-16 mt-20">
        <div className="max-w-content mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-24">
            <div className="max-w-sm">
              <h2 className="text-sm font-display font-black uppercase tracking-tight text-primary mb-6">
                Premium Footwear in Sri Lanka
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-4">
                NEVERBE offers an extensive range of footwear designed to meet
                every lifestyle need. From high-performance sports shoes to
                stylish casual sneakers, we provide the best shoe prices in Sri
                Lanka without compromising on quality.
              </p>
            </div>

            <div className="max-w-sm">
              <h3 className="text-sm font-display font-black uppercase tracking-tight text-primary mb-6">
                Popular Collections
              </h3>
              <ul className="text-sm text-muted space-y-3 font-medium">
                <li className="hover:text-accent cursor-pointer transition-colors">
                  Men&apos;s Lifestyle Sneakers
                </li>
                <li className="hover:text-accent cursor-pointer transition-colors">
                  Women&apos;s Performance Running
                </li>
                <li className="hover:text-accent cursor-pointer transition-colors">
                  Island-wide COD Footwear
                </li>
                <li className="hover:text-accent cursor-pointer transition-colors">
                  High-Ankle Gym Boots
                </li>
              </ul>
            </div>

            <div className="max-w-sm">
              <h3 className="text-sm font-display font-black uppercase tracking-tight text-primary mb-6">
                Quality Guaranteed
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                We accept size exchanges within 7 days. Every product is checked
                for quality (7A Grade) to ensure you get the durability and
                comfort you deserve.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
