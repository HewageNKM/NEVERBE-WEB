"use client";

import { Carousel, Typography, Button, Flex } from "antd";
import ComboCard from "@/app/(site)/collections/combos/components/ComboCard";
import Link from "next/link";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface TrendingBundlesProps {
  bundles: any[];
}

const TrendingBundles: React.FC<TrendingBundlesProps> = ({ bundles }) => {
  if (!bundles || bundles.length === 0) return null;

  return (
    <section className="w-full max-w-content mx-auto px-4 md:px-8 section-spacing">
      <Flex justify="space-between" align="end" className="mb-10">
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
            Save More
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
            Trending Bundles
          </Title>
          <Text
            type="secondary"
            style={{ marginTop: 4, display: "block", fontSize: 13 }}
          >
            Save big with our exclusive combo deals. Buy more, pay less.
          </Text>
        </Flex>

        <Link href="/collections/combos" className="hidden md:block">
          <Button
            type="text"
            icon={<ArrowRightOutlined />}
            iconPosition="end"
            style={{
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: 12,
            }}
            className="hover:!text-[#97e13e]"
          >
            View All
          </Button>
        </Link>
      </Flex>

      <Carousel
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
            settings: { slidesToShow: 3.2 },
          },
          {
            breakpoint: 640,
            settings: { slidesToShow: 2.2 },
          },
          {
            breakpoint: 0,
            settings: { slidesToShow: 1.2 },
          },
        ]}
      >
        {bundles.map((bundle) => (
          <div key={bundle.id} className="px-2">
            <ComboCard combo={bundle} />
          </div>
        ))}

        {/* Mobile "View All" Card */}
        <div className="px-2 md:hidden">
          <Link
            href="/collections/combos"
            className="flex flex-col items-center justify-center w-full aspect-4/5 rounded-[24px] transition-all duration-300 group"
            style={{
              background: "rgba(248, 250, 245, 0.9)",
              border: "1px solid rgba(151, 225, 62, 0.15)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #97e13e 0%, #7bc922 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
                boxShadow: "0 8px 24px rgba(151, 225, 62, 0.35)",
              }}
              className="group-active:scale-95 transition-transform"
            >
              <ArrowRightOutlined style={{ fontSize: 22, color: "#000" }} />
            </div>
            <Text
              strong
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: 12,
                textAlign: "center",
              }}
            >
              Explore All Bundles
            </Text>
          </Link>
        </div>
      </Carousel>
    </section>
  );
};

export default TrendingBundles;
