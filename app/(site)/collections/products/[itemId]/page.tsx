import { cache } from "react";
import ProductHero from "@/app/(site)/collections/products/[itemId]/components/ProductHero";
import SimilarProducts from "@/app/(site)/collections/products/[itemId]/components/SimilarProducts";
import { notFound } from "next/navigation";
import { getProductById, getSimilarItems } from "@/services/ProductService";
import type { Metadata } from "next";
import { Product } from "@/interfaces/Product";
import ProductFAQ from "./components/ProductFAQ";

const getProduct = cache(async (id: string): Promise<Product | null> => {
  try {
    return await getProductById(id);
  } catch (e) {
    console.error(e);
    return null;
  }
});

export async function generateMetadata(context: {
  params: Promise<{ itemId: string }>;
}): Promise<Metadata> {
  const params = await context.params;
  const item = await getProduct(params.itemId);

  if (!item) {
    return {
      title: "Item Not Found | NEVERBE",
      description: "The requested sneaker could not be found.",
      robots: { index: false, follow: true },
    };
  }

  const safeTitle = `${item.name} - Premium 7A/Master Copy`;

  return {
    title: safeTitle,
    description: `Get the best deal on ${item.name} (Master Copy) in Sri Lanka. High-quality materials, 7A grade finish, and islandwide delivery available at NEVERBE.`,
    keywords: [
      item.name,
      "first copy sneakers sri lanka",
      "7a quality shoes",
      "master copy shoes",
      "premium copy sneakers",
      "neverbe shoes",
      "mens fashion footwear",
    ],
    alternates: {
      canonical: `https://neverbe.lk/collections/products/${item.id}`,
    },
    openGraph: {
      title: safeTitle,
      description: `Shop ${item.name} - High Quality First Copy in Sri Lanka.`,
      url: `https://neverbe.lk/collections/products/${item.id}`,
      type: "website",
      siteName: "NEVERBE",
      images: [
        {
          url: item.thumbnail?.url || "https://neverbe.lk/api/v1/og",
          width: 1200,
          height: 630,
          alt: `${item.name} - Detailed View`,
        },
      ],
    },
  };
}

const Page = async (context: { params: Promise<{ itemId: string }> }) => {
  const params = await context.params;

  const itemData = getProduct(params.itemId);
  const similarData = getSimilarItems(params.itemId).catch(() => []);

  const [item, similarItems] = await Promise.all([itemData, similarData]);

  if (!item) return notFound();

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    image: [item.thumbnail?.url || "https://neverbe.lk/api/v1/og"],
    description: `High-quality inspired design of ${item.name}. Note: This is a premium replica intended for fashion purposes.`,
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
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "NEVERBE",
      },
    },
  };

  return (
    <main className="w-full relative mt-[80px] md:mt-[100px] min-h-screen px-4 md:px-8 bg-white text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductHero item={item} />
      <ProductFAQ />
      <SimilarProducts items={similarItems || []} />
    </main>
  );
};

export default Page;
