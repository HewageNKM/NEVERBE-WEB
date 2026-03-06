import { cache } from "react";
import ProductHero from "@/app/(site)/collections/products/[itemId]/components/ProductHero";
import SimilarProducts from "@/app/(site)/collections/products/[itemId]/components/SimilarProducts";
import { notFound } from "next/navigation";
import { getProductById, getSimilarItems } from "@/actions/productAction";
import type { Metadata } from "next";
import { Product } from "@/interfaces/Product";
import ProductFAQ from "./components/ProductFAQ";
import RecentlyViewedTracker from "./components/RecentlyViewedTracker";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Flex } from "antd";

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

  const safeTitle = `${item.name}`;

  return {
    title: safeTitle,
    description: `Experience the exclusive ${item.name} (Premium Edition) in Sri Lanka. Crafted with high-end materials, artisanal finish, and islandwide delivery available at NEVERBE.`,
    keywords: [
      item.name,
      "premium edition sneakers sri lanka",
      "high-end quality shoes",
      "exclusive design footwear",
      "artisan series sneakers",
      "neverbe premium",
      "mens luxury footwear",
    ],
    alternates: {
      canonical: `https://neverbe.lk/collections/products/${item.id}`,
    },
    openGraph: {
      title: safeTitle,
      description: `Shop ${item.name} - Premium Edition in Sri Lanka.`,
      url: `https://neverbe.lk/collections/products/${item.id}`,
      type: "website",
      siteName: "NEVERBE",
      locale: "en_LK",
      images: [
        {
          url: (
            item.thumbnail?.url || "https://neverbe.lk/logo-og.png"
          ).replace(/^http:\/\//, "https://"),
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: `${item.name} - Premium Edition`,
        },
        {
          url: (
            item.thumbnail?.url || "https://neverbe.lk/logo-og.png"
          ).replace(/^http:\/\//, "https://"),
          width: 600,
          height: 600,
          type: "image/jpeg",
          alt: `${item.name} - Square View`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: safeTitle,
      description: `Explore ${item.name} at NEVERBE. Premium quality footwear and apparel in Sri Lanka.`,
      images: [
        (item.thumbnail?.url || "https://neverbe.lk/logo-og.png").replace(
          /^http:\/\//,
          "https://",
        ),
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
    image: [item.thumbnail?.url || "https://neverbe.lk/logo-og.png"],
    description: `High-end inspired design of ${item.name}. Note: This is a premium designer-inspired masterpiece intended for fashion enthusiasts.`,
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

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: "Products", href: "/collections/products" },
    {
      label: item.category || "Footwear",
      href: `/collections/products?category=${encodeURIComponent(
        item.category || "",
      )}`,
    },
    { label: item.name },
  ];

  return (
    <Flex
      vertical
      className="w-full relative mt-[80px] md:mt-[100px] min-h-screen px-4 md:px-8 bg-white text-primary"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {/* Breadcrumbs Navigation */}
      <Flex
        vertical
        gap={16}
        className="w-full max-w-[1600px] mx-auto pt-4 pb-2 text-primary px-4 md:px-10 lg:px-16"
      >
        <Breadcrumbs items={breadcrumbItems} />
      </Flex>
      <ProductHero item={item} />
      <ProductFAQ />
      <SimilarProducts items={similarItems || []} />
      <RecentlyViewedTracker product={item} />
    </Flex>
  );
};

export default Page;
