import React from "react";
import DealsHeader from "./components/DealsHeader";
import DealsProducts from "./components/DealsProducts";
import EmptyState from "@/components/EmptyState";
import { getDealsProducts } from "@/services/ProductService";
import { seoKeywords } from "@/constants";
import { Product } from "@/interfaces/Product";
import type { Metadata } from "next";


/* ✅ SEO-optimized metadata for Sri Lanka deals page */
export const metadata: Metadata = {
  title: {
    default: "Best Shoe Deals & Discounts | NEVERBE Sri Lanka",
    template: "%s | NEVERBE",
  },
  description:
    "Shop the best shoe deals and discounts in Sri Lanka. Save on Nike, Adidas, Puma, New Balance, and more high-quality replica sneakers, slides, and sandals at NEVERBE.",
  keywords: [
    "neverbe deals",
    "shoe deals sri lanka",
    "discount shoes sri lanka",
    "nike sale sri lanka",
    "adidas discount sri lanka",
    "puma shoes offers",
    "new balance sale",
    "sneaker offers sri lanka",
    "clearance shoes sri lanka",
    "online shoe discounts",
    ...seoKeywords,
  ],
  alternates: {
    canonical: "https://neverbe.lk/collections/deals",
  },
  openGraph: {
    title: "Shoe Deals & Discounts | NEVERBE Sri Lanka",
    description:
      "Find exclusive offers and discounts on Nike, Adidas, Puma, and New Balance replica shoes at NEVERBE — Sri Lanka’s trusted online sneaker store.",
    url: "https://neverbe.lk/collections/deals",
    siteName: "NEVERBE",
    type: "website",
    locale: "en_LK",
    images: [
      {
        url: "https://neverbe.lk/api/v1/og",
        width: 1200,
        height: 630,
        alt: "NEVERBE Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@neverbe",
    creator: "@neverbe",
    title: "Best Shoe Deals & Offers | NEVERBE Sri Lanka",
    description:
      "Shop high-quality Nike, Adidas, and Puma replica shoes at discounted prices — only at NEVERBE Sri Lanka.",
    images: ["https://neverbe.lk/api/v1/og"],
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
  category: "Ecommerce",
  metadataBase: new URL("https://neverbe.lk"),
};

const Page = async () => {
  let items: { dataList: Product[] } = { dataList: [] };

  try {
    items = await getDealsProducts(undefined, undefined, 1, 20);
  } catch (e) {
    console.error("Error fetching deal items:", e);
  }

  const dealsList = items?.dataList || [];

  const dealsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Shoe Deals and Discounts - NEVERBE Sri Lanka",
    description:
      "Find the best deals and discount offers on Nike, Adidas, Puma, and New Balance replica sneakers at NEVERBE Sri Lanka.",
    url: "https://neverbe.lk/collections/deals",
    inLanguage: "en-LK",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: dealsList.map((product: Product, index: number) => ({
        "@type": "Product",
        position: index + 1,
        name: product?.name,
        image: product?.thumbnail?.url || "https://neverbe.lk/api/v1/og",
        description:
          product?.description ||
          "Premium replica footwear available at discounted prices from NEVERBE Sri Lanka.",
        url: `https://neverbe.lk/product/${product?.id}`,
        offers: {
          "@type": "Offer",
          priceCurrency: "LKR",
          price: product?.sellingPrice || "0.00",
          availability: "https://schema.org/InStock",
          url: `https://neverbe.lk/product/${product?.slug || product?.id}`,
          priceValidUntil: new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 30
          ).toISOString(),
        },
      })),
    },
  };

  return (
    <main className="w-full relative lg:mt-28 mt-16 mb-5 overflow-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dealsSchema) }}
      />

      <DealsHeader />

      <div className="px-4">
        {dealsList.length > 0 ? (
          <DealsProducts items={dealsList} />
        ) : (
          <EmptyState heading="No deals available at this time." />
        )}
      </div>
    </main>
  );
};

export const dynamic = "force-dynamic";
export default Page;
