export * from "./Product";
export * from "./ProductVariant";
export * from "./InventoryItem";
export * from "./Img";
export * from "./Promotion";
export * from "./Coupon";
export * from "./ComboProduct";

export * from "./index"; // Re-export everything from index, or just BagItem if circular deps worry.
// Better: Just re-export BagItem from index.

import { BagItem as GlobalBagItem } from "./index";
export type BagItem = GlobalBagItem;
