"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/interfaces/Product";
import { usePromotionsContext } from "@/components/PromotionsProvider";
import {
  calculateFinalPrice,
  hasDiscount as checkHasDiscount,
} from "@/utils/pricing";
import { Card, Typography, Badge, Tag } from "antd";

const { Text, Title } = Typography;

interface SearchResultCardProps {
  item: Product;
  onClick: () => void;
  variant?: "list" | "card";
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({
  item,
  onClick,
  variant = "list",
}) => {
  const { getPromotionForProduct, getPromotionsForProduct } =
    usePromotionsContext();
  const activePromo = getPromotionForProduct(item.id);
  const allPromos = getPromotionsForProduct(item.id);

  const finalPrice = calculateFinalPrice(item, activePromo);
  const hasDiscount = checkHasDiscount(item, activePromo);
  const outOfStock = !item.inStock;

  // Determine ribbon text — only show when there's something meaningful
  const ribbonText = outOfStock
    ? "Sold Out"
    : activePromo
      ? activePromo.name?.length < 20
        ? activePromo.name
        : activePromo.type === "BOGO"
          ? "Buy 1 Get 1"
          : "Special Offer"
      : item.discount > 0
        ? `${item.discount}% Off`
        : null;

  // --- VARIANT: CARD (Grid Search / Trending) ---
  if (variant === "card") {
    return (
      <Badge.Ribbon
        text={ribbonText}
        color={
          outOfStock
            ? "var(--color-error)"
            : activePromo
              ? "var(--color-warning)"
              : "var(--color-accent)"
        }
        style={{
          padding: "0 10px",
          fontSize: "11px",
          fontWeight: 800,
          textTransform: "uppercase",
          color:
            activePromo && !outOfStock ? "var(--color-primary-dark)" : "#fff",
          letterSpacing: "0.05em",
          display: ribbonText ? undefined : "none",
        }}
      >
        <Card
          hoverable
          className="group active:scale-[0.98]"
          style={{
            overflow: "hidden",
            transition: "all 0.3s ease",
            background: "#fff",
            boxShadow: "none",
            border: "1px solid var(--color-default)",
            borderRadius: 24,
          }}
          styles={{
            body: { padding: "10px 12px" },
            cover: { position: "relative" },
          }}
          cover={
            <Link
              href={`/collections/products/${item.id}`}
              onClick={onClick}
              className="block"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-t-[24px]">
                <Image
                  src={item.thumbnail.url}
                  alt={item.name}
                  fill
                  className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
                    outOfStock ? "opacity-60 grayscale" : ""
                  }`}
                />
              </div>
            </Link>
          }
        >
          <Link href={`/collections/products/${item.id}`} onClick={onClick}>
            <div className="flex flex-col gap-0.5 mb-2">
              <Title
                level={5}
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
                className="group-hover:text-accent transition-colors line-clamp-2"
              >
                {item.name}
              </Title>
              <Text
                type="secondary"
                style={{
                  textTransform: "capitalize",
                  fontWeight: 600,
                  fontSize: "11px",
                }}
              >
                {item.category?.replace("-", " ") || "Premium Gear"}
              </Text>
            </div>

            <div className="flex items-baseline gap-1.5 flex-wrap mb-1 text-base">
              <Text
                strong
                style={{
                  color: hasDiscount ? "var(--color-accent)" : "inherit",
                  fontSize: "1rem",
                  letterSpacing: "-0.03em",
                }}
              >
                Rs. {finalPrice.toLocaleString()}
              </Text>
              {hasDiscount && (
                <Text delete type="secondary" style={{ fontSize: "0.75rem" }}>
                  Rs.{" "}
                  {item.marketPrice > item.sellingPrice
                    ? item.marketPrice.toLocaleString()
                    : item.sellingPrice.toLocaleString()}
                </Text>
              )}
            </div>

            {allPromos.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {allPromos.map((promo) => (
                  <Tag
                    key={promo.id}
                    style={{
                      fontSize: "9px",
                      fontWeight: 800,
                      borderRadius: "6px",
                      border: "none",
                      padding: "0 6px",
                      background: "var(--color-warning)",
                      color: "var(--color-primary-dark)",
                      margin: 0,
                      textTransform: "uppercase",
                    }}
                  >
                    {promo.name}
                  </Tag>
                ))}
              </div>
            )}
          </Link>
        </Card>
      </Badge.Ribbon>
    );
  }

  // --- VARIANT: LIST (Mobile Menu / Compact Search) ---
  return (
    <Link
      href={`/collections/products/${item.id}`}
      onClick={onClick}
      className="group flex items-center gap-4 p-4 hover:bg-surface-3 transition-all cursor-pointer w-full border-b border-default last:border-none"
    >
      <div className="relative w-20 h-20 bg-surface-2 rounded-xl overflow-hidden shrink-0 border border-default">
        <Image
          src={item.thumbnail.url}
          alt={item.name}
          width={100}
          height={100}
          className={`object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 ${
            outOfStock ? "opacity-60 grayscale" : ""
          }`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <Title
            level={5}
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.3,
            }}
            className="truncate group-hover:text-accent transition-colors"
          >
            {item.name}
          </Title>
          {allPromos.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {allPromos.map((promo) => (
                <span
                  key={promo.id}
                  className="shrink-0 bg-accent text-dark text-[8px] font-black px-1.5 py-0.5 rounded-sm shadow-sm uppercase"
                >
                  {promo.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <Text
          type="secondary"
          style={{
            textTransform: "capitalize",
            fontWeight: 600,
            fontSize: "11px",
          }}
        >
          {item.category?.replace("-", " ") || "Gear"}
        </Text>

        <div className="flex items-center gap-3 mt-2">
          <Text
            strong
            style={{
              color: hasDiscount ? "var(--color-accent)" : "inherit",
              fontSize: "0.9rem",
              letterSpacing: "-0.03em",
            }}
          >
            Rs. {finalPrice.toLocaleString()}
          </Text>
          {hasDiscount && (
            <Text delete type="secondary" style={{ fontSize: "0.75rem" }}>
              Rs. {item.sellingPrice.toLocaleString()}
            </Text>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SearchResultCard;
