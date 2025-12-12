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
  memberSince?: string; // Custom property
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

export interface BagItem {
  itemId: string;
  variantId: string;
  name: string;
  variantName: string;
  thumbnail: string;
  discount: number;
  size: string;
  category: string;
  quantity: number;
  price: number;
  bPrice: number;
}

export interface OrderItem {
  itemId: string;
  variantId: string;
  name: string;
  variantName: string;
  size: string;
  quantity: number;
  price: number;
  bPrice: number;
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
  customer: Customer;
  status: string;
  discount: number;
  fee?: number;
  shippingFee?: number;
  from: string;

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
