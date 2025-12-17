// /collections/products/{productId}

import { Img } from "./Img";
import { ProductVariant } from "./ProductVariant";

export interface Product {
  id: string;
  productId: string;

  name: string;
  category: string;
  brand: string;
  description: string;

  thumbnail: Img;
  variants: ProductVariant[];
  weight: number;

  buyingPrice: number;
  sellingPrice: number;
  marketPrice: number;
  discount: number;

  inStock: boolean;
  status: boolean;
  listing?: boolean;
  isDeleted?: boolean;
  tags?: string[];

  // Optional timestamps if needed
  createdAt?: any;
  updatedAt?: any;
}
