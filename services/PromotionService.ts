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

  // 5. Minimum Order Amount
  if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order amount of ${coupon.minOrderAmount} required`,
    };
  }

  // 6. Calculate Discount
  let discountAmount = 0;
  if (coupon.discountType === "FIXED") {
    discountAmount = coupon.discountValue;
  } else if (coupon.discountType === "PERCENTAGE") {
    discountAmount = (cartTotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else if (coupon.discountType === "FREE_SHIPPING") {
    discountAmount = 0; // Handled as flag
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
