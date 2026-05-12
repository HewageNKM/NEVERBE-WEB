"use client";

import React from "react";
import { Typography, Flex } from "antd";
import Image from "next/image";
import Link from "next/link";

const { Text, Title } = Typography;

const BrandsSlider = ({ items }: { items: any[] }) => {
  if (!items || items.length === 0) return null;

  // Ensure items have necessary properties and double them for seamless marquee
  const sanitizedItems = items.map(item => ({
    ...item,
    displayName: item.name || item.label || "Brand",
  }));
  const doubledItems = [...sanitizedItems, ...sanitizedItems];

  return (
    <section
      className="w-full overflow-hidden"
      style={{
        background: "var(--color-primary)",
        padding: "64px 0",
      }}
    >
      <div className="max-w-content mx-auto px-4 md:px-8 mb-10">
        <Flex vertical align="center" gap={4}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "var(--color-accent)",
            }}
          >
            Trusted Brands
          </Text>
          <Title
            level={3}
            style={{
              margin: 0,
              textTransform: "uppercase",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: "#fff",
              textAlign: "center",
            }}
          >
            Our Brands
          </Title>
          <Text
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 13,
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            Discover the latest from a wide range of brands
          </Text>
        </Flex>
      </div>

      {/* Marquee Row 1 — Left to Right */}
      <div className="relative w-full overflow-hidden mb-6">
        <div className="flex animate-marquee" style={{ width: "fit-content" }}>
          {doubledItems.map((brand, idx) => (
            <Link
              key={`row1-${brand.id}-${idx}`}
              href={`/collections/products?brand=${encodeURIComponent(
                (brand?.displayName || "").toLowerCase(),
              )}`}
              className="flex-shrink-0 mx-8 flex items-center justify-center opacity-80 hover:opacity-100 transition-all duration-300"
              style={{ height: 60, minWidth: 140 }}
            >
              {brand.logoUrl ? (
                <Image
                  src={brand.logoUrl}
                  alt={brand.displayName}
                  width={120}
                  height={60}
                  className="object-contain h-10 w-auto opacity-90 filter grayscale contrast-200 invert"
                />
              ) : (
                <Text
                  strong
                  style={{
                    fontSize: 16,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "rgba(255,255,255,0.6)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {brand.displayName}
                </Text>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Marquee Row 2 — Right to Left */}
      <div className="relative w-full overflow-hidden">
        <div
          className="flex animate-marquee-reverse"
          style={{ width: "fit-content" }}
        >
          {doubledItems
            .slice()
            .reverse()
            .map((brand, idx) => (
              <Link
                key={`row2-${brand.id}-${idx}`}
                href={`/collections/products?brand=${encodeURIComponent(
                  (brand?.displayName || "").toLowerCase(),
                )}`}
                className="mx-8 shrink-0 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-300"
                style={{ height: 60, minWidth: 140 }}
              >
                {brand.logoUrl ? (
                  <Image
                    src={brand.logoUrl}
                    alt={brand.displayName}
                    width={120}
                    height={60}
                    className="object-contain h-10 w-auto opacity-90 filter grayscale contrast-200 invert"
                  />
                ) : (
                  <Text
                    strong
                    style={{
                      fontSize: 16,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "rgba(255,255,255,0.6)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {brand.displayName}
                  </Text>
                )}
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSlider;
