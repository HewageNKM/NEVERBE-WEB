import { firestore } from "firebase-admin";
import Timestamp = firestore.Timestamp;

export interface Coupon {
  id: string;
  code: string;
  name: string; // Internal name
  description?: string; // User facing description

  // Discount
  discountType: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  discountValue: number;
  maxDiscount?: number; // Cap for percentage

  // Rules
  minOrderAmount?: number;
  minQuantity?: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  excludedProducts?: string[];

  // Limits
  usageLimit?: number; // Total global uses
  usageCount: number;
  perUserLimit?: number;

  // Validity
  startDate: Timestamp | string;
  endDate: Timestamp | string; // Optional for never expire?

  status: "ACTIVE" | "INACTIVE" | "EXPIRED";

  // User Restrictions
  restrictedToUsers?: string[]; // Specific user IDs
  firstOrderOnly?: boolean;

  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}

export interface CouponUsage {
  id: string;
  couponId: string;
  userId: string;
  orderId: string;
  discountApplied: number;
  usedAt: Timestamp | string;
}
