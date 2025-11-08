import { adminFirestore } from "@/firebase/firebaseAdmin";

/**
 * Get active brands for dropdown
 */
export const getBrandsForDropdown = async () => {
  try {
    console.log("[OtherService] Fetching brands for dropdown...");
    const brandDoc = await adminFirestore
      .collection("brands")
      .where("status", "==", true)
      .where("isDeleted", "==", false)
      .get();

    const brands = brandDoc.docs.map((doc) => {
      const data = doc.data();
      console.log(`[OtherService] Brand fetched: ${data.name} (ID: ${doc.id})`);
      return {
        id: doc.id,
        label: data.name,
      };
    });

    console.log(`[OtherService] Total brands fetched: ${brands.length}`);
    return brands;
  } catch (error) {
    console.error("[OtherService] Failed to fetch brands for dropdown:", error);
    throw error;
  }
};

/**
 * Get full brand objects
 */
export const getBrands = async () => {
  try {
    console.log("[OtherService] Fetching all brands...");
    const brandDoc = await adminFirestore
      .collection("brands")
      .where("status", "==", true)
      .where("isDeleted", "==", false)
      .get();

    const brands = brandDoc.docs.map((doc) => {
      const data = doc.data();
      console.log(`[OtherService] Brand fetched: ${data.name} (ID: ${doc.id})`);
      return {
        ...data,
        createdAt: null,
        updatedAt: null,
      };
    });

    console.log(`[OtherService] Total brands fetched: ${brands.length}`);
    return brands;
  } catch (error) {
    console.error("[OtherService] Failed to fetch brands:", error);
    throw error;
  }
};

/**
 * Get active categories for dropdown
 */
export const getCategoriesForDropdown = async () => {
  try {
    console.log("[OtherService] Fetching categories for dropdown...");
    const catDoc = await adminFirestore
      .collection("categories")
      .where("status", "==", true)
      .where("isDeleted", "==", false)
      .get();

    const categories = catDoc.docs.map((doc) => {
      const data = doc.data();
      console.log(`[OtherService] Category fetched: ${data.name} (ID: ${doc.id})`);
      return {
        id: doc.id,
        label: data.name,
      };
    });

    console.log(`[OtherService] Total categories fetched: ${categories.length}`);
    return categories;
  } catch (error) {
    console.error("[OtherService] Failed to fetch categories for dropdown:", error);
    throw error;
  }
};
