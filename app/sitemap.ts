import {
  getBrandForSitemap,
  getProductsForSitemap,
  getCategoriesForSitemap,
} from "@/services/ProductService";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://neverbe.lk";

  const allProducts = await getProductsForSitemap();
  const getBrands = await getBrandForSitemap();
  const getCategories = await getCategoriesForSitemap();

  return [
    {
      url: baseUrl,
      priority: 1,
      lastModified: new Date(),
      changeFrequency: "daily",
    },
    {
      url: `${baseUrl}/collections/products`,
      lastModified: new Date(),
      priority: 0.9,
      changeFrequency: "weekly",
    },
    // Gender-specific collections
    {
      url: `${baseUrl}/collections/products?gender=men`,
      lastModified: new Date(),
      priority: 0.8,
      changeFrequency: "weekly",
    },
    {
      url: `${baseUrl}/collections/products?gender=women`,
      lastModified: new Date(),
      priority: 0.8,
      changeFrequency: "weekly",
    },
    {
      url: `${baseUrl}/collections/offers`,
      lastModified: new Date(),
      priority: 0.8,
      changeFrequency: "weekly",
    },
    {
      url: `${baseUrl}/collections/combos`,
      lastModified: new Date(),
      priority: 0.7,
      changeFrequency: "weekly",
    },
    {
      url: `${baseUrl}/collections/new-arrivals`,
      lastModified: new Date(),
      priority: 0.8,
      changeFrequency: "daily",
    },
    ...getCategories,
    ...getBrands,
    ...allProducts,
    {
      url: `${baseUrl}/aboutUs`,
      lastModified: new Date(),
      priority: 0.5,
    },
    {
      url: `${baseUrl}/policies/privacy-policy`,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/policies/shipping-return-policy`,
      lastModified: new Date(),
      priority: 0.5,
    },
    {
      url: `${baseUrl}/policies/terms-conditions`,
      lastModified: new Date(),
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      priority: 0.3,
    },
  ];
}

export const dynamic = "force-dynamic";
