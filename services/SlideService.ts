import { adminFirestore } from "@/firebase/firebaseAdmin";
import { Slide } from "@/interfaces";
import { toSafeLocaleString } from "./UtilService";

// Function to fetch all slider items
export const getSliders = async () => {
  console.log("Fetching sliders.");
  const docs = await adminFirestore.collection("sliders").get();
  const sliders: Slide[] = [];
  docs.forEach((doc) => {
    sliders.push({
      ...doc.data(),
      createdAt: toSafeLocaleString(doc.data().createdAt),
      updatedAt: toSafeLocaleString(doc.data().updatedAt)
    });
  });
  console.log("Total sliders fetched:", sliders.length);
  return sliders;
};