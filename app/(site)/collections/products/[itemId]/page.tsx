import { cache } from "react";
import ProductHero from "@/app/(site)/collections/products/[itemId]/components/ProductHero";
import SimilarProducts from "@/app/(site)/collections/products/[itemId]/components/SimilarProducts";
import { notFound } from "next/navigation";
import { getProductById, getSimilarItems } from "@/services/ProductService";
import type { Metadata } from "next";
import { Product } from "@/interfaces/Product";

const getProduct = cache(async (id: string) : Promise<Product | null>=> {
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
  
  // Fetch data in parallel for speed
  // 1. getProduct is cached, so it won't hit the DB again if called in metadata
  // 2. getSimilarItems runs at the same time
  const itemData = getProduct(params.itemId);
  const similarData = getSimilarItems(params.itemId).catch(() => []);

  const [item, similarItems] = await Promise.all([itemData, similarData]);

  if (!item) return notFound();

  /* ✅ LEGAL SAFEGUARD: Structured Data */
  // Never claim the brand is "Nike" in Schema if it is a copy.
  // This is the #1 reason Google bans Merchant Center accounts.
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name, 
    image: [item.thumbnail?.url || "https://neverbe.lk/api/v1/og"],
    description: `High-quality inspired design of ${item.name}. Note: This is a premium replica intended for fashion purposes.`,
    sku: item.id,
    brand: {
      "@type": "Brand",
      name: "NEVERBE", // ALWAYS use your store name, never the trademarked brand
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

export default Page;