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
        item.isRestockingSoon
          ? "Restock Soon"
          : outOfStocks
            ? "Sold Out"
            : item.isNewArrival
              ? "New Arrival"
              : activePromo
                ? activePromo.type === "BOGO"
                  ? "Buy 1 Get 1"
                  : "Special Offer"
                : item.discount > 0
                  ? `${item.discount}% Off`
                  : null
      }
      color={
        item.isRestockingSoon
          ? "var(--color-warning)"
          : outOfStocks
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
          (activePromo || item.isRestockingSoon) && !outOfStocks
            ? "var(--color-primary-dark)"
            : "#fff",
        letterSpacing: "0.05em",
        display:
          item.isRestockingSoon ||
          outOfStocks ||
          item.isNewArrival ||
          activePromo ||
          item.discount > 0
            ? undefined
            : "none",
      }}
    >
      <Card
        hoverable
        className="group active:scale-[0.98]"
        style={{
          overflow: "hidden",
          transition: "all 0.3s ease",
        }}
        styles={{
          body: { padding: "10px 12px" },
          cover: { position: "relative" },
        }}
        cover={
          <div className="relative aspect-square w-full overflow-hidden rounded-t-[24px]">
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

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openQuickView(item);
              }}
              className="absolute bottom-3 right-3 z-20 w-9 h-9 rounded-full shadow-custom border border-white/40 bg-white/80 backdrop-blur-md text-primary-dark hover:bg-white hover:text-accent lg:opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center shrink-0"
            >
              <IoEyeOutline size={18} />
            </button>
          </div>
        }
      >
        <Link href={`/collections/products/${item?.id}`}>
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
        </Link>

        {item.variants?.length > 1 && (
          <div className="flex items-center gap-1.5 mb-2">
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
                    className={`w-6 h-6 rounded-full overflow-hidden border-2 transition-all duration-200 ${
                      activeVariant?.variantId === variant.variantId
                        ? "border-accent shadow-sm transform scale-110 relative z-10"
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
                    <div className="absolute -top-1 -right-1 z-20 w-3.5 h-3.5 bg-accent rounded-full border border-white flex items-center justify-center shadow-sm">
                      <span className="text-[7px] font-black text-primary-dark">
                        %
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
            {item.variants.length > 5 && (
              <Text type="secondary" style={{ fontSize: 10, fontWeight: 700 }}>
                +{item.variants.length - 5}
              </Text>
            )}
          </div>
        )}

        <Link href={`/collections/products/${item?.id}`}>
          <div className="flex items-baseline gap-1.5 flex-wrap mb-1 text-base">
            <Text
              strong
              style={{
                color: hasDiscount ? "var(--color-accent)" : "inherit",
                fontSize: "1rem",
                letterSpacing: "-0.03em",
              }}
            >
              Rs. {discountedPrice.toLocaleString()}
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

          <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-default">
            <Text
              type="secondary"
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              3 x Rs.{" "}
              {(discountedPrice / 3).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              with
            </Text>
            <div className="w-7 h-2.5 relative">
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
