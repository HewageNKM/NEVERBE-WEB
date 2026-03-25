"use client";

import { useEffect, useRef, useState } from "react";
import axiosInstance from "@/actions/axiosInstance";
import { formatDistanceToNow } from "date-fns";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { FcGoogle } from "react-icons/fc";
import "swiper/css";

import { Typography, Button, Rate, Avatar, Card, Flex, Space } from "antd";

const { Title, Text, Paragraph } = Typography;

interface ReviewData {
  id: string | number;
  name: string;
  rating: number;
  text: string;
  date: string;
  source?: string;
}

const ReviewCard = ({ review }: { review: ReviewData }) => {
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
      className="group relative block aspect-4/5 overflow-hidden rounded-[32px] bg-surface-2 shadow-sm hover:shadow-xl transition-all duration-500 border border-default/50"
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
                    "linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)",
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
                    color: "var(--color-primary-dark)",
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
                    color: "var(--color-primary-dark)",
                  }}
                >
                  {review.date}
                </Text>
              </Flex>
            </Flex>
            {review.source === "GOOGLE" && (
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
            )}
          </Flex>

          <Rate
            disabled
            defaultValue={review.rating}
            className="mb-4"
            style={{ color: "var(--color-accent)", fontSize: 14 }}
          />

          <Paragraph
            style={{
              marginBottom: 24,
              color: "var(--color-primary-dark)",
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
              background:
                "linear-gradient(90deg, var(--color-accent), var(--color-accent-hover))",
              borderRadius: 99,
            }}
          />
          <Text
            style={{
              fontSize: 10,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--color-primary-dark)",
            }}
          >
            {review.source === "GOOGLE" ? "Verified Google Review" : "Verified Purchase"}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

const CustomerReviews = () => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [reviewsList, setReviewsList] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosInstance.get("/web/reviews?limit=10");
        if (res.data && Array.isArray(res.data)) {
          const mapped = res.data.map((r: any) => ({
            id: r.reviewId || r.id,
            name: r.userName || "Customer",
            rating: r.rating || 5,
            text: r.review || "",
            source: r.source || "WEB",
            date: r.createdAt
              ? formatDistanceToNow(new Date(r.createdAt), {
                  addSuffix: true,
                })
              : "recently",
          }));
          setReviewsList(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

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
                  style={{ color: "var(--color-accent)", fontSize: 14 }}
                />
                <Text
                  strong
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    color: "var(--color-primary-dark)",
                  }}
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
                  color: "var(--color-primary-dark)",
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
                  color: "var(--color-accent)",
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
                  color: "var(--color-primary-dark)",
                }}
              >
                Customers Trust Us
              </Title>
            </Flex>
            <Text
              style={{
                fontWeight: 500,
                display: "block",
                color: "var(--color-primary-dark)",
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
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:border-accent! hover:text-accent!"
            />
            <Button
              ref={nextRef}
              shape="circle"
              icon={
                <RightOutlined style={{ fontSize: "clamp(12px, 2vw, 14px)" }} />
              }
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:border-accent! hover:text-accent!"
            />
          </Flex>
        </Flex>

        <div className="relative pb-8 mt-6 md:mt-0 min-h-[300px]">
          {loading ? (
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-[280px] h-[350px] bg-white rounded-[32px] border border-default/20 animate-pulse shrink-0"
                />
              ))}
            </div>
          ) : reviewsList.length > 0 ? (
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
              {reviewsList.map((review) => (
                <SwiperSlide key={review.id} className="pb-4">
                  <ReviewCard review={review} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Text className="text-muted italic">
              No reviews available yet. Be the first to share your experience!
            </Text>
          )}
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
                backgroundColor: "var(--color-accent)",
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
