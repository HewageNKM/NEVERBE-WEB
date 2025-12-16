import { adminFirestore } from "@/firebase/firebaseAdmin";
import { Coupon, Promotion, CouponUsage } from "@/interfaces/BagItem";
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

  // 9. Applicable Products Check
  if (coupon.applicableProducts && coupon.applicableProducts.length > 0) {
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
    if (coupon.applicableProducts && coupon.applicableProducts.length > 0) {
      applicableTotal = cartItems
        .filter((item) => coupon.applicableProducts!.includes(item.itemId))
        .reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
    // Exclude excluded products from discount calculation
    if (coupon.excludedProducts && coupon.excludedProducts.length > 0) {
      const excludedTotal = cartItems
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

  return { valid: true, discount: discountAmount, coupon };
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
