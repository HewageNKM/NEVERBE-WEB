"use client";

import React from "react";
import { Typography, Flex } from "antd";
import Image from "next/image";
import Link from "next/link";

const { Text, Title } = Typography;

const BrandsSlider = ({ items }: { items: any[] }) => {
  if (!items || items.length === 0) return null;

  // Double the items for seamless marquee effect
  const doubledItems = [...items, ...items];

  return (
    <section
      className="w-full overflow-hidden"
      style={{
        background: "#111",
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
              color: "#2e9e5b",
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
                (brand?.name || "").toLowerCase(),
              )}`}
              className="flex-shrink-0 mx-6 flex items-center justify-center opacity-30 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500"
              style={{ height: 60, minWidth: 120 }}
            >
              {brand.logoUrl ? (
                <Image
                  src={brand.logoUrl}
                  alt={brand.name}
                  width={100}
                  height={50}
                  className="object-contain h-10 w-auto brightness-0 invert"
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
                  {brand.name}
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
                  (brand?.name || "").toLowerCase(),
                )}`}
                className="flex-shrink-0 mx-6 flex items-center justify-center opacity-30 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500"
                style={{ height: 60, minWidth: 120 }}
              >
                {brand.logoUrl ? (
                  <Image
                    src={brand.logoUrl}
                    alt={brand.name}
                    width={100}
                    height={50}
                    className="object-contain h-10 w-auto brightness-0 invert"
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
                    {brand.name}
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
