import { Timestamp } from "@firebase/firestore";

export interface Message {
  email: string;
  subject: string;
  name: string;
  message: string;
}

export interface SerializableUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  providerId: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  memberSince?: string;
}

export interface PaymentMethod {
  paymentId: string;
  name: string;
  fee: number;
  status: "Active" | "Inactive";
  available: string[];

  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}
export interface Review {
  reviewId: string;
  itemId: string;
  rating: number;
  review: string;
  userId: string;
  userName: string;
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}

export interface Type {
  name: string; // Type name, e.g., "Shoes"
  url: string; // URL to the type's main page under the manufacturer
  titles: Title[]; // Array of brand titles under this type
}

export interface Title {
  name: string; // Brand title name, e.g., "Running Shoes"
  url: string; // URL to this specific title's page
}

export interface Item {
  itemId: string;
  type: string;
  brand: string;
  description: string;
  keywords: string[];
  thumbnail: {
    file: string;
    url: string;
  };
  variants: Variant[];
  manufacturer: string;
  name: string;
  sellingPrice: number;
  marketPrice: number;
  buyingPrice: number;
  discount: number;
  listing: "Active" | "Inactive";
  status: "Active" | "Inactive";

  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface Size {
  size: string;
  stock: number;
}

export interface Variant {
  variantId: string;
  variantName: string;
  images: [
    {
      file: string;
      url: string;
    }
  ];
  sizes: Size[];
}

export interface BaseItem {
  itemId: string;
  variantId: string;
  size: string;
  quantity: number;
  price: number;
  bPrice: number; // Buying price
  name: string;
  thumbnail: string;
  discount?: number; // Made optional as it was varying
}

export interface OrderItem extends BaseItem {
  variantName: string;
}

export interface FooterLink {
  title: string;
  url: string;
}

export interface SocialMedia {
  icon: React.ElementType;
  name: string;
  url: string;
}

export interface Slide {
  fileName: string;
  url: string;
  id: string;
}

export interface Order {
  orderId: string | null;
  paymentId: string;
  items: OrderItem[];
  paymentStatus: string;
  paymentMethod: string;
  paymentMethodId?: string;
  customer: Customer;
  status: string;
  discount: number;
  fee?: number;
  shippingFee?: number;
  transactionFeeCharge?: number;
  total?: number;
  from: string;
  userId?: string;

  couponCode?: string;
  couponDiscount?: number;
  promotionDiscount?: number;
  appliedPromotionId?: string;
  appliedPromotionIds?: string[]; // All stacked promotion IDs

  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip?: string;

  shippingName?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingZip?: string;
  shippingPhone?: string;

  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}

// Re-export BagItem with full properties
// Re-export BagItem with full properties
export interface BagItem extends BaseItem {
  discount: number; // Override to be required if it was strictly required before, or keep optional. In BagItem.ts it was required.
  image?: string; // KEEPING AS OPTIONAL DEPRECATED FOR NOW TO PREVENT BREAKING IMMEDIATELY, OR REMOVE? Plan said remove.
  // Actually, plan says remove `image` and use `thumbnail`.
  // Let's remove `image` and strict type `thumbnail`.

  itemType: string;
  maxQuantity: number;
  variantName?: string;

  // Combo-specific properties
  comboId?: string;
  comboName?: string;
  isComboItem?: boolean;
}
