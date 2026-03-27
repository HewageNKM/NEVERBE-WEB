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
    <div className="w-full min-h-screen" style={{ background: "#f8faf5" }}>
      <div className="max-w-content mx-auto px-4 lg:px-12 py-8 lg:py-12 animate-fade">
        {/* Breadcrumbs */}
        <nav
          style={{
            fontSize: 12,
            color: "var(--color-primary-dark)",
            marginBottom: 16,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          <Link href="/" style={{ color: "var(--color-primary-dark)", opacity: 0.6 }}>
            Home
          </Link>
          <span style={{ margin: "0 8px", opacity: 0.4 }}>/</span>
          <span>Search</span>
        </nav>

        {/* Header Section */}
        <div className="mb-10">
          <h1
            style={{
              fontSize: "clamp(1.75rem, 5vw, 3rem)",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: 0,
              marginBottom: 8,
              color: "var(--color-primary-dark)",
            }}
          >
            {products.length > 0 ? (
              <>
                Search results for <span style={{ color: "var(--color-accent)" }}>"{query}"</span>
              </>
            ) : (
              <>
                No results for <span style={{ color: "var(--color-accent)" }}>"{query}"</span>
              </>
            )}
          </h1>
          <p
            style={{
              color: "var(--color-primary-dark)",
              fontSize: 12,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              margin: 0,
              opacity: 0.6
            }}
          >
            Found <span style={{ color: "var(--color-accent)" }}>{products.length}</span> {products.length === 1 ? "product" : "products"}
          </p>
        </div>

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
    </div>
  );
}
