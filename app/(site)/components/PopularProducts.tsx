"use client";
import ProductSlider from "@/components/ProductSlider";
import { Product } from "@/interfaces/Product";

const PopularProducts = ({ hotItems }: { hotItems: Product[] }) => {
  return <ProductSlider title="Popular Right Now" items={hotItems} />;
};

export default PopularProducts;
