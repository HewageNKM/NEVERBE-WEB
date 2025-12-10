import Products from "@/app/(site)/collections/products/components/Products";
import ProductsHeader from "@/app/(site)/collections/products/components/ProductsHeader";
import EmptyState from "@/components/EmptyState";
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
    ...seoKeywords, // Your existing keywords
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
        url: "https://neverbe.lk/api/v1/og", // Ensure this image is generic/appealing
        width: 1200,
        height: 630,
        alt: "NEVERBE Shoe Collection",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
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

  /* ✅ Structured Data: Optimized for Google Shopping / Listings */
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
    <main className="w-full relative lg:mt-28 mt-16 mb-5 overflow-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productListingSchema),
        }}
      />

      <ProductsHeader />

      <div className="px-4">
        {productList.length > 0 ? (
          <Products items={productList} />
        ) : (
          <EmptyState heading="No products available at this time." />
        )}
      </div>

      {/* ✅ SEO FOOTER TEXT
        This is the "Secret Sauce" for ranking category pages. 
        It sits at the bottom, so it doesn't annoy users, but Google reads it 
        to understand that this page covers ALL types of shoes.
      */}
      <section className="container mx-auto px-4 py-12 border-t border-gray-100 mt-12 bg-gray-50 rounded-xl">
        <article className="prose prose-sm max-w-none text-gray-600">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Shop the Best Collection of Shoes in Sri Lanka
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p>
                Are you looking to{" "}
                <strong>buy shoes online in Sri Lanka</strong>? You have come to
                the right place. NEVERBE offers an extensive range of footwear
                designed to meet every lifestyle need. Our catalog features
                hundreds of options, from high-performance{" "}
                <strong>sports shoes</strong>
                to stylish <strong>casual sneakers</strong>.
              </p>
              <p className="mt-2">
                We understand that price matters. That is why we provide the
                best <strong>shoe prices in Sri Lanka</strong>
                without compromising on quality. Whether you are looking for
                budget-friendly daily wear or premium
                <strong>Master Copy sneakers</strong> that look exactly like the
                big brands, we have something for everyone.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Explore Our Categories
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Men's Shoes:</strong> From formal wear to gym
                  trainers, find durable and stylish options for men.
                </li>
                <li>
                  <strong>Running Shoes:</strong> Lightweight, breathable, and
                  comfortable shoes perfect for jogging or the gym.
                </li>
                <li>
                  <strong>Slides & Sandals:</strong> The perfect choice for Sri
                  Lanka's tropical weather. Comfortable and trendy.
                </li>
                <li>
                  <strong>Boots:</strong> Rugged footwear for a bold fashion
                  statement.
                </li>
              </ul>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
};

export default Page;
