import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://neverbe.lk";

  // Core static pages
  const staticPages = [
    "",
    "/collections/products",
    "/aboutUs",
    "/contact",
    "/policies/shipping-return-policy",
    "/policies/terms-conditions",
    "/policies/privacy-policy",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Categories (based on constants/collectionList)
  const categories = [
    "/collections/products?category=sandals%20%26%20slippers%20%26%20slides",
    "/collections/products?category=boots",
    "/collections/products?category=running%20shoes",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...categories];
}
