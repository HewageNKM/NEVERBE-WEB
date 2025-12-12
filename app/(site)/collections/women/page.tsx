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
  },
};

const WomenPage = async () => {
  // Filter by 'Women' tag
  const { total, dataList } = await getProducts(["Women"], undefined, 1, 20);

  return (
    <main className="w-full min-h-screen bg-white pt-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
          Women's Collection
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
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
