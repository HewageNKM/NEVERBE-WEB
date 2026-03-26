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
  images?: { url: string }[];
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
              marginBottom: review.images?.length ? 12 : 24,
              color: "var(--color-primary-dark)",
              fontWeight: 500,
              lineHeight: 1.7,
              position: "relative",
              zIndex: 1,
            }}
          >
            &ldquo;{review.text}&rdquo;
          </Paragraph>

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
  const googlePrevRef = useRef<HTMLButtonElement>(null);
  const googleNextRef = useRef<HTMLButtonElement>(null);
  const sitePrevRef = useRef<HTMLButtonElement>(null);
  const siteNextRef = useRef<HTMLButtonElement>(null);

  const [googleReviews, setGoogleReviews] = useState<ReviewData[]>([]);
  const [siteReviews, setSiteReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const [googleRes, siteRes] = await Promise.all([
          axiosInstance.get("/web/reviews?limit=10&source=GOOGLE"),
          axiosInstance.get("/web/reviews?limit=10&source=WEB"),
        ]);

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
        if (siteRes.data && Array.isArray(siteRes.data)) {
          setSiteReviews(siteRes.data.map(mapReview));
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (!loading && googleReviews.length === 0 && siteReviews.length === 0)
    return null;

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
        {/* Header Section */}
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
          </Flex>
        </Flex>

        {/* --- GOOGLE REVIEWS SECTION --- */}
        {(loading || googleReviews.length > 0) && (
          <div className="mb-16">
            <Flex justify="space-between" align="center" className="mb-6">
              <Flex align="center" gap={12}>
                <FcGoogle size={24} />
                <Title level={4} style={{ margin: 0, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                  Google Reviews
                </Title>
              </Flex>
              <Flex align="center" gap={12}>
                <Button
                  ref={googlePrevRef}
                  shape="circle"
                  icon={<LeftOutlined style={{ fontSize: 12 }} />}
                  className="w-8 h-8 flex items-center justify-center hover:border-accent! hover:text-accent!"
                />
                <Button
                  ref={googleNextRef}
                  shape="circle"
                  icon={<RightOutlined style={{ fontSize: 12 }} />}
                  className="w-8 h-8 flex items-center justify-center hover:border-accent! hover:text-accent!"
                />
              </Flex>
            </Flex>

            <div className="relative min-h-[300px]">
              {loading ? (
                <div className="flex gap-4 overflow-hidden">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-[280px] h-[350px] bg-white rounded-[32px] border border-default/20 animate-pulse shrink-0" />
                  ))}
                </div>
              ) : (
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
                    768: { slidesPerView: 3.2 },
                    1280: { slidesPerView: 4.2 },
                  }}
                  className="overflow-visible!"
                >
                  {googleReviews.map((review) => (
                    <SwiperSlide key={review.id} className="pb-4">
                      <ReviewCard review={review} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>
        )}

        {/* --- OUR REVIEWS SECTION --- */}
        {(loading || siteReviews.length > 0) && (
          <div className="mb-16">
            <Flex justify="space-between" align="center" className="mb-6">
              <Flex align="center" gap={12}>
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px] font-black italic">!</span>
                </div>
                <Title level={4} style={{ margin: 0, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                  Our Community
                </Title>
              </Flex>
              <Flex align="center" gap={12}>
                <Button
                  ref={sitePrevRef}
                  shape="circle"
                  icon={<LeftOutlined style={{ fontSize: 12 }} />}
                  className="w-8 h-8 flex items-center justify-center hover:border-accent! hover:text-accent!"
                />
                <Button
                  ref={siteNextRef}
                  shape="circle"
                  icon={<RightOutlined style={{ fontSize: 12 }} />}
                  className="w-8 h-8 flex items-center justify-center hover:border-accent! hover:text-accent!"
                />
              </Flex>
            </Flex>

            <div className="relative min-h-[300px]">
              {loading ? (
                <div className="flex gap-4 overflow-hidden">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-[280px] h-[350px] bg-white rounded-[32px] border border-default/20 animate-pulse shrink-0" />
                  ))}
                </div>
              ) : (
                <Swiper
                  modules={[Navigation]}
                  onInit={(s) => {
                    if (s.params.navigation && typeof s.params.navigation !== "boolean") {
                      s.params.navigation.prevEl = sitePrevRef.current;
                      s.params.navigation.nextEl = siteNextRef.current;
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
                  {siteReviews.map((review) => (
                    <SwiperSlide key={review.id} className="pb-4">
                      <ReviewCard review={review} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <Flex justify="center" className="mt-4">
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
