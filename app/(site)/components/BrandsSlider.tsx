"use client";

import React from "react";
import { Carousel, Typography, Flex } from "antd";
import Image from "next/image";
import Link from "next/link";

const { Text } = Typography;

const BrandsSlider = ({ items }: { items: any[] }) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="w-full section-spacing">
      <div className="max-w-content mx-auto px-4 md:px-8">
        {/* Glass container panel */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(248,250,245,0.95) 0%, rgba(255,255,255,1) 50%, rgba(248,250,245,0.95) 100%)",
            borderRadius: 32,
            padding: "48px 32px",
            border: "1px solid rgba(151, 225, 62, 0.08)",
          }}
        >
          <Flex vertical align="center" gap={32}>
            <Text
              type="secondary"
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
              }}
            >
              Trusted By You, Sourced By Us
            </Text>

            <div className="w-full transition-all duration-700 px-4">
              <Carousel
                autoplay
                dots={false}
                draggable
                infinite
                slidesToShow={6}
                responsive={[
                  {
                    breakpoint: 1024,
                    settings: { slidesToShow: 6 },
                  },
                  {
                    breakpoint: 768,
                    settings: { slidesToShow: 4 },
                  },
                  {
                    breakpoint: 480,
                    settings: { slidesToShow: 3 },
                  },
                ]}
              >
                {items.map((brand) => (
                  <div key={brand.id} className="px-4">
                    <div className="flex justify-center items-center opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500 h-16">
                      <Link
                        href={`/collections/products?brand=${encodeURIComponent(
                          (brand?.name || "").toLowerCase(),
                        )}`}
                        className="block"
                      >
                        {brand.logoUrl ? (
                          <Image
                            src={brand.logoUrl}
                            alt={brand.name}
                            width={100}
                            height={60}
                            className="object-contain h-10 w-auto mx-auto"
                          />
                        ) : (
                          <Text
                            strong
                            style={{
                              fontSize: 16,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            {brand.name}
                          </Text>
                        )}
                      </Link>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          </Flex>
        </div>
      </div>
    </section>
  );
};

export default BrandsSlider;
