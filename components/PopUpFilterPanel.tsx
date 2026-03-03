"use client";
import React from "react";
import { Drawer, Button, Switch, Tag } from "antd";
import { IoCloseOutline } from "react-icons/io5";
import { useFilterData } from "@/hooks/useFilterData";
import { AVAILABLE_SIZES } from "@/constants/filters";

interface PopUpFilterPanelProps {
  selectedBrands: string[];
  selectedCategories: string[];
  selectedSizes: string[];
  inStock: boolean;
  onBrandToggle: (brand: string) => void;
  onCategoryToggle: (category: string) => void;
  onSizeToggle: (size: string) => void;
  onInStockChange: (value: boolean) => void;
  onReset: () => void;
  onClose: () => void;
  showCategories?: boolean;
}

const FilterList = ({
  title,
  items,
  selected,
  onToggle,
}: {
  title: string;
  items: any[];
  selected: string[];
  onToggle: (label: string) => void;
}) => (
  <div className="py-6 border-t border-gray-100">
    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
      {title}
    </h3>
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => {
        const isActive = selected.includes(item.label?.toLowerCase());
        return (
          <button
            key={i}
            onClick={() => onToggle(item.label)}
            style={{
              padding: "6px 16px",
              borderRadius: 99,
              fontSize: 12,
              fontWeight: 700,
              border: isActive
                ? "1.5px solid #2e9e5b"
                : "1.5px solid rgba(0,0,0,0.1)",
              background: isActive ? "rgba(46, 158, 91,0.1)" : "transparent",
              color: isActive ? "#1d6639" : "#555",
              cursor: "pointer",
              transition: "all 0.2s ease",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  </div>
);

const PopUpFilterPanel: React.FC<PopUpFilterPanelProps> = ({
  selectedBrands,
  selectedCategories,
  selectedSizes,
  inStock,
  onBrandToggle,
  onCategoryToggle,
  onSizeToggle,
  onInStockChange,
  onReset,
  onClose,
  showCategories = true,
}) => {
  const { brands, categories } = useFilterData(showCategories);
  const activeFilterCount =
    selectedBrands.length +
    selectedCategories.length +
    selectedSizes.length +
    (inStock ? 1 : 0);

  return (
    <Drawer
      open
      onClose={onClose}
      placement="right"
      width={360}
      styles={{
        header: {
          background: "#fff",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          padding: "20px 24px",
        },
        body: {
          background: "#fff",
          padding: 0,
          display: "flex",
          flexDirection: "column",
        },
        footer: {
          background: "#fff",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          padding: "16px 24px",
        },
        content: { borderRadius: "24px 0 0 24px", overflow: "hidden" },
      }}
      title={
        <span
          style={{
            fontWeight: 900,
            fontSize: 16,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            color: "#1a1a1a",
          }}
        >
          Filters
          {activeFilterCount > 0 && (
            <span
              style={{
                marginLeft: 8,
                background: "#2e9e5b",
                color: "#fff",
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 800,
                padding: "2px 8px",
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </span>
      }
      closeIcon={<IoCloseOutline size={22} style={{ color: "#555" }} />}
      footer={
        <div className="flex gap-3">
          <Button
            type="text"
            onClick={() => {
              onReset();
            }}
            disabled={activeFilterCount === 0}
            style={{
              flex: 1,
              height: 44,
              fontWeight: 800,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: activeFilterCount > 0 ? "#e53e3e" : "#ccc",
              border: "1.5px solid rgba(0,0,0,0.08)",
              borderRadius: 99,
            }}
          >
            Clear All
          </Button>
          <Button
            type="primary"
            onClick={onClose}
            style={{
              flex: 2,
              height: 44,
              background: "#2e9e5b",
              color: "#fff",
              border: "none",
              fontWeight: 800,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              borderRadius: 99,
            }}
          >
            View Results
          </Button>
        </div>
      }
    >
      <div className="flex-1 overflow-y-auto px-6 hide-scrollbar">
        {/* In Stock */}
        <div className="flex justify-between items-center py-5 border-b border-gray-100">
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#1a1a1a",
            }}
          >
            In Stock Only
          </span>
          <Switch
            checked={inStock}
            onChange={onInStockChange}
            style={{ background: inStock ? "#2e9e5b" : undefined }}
          />
        </div>

        {/* Sizes */}
        <div className="py-6 border-b border-gray-100">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
            Size
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {AVAILABLE_SIZES.map((size) => {
              const isActive = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => onSizeToggle(size)}
                  style={{
                    aspectRatio: "1",
                    border: isActive
                      ? "2px solid #2e9e5b"
                      : "1.5px solid rgba(0,0,0,0.1)",
                    background: isActive ? "rgba(46, 158, 91,0.1)" : "#f8f9fa",
                    color: isActive ? "#1d6639" : "#333",
                    fontWeight: 800,
                    fontSize: 13,
                    borderRadius: 12,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    padding: "10px 0",
                  }}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {showCategories && (
          <FilterList
            title="Category"
            items={categories}
            selected={selectedCategories}
            onToggle={onCategoryToggle}
          />
        )}

        <FilterList
          title="Brand"
          items={brands}
          selected={selectedBrands}
          onToggle={onBrandToggle}
        />

        <div className="h-6" />
      </div>
    </Drawer>
  );
};

export default PopUpFilterPanel;
