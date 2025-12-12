export const revalidate = 3600;

import CollectionProducts from "@/app/(site)/collections/components/CollectionProducts";
import { getNewArrivals } from "@/services/ProductService";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Arrivals - Latest Sneaker Drops | NEVERBE",
  description:
    "Shop the latest arrivals at NEVERBE. Discover the newest 7A quality sneakers, slides, and footwear drops in Sri Lanka.",
  openGraph: {
    title: "New Arrivals - Latest Sneaker Drops | NEVERBE",
    description:
      "Discover the newest 7A quality sneakers, slides, and footwear drops in Sri Lanka.",
    url: "https://neverbe.lk/collections/new-arrivals",
    type: "website",
  },
};

const NewArrivalsPage = async () => {
  const { total, dataList } = await getNewArrivals(1, 20);

  return (
    <main className="w-full min-h-screen bg-white pt-8">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 mb-8 text-left">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
          New Arrivals
        </h1>
        <p className="text-gray-500 max-w-xl text-sm md:text-base">
          Fresh drops. The latest styles added to our collection.
        </p>
      </div>

      <CollectionProducts
        initialItems={dataList}
        collectionType="new-arrivals"
        total={total}
      />
    </main>
  );
};

export default NewArrivalsPage;
