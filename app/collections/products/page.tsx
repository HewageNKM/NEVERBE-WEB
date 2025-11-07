import React from "react";
import Products from "@/app/collections/products/components/Products";
import ProductsHeader from "@/app/collections/products/components/ProductsHeader";
import EmptyState from "@/components/EmptyState";
import { getProducts } from "@/services/ProductService";
import { seoKeywords } from "@/constants";
import type { Metadata, Viewport } from "next";


export const metadata: Metadata = {
  title: {
    default: "Shop All Products | NEVERBE Sri Lanka",
    template: "%s | NEVERBE",
  },
  description:
    "Discover NEVERBE’s full collection of high-quality Nike, Adidas, Puma, and New Balance replica shoes. Browse sneakers, slides, sandals, and flip flops online in Sri Lanka.",
  keywords: [
    "neverbe products",
    "nike shoes sri lanka",
    "adidas sri lanka",
    "puma shoes sri lanka",
    "new balance sri lanka",
    "sneakers sri lanka",
    "copy shoes sri lanka",
    "slides sri lanka",
    "flip flops sri lanka",
    ...seoKeywords,
  ],
  alternates: {
    canonical: "https://neverbe.lk/collections/products",
  },
  openGraph: {
    title: "Shop All Products | NEVERBE Sri Lanka",
    description:
      "Browse Nike, Adidas, New Balance, and Puma replica shoes and more at NEVERBE — Sri Lanka’s premier online sneaker store.",
    url: "https://neverbe.lk/collections/products",
    type: "website",
    siteName: "NEVERBE",
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
    title: "Shop All Products | NEVERBE Sri Lanka",
    description:
      "Discover premium replica sneakers and slides at NEVERBE — Sri Lanka’s trusted online shoe store.",
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
  let items: any = {};

  try {
    items = await getProducts(undefined, undefined, 1, 20);
  } catch (e) {
    console.error("Error fetching items:", e);
  }

  const productList = items?.dataList || [];

  const productListingSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "All Products - NEVERBE",
    description:
      "Explore NEVERBE’s full collection of Nike, Adidas, Puma, and New Balance replica sneakers, slides, and sandals available across Sri Lanka.",
    url: "https://neverbe.lk/collections/products",
    inLanguage: "en-LK",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: productList.map((product: any, index: number) => ({
        "@type": "Product",
        position: index + 1,
        name: product?.name,
        image: product?.thumbnail?.url || "https://neverbe.lk/api/v1/og",
        description:
          product?.description ||
          "Premium replica footwear available at NEVERBE Sri Lanka.",
        url: `https://neverbe.lk/product/${product?.id}`,
        offers: {
          "@type": "Offer",
          priceCurrency: "LKR",
          price: product?.price || "0.00",
          availability: "https://schema.org/InStock",
          url: `https://neverbe.lk/product/${product?.id}`,
        },
      })),
    },
  };

  return (
    <main className="w-full relative lg:mt-28 mt-16 mb-5 overflow-clip">
      {/* ✅ Inject Product Listing Schema for Google */}
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
    </main>
  );
};

export const dynamic = "force-dynamic";
export default Page;
