import { firestore } from "firebase-admin";
import Timestamp = firestore.Timestamp;
import { Img } from "./Img";

export interface ComboProduct {
  id: string;
  name: string;
  description: string;
  thumbnail?: Img;

  // Items in the bundle
  items: ComboItem[];

  // Pricing
  originalPrice: number; // Sum of individual items
  comboPrice: number; // Discounted price
  savings: number; // Calculated savings

  // Settings
  type: "BUNDLE" | "BOGO" | "MULTI_BUY";
  status: "ACTIVE" | "INACTIVE";
  startDate?: Timestamp | string;
  endDate?: Timestamp | string;

  // For BOGO/Multi logic
  buyQuantity?: number;
  getQuantity?: number;
  getDiscount?: number; // % off on the 'get' items

  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}

export interface ComboItem {
  productId: string;
  variantId?: string; // Optional if bundle applies to any variant
  quantity: number;
  required: boolean; // Is this item mandatory for the bundle?
}
