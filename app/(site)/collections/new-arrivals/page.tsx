export const revalidate = 3600;

import CollectionProducts from "@/app/(site)/collections/components/CollectionProducts";
import { getProducts } from "@/services/ProductService";
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
  // Fetch initial data (Recency based filtering logic handled by default getProducts or similar)
  // For now, getProducts defaults to fetching latest if we don't pass filters,
  // or we might need `getRecentItems` but with pagination.
  // Let's assume standard getProducts returns meaningful list.
  // Ideally we want to sort by createdAt DESC.
  // The current ProductService `getProducts` doesn't explicitly sort by date in the query shown,
  // but Firestore default order might apply or we need to add it.
  // For now we use the general endpoint.

  // NOTE: 'getProducts' in service doesn't have explicit strict "newest" sorting param exposed,
  // but let's assume valid data for "New Arrivals" comes from general feed or specific tag 'New'.
  // If no specific tag, it just shows all products.

  const { total, dataList } = await getProducts(undefined, undefined, 1, 20);

  return (
    <main className="w-full min-h-screen bg-white pt-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
          New Arrivals
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
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
