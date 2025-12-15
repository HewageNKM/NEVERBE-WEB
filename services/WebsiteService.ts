import { adminFirestore } from "@/firebase/firebaseAdmin";

// ============ PROMOTIONS (ADS) ============

export interface Promotion {
  id: string;
  file: string;
  url: string;
  title: string;
  link: string;
  createdAt?: string;
}

const ADS_COLLECTION = "website_ads";

/**
 * Fetch all promotional banners/ads
 */
export const getPromotions = async (): Promise<Promotion[]> => {
  try {
    console.log("[WebsiteService] Fetching promotions");
    const snapshot = await adminFirestore
      .collection(ADS_COLLECTION)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        file: data.file,
        url: data.url,
        title: data.title,
        link: data.link,
        createdAt: data.createdAt?.toDate?.()?.toISOString(),
      };
    });
  } catch (error) {
    console.error("[WebsiteService] Failed to fetch promotions:", error);
    return [];
  }
};

// ============ NAVIGATION CONFIG ============

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

export interface NavigationConfig {
  mainNav: NavigationItem[];
  footerNav: NavigationItem[];
}

const CONFIG_COLLECTION = "site_config";
const NAV_DOC = "navigation";

/**
 * Fetch dynamic navigation configuration
 */
export const getNavigationConfig = async (): Promise<NavigationConfig> => {
  try {
    console.log("[WebsiteService] Fetching navigation config");
    const doc = await adminFirestore
      .collection(CONFIG_COLLECTION)
      .doc(NAV_DOC)
      .get();

    if (!doc.exists) {
      console.warn("[WebsiteService] No navigation config found, using empty");
      return { mainNav: [], footerNav: [] };
    }

    return doc.data() as NavigationConfig;
  } catch (error) {
    console.error("[WebsiteService] Failed to fetch navigation:", error);
    return { mainNav: [], footerNav: [] };
  }
};
