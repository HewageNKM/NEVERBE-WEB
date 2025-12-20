"use client";
import ProductSlider from "@/components/ProductSlider";
import { Product } from "@/interfaces/Product";

const NewArrivals = ({ arrivals }: { arrivals: Product[] }) => {
  return (
    <ProductSlider
      title="New Arrivals"
      items={arrivals}
      subtitle="Just dropped — Shop the latest styles"
      viewAllHref="/collections/new-arrivals"
    />
  );
};

export default NewArrivals;
