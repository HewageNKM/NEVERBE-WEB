export * from "./Product";
export * from "./ProductVariant";
export * from "./InventoryItem";
export * from "./Img";
export * from "./Promotion";
export * from "./Coupon";
export * from "./ComboProduct";

export interface BagItem {
  itemId: string;
  variantId: string;
  size: string;
  quantity: number;
  price: number;
  bPrice: number; // Buying price for profit calculation
  name: string;
  image: string;
  discount: number;
  itemType: string;
  maxQuantity: number;
  variantName?: string;

  // Product targeting fields for promotions
  category?: string;
  brand?: string;

  // Combo-specific properties
  comboId?: string;
  comboName?: string;
  isComboItem?: boolean;
}
