import React from "react";
import ProductHero from "@/app/collections/products/[itemId]/components/ProductHero";
import { notFound } from "next/navigation";
import { Product } from "@/interfaces/Product";
import SimilarProducts from "@/app/collections/products/[itemId]/components/SimilarProducts";
import { getProductById, getSimilarItems } from "@/services/ProductService";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { itemId: string } }): Promise<Metadata> {
  let item: Product | null = null;

  try {
    item = await getProductById(params.itemId);
  } catch (e) {
    console.error(e);
  }

  if (!item) {
    return {
      title: "Product Not Found - NEVERBE",
      description: "This product could not be found.",
    };
  }

  const title = `${item.name} | NEVERBE Sri Lanka`;
  const description = item.description || `Discover ${item.name} at NEVERBE. Premium replica shoes in Sri Lanka.`;

  return {
    title,
    description,
    keywords: [
      item.name,
      "NEVERBE",
      "replica shoes Sri Lanka",
      "Nike replica",
      "Adidas replica",
      "New Balance replica",
      "sneakers Sri Lanka",
    ],
    alternates: {
      canonical: `https://neverbe.lk/collections/products/${item.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://neverbe.lk/collections/products/${item.id}`,
      type: "website",
      siteName: "NEVERBE",
      images: [
        {
          url: item.thumbnail?.url || "https://neverbe.lk/api/v1/og",
          width: 1200,
          height: 630,
          alt: item.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@neverbe",
      creator: "@neverbe",
      title,
      description,
      images: [item.thumbnail?.url || "https://neverbe.lk/api/v1/og"],
    },
  };
}

const Page = async ({ params }: { params: { itemId: string } }) => {
  let item: Product | null = null;

  try {
    item = await getProductById(params.itemId);
  } catch (e) {
    console.error(e);
  }

  if (!item) return notFound();

  let similarItems: Product[] = [];
  try {
    similarItems = await getSimilarItems(item.id);
  } catch (e) {
    console.error("Error fetching similar items:", e);
  }

  /* ✅ Structured Data for Product + Offer */
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    image: [item.thumbnail?.url || "https://neverbe.lk/api/v1/og"],
    description: item.description || `Buy ${item.name} at NEVERBE Sri Lanka`,
    sku: item.id,
    brand: {
      "@type": "Brand",
      name: "NEVERBE",
    },
    offers: {
      "@type": "Offer",
      url: `https://neverbe.lk/collections/products/${item.id}`,
      priceCurrency: "LKR",
      price: item.sellingPrice || "0.00",
      availability: "https://schema.org/InStock",
      priceValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    },
  };

  return (
    <main className="w-full lg:mt-32 mt-20 md:mt-28 overflow-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="md:px-8 px-4 py-4">
        <ProductHero item={item} />
        <SimilarProducts items={similarItems || []} />
      </div>
    </main>
  );
};

export const dynamic = "force-dynamic";
export default Page;
