import React from "react";
import type { Metadata } from "next";
import { Item } from "@/interfaces";
import BrandProducts from "./components/BrandProducts";
import BrandHeader from "./components/BrandHeader";
import { getProductsByBrand } from "@/services/ProductService";


export async function generateMetadata( context: { params: Promise<{ brand: string }> }): Promise<Metadata> {
  const params = await context.params;
  const decodedBrand = decodeURIComponent(params.brand).replace(/-/g, " ");
  const capitalizedBrand =
    decodedBrand.charAt(0).toUpperCase() + decodedBrand.slice(1);

  const title = `${capitalizedBrand} Collection | NEVERBE Sri Lanka`;
  const description = `Shop premium ${capitalizedBrand} shoes and apparel at NEVERBE Sri Lanka. Discover high-quality replicas of Nike, Adidas, Puma, and New Balance with exclusive deals and fast delivery.`;

  return {
    title,
    description,
    keywords: [
      `${capitalizedBrand}`,
      `${capitalizedBrand} Sri Lanka`,
      `${capitalizedBrand} online store`,
      `${capitalizedBrand} offers`,
      `${capitalizedBrand} discounts`,
      "neverbe",
      "neverbe.lk",
      "shoes sri lanka",
      "online shoe store",
    ],
    alternates: {
      canonical: `https://neverbe.lk/collections/brands/${params.brand}`,
    },
    openGraph: {
      title,
      description,
      url: `https://neverbe.lk/collections/brands/${params.brand}`,
      type: "website",
      siteName: "NEVERBE",
      locale: "en_LK",
      images: [
        {
          url: "https://neverbe.lk/api/v1/og",
          width: 1200,
          height: 630,
          alt: `${capitalizedBrand} - NEVERBE Sri Lanka`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@neverbe",
      creator: "@neverbe",
      title,
      description,
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
}

const Page = async ( context: { params: Promise<{ brand: string }> }) => {
  const params = await context.params;
  const brand = decodeURIComponent(params.brand).replace(/-/g, " ");
  let items: Item[] = [];

  try {
    const res = await getProductsByBrand(brand, 1, 20);
    items = res.dataList || [];
  } catch (e) {
    console.error("Error fetching brand products:", e);
  }

  const brandSchema = {
    "@context": "https://schema.org",
    "@type": "Brand",
    name: brand,
    url: `https://neverbe.lk/collections/brands/${encodeURIComponent(brand)}`,
    logo: "https://neverbe.lk/api/v1/og",
    description: `Explore ${brand} shoes and collections available at NEVERBE Sri Lanka.`,
  };

  const productListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${brand} Collection - NEVERBE Sri Lanka`,
    description: `Shop authentic-looking ${brand} replica shoes available in Sri Lanka with exclusive deals.`,
    url: `https://neverbe.lk/collections/brands/${encodeURIComponent(brand)}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((product, index) => ({
        "@type": "Product",
        position: index + 1,
        name: product.name,
        image: product.thumbnail?.url || "https://neverbe.lk/api/v1/og",
        description:
          product.description ||
          `Shop ${product.name} available now at NEVERBE Sri Lanka.`,
        url: `https://neverbe.lk/product/${product.id}`,
        brand: {
          "@type": "Brand",
          name: brand,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "LKR",
          price: product.sellingPrice || "0.00",
          availability: "https://schema.org/InStock",
          url: `https://neverbe.lk/product/${product.id}`,
          priceValidUntil: new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 30
          ).toISOString(),
        },
      })),
    },
  };

  return (
    <main className="w-full relative lg:mt-28 mt-16 mb-5 overflow-hidden">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([brandSchema, productListSchema]),
        }}
      />

      <section className="w-full">
        <BrandHeader brand={brand} />
        <BrandProducts items={items} brand={brand} />
      </section>
    </main>
  );
};

export default Page;