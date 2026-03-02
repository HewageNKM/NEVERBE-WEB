"use client";

import React, { useRef } from "react";
import {
  Carousel,
  Typography,
  Button,
  Rate,
  Avatar,
  Card,
  Flex,
  Space,
} from "antd";
import type { CarouselRef } from "antd/es/carousel";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;

const reviews = [
  {
    id: 1,
    name: "Kavindi Perera",
    rating: 5,
    text: "Amazing quality shoes! Delivery was super fast and the packaging was premium. Definitely buying again!",
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Ashan Fernando",
    rating: 5,
    text: "Best shoe store in Sri Lanka. The sneakers I ordered are exactly as shown in the pictures. Very happy customer!",
    date: "1 month ago",
  },
  {
    id: 3,
    name: "Dilini Jayawardena",
    rating: 5,
    text: "Customer service is exceptional. They helped me find the perfect size and the exchange process was hassle-free.",
    date: "3 weeks ago",
  },
  {
    id: 4,
    name: "Nuwan Silva",
    rating: 4,
    text: "Great variety of shoes at reasonable prices. Cash on delivery option is very convenient. Highly recommend!",
    date: "1 month ago",
  },
  {
    id: 5,
    name: "Tharushi Mendis",
    rating: 5,
    text: "Ordered running shoes for my husband. He loves them! Will definitely recommend NEVERBE to friends and family.",
    date: "2 months ago",
  },
  {
    id: 6,
    name: "Chamara Rathnayake",
    rating: 5,
    text: "The combos offer is amazing value for money. Got two pairs for the price of one. Quality is top-notch!",
    date: "1 month ago",
  },
];

const ReviewCard = ({ review }: { review: (typeof reviews)[0] }) => {
  const initials = review.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card
      hoverable
      style={{
        borderRadius: 24,
        height: "100%",
        border: "1px solid rgba(151, 225, 62, 0.12)",
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(12px)",
      }}
      styles={{
        body: {
          padding: 24,
          height: "100%",
        },
      }}
      className="glass-glow-hover"
    >
      <Flex vertical justify="space-between" style={{ height: "100%" }}>
        <div>
          <Flex justify="space-between" align="start" className="mb-4">
            <Flex gap={12} align="center">
              <Avatar
                size={48}
                style={{
                  background:
                    "linear-gradient(135deg, #97e13e 0%, #7bc922 100%)",
                  color: "#000",
                  fontWeight: 900,
                  boxShadow: "0 4px 12px rgba(151, 225, 62, 0.3)",
                }}
              >
                {initials}
              </Avatar>
              <Flex vertical>
                <Text
                  strong
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: "-0.02em",
                    fontSize: 13,
                  }}
                >
                  {review.name}
                </Text>
                <Text
                  type="secondary"
                  style={{
                    fontSize: 10,
                    textTransform: "uppercase",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                  }}
                >
                  {review.date}
                </Text>
              </Flex>
            </Flex>
            <div
              style={{
                background: "rgba(255,255,255,0.8)",
                borderRadius: "50%",
                padding: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                border: "1px solid rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FcGoogle size={20} />
            </div>
          </Flex>

          <Rate
            disabled
            defaultValue={review.rating}
            className="mb-4"
            style={{ color: "#97e13e", fontSize: 14 }}
          />

          <Paragraph
            style={{
              marginBottom: 24,
              color: "rgba(0,0,0,0.6)",
              fontWeight: 500,
              fontStyle: "italic",
              lineHeight: 1.7,
            }}
          >
            &ldquo;{review.text}&rdquo;
          </Paragraph>
        </div>

        <Flex
          align="center"
          gap={8}
          style={{
            paddingTop: 16,
            borderTop: "1px solid rgba(151, 225, 62, 0.1)",
          }}
        >
          <div
            style={{
              width: 16,
              height: 4,
              background: "linear-gradient(90deg, #97e13e, #7bc922)",
              borderRadius: 99,
            }}
          />
          <Text
            type="secondary"
            style={{
              fontSize: 10,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Verified Purchase
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

const CustomerReviews = () => {
  const carouselRef = useRef<CarouselRef>(null);

  return (
    <section className="w-full max-w-content mx-auto px-4 md:px-8 section-spacing">
      <Flex
        vertical
        justify="space-between"
        align="start"
        gap={24}
        className="mb-12 md:flex-row md:items-end"
      >
        <Flex vertical gap={8}>
          <Flex align="center" gap={16} className="mb-4">
            <Space
              style={{
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(12px)",
                borderRadius: 99,
                padding: "6px 16px",
                border: "1px solid rgba(151, 225, 62, 0.15)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
              }}
            >
              <FcGoogle size={22} />
              <Rate
                disabled
                defaultValue={5}
                style={{ color: "#97e13e", fontSize: 14 }}
              />
              <Text strong style={{ fontSize: 18, fontWeight: 900 }}>
                4.9
              </Text>
            </Space>
            <Text
              type="secondary"
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              200+ Reviews
            </Text>
          </Flex>

          <Flex vertical gap={4}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#97e13e",
              }}
            >
              Testimonials
            </Text>
            <Title
              level={2}
              style={{
                margin: 0,
                textTransform: "uppercase",
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              Athletes Trust Us
            </Title>
          </Flex>
          <Text type="secondary" style={{ fontWeight: 500, display: "block" }}>
            Real performance reviews from real Sri Lankan athletes
          </Text>
        </Flex>

        <Flex align="center" gap={12} className="hidden md:flex">
          <Button
            shape="circle"
            icon={<LeftOutlined />}
            size="large"
            onClick={() => carouselRef.current?.prev()}
            style={{
              border: "1px solid rgba(151, 225, 62, 0.2)",
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(8px)",
            }}
            className="hover:!border-[#97e13e] hover:!text-[#97e13e]"
          />
          <Button
            shape="circle"
            icon={<RightOutlined />}
            size="large"
            onClick={() => carouselRef.current?.next()}
            style={{
              border: "1px solid rgba(151, 225, 62, 0.2)",
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(8px)",
            }}
            className="hover:!border-[#97e13e] hover:!text-[#97e13e]"
          />
        </Flex>
      </Flex>

      <Carousel
        ref={carouselRef}
        dots={false}
        infinite={false}
        draggable
        slidesToShow={4}
        responsive={[
          {
            breakpoint: 1280,
            settings: { slidesToShow: 4 },
          },
          {
            breakpoint: 1024,
            settings: { slidesToShow: 3 },
          },
          {
            breakpoint: 640,
            settings: { slidesToShow: 1.2 },
          },
          {
            breakpoint: 0,
            settings: { slidesToShow: 1.1 },
          },
        ]}
      >
        {reviews.map((review) => (
          <div key={review.id} className="px-2 pb-4">
            <ReviewCard review={review} />
          </div>
        ))}
      </Carousel>

      <Flex justify="center" className="mt-12">
        <Button
          type="primary"
          shape="round"
          size="large"
          href="https://g.page/r/neverbe/review"
          target="_blank"
          icon={<FcGoogle size={20} />}
          style={{
            height: 56,
            padding: "0 36px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            alignItems: "center",
            display: "flex",
            backgroundColor: "#111",
            color: "#fff",
            border: "none",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}
          className="hover:!bg-[#97e13e] hover:!text-black transition-colors"
        >
          Rate Your Performance
        </Button>
      </Flex>
    </section>
  );
};

export default CustomerReviews;
