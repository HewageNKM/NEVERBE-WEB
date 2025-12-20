"use client";
import ProductSlider from "@/components/ProductSlider";
import { Product } from "@/interfaces/Product";

const NewArrivals = ({ arrivals }: { arrivals: Product[] }) => {
  return <ProductSlider title="New Arrivals" items={arrivals} />;
};

export default NewArrivals;
