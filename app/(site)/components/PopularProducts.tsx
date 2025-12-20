"use client";
import ProductSlider from "@/components/ProductSlider";
import { Product } from "@/interfaces/Product";

const PopularProducts = ({ hotItems }: { hotItems: Product[] }) => {
  return (
    <ProductSlider
      title="Best Sellers"
      items={hotItems}
      subtitle="Shop our most-loved shoes"
      viewAllHref="/collections/products"
    />
  );
};

export default PopularProducts;
