"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoEyeOutline } from "react-icons/io5";
import { KOKOLogo } from "@/assets/images";
import { Product } from "@/interfaces/Product";
import { ProductVariant } from "@/interfaces/ProductVariant";
import {
  ProductVariantTarget,
  PromotionCondition,
} from "@/interfaces/Promotion";
import { usePromotionsContext } from "@/components/PromotionsProvider";
import { useQuickView } from "@/components/QuickViewProvider";
import {
  calculateFinalPrice,
  hasDiscount as checkHasDiscount,
} from "@/utils/pricing";
import { isVariantEligibleForPromotion } from "@/utils/promotionUtils";
// ItemCard with Antd Fluid Design
import { Card, Button, Typography, Badge, Tag } from "antd";

const { Text, Title, Paragraph } = Typography;

const ItemCard = ({
  item,
  priority = false,
}: {
  item: Product;
  priority?: boolean;
}) => {
  const [outOfStocks, setOutOfStocks] = useState(false);
  const [activeVariant, setActiveVariant] = useState<ProductVariant | null>(
    null,
  );
  const { openQuickView } = useQuickView();
  const { getPromotionForProduct } = usePromotionsContext();

  useEffect(() => {
    if (!item.inStock) {
      setOutOfStocks(true);
    }
    if (item.variants?.length > 0) {
      setActiveVariant(item.variants[0]);
    }
  }, [item]);

  const activePromo = getPromotionForProduct(item.id);
  const discountedPrice = calculateFinalPrice(item, activePromo);
  const hasDiscount = checkHasDiscount(item, activePromo);

  const displayImage = activeVariant?.images?.[0]?.url || item.thumbnail.url;

  const getVariantPromotion = (variantId: string) => {
    const promo = getPromotionForProduct(item.id, variantId);
    if (!promo) return null;

    const isEligible = isVariantEligibleForPromotion(
      item.id,
      variantId,
      promo.applicableProductVariants as ProductVariantTarget[] | undefined,
      promo.conditions as PromotionCondition[] | undefined,
    );
    return isEligible ? promo : null;
  };

  return (
    <Badge.Ribbon
      text={
        outOfStocks
          ? "Sold Out"
          : activePromo
            ? activePromo.type === "BOGO"
              ? "Buy 1 Get 1"
              : "Special Offer"
            : item.discount > 0
              ? `${item.discount}% Off`
              : "Just In"
      }
      color={outOfStocks ? "#000" : "#97e13e"}
      style={{
        padding: "0 16px",
        fontWeight: 800,
        textTransform: "uppercase",
        color: outOfStocks ? "#fff" : "#000",
        letterSpacing: "0.05em",
      }}
    >
      <Card
        hoverable
        className="group"
        style={{
          borderRadius: 24,
          overflow: "hidden",
          border: "1px solid #e0e8d8",
          transition: "all 0.3s ease",
        }}
        styles={{
          body: { padding: "16px" },
          cover: { position: "relative" },
        }}
        cover={
          <div className="relative aspect-4/5 w-full overflow-hidden bg-surface-3 rounded-t-[24px]">
            <Link
              href={`/collections/products/${item?.id}`}
              className="block h-full w-full"
            >
              <Image
                width={600}
                height={750}
                src={displayImage}
                alt={item.name}
                className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                  outOfStocks ? "opacity-60 grayscale" : ""
                }`}
                priority={priority}
              />
            </Link>

            {!outOfStocks && (
              <div className="absolute bottom-4 left-4 right-4 translate-y-[150%] group-hover:translate-y-0 transition-transform duration-300 z-10 hidden lg:block">
                <Button
                  block
                  shape="round"
                  size="large"
                  onClick={(e) => {
                    e.preventDefault();
                    openQuickView(item);
                  }}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(8px)",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    border: "1px solid #e0e8d8",
                  }}
                  className="hover:!text-[#97e13e] hover:!border-[#97e13e]"
                >
                  Quick Look
                </Button>
              </div>
            )}

            {!outOfStocks && (
              <Button
                shape="circle"
                icon={<IoEyeOutline size={20} />}
                onClick={(e) => {
                  e.preventDefault();
                  openQuickView(item);
                }}
                className="absolute bottom-3 right-3 lg:hidden z-10 shadow-md"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(8px)",
                  border: "none",
                }}
              />
            )}
          </div>
        }
      >
        <Link href={`/collections/products/${item?.id}`}>
          <div className="flex flex-col gap-1 mb-3">
            <Title
              level={5}
              style={{
                margin: 0,
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
              className="group-hover:text-accent transition-colors line-clamp-2"
            >
              {item.name}
            </Title>
            <Text
              type="secondary"
              style={{ textTransform: "capitalize", fontWeight: 600 }}
            >
              {item.category?.replace("-", " ") || "Premium Gear"}
            </Text>
          </div>
        </Link>

        {item.variants?.length > 1 && (
          <div className="flex items-center gap-2 mb-3">
            {item.variants.slice(0, 5).map((variant) => {
              const variantPromo = getVariantPromotion(variant.variantId);
              return (
                <div
                  key={variant.variantId}
                  className="relative cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveVariant(variant);
                  }}
                  onMouseEnter={() => setActiveVariant(variant)}
                >
                  <div
                    className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all duration-200 ${
                      activeVariant?.variantId === variant.variantId
                        ? "border-[#97e13e] shadow-sm transform scale-110 relative z-10"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={variant.images?.[0]?.url || item.thumbnail.url}
                      alt={variant.variantName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {variantPromo && (
                    <div className="absolute -top-1 -right-1 z-20 w-3.5 h-3.5 bg-[#97e13e] rounded-full border border-white flex items-center justify-center shadow-sm">
                      <span className="text-[7px] font-black text-black">
                        %
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
            {item.variants.length > 5 && (
              <Text type="secondary" style={{ fontSize: 11, fontWeight: 700 }}>
                +{item.variants.length - 5}
              </Text>
            )}
          </div>
        )}

        <Link href={`/collections/products/${item?.id}`}>
          <div className="flex items-baseline gap-2 flex-wrap mb-1 text-base">
            <Text
              strong
              style={{
                color: hasDiscount ? "#97e13e" : "inherit",
                fontSize: "1.1rem",
                letterSpacing: "-0.03em",
              }}
            >
              Rs. {discountedPrice.toLocaleString()}
            </Text>
            {hasDiscount && (
              <Text delete type="secondary" style={{ fontSize: "0.85rem" }}>
                Rs.{" "}
                {item.marketPrice > item.sellingPrice
                  ? item.marketPrice.toLocaleString()
                  : item.sellingPrice.toLocaleString()}
              </Text>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Text
              type="secondary"
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              3 x Installments with
            </Text>
            <div className="w-10 h-4 relative grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
              <Image
                src={KOKOLogo}
                alt="KOKO"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </Link>
      </Card>
    </Badge.Ribbon>
  );
};

export default ItemCard;
