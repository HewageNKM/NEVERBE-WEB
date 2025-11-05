import React from "react";
import { Metadata } from "next";
import EmptyState from "@/components/EmptyState";
import { seoKeywords } from "@/constants";
import { getDealsProducts } from "@/services/ProductService";
import { Product } from "@/interfaces/Product";
import DealsHeader from "./components/DealsHeader";
import DealsProducts from "./components/DealsProducts";

export const metadata: Metadata = {
  title: "Deals",
  description:
    "Find the best deals and discounts on shoes, sandals, and sneakers at NEVERBE. Save more on top brands like Nike, Adidas, Puma, and more.",
  keywords: [...seoKeywords, "discount", "offers", "sale", "deals"],
  twitter: {
    card: "summary",
    site: "@neverbe",
    creator: "@neverbe",
    title: "Deals",
    description:
      "Find the best deals and discounts on shoes, sandals, and sneakers at NEVERBE.",
  },
  openGraph: {
    title: "Deals",
    description:
      "Find the best deals and discounts on shoes, sandals, and sneakers at NEVERBE.",
    url: "https://neverbe.lk/collections/deals",
    type: "website",
    images: [
      {
        url: "https://neverbe.lk/api/v1/og",
        width: 260,
        height: 260,
        alt: "NEVERBE Logo",
      },
    ],
  },
};

const Page = async () => {
  let items: { dataList: Product[] } = { dataList: [] };

  try {
    items = await getDealsProducts(undefined, undefined, 1, 20);
  } catch (e) {
    console.error("Error fetching deal items:", e);
  }

  return (
    <main className="w-full relative lg:mt-28 mt-16 mb-5 overflow-clip">
      <DealsHeader />
      <div className="px-4">
        {items.dataList.length > 0 ? (
          <DealsProducts items={items.dataList || []} />
        ) : (
          <EmptyState heading="No deals available at this time." />
        )}
      </div>
    </main>
  );
};

export default Page;
export const dynamic = "force-dynamic";

