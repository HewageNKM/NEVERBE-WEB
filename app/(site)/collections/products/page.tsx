import Products from "@/app/(site)/collections/products/components/Products";
import ProductsHeader from "@/app/(site)/collections/products/components/ProductsHeader";
import { getProducts } from "@/services/ProductService";
import { seoKeywords } from "@/constants";
import type { Metadata } from "next";

// OPTIMIZATION: Keep ISR at 1 hour. Perfect for SEO speed.
export const revalidate = 3600;

export const metadata: Metadata = {
  // SEO STRATEGY: Target the "Online Store" intent directly.
  title: {
    default: "Buy Shoes Online in Sri Lanka | Men's & Women's Footwear Catalog",
    template: "%s | NEVERBE",
  },
  description:
    "Browse the largest collection of shoes in Sri Lanka. From running shoes and sneakers to sandals and slides. Cash on delivery available island-wide.",
  keywords: [
    "buy shoes online sri lanka",
    "shoes price in sri lanka",
    "ladies shoes sri lanka",
    "gents shoes sri lanka",
    "sports shoes online",
    "canvas shoes sri lanka",
    "party shoes",
    "office shoes",
    ...seoKeywords,
  ],
  alternates: {
    canonical: "https://neverbe.lk/collections/products",
  },
  openGraph: {
    title: "Buy Shoes Online in Sri Lanka | Huge Collection",
    description:
      "Shop sneakers, sports shoes, and casual footwear at the best prices in Sri Lanka. Island-wide delivery.",
    url: "https://neverbe.lk/collections/products",
    type: "website",
    siteName: "NEVERBE",
    locale: "en_LK",
    images: [
      {
        url: "https://neverbe.lk/shoes-og.jpg",
        width: 1200,
        height: 630,
        alt: "NEVERBE Shoe Collection",
      },
    ],
  },
  metadataBase: new URL("https://neverbe.lk"),
};

const Page = async () => {
  let items: any = {};

  try {
    items = await getProducts(undefined, undefined, 1, 20);
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
      "A complete catalog of shoes available in Sri Lanka, including sneakers, running shoes, and slides.",
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
          image: product?.thumbnail?.url || "https://neverbe.lk/api/v1/og",
          description: product?.description || "Premium footwear in Sri Lanka.",
          url: `https://neverbe.lk/collections/products/${product?.id}`,
          brand: {
            "@type": "Brand",
            name: "NEVERBE",
          },
          offers: {
            "@type": "Offer",
            priceCurrency: "LKR",
            price: product?.sellingPrice || product?.price || "0.00",
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition", // Important for Google
          },
        },
      })),
    },
  };

  return (
    <main className="w-full relative mt-4 lg:mt-8 mb-10 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productListingSchema),
        }}
      />
      <ProductsHeader />

      <div className="w-full">
        <Products items={productList} />
      </div>

      {/* SEO Footer - Fine Print Style */}
      <section className="max-w-[1440px] mx-auto px-4 py-12 border-t border-gray-100 mt-12">
        <article className="grid md:grid-cols-2 gap-8 text-xs text-gray-400 leading-relaxed text-justify md:text-left">
          <div>
            <h2 className="text-black font-bold uppercase tracking-wide mb-2">
              The #1 Online Shoe Store in Sri Lanka
            </h2>
            <p className="mb-4">
              NEVERBE offers an extensive range of footwear designed to meet
              every lifestyle need. Our catalog features hundreds of options,
              from high-performance sports shoes to stylish casual sneakers. We
              provide the best shoe prices in Sri Lanka without compromising on
              quality.
            </p>
          </div>
          <div>
            <h3 className="text-black font-bold uppercase tracking-wide mb-2">
              Popular Categories
            </h3>
            <p>
              Men's Sneakers • Women's Running Shoes • Slides & Sandals •
              High-Ankle Boots • Gym Footwear
            </p>
          </div>
        </article>
      </section>
    </main>
  );
};

export default Page;
