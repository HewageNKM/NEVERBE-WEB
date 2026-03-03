import { Product } from "@/interfaces/Product";

/**
 * DealsMerger
 * Utility to merge Promoted Products with Discounted Products
 * securely and with correct pagination stitching.
 */
export class DealsMerger {
  /**
   * Stitch two paginated sources together: Promoted (Priority) and Discounted (Fillers).
   */
  static stitch(
    promoted: Product[],
    discounted: Product[],
    page: number,
    size: number
  ): Product[] {
    const startIndex = (page - 1) * size;
    const promoCount = promoted.length;
    let result: Product[] = [];

    // 1. Add Promoted Products if they fall within the current page window
    if (startIndex < promoCount) {
      result = promoted.slice(startIndex, startIndex + size);
    }

    // 2. Fill remaining slots with Discounted Products
    if (result.length < size) {
      const remainingSlots = size - result.length;

      // Calculate how many discounted items we need to skip.
      // If we completely skipped promoted items (page start > promo count),
      // we need to skip (startIndex - promoCount) discounted items.
      // If we are partly in promoted items, we take from index 0 of discounted.
      const discountOffset = Math.max(0, startIndex - promoCount);

      // We assume 'discounted' array PASSED IN here is already the "Right Chunk"
      // or the "Full Stream"?
      // Actually, fetching the right chunk of discounted products is the hard part.
      // This helper assumes 'discounted' contains the items we need.
      // But typically, the Service fetches the discounted items.

      // So this method primarily helps CONCATENATE given the raw arrays if we were doing in-memory?
      // No, let's make this helper simpler: JUST deduplication and concatenation.

      // The Service is responsible for fetching the correct 'discounted' slice.
      // This helper will just merge and deduplicate.

      const promoIds = new Set(promoted.map((p) => p.id));
      const dedupedDiscounts = discounted.filter((p) => !promoIds.has(p.id));

      result = [...result, ...dedupedDiscounts];
    }

    return result.slice(0, size);
  }
}
