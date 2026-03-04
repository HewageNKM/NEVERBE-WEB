"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { FcGoogle } from "react-icons/fc";
import "swiper/css";

import { Typography, Button, Rate, Avatar, Card, Flex, Space } from "antd";

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
        height: "100%",
        background: "#fff",
        border: "1px solid rgba(46, 158, 91, 0.15)",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
      }}
      styles={{
        body: {
          padding: 24,
          height: "100%",
        },
      }}
      className="group/review hover:!border-[#2e9e5b]/40 hover:-translate-y-2 transition-all duration-500 !rounded-[24px]"
    >
      {/* Quote watermark */}
      <span className="review-quote-mark">❝</span>

      <Flex vertical justify="space-between" style={{ height: "100%" }}>
        <div>
          <Flex justify="space-between" align="start" className="mb-4">
            <Flex gap={12} align="center">
              <Avatar
                size={48}
                style={{
                  background:
                    "linear-gradient(135deg, #2e9e5b 0%, #26854b 100%)",
                  color: "#fff",
                  fontWeight: 900,
                  flexShrink: 0,
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
                    color: "#1a1a1a",
                  }}
                >
                  {review.name}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    textTransform: "uppercase",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    color: "#aaa",
                  }}
                >
                  {review.date}
                </Text>
              </Flex>
            </Flex>
            <div
              style={{
                background: "rgba(46, 158, 91, 0.08)",
                borderRadius: "50%",
                padding: 8,
                border: "1px solid rgba(46, 158, 91, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FcGoogle size={20} />
            </div>
          </Flex>

          <Rate
            disabled
            defaultValue={review.rating}
            className="mb-4"
            style={{ color: "#2e9e5b", fontSize: 14 }}
          />

          <Paragraph
            style={{
              marginBottom: 24,
              color: "#555",
              fontWeight: 500,
              lineHeight: 1.7,
              position: "relative",
              zIndex: 1,
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
            borderTop: "1px solid rgba(46, 158, 91, 0.15)",
          }}
        >
          <div
            style={{
              width: 16,
              height: 4,
              background: "linear-gradient(90deg, #2e9e5b, #26854b)",
              borderRadius: 99,
            }}
          />
          <Text
            style={{
              fontSize: 10,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#aaa",
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
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section
      className="w-full"
      style={{
        background: "#f8faf5",
        padding: "80px 0",
      }}
    >
      {/* Green separator */}
      <div className="green-separator mb-0" />

      <div className="max-w-content mx-auto px-4 md:px-8 pt-16">
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
                  borderRadius: 99,
                  padding: "6px 16px",
                  background: "rgba(46, 158, 91, 0.1)",
                  border: "1px solid rgba(46, 158, 91, 0.25)",
                }}
              >
                <FcGoogle size={22} />
                <Rate
                  disabled
                  defaultValue={5}
                  style={{ color: "#2e9e5b", fontSize: 14 }}
                />
                <Text
                  strong
                  style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a" }}
                >
                  4.9
                </Text>
              </Space>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#999",
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
                  color: "#2e9e5b",
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
                  color: "#1a1a1a",
                }}
              >
                Customers Trust Us
              </Title>
            </Flex>
            <Text
              style={{
                fontWeight: 500,
                display: "block",
                color: "#777",
              }}
            >
              Real performance reviews from real Sri Lankan athletes
            </Text>
          </Flex>

          <Flex align="center" gap={12} className="ml-auto">
            <Button
              ref={prevRef}
              shape="circle"
              icon={
                <LeftOutlined style={{ fontSize: "clamp(12px, 2vw, 14px)" }} />
              }
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:border-[#2e9e5b]! hover:text-[#2e9e5b]!"
            />
            <Button
              ref={nextRef}
              shape="circle"
              icon={
                <RightOutlined style={{ fontSize: "clamp(12px, 2vw, 14px)" }} />
              }
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:border-[#2e9e5b]! hover:text-[#2e9e5b]!"
            />
          </Flex>
        </Flex>

        <div className="relative pb-8 mt-6 md:mt-0">
          <Swiper
            modules={[Navigation]}
            onInit={(s) => {
              if (
                s.params.navigation &&
                typeof s.params.navigation !== "boolean"
              ) {
                s.params.navigation.prevEl = prevRef.current;
                s.params.navigation.nextEl = nextRef.current;
                s.navigation.init();
                s.navigation.update();
              }
            }}
            spaceBetween={16}
            slidesPerView={1.3}
            breakpoints={{
              768: { slidesPerView: 3.2 },
              1280: { slidesPerView: 4.2 },
            }}
            className="overflow-visible!"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id} className="pb-4">
                <ReviewCard review={review} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <Flex justify="center" className="mt-12">
          <a
            href="https://g.page/r/neverbe/review"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              type="primary"
              size="large"
              shape="round"
              icon={<FcGoogle size={20} />}
              style={{
                height: 52,
                padding: "0 32px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: 13,
                backgroundColor: "#2e9e5b",
                color: "#fff",
                border: "none",
              }}
            >
              Rate Your Experience →
            </Button>
          </a>
        </Flex>
      </div>
    </section>
  );
};

export default CustomerReviews;
