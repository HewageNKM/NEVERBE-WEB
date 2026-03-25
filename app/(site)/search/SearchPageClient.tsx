"use client";

import React from "react";
import { Product } from "@/interfaces/Product";
import ProductGrid from "@/components/ProductGrid";
import { Typography, Breadcrumb, Flex } from "antd";
import Link from "next/link";

const { Title, Text } = Typography;

interface SearchPageClientProps {
  query: string;
  products: Product[];
}

export default function SearchPageClient({ query, products }: SearchPageClientProps) {
  return (
    <div className="max-w-content mx-auto px-4 lg:px-12 py-8 lg:py-16 animate-fade">
      {/* Breadcrumbs */}
      <Breadcrumb
        className="mb-8"
        items={[
          { title: <Link href="/">Home</Link> },
          { title: "Search" },
        ]}
      />

      {/* Header Section */}
      <Flex vertical gap={4} className="mb-12">
        <Title level={1} className="uppercase tracking-tighter m-0 font-black">
          {products.length > 0 ? `Search results for "${query}"` : `No results for "${query}"`}
        </Title>
        <Text type="secondary" className="font-bold uppercase tracking-widest text-xs">
          Found {products.length} {products.length === 1 ? "product" : "products"}
        </Text>
      </Flex>

      {/* Results Grid */}
      <ProductGrid 
        products={products} 
        loading={false} 
        emptyHeading="We couldn't find any matches"
        emptySubHeading="Try checking your spelling or using more general terms."
      />
      
      {/* Bottom spacing */}
      <div className="pb-20" />
    </div>
  );
}
