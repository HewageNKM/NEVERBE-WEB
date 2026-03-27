"use client";

import { useEffect, useRef, useState } from "react";
import axiosInstance from "@/actions/axiosInstance";
import { formatDistanceToNow } from "date-fns";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { LeftOutlined, RightOutlined, ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";
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
  images?: { url: string }[];
}

const ReviewCard = ({ review }: { review: ReviewData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const initials = review.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const isLongText = review.text.length > 180;
  const displayedText = isExpanded ? review.text : review.text.slice(0, 180);

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
        display: "flex",
        flexDirection: "column"
      }}
      styles={{
        body: {
          padding: 24,
          height: "100%",
          display: "flex",
          flexDirection: "column"
        },
      }}
      className="group relative block overflow-hidden rounded-[32px] bg-surface-2 shadow-sm hover:shadow-xl transition-all duration-500 border border-default/50"
    >
      {/* Quote watermark */}
      <span className="review-quote-mark">❝</span>

      <Flex vertical justify="space-between" style={{ flex: 1 }}>
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

          <div style={{ position: "relative" }}>
            <Paragraph
              style={{
                marginBottom: 8,
                color: "var(--color-primary-dark)",
                fontWeight: 500,
                lineHeight: 1.7,
                position: "relative",
                zIndex: 1,
                fontSize: 14
              }}
            >
              &ldquo;{displayedText}{!isExpanded && isLongText ? "..." : ""}&rdquo;
            </Paragraph>
            
            {isLongText && (
              <Button 
                type="link" 
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ 
                  padding: 0, 
                  height: "auto", 
                  fontSize: 12, 
                  fontWeight: 800,
                  color: "var(--color-accent)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 16
                }}
              >
                {isExpanded ? "Show Less ↑" : "Show More ↓"}
              </Button>
            )}
          </div>

          {review.images && review.images.length > 0 && (
            <Flex gap={8} className="mb-4 overflow-x-auto pb-2 custom-scrollbar">
              {review.images.map((img, idx) => (
                <div 
                  key={idx} 
                  className="shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-default/10 shadow-sm"
                >
                  <img 
                    src={img.url} 
                    alt={`Review ${idx}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </Flex>
          )}
        </div>

        <Flex
          align="center"
          gap={8}
          style={{
            paddingTop: 16,
            borderTop: "1px solid rgba(46, 158, 91, 0.15)",
            marginTop: "auto"
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
            Verified Google Review
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

const CustomerReviews = () => {
  const googlePrevRef = useRef<HTMLButtonElement>(null);
  const googleNextRef = useRef<HTMLButtonElement>(null);

  const [googleReviews, setGoogleReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const googleRes = await axiosInstance.get("/web/reviews?limit=10&source=GOOGLE");

        const mapReview = (r: any) => ({
          id: r.reviewId || r.id,
          name: r.userName || "Customer",
          rating: r.rating || 5,
          text: r.review || "",
          source: r.source || "WEB",
          images: r.images || [],
          date: r.createdAt
            ? formatDistanceToNow(new Date(r.createdAt), {
                addSuffix: true,
              })
            : "recently",
        });

        if (googleRes.data && Array.isArray(googleRes.data)) {
          setGoogleReviews(googleRes.data.map(mapReview));
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const averageRating = googleReviews.length > 0 
    ? (googleReviews.reduce((acc, r) => acc + r.rating, 0) / googleReviews.length).toFixed(1)
    : "5.0";

  if (loading || googleReviews.length === 0)
    return null;

  return (
    <section
      className="w-full relative overflow-hidden"
      style={{
        background: "#f8faf5",
        padding: "80px 0",
      }}
    >
      <div className="max-w-content mx-auto px-4 md:px-8">
        {/* Mirroring ProductSlider Header Structure */}
        <Flex
          vertical={false}
          align="center"
          justify="space-between"
          className="mb-10 md:mb-8 gap-4 flex-col md:flex-row"
        >
          <Flex vertical gap={4} className="text-center md:text-left">
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
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(1.75rem, 5vw, 3rem)",
                textTransform: "uppercase",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1,
                color: "var(--color-primary-dark)",
              }}
            >
              Customers Trust Us
            </h2>
          </Flex>

          <Flex
            align="center"
            gap={12}
            className="w-full md:w-auto justify-between md:justify-end"
          >
            {/* Navigation Arrows on Right (Matching New Arrivals) */}
            <Flex align="center" gap={8}>
              <Button
                ref={googlePrevRef}
                shape="circle"
                icon={<LeftOutlined style={{ fontSize: "clamp(12px, 2vw, 14px)" }} />}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:border-accent! hover:text-accent! transition-all border-default bg-white"
              />
              <Button
                ref={googleNextRef}
                shape="circle"
                icon={<RightOutlined style={{ fontSize: "clamp(12px, 2vw, 14px)" }} />}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:border-accent! hover:text-accent! transition-all border-default bg-white"
              />
            </Flex>

            {/* View All Button on Right */}
            <Link 
              href="https://share.google/Y1jgPSYHgOcKumEq2" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button
                type="text"
                icon={<ArrowRightOutlined />}
                iconPosition="end"
                style={{
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: 12,
                  color: "var(--color-primary-dark)"
                }}
                className="hover:text-accent!"
              >
                View All
              </Button>
            </Link>
          </Flex>
        </Flex>

        {/* Carousel Container matched to ProductSlider */}
        <div className="relative pb-4 mt-6 md:mt-0">
          <Swiper
            modules={[Navigation]}
            onInit={(s) => {
              if (s.params.navigation && typeof s.params.navigation !== "boolean") {
                s.params.navigation.prevEl = googlePrevRef.current;
                s.params.navigation.nextEl = googleNextRef.current;
                s.navigation.init();
                s.navigation.update();
              }
            }}
            spaceBetween={16}
            slidesPerView={1.3}
            breakpoints={{
              768: { slidesPerView: 3.2, spaceBetween: 16 },
              1280: { slidesPerView: 4.2, spaceBetween: 24 },
            }}
            className="overflow-visible!"
          >
            {googleReviews.map((review) => (
              <SwiperSlide key={review.id} className="pb-8 !h-auto">
                <ReviewCard review={review} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Footer CTA */}
        <Flex justify="center" className="mt-8">
          <a
            href="https://search.google.com/local/writereview?placeid=ChIJ2TyZoff_4joRgDt7is46uRk"
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
