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
          { title: <Link href="/" className="text-primary-dark/50 hover:text-accent transition-colors font-bold uppercase text-[10px] tracking-widest">Home</Link> },
          { title: <span className="text-primary-dark font-black uppercase text-[10px] tracking-widest">Search</span> },
        ]}
      />

      {/* Header Section */}
      <Flex vertical gap={4} className="mb-12">
        <Title level={1} className="uppercase tracking-tighter m-0 font-black text-primary-dark">
          {products.length > 0 ? (
            <>
              Search results for <span className="text-accent underline decoration-accent/30 underline-offset-8">"{query}"</span>
            </>
          ) : (
            <>
              No results for <span className="text-accent">"{query}"</span>
            </>
          )}
        </Title>
        <Text className="font-black uppercase tracking-widest text-[10px] text-primary-dark opacity-40">
          Found <span className="text-accent">{products.length}</span> {products.length === 1 ? "product" : "products"}
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
