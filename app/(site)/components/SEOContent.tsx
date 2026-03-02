"use client";
import React from "react";
import Link from "next/link";
import { Typography, Row, Col, Card, Flex, Divider, Tag } from "antd";

const { Title, Paragraph, Text } = Typography;

const SEOContent = () => {
  const categories = [
    "Men's Sneakers",
    "Women's Running Shoes",
    "Sports Shoes",
    "Casual Slides",
    "High-Ankle Boots",
    "Gym Footwear",
    "Office Shoes",
    "Party Wear",
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
    { label: "Nike Copy Shoes", href: "/collections/products?brand=nike" },
    { label: "Shoe Sale", href: "/collections/offers" },
    {
      label: "Best Sneakers 2025",
      href: "/collections/products?category=sneakers",
    },
  ];

  return (
    <Card
      styles={{
        body: { padding: "48px 0" },
      }}
      style={{
        borderRadius: 0,
        border: "none",
        borderTop: "1px solid rgba(151, 225, 62, 0.08)",
        background:
          "linear-gradient(180deg, rgba(248,250,245,0.5) 0%, rgba(255,255,255,1) 100%)",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
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
                Premium Footwear in Sri Lanka
              </Title>
              <Paragraph
                style={{
                  color: "rgba(0,0,0,0.4)",
                  fontSize: 12,
                  marginBottom: 0,
                  lineHeight: 1.8,
                }}
              >
                NEVERBE is the premier online destination to{" "}
                <Text strong style={{ color: "rgba(0,0,0,0.55)" }}>
                  buy shoes in Sri Lanka
                </Text>
                . We bridge the gap between high-end street culture and
                affordability, offering a curated selection of
                <Text strong style={{ color: "rgba(0,0,0,0.55)" }}>
                  {" "}
                  sneakers, running shoes, and casual footwear
                </Text>
                . Whether you are in Colombo, Kandy, or Galle, our island-wide
                delivery ensures you get the latest drops right to your door.
              </Paragraph>
              <Paragraph
                style={{
                  color: "rgba(0,0,0,0.4)",
                  fontSize: 12,
                  marginBottom: 0,
                  lineHeight: 1.8,
                }}
              >
                We specialize in{" "}
                <Text strong style={{ color: "rgba(0,0,0,0.55)" }}>
                  Master Copy (7A Quality)
                </Text>{" "}
                footwear, giving you the look and feel of major global brands
                like Nike, Adidas, and Jordan at a fraction of the cost.
                Experience premium materials, durable stitching, and iconic
                designs without the premium price tag.
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
                        color: "rgba(0,0,0,0.5)",
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
                    color: "rgba(0,0,0,0.4)",
                    fontSize: 12,
                    marginBottom: 0,
                    lineHeight: 1.8,
                  }}
                >
                  Stop searching for &quot;shoe shops near me&quot; and trust
                  our secure online platform. We offer{" "}
                  <Text strong style={{ color: "rgba(0,0,0,0.55)" }}>
                    Cash on Delivery (COD)
                  </Text>
                  , hassle-free exchanges, and dedicated customer support. Join
                  thousands of satisfied customers who have upgraded their shoe
                  game with NEVERBE.
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
              color: "rgba(0,0,0,0.25)",
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
                    color: "rgba(0,0,0,0.35)",
                    transition: "color 0.3s ease",
                  }}
                  className="hover:!text-[#97e13e]"
                >
                  {link.label}
                </Link>
              </React.Fragment>
            ))}
          </Flex>
        </div>
      </div>
    </Card>
  );
};

export default SEOContent;
