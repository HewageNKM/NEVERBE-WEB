"use client";
import React from "react";
import Link from "next/link";
import { Typography, Row, Col, Flex, Divider, Tag } from "antd";

const { Title, Paragraph, Text } = Typography;

const SEOContent = () => {
  const categories = [
    "Men's Sneakers",
    "Women's Running Shoes",
    "Sports Shoes",
    "Casual Slides",
    "High-Ankle Boots",
    "Gym Footwear",
    "Men's Clothing",
    "Women's Clothing",
    "Sports Apparel",
    "Activewear",
    "Accessories",
    "Socks & Undergarments",
  ];

  const searchLinks = [
    {
      label: "Running Shoes Sri Lanka",
      href: "/collections/products?category=running%20shoes",
    },
    {
      label: "Men's Sandals",
      href: "/collections/products?category=sandals%20%26%20slippers%20%26%20slides",
    },
    {
      label: "Men's Activewear",
      href: "/collections/products?category=activewear",
    },
    { label: "Shoe Sale", href: "/collections/offers" },
    {
      label: "Best Sneakers 2025",
      href: "/collections/products?category=sneakers",
    },
    {
      label: "Women's Sports Apparel",
      href: "/collections/products?category=sports%20apparel",
    },
    {
      label: "Clothing Sri Lanka",
      href: "/collections/products?category=clothing",
    },
  ];

  return (
    <div
      className="!rounded-none !border-x-0 !border-b-0"
      style={{
        padding: "48px 0",
      }}
    >
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <Row gutter={[48, 48]}>
          {/* LEFT COLUMN: Main Keywords */}
          <Col xs={24} lg={12}>
            <Flex vertical gap={16}>
              <Title
                level={5}
                style={{
                  fontWeight: 800,
                  margin: 0,
                  fontSize: 14,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Premium Fashion & Footwear in Sri Lanka
              </Title>
              <Paragraph
                style={{
                  color: "#1a1a1a",
                  fontSize: 12,
                  marginBottom: 0,
                  lineHeight: 1.8,
                }}
              >
                NEVERBE is Sri Lanka&apos;s premier online destination to{" "}
                <Text strong style={{ color: "#1a1a1a" }}>
                  buy shoes, clothing, and fashion accessories
                </Text>
                . We bridge the gap between high-end street culture and
                affordability, offering a curated selection of{" "}
                <Text strong style={{ color: "#1a1a1a" }}>
                  sneakers, activewear, sports apparel, and casual footwear
                </Text>
                . Whether you are in Colombo, Kandy, or Galle, our island-wide
                delivery ensures you get the latest drops right to your door.
              </Paragraph>
              <Paragraph
                style={{
                  color: "#1a1a1a",
                  fontSize: 12,
                  marginBottom: 0,
                  lineHeight: 1.8,
                }}
              >
                We specialize in{" "}
                <Text strong style={{ color: "#1a1a1a" }}>
                  Master Copy (7A Quality)
                </Text>{" "}
                footwear and fashion, giving you the look and feel of major
                global brands like Nike, Adidas, and Jordan at a fraction of the
                cost. From premium shoes to everyday clothing and wearables —
                experience iconic designs without the premium price tag.
              </Paragraph>
            </Flex>
          </Col>

          {/* RIGHT COLUMN: Categories & Trust */}
          <Col xs={24} lg={12}>
            <Flex vertical gap={24}>
              <Flex vertical gap={12}>
                <Title
                  level={5}
                  style={{
                    fontWeight: 800,
                    margin: 0,
                    fontSize: 14,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Shop by Category
                </Title>
                <Flex wrap gap={8}>
                  {categories.map((tag, i) => (
                    <Tag
                      key={i}
                      style={{
                        borderRadius: 99,
                        padding: "4px 14px",
                        fontSize: 11,
                        fontWeight: 600,
                        border: "1px solid rgba(151, 225, 62, 0.15)",
                        background: "rgba(151, 225, 62, 0.05)",
                        color: "#1a1a1a",
                        cursor: "default",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {tag}
                    </Tag>
                  ))}
                </Flex>
              </Flex>

              <Divider
                style={{ margin: 0, borderColor: "rgba(151, 225, 62, 0.08)" }}
              />

              <Flex vertical gap={12}>
                <Title
                  level={5}
                  style={{
                    fontWeight: 800,
                    margin: 0,
                    fontSize: 14,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Why Buy Online with NEVERBE?
                </Title>
                <Paragraph
                  style={{
                    color: "#1a1a1a",
                    fontSize: 12,
                    marginBottom: 0,
                    lineHeight: 1.8,
                  }}
                >
                  Stop searching for &quot;shops near me&quot; and trust our
                  secure online platform. We offer{" "}
                  <Text strong style={{ color: "#1a1a1a" }}>
                    Cash on Delivery (COD)
                  </Text>
                  , hassle-free exchanges, and dedicated customer support. Join
                  thousands of satisfied customers across Sri Lanka who have
                  upgraded their wardrobe — from shoes and clothing to
                  accessories — with NEVERBE.
                </Paragraph>
              </Flex>
            </Flex>
          </Col>
        </Row>

        {/* SEO Navigation Links */}
        <div
          style={{
            marginTop: 48,
            paddingTop: 32,
            borderTop: "1px solid rgba(151, 225, 62, 0.08)",
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#1a1a1a",
              display: "block",
              marginBottom: 16,
            }}
          >
            Popular Searches
          </Text>
          <Flex wrap gap={12} align="center">
            {searchLinks.map((link, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <Text style={{ color: "rgba(0,0,0,0.1)", fontSize: 12 }}>
                    /
                  </Text>
                )}
                <Link
                  href={link.href}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#1a1a1a",
                    transition: "color 0.3s ease",
                  }}
                  className="hover:text-[#97e13e]!"
                >
                  {link.label}
                </Link>
              </React.Fragment>
            ))}
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default SEOContent;
