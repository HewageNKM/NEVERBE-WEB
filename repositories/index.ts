/**
 * Repository Layer - Data Access
 *
 * This layer contains all data access logic, providing a clean interface
 * for services to interact with Firestore without knowing implementation details.
 *
 * Usage:
 *   import { productRepository, promotionRepository } from '@/repositories';
 *   const products = await productRepository.findAll({ page: 1, size: 20 });
 */

export { BaseRepository } from "./BaseRepository";
export { productRepository, ProductRepository } from "./ProductRepository";
export {
  promotionRepository,
  PromotionRepository,
} from "./PromotionRepository";
export { couponRepository, CouponRepository } from "./CouponRepository";
export { comboRepository, ComboRepository } from "./ComboRepository";
export { orderRepository, OrderRepository } from "./OrderRepository";
export { otherRepository, OtherRepository } from "./OtherRepository";

// Re-export types
export type { ProductQueryOptions, PaginatedResult } from "./ProductRepository";
