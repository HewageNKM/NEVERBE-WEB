import React from "react";
import { Metadata } from "next";
import { Product } from "@/interfaces/Product";
import CategoryProducts from "./components/CategoryProducts";
import CategoryHeader from "./components/CategoryHeader";
import { getProductsByCategory } from "@/services/ProductService";

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const title = `${params.category.replace("%20", " ")}`;
  const description = `Browse the best ${title} products at NEVERBE. Discover quality items and exclusive deals.`;

  return {
    title,
    description,
    keywords: `${title}, NEVERBE, online shopping, categories`,
    openGraph: {
      title,
      description,
      url: `https://neverbe.lk/collections/categories/${params.category}`,
      type: "website",
    },
  };
}

const Page = async ({ params }: { params: { category: string } }) => {
  const category = params.category.replace("%20", " ");
  let items: Product[] = [];

  try {
    const res = await getProductsByCategory(category, 1, 20);
    items = res.dataList;
  } catch (e) {
    console.error("Error fetching items:", e);
  }

  return (
    <main className="w-full relative lg:mt-28 mt-16 mb-5 overflow-hidden">
      <section className="w-full">
        <CategoryHeader category={category} />
        <CategoryProducts items={items || []} category={category} />
      </section>
    </main>
  );
};

export default Page;
export const dynamic = "force-dynamic";
