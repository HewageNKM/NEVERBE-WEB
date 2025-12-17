import { adminFirestore } from "@/firebase/firebaseAdmin";

// ============ NAVIGATION CONFIG ============

export interface NavigationItem {
  title: string;
  link: string;
  children?: NavigationItem[];
}

export interface SocialMediaItem {
  name: string; // e.g., "facebook", "instagram", "tiktok"
  url: string;
}

export interface NavigationConfig {
  mainNav: NavigationItem[];
  footerNav: NavigationItem[];
  socialLinks?: SocialMediaItem[];
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
