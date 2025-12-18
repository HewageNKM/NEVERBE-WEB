import {
  getBrandForSitemap,
  getProductsForSitemap,
  getCategoriesForSitemap,
} from "@/services/ProductService";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://neverbe.lk";

  // Fetch dynamic data from database
  const allProducts = await getProductsForSitemap();
  const dynamicBrands = await getBrandForSitemap();
  const dynamicCategories = await getCategoriesForSitemap();

  // Main/Static URLs (essential pages to index)
  const mainUrls: MetadataRoute.Sitemap = [
    // Homepage
    {
      url: baseUrl,
      priority: 1,
      lastModified: new Date(),
      changeFrequency: "daily",
    },
    // Core Collections
    {
      url: `${baseUrl}/collections/products`,
      priority: 0.9,
      lastModified: new Date(),
      changeFrequency: "daily",
    },
    {
      url: `${baseUrl}/collections/new-arrivals`,
      priority: 0.9,
      lastModified: new Date(),
      changeFrequency: "daily",
    },
    // Gender Filters
    {
      url: `${baseUrl}/collections/products?gender=men`,
      priority: 0.85,
      lastModified: new Date(),
      changeFrequency: "weekly",
    },
    {
      url: `${baseUrl}/collections/products?gender=women`,
      priority: 0.85,
      lastModified: new Date(),
      changeFrequency: "weekly",
    },
    // Promotions
    {
      url: `${baseUrl}/collections/offers`,
      priority: 0.8,
      lastModified: new Date(),
      changeFrequency: "daily",
    },
    {
      url: `${baseUrl}/collections/combos`,
      priority: 0.8,
      lastModified: new Date(),
      changeFrequency: "weekly",
    },
    // Info Pages
    { url: `${baseUrl}/aboutUs`, priority: 0.5, lastModified: new Date() },
    { url: `${baseUrl}/contact`, priority: 0.5, lastModified: new Date() },
    // Policies
    { url: `${baseUrl}/policies/privacy-policy`, priority: 0.3 },
    {
      url: `${baseUrl}/policies/shipping-return-policy`,
      priority: 0.3,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/policies/terms-conditions`,
      priority: 0.3,
      lastModified: new Date(),
    },
  ];

  return [
    ...mainUrls,
    ...dynamicCategories, // Categories from DB
    ...dynamicBrands, // Brands from DB
    ...allProducts, // Products from DB
  ];
}

export const dynamic = "force-dynamic";
