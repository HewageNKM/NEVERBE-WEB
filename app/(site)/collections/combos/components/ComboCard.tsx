"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ComboProduct } from "@/interfaces/ComboProduct";

// ComboCard with Antd Fluid Design
import { Card, Typography, Badge, Tag } from "antd";

const { Text, Title, Paragraph } = Typography;

interface ComboCardProps {
  combo: ComboProduct & { previewThumbnail?: string };
}

/**
 * ComboCard - NEVERBE Flow Style
 * Bundle cards with branded badges and dynamic pricing display.
 */
const ComboCard: React.FC<ComboCardProps> = ({ combo }) => {
  const savings = combo.originalPrice - combo.comboPrice;
  const savingsPercent = Math.round((savings / combo.originalPrice) * 100);

  // Get combo type label
  const getTypeLabel = () => {
    switch (combo.type) {
      case "BOGO":
        return "Buy & Get Free";
      case "MULTI_BUY":
        return `Buy ${combo.buyQuantity} Save More`;
      case "BUNDLE":
      default:
        return "Bundle Deal";
    }
  };

  const hasSavings = savings > 0;

  return (
    <Badge.Ribbon
      text={hasSavings ? `Save ${savingsPercent}%` : getTypeLabel()}
      color={hasSavings ? "#000" : "#97e13e"}
      style={{
        padding: "0 16px",
        fontWeight: 800,
        textTransform: "uppercase",
        color: hasSavings ? "#97e13e" : "#000",
        letterSpacing: "0.05em",
        top: 12,
      }}
    >
      <Link href={`/collections/combos/${combo.id}`} className="block w-full">
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
            <div className="relative aspect-4/5 w-full overflow-hidden bg-surface-2 rounded-t-[24px]">
              {combo.previewThumbnail || combo.thumbnail?.url ? (
                <Image
                  src={combo.previewThumbnail || combo.thumbnail?.url || ""}
                  alt={combo.name}
                  fill
                  className="object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl opacity-40">📦</span>
                </div>
              )}
              {hasSavings && (
                <div className="absolute bottom-3 left-3 z-10">
                  <Tag
                    color="#97e13e"
                    style={{
                      color: "#000",
                      fontWeight: 800,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      padding: "4px 8px",
                      border: "none",
                    }}
                  >
                    {getTypeLabel()}
                  </Tag>
                </div>
              )}
            </div>
          }
        >
          <div className="flex flex-col gap-2">
            <div>
              <Title
                level={5}
                style={{
                  margin: 0,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                }}
                className="group-hover:text-accent transition-colors line-clamp-1"
              >
                {combo.name}
              </Title>
              <Text type="secondary" style={{ fontWeight: 600 }}>
                {combo.items?.length || 0} Piece Bundle
              </Text>
            </div>

            {combo.type === "BOGO" && (
              <Text
                style={{
                  color: "#97e13e",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: "0.05em",
                }}
              >
                Buy {combo.buyQuantity}, Get {combo.getQuantity} Free
              </Text>
            )}

            <div className="flex flex-col mt-2">
              <Text
                strong
                style={{
                  fontSize: "1.25rem",
                  letterSpacing: "-0.03em",
                }}
              >
                Rs. {combo.comboPrice.toLocaleString()}
              </Text>
              {hasSavings && (
                <Text delete type="secondary" style={{ fontSize: "0.85rem" }}>
                  Rs. {combo.originalPrice.toLocaleString()}
                </Text>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </Badge.Ribbon>
  );
};

export default ComboCard;
