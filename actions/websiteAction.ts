import { otherRepository } from "@/repositories/OtherRepository";

/**
 * WebsiteService - Thin wrapper over OtherRepository
 * Delegates data access to repository layer
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

export const getNavigationConfig = (): Promise<NavigationConfig> =>
  otherRepository.getNavigationConfig();
