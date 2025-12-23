import Products from "@/app/(site)/collections/products/components/Products";
import ProductsHeader from "@/app/(site)/collections/products/components/ProductsHeader";
import { getProducts } from "@/services/ProductService";
import { seoKeywords } from "@/constants";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    default: "Shoes Online Sri Lanka | Men's & Women's Catalog",
    template: "%s | NEVERBE",
  },
  description:
    "Browse sneakers, running shoes, and slides in Sri Lanka. Cash on delivery available island-wide.",
  keywords: [
    "buy shoes online sri lanka",
    "shoes price in sri lanka",
    ...seoKeywords,
  ],
  alternates: { canonical: "https://neverbe.lk/collections/products" },
  openGraph: {
    title: "Buy Shoes Online in Sri Lanka | Huge Collection",
    description:
      "Shop sneakers and casual footwear at the best prices in Sri Lanka.",
    url: "https://neverbe.lk/collections/products",
    type: "website",
    siteName: "NEVERBE",
    locale: "en_LK",
    images: [
      {
        url: "https://neverbe.lk/shoes-og.jpg",
        width: 1200,
        height: 630,
        alt: "NEVERBE",
      },
    ],
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
    "@type": "CollectionPage",
    name: "Shoes & Footwear Collection Sri Lanka",
    description:
      "Catalog of sneakers, running shoes, and slides available in Sri Lanka.",
    url: "https://neverbe.lk/collections/products",
    inLanguage: "en-LK",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: productList.map((product: any, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product?.name,
          image: product?.thumbnail?.url,
          url: `https://neverbe.lk/collections/products/${product?.id}`,
          brand: { "@type": "Brand", name: "NEVERBE" },
          offers: {
            "@type": "Offer",
            priceCurrency: "LKR",
            price: product?.sellingPrice || "0.00",
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
          },
        },
      })),
    },
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
