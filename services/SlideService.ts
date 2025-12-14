import { adminFirestore } from "@/firebase/firebaseAdmin";
import { Slide } from "@/interfaces/BagItem";
import { toSafeLocaleString } from "./UtilService";

// Function to fetch all slider items
export const getSliders = async () => {
  try {
    console.log("[SliderService] getSliders → Fetching all slider items.");

    const snapshot = await adminFirestore.collection("sliders").get();
    console.log(`[SliderService] Total documents retrieved: ${snapshot.size}`);

    const sliders: Slide[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      const slider: Slide = {
        ...data,
        id: doc.id,
        createdAt: null,
        updatedAt: null,
      };
      console.log(`[SliderService] Processed slider: ${slider.id}`);
      return slider;
    });

    console.log(`[SliderService] Total sliders processed: ${sliders.length}`);
    return sliders;
  } catch (error) {
    console.error("[SliderService] Failed to fetch sliders:", error);
    throw error;
  }
};
