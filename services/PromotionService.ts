import { adminFirestore } from "@/firebase/firebaseAdmin";
import {
  Coupon,
  Promotion,
  CouponUsage,
  ProductVariantTarget,
} from "@/interfaces/BagItem";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

const PROMOTIONS_COLLECTION = "promotions";
const COUPONS_COLLECTION = "coupons";
const COUPON_USAGE_COLLECTION = "coupon_usage";

/**
 * Serialize Firestore Timestamp to ISO string for client components
 */
const serializeTimestamp = (val: any): string | null => {
  if (!val) return null;
  if (typeof val.toDate === "function") {
    return val.toDate().toISOString();
  }
  if (val instanceof Date) {
    return val.toISOString();
  }
  return val;
};

/**
 * Serialize all timestamp fields in an object
 */
const serializeCombo = (combo: any) => ({
  ...combo,
  startDate: serializeTimestamp(combo.startDate),
  endDate: serializeTimestamp(combo.endDate),
  createdAt: serializeTimestamp(combo.createdAt),
  updatedAt: serializeTimestamp(combo.updatedAt),
});

interface CartItem {
  itemId: string;
  variantId: string;
  quantity: number;
  price: number;
}

/**
 * Check if cart items are eligible based on variant-level targeting.
 * Returns true if at least one cart item matches the targeting rules.
 */
const checkVariantEligibility = (
  cartItems: CartItem[],
  targets: ProductVariantTarget[]
): boolean => {
  if (!targets || targets.length === 0) {
    return true; // No variant restrictions, all products allowed
  }

  for (const target of targets) {
    const matchingCartItems = cartItems.filter(
      (item) => item.itemId === target.productId
    );

    if (matchingCartItems.length === 0) {
      continue; // This target product is not in cart
    }

    // Check variant mode
    if (target.variantMode === "ALL_VARIANTS") {
      return true; // Any variant of this product qualifies
    }

    if (target.variantMode === "SPECIFIC_VARIANTS" && target.variantIds) {
      // Check if any cart item has a matching variant
      const hasMatchingVariant = matchingCartItems.some(
        (item) => item.variantId && target.variantIds!.includes(item.variantId)
      );
      if (hasMatchingVariant) {
        return true;
      }
    }
  }

  return false; // No matching products/variants found
};

/**
 * Get cart items that match the variant-level targeting rules.
 * Used to calculate discount amount only on eligible items.
 */
const getEligibleCartItems = (
  cartItems: CartItem[],
  targets: ProductVariantTarget[]
): CartItem[] => {
  if (!targets || targets.length === 0) {
    return cartItems; // No restrictions, all items eligible
  }

  return cartItems.filter((item) => {
    for (const target of targets) {
      if (item.itemId !== target.productId) continue;

      if (target.variantMode === "ALL_VARIANTS") {
        return true;
      }

      if (target.variantMode === "SPECIFIC_VARIANTS" && target.variantIds) {
        return item.variantId && target.variantIds.includes(item.variantId);
      }
    }
    return false;
  });
};

export const getCouponByCode = async (code: string): Promise<Coupon | null> => {
  try {
    const snapshot = await adminFirestore
      .collection(COUPONS_COLLECTION)
      .where("code", "==", code)
      .where("isDeleted", "!=", true)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Coupon;
  } catch (error) {
    console.error("Error getting coupon:", error);
    return null;
  }
};

/**
 * Helper to check how many times a user used a coupon.
 * Matches backend implementation for per-user limit validation.
 */
const getUserCouponUsageCount = async (
  couponId: string,
  userId: string
): Promise<number> => {
  try {
    const snapshot = await adminFirestore
      .collection(COUPON_USAGE_COLLECTION)
      .where("couponId", "==", couponId)
      .where("userId", "==", userId)
      .count()
      .get();
    return snapshot.data().count;
  } catch (error) {
    console.error("Error getting coupon usage count:", error);
    return 0;
  }
};

/**
 * Helper to check if this is the user's first order
 */
const isFirstOrder = async (userId: string): Promise<boolean> => {
  try {
    const ordersSnapshot = await adminFirestore
      .collection("orders")
      .where("userId", "==", userId)
      .where("status", "!=", "CANCELLED")
      .limit(1)
      .get();
    return ordersSnapshot.empty;
  } catch (error) {
    console.error("Error checking first order:", error);
    return false;
  }
};

export const validateCoupon = async (
  code: string,
  userId: string | null,
  cartTotal: number,
  cartItems: CartItem[]
): Promise<{
  valid: boolean;
  discount: number;
  message?: string;
  coupon?: Coupon;
  conditionFeedback?: {
    type: string;
    met: boolean;
    current?: number;
    required?: number;
    message: string;
  }[];
}> => {
  const coupon = await getCouponByCode(code);

  if (!coupon) {
    return { valid: false, discount: 0, message: "Invalid coupon code" };
  }

  // 1. Status Check
  if (coupon.status !== "ACTIVE") {
    return { valid: false, discount: 0, message: "Coupon is not active" };
  }

  // 2. Date Check
  const now = new Date();
  const startDate =
    coupon.startDate instanceof Timestamp
      ? coupon.startDate.toDate()
      : new Date(coupon.startDate as string);
  const endDate = coupon.endDate
    ? coupon.endDate instanceof Timestamp
      ? coupon.endDate.toDate()
      : new Date(coupon.endDate as string)
    : null;

  if (now < startDate) {
    return { valid: false, discount: 0, message: "Coupon has not started yet" };
  }
  if (endDate && now > endDate) {
    return { valid: false, discount: 0, message: "Coupon has expired" };
  }

  // 3. Usage Limits
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return { valid: false, discount: 0, message: "Coupon usage limit reached" };
  }

  // 4. User Restriction
  if (coupon.restrictedToUsers && coupon.restrictedToUsers.length > 0) {
    if (!userId || !coupon.restrictedToUsers.includes(userId)) {
      return {
        valid: false,
        discount: 0,
        message: "This coupon is not valid for your account",
      };
    }
  }

  // 5. Per User Limit (check usage history)
  if (userId && coupon.perUserLimit) {
    const usageCount = await getUserCouponUsageCount(coupon.id, userId);
    if (usageCount >= coupon.perUserLimit) {
      return {
        valid: false,
        discount: 0,
        message: "You have already used this coupon",
      };
    }
  }

  // 6. First Order Only Check
  if (coupon.firstOrderOnly) {
    if (!userId) {
      return {
        valid: false,
        discount: 0,
        message: "Please sign in to use this coupon",
      };
    }
    const isFirst = await isFirstOrder(userId);
    if (!isFirst) {
      return {
        valid: false,
        discount: 0,
        message: "This coupon is only valid for first-time orders",
      };
    }
  }

  // 7. Minimum Order Amount
  if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order amount of Rs. ${coupon.minOrderAmount.toLocaleString()} required`,
    };
  }

  // 8. Minimum Quantity Check
  if (coupon.minQuantity) {
    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    if (totalQuantity < coupon.minQuantity) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum ${coupon.minQuantity} items required to use this coupon`,
      };
    }
  }

  // 9a. Variant-Level Products Check (new)
  if (
    coupon.applicableProductVariants &&
    coupon.applicableProductVariants.length > 0
  ) {
    const variantEligible = checkVariantEligibility(
      cartItems,
      coupon.applicableProductVariants
    );
    if (!variantEligible) {
      return {
        valid: false,
        discount: 0,
        message:
          "This coupon is not valid for the product variants in your cart",
      };
    }
  }

  // 9b. Applicable Products Check (legacy - product-level only)
  if (
    coupon.applicableProducts &&
    coupon.applicableProducts.length > 0 &&
    (!coupon.applicableProductVariants ||
      coupon.applicableProductVariants.length === 0)
  ) {
    const hasApplicableProduct = cartItems.some((item) =>
      coupon.applicableProducts!.includes(item.itemId)
    );
    if (!hasApplicableProduct) {
      return {
        valid: false,
        discount: 0,
        message: "This coupon is not valid for items in your cart",
      };
    }
  }

  // 10. Applicable Categories Check
  if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
    // Get product details to check categories
    const productIds = cartItems.map((item) => item.itemId);
    const productsSnapshot = await adminFirestore
      .collection("products")
      .where("__name__", "in", productIds.slice(0, 10)) // Firestore 'in' limit is 10
      .get();

    const productCategories = productsSnapshot.docs.map(
      (doc) => doc.data().category
    );
    const hasApplicableCategory = productCategories.some((cat) =>
      coupon.applicableCategories!.includes(cat)
    );

    if (!hasApplicableCategory) {
      return {
        valid: false,
        discount: 0,
        message: "This coupon is not valid for the categories in your cart",
      };
    }
  }

  // 11. Excluded Products Check
  if (coupon.excludedProducts && coupon.excludedProducts.length > 0) {
    const allExcluded = cartItems.every((item) =>
      coupon.excludedProducts!.includes(item.itemId)
    );
    if (allExcluded) {
      return {
        valid: false,
        discount: 0,
        message: "This coupon cannot be applied to the items in your cart",
      };
    }
  }

  // 12. Calculate Discount
  let discountAmount = 0;
  if (coupon.discountType === "FIXED") {
    discountAmount = coupon.discountValue;
  } else if (coupon.discountType === "PERCENTAGE") {
    // If applicable products are specified, only apply discount to those
    let applicableTotal = cartTotal;
    let eligibleItems = cartItems;

    // If variant-level targeting is specified, use that first
    if (
      coupon.applicableProductVariants &&
      coupon.applicableProductVariants.length > 0
    ) {
      eligibleItems = getEligibleCartItems(
        cartItems,
        coupon.applicableProductVariants
      );
      applicableTotal = eligibleItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }
    // Fallback to legacy product-level targeting
    else if (
      coupon.applicableProducts &&
      coupon.applicableProducts.length > 0
    ) {
      eligibleItems = cartItems.filter((item) =>
        coupon.applicableProducts!.includes(item.itemId)
      );
      applicableTotal = eligibleItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }

    // Exclude excluded products from discount calculation
    if (coupon.excludedProducts && coupon.excludedProducts.length > 0) {
      const excludedTotal = eligibleItems
        .filter((item) => coupon.excludedProducts!.includes(item.itemId))
        .reduce((sum, item) => sum + item.price * item.quantity, 0);
      applicableTotal = applicableTotal - excludedTotal;
    }

    discountAmount = (applicableTotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else if (coupon.discountType === "FREE_SHIPPING") {
    discountAmount = 0; // Handled as flag - shipping discount applied separately
  }

  // Build condition feedback for real-time customer hints
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const conditionFeedback: {
    type: string;
    met: boolean;
    current?: number;
    required?: number;
    message: string;
  }[] = [];

  // Min order amount feedback
  if (coupon.minOrderAmount) {
    const met = cartTotal >= coupon.minOrderAmount;
    conditionFeedback.push({
      type: "MIN_ORDER_AMOUNT",
      met,
      current: cartTotal,
      required: coupon.minOrderAmount,
      message: met
        ? `✓ Minimum order of Rs. ${coupon.minOrderAmount.toLocaleString()} met`
        : `Add Rs. ${(
            coupon.minOrderAmount - cartTotal
          ).toLocaleString()} more to use this coupon`,
    });
  }

  // Min quantity feedback
  if (coupon.minQuantity) {
    const met = totalQuantity >= coupon.minQuantity;
    conditionFeedback.push({
      type: "MIN_QUANTITY",
      met,
      current: totalQuantity,
      required: coupon.minQuantity,
      message: met
        ? `✓ Minimum ${coupon.minQuantity} items in cart`
        : `Add ${coupon.minQuantity - totalQuantity} more item${
            coupon.minQuantity - totalQuantity > 1 ? "s" : ""
          } to use this coupon`,
    });
  }

  // First order only feedback
  if (coupon.firstOrderOnly) {
    conditionFeedback.push({
      type: "FIRST_ORDER_ONLY",
      met: true, // Already passed validation if we got here
      message: "✓ First order only coupon",
    });
  }

  // Applicable products/categories hint
  if (coupon.applicableProducts && coupon.applicableProducts.length > 0) {
    conditionFeedback.push({
      type: "APPLICABLE_PRODUCTS",
      met: true,
      message: `Applies to ${
        coupon.applicableProducts.length
      } specific product${coupon.applicableProducts.length > 1 ? "s" : ""}`,
    });
  }

  if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
    conditionFeedback.push({
      type: "APPLICABLE_CATEGORIES",
      met: true,
      message: `Applies to: ${coupon.applicableCategories.join(", ")}`,
    });
  }

  // Excluded products warning
  if (coupon.excludedProducts && coupon.excludedProducts.length > 0) {
    const hasExcluded = cartItems.some((item) =>
      coupon.excludedProducts!.includes(item.itemId)
    );
    if (hasExcluded) {
      conditionFeedback.push({
        type: "EXCLUDED_PRODUCTS",
        met: false,
        message: "Some items in your cart are excluded from this coupon",
      });
    }
  }

  // Free shipping indicator
  if (coupon.discountType === "FREE_SHIPPING") {
    conditionFeedback.push({
      type: "FREE_SHIPPING",
      met: true,
      message: "🚚 Free shipping on your order!",
    });
  }

  return { valid: true, discount: discountAmount, coupon, conditionFeedback };
};

/**
 * Get all active promotions
 */
export const getActivePromotions = async () => {
  try {
    const now = new Date();
    const snapshot = await adminFirestore
      .collection(PROMOTIONS_COLLECTION)
      .where("status", "==", "ACTIVE")
      .where("isDeleted", "!=", true)
      .get();

    const promotions = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startDate: serializeTimestamp(data.startDate),
          endDate: serializeTimestamp(data.endDate),
          createdAt: serializeTimestamp(data.createdAt),
          updatedAt: serializeTimestamp(data.updatedAt),
        };
      })
      .filter((promo: any) => {
        // Filter by date range
        const startDate = promo.startDate ? new Date(promo.startDate) : null;
        const endDate = promo.endDate ? new Date(promo.endDate) : null;

        if (startDate && now < startDate) return false;
        if (endDate && now > endDate) return false;

        return true;
      });

    return promotions;
  } catch (e) {
    console.error("Error fetching promotions", e);
    return [];
  }
};

export const getActiveCombos = async () => {
  try {
    const snapshot = await adminFirestore
      .collection("combo_products")
      .where("status", "==", "ACTIVE")
      .where("isDeleted", "!=", true)
      .get();
    return snapshot.docs.map((doc) =>
      serializeCombo({ id: doc.id, ...doc.data() })
    );
  } catch (e) {
    console.error("Error fetching combos", e);
    return [];
  }
};

/**
 * Get a single combo by ID with populated product details
 */
export const getComboById = async (id: string) => {
  try {
    const doc = await adminFirestore.collection("combo_products").doc(id).get();

    if (!doc.exists) return null;

    const combo = { id: doc.id, ...doc.data() } as any;

    // Skip soft-deleted combos
    if (combo.isDeleted) return null;

    // Populate product details for each combo item
    const populatedItems = await Promise.all(
      (combo.items || []).map(async (item: any) => {
        try {
          const productDoc = await adminFirestore
            .collection("products")
            .doc(item.productId)
            .get();

          if (!productDoc.exists) {
            return { ...item, product: null };
          }

          const productData = productDoc.data();

          // Find specific variant if variantId is provided
          let variant = null;
          if (item.variantId && productData?.variants) {
            variant = productData.variants.find(
              (v: any) => v.variantId === item.variantId
            );
          }

          return {
            ...item,
            product: {
              id: productDoc.id,
              name: productData?.name,
              thumbnail: productData?.thumbnail,
              sellingPrice: productData?.sellingPrice,
              marketPrice: productData?.marketPrice,
              buyingPrice: productData?.buyingPrice || 0,
              discount: productData?.discount || 0,
              variants: productData?.variants || [],
            },
            variant,
          };
        } catch (err) {
          console.error(`Error fetching product ${item.productId}:`, err);
          return { ...item, product: null };
        }
      })
    );

    return serializeCombo({
      ...combo,
      items: populatedItems,
    });
  } catch (e) {
    console.error("Error fetching combo by ID:", e);
    return null;
  }
};

/**
 * Get all active combos with populated product details (for listing page)
 */
export const getActiveCombosWithProducts = async () => {
  try {
    const combos = await getActiveCombos();

    const populatedCombos = await Promise.all(
      combos.map(async (combo: any) => {
        // Just get first product thumbnail for listing card
        const firstItem = combo.items?.[0];
        if (!firstItem) return combo;

        try {
          const productDoc = await adminFirestore
            .collection("products")
            .doc(firstItem.productId)
            .get();

          if (!productDoc.exists) return combo;

          const productData = productDoc.data();
          return {
            ...combo,
            previewThumbnail:
              combo.thumbnail?.url || productData?.thumbnail?.url,
          };
        } catch {
          return combo;
        }
      })
    );

    return populatedCombos;
  } catch (e) {
    console.error("Error fetching combos with products", e);
    return [];
  }
};

/**
 * Get paginated active combos with product details
 */
export const getPaginatedCombos = async (
  page: number = 1,
  pageSize: number = 6
): Promise<{ combos: any[]; total: number; totalPages: number }> => {
  try {
    // Get all active combos first (for accurate count)
    const allCombosSnapshot = await adminFirestore
      .collection("combo_products")
      .where("status", "==", "ACTIVE")
      .where("isDeleted", "!=", true)
      .get();

    const total = allCombosSnapshot.size;
    const totalPages = Math.ceil(total / pageSize);

    // Get paginated slice
    const offset = (page - 1) * pageSize;
    const paginatedDocs = allCombosSnapshot.docs.slice(
      offset,
      offset + pageSize
    );

    const combos = paginatedDocs.map((doc) =>
      serializeCombo({ id: doc.id, ...doc.data() })
    );

    // Populate with product thumbnails
    const populatedCombos = await Promise.all(
      combos.map(async (combo: any) => {
        const firstItem = combo.items?.[0];
        if (!firstItem) return combo;

        try {
          const productDoc = await adminFirestore
            .collection("products")
            .doc(firstItem.productId)
            .get();

          if (!productDoc.exists) return combo;

          const productData = productDoc.data();
          return {
            ...combo,
            previewThumbnail:
              combo.thumbnail?.url || productData?.thumbnail?.url,
          };
        } catch {
          return combo;
        }
      })
    );

    return {
      combos: populatedCombos,
      total,
      totalPages,
    };
  } catch (e) {
    console.error("Error fetching paginated combos", e);
    return { combos: [], total: 0, totalPages: 0 };
  }
};

/**
 * Validate combo items selection for add to cart
 */
export const validateComboSelection = (
  combo: any,
  selections: { productId: string; variantId: string; size: string }[]
) => {
  const requiredItems = combo.items?.filter((item: any) => item.required) || [];

  // Check all required items have a selection
  for (const required of requiredItems) {
    const hasSelection = selections.some(
      (s) => s.productId === required.productId
    );
    if (!hasSelection) {
      return {
        valid: false,
        message: `Please select options for all required items`,
      };
    }
  }

  // Check all selections have size
  for (const selection of selections) {
    if (!selection.size) {
      return {
        valid: false,
        message: `Please select a size for all items`,
      };
    }
  }

  return { valid: true };
};
