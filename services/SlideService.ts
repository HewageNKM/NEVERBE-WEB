import { adminFirestore } from "@/firebase/firebaseAdmin";
import { Slide } from "@/interfaces";

// Function to fetch all slider items
export const getSliders = async () => {
  console.log("Fetching sliders.");
  const docs = await adminFirestore.collection("sliders").get();
  const sliders: Slide[] = [];
  docs.forEach((doc) => {
    sliders.push({
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate().toLocaleString(),
    });
  });
  console.log("Total sliders fetched:", sliders.length);
  return sliders;
};