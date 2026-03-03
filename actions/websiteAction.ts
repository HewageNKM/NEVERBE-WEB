import axiosInstance from "./axiosInstance";

/**
 * WebsiteService - Thin wrapper over API
 * Delegates data access to API server
 */

// ============ NAVIGATION CONFIG ============

export interface NavigationItem {
  title: string;
  link: string;
  children?: NavigationItem[];
}

export interface SocialMediaItem {
  name: string;
  url: string;
}

export interface NavigationConfig {
  mainNav: NavigationItem[];
  footerNav: NavigationItem[];
  socialLinks?: SocialMediaItem[];
}

export const getNavigationConfig = async (): Promise<NavigationConfig> => {
  try {
    const res = await axiosInstance.get("/web/config/navigation");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch navigation config:", error);
    return { mainNav: [], footerNav: [] };
  }
};
