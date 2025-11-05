import React from "react";
import Products from "@/app/collections/products/components/Products";
import ProductsHeader from "@/app/collections/products/components/ProductsHeader";
import { Metadata } from "next";
import { Item } from "@/interfaces";
import EmptyState from "@/components/EmptyState";
import { seoKeywords } from "@/constants";
import { getProducts } from "@/services/ProductService";
import { Product } from "@/interfaces/Product";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore a wide range of products available at NEVERBE. Nike, Adidas, Puma, New Balance Vietnam high copy shoes, flip flop, sandals, slides and more.",
  keywords: seoKeywords,
  twitter: {
    card: "summary",
    site: "@neverbe",
    creator: "@neverbe",
    title: "Products",
    description:
      "Explore a wide range of products available at NEVERBE. Nike, Adidas, Puma, New Balance Vietnam high copy shoes, flip flop, sandals, slides and more.",
  },
  openGraph: {
    title: "Products",
    description:
      "Explore a wide range of products available at NEVERBE. Nike, Adidas, Puma, New Balance Vietnam high copy shoes, flip flop, sandals, slides and more.",
    url: "https://neverbe.lk/collections/products",
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
  let items: Product[] = [];

  try {
    items = await getProducts(undefined, undefined, 1, 20);
  } catch (e) {
    console.error("Error fetching items:", e);
  }
  return (
    <main className="w-full relative lg:mt-28 mt-16 mb-5 overflow-clip">
      <ProductsHeader />
      <div className="px-4">
        {items.length > 0 ? (
          <Products items={items} />
        ) : (
          <EmptyState heading="No products available at this time." />
        )}
      </div>
    </main>
  );
};

export const dynamic = "force-dynamic";
export default Page;
