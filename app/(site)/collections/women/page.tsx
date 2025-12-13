export const revalidate = 3600;

import CollectionProducts from "@/app/(site)/collections/components/CollectionProducts";
import { getProducts } from "@/services/ProductService";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Women's Sneakers & Footwear | NEVERBE",
  description:
    "Shop the best collection of women's sneakers in Sri Lanka. Stylish, comfortable, and premium quality footwear.",
  openGraph: {
    title: "Women's Sneakers & Footwear | NEVERBE",
    description: "Shop the best collection of women's sneakers in Sri Lanka.",
    url: "https://neverbe.lk/collections/women",
    type: "website",
    images: [
      {
        url: "https://neverbe.lk/logo-og.png", // Ensure this image is generic/appealing
        width: 1200,
        height: 630,
        alt: "NEVERBE Women's Collection",
      },
    ],
  },
};

const WomenPage = async () => {
  // Filter by 'Women' tag
  const { total, dataList } = await getProducts(["Women"], undefined, 1, 20);

  return (
    <main className="w-full min-h-screen bg-white pt-8">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 mb-8 text-left">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
          Women
        </h1>
        <p className="text-gray-500 max-w-xl text-sm md:text-base">
          Discover sneakers and slides curated for women.
        </p>
      </div>

      <CollectionProducts
        initialItems={dataList}
        collectionType="women"
        tagName="Women"
        total={total}
      />
    </main>
  );
};

export default WomenPage;
