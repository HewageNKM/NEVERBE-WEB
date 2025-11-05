import { adminFirestore } from "@/firebase/firebaseAdmin";

export const getBrandsForDropdown = async () => {
  try {
    const brandDoc = await adminFirestore
      .collection("brands")
      .where("status", "==", true)
      .where("isDeleted", "==", false)
      .get();
    const brands = brandDoc.docs.map((doc) => ({
      id: doc.id,
      label: doc.data().name,
    }));
    return brands;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getBrands = async () => {
  const brandDoc = await adminFirestore
    .collection("brands")
    .where("status", "==", true)
    .where("isDeleted", "==", false)
    .get();
  const brands = brandDoc.docs.map((doc) => ({
    ...doc.data(),
    createdAt: null,
    updatedAt: null,
  }));
  return brands;
};

export const getCategoriesForDropdown = async () => {
  try {
    const brandDoc = await adminFirestore
      .collection("categories")
      .where("status", "==", true)
      .where("isDeleted", "==", false)
      .get();
    const brands = brandDoc.docs.map((doc) => ({
      id: doc.id,
      label: doc.data().name,
    }));
    return brands;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
