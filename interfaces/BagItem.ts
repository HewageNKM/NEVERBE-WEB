import { BaseItem } from "./BaseItem";

export type VariantMode = "ALL_VARIANTS" | "SPECIFIC_VARIANTS";

/**
 * BagItem represents an item in the shopping bag/cart
 */
export interface BagItem extends BaseItem {
  discount: number;
  itemType: string;
  maxQuantity: number;
  variantName?: string;

  // Combo-specific properties
  comboId?: string;
  comboName?: string;
  isComboItem?: boolean;
}
