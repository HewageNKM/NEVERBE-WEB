import { MetadataRoute } from "next";
import {
  getProductsForSitemap,
  getCategoriesForSitemap,
  getBrandForSitemap,
} from "@/actions/productAction";
import { getCombosForSitemap } from "@/actions/promotionAction";
import { CATEGORY_MAPPINGS } from "@/utils/categorySlug";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://neverbe.lk";

  // Core static pages
  const staticPages = [
    "",
    "/collections/products",
    "/collections/new-arrivals",
    "/collections/combos",
    "/collections/offers",
    "/search",
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

  // Clean category pages (SEO-friendly URLs)
  const categoryPages = CATEGORY_MAPPINGS.map((c) => ({
    url: `${baseUrl}/collections/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  try {
    // Dynamically fetch catalog data
    const [products, categories, brands, combos] = await Promise.all([
      getProductsForSitemap(),
      getCategoriesForSitemap(),
      getBrandForSitemap(),
      getCombosForSitemap(),
    ]);

    // Ensure all dynamic URLs use the correct base URL and are structured correctly
    const processDynamicUrls = (items: any[]) => {
      return items
        .filter(
          (item) =>
            item.url &&
            !String(item.url).toLowerCase().includes("undefined") &&
            !String(item.url).includes("?category=") && // Filter out items with empty params if needed, but the action filter handles this
            !String(item.url).includes("?brand="),
        )
        .map((item) => {
          // Normalize path: remove domain if present, ensure leading slash
          let path = String(item.url).replace(/^https?:\/\/[^\/]+/, "");
          if (!path.startsWith("/")) path = `/${path}`;

          return {
            ...item,
            url: `${baseUrl}${path}`,
          };
        });
    };

    // For brand and categories, we need to allow the query params, so we refine the filter
    const processCatalogUrls = (items: any[]) => {
      return items
        .filter(
          (item) =>
            item.url && !String(item.url).toLowerCase().includes("undefined"),
        )
        .map((item) => {
          let path = String(item.url).replace(/^https?:\/\/[^\/]+/, "");
          if (!path.startsWith("/")) path = `/${path}`;
          return {
            ...item,
            url: `${baseUrl}${path}`,
          };
        });
    };

    return [
      ...staticPages,
      ...categoryPages,
      ...processCatalogUrls(brands),
      ...processDynamicUrls(products),
      ...processDynamicUrls(combos),
    ];
  } catch (error) {
    console.error(
      "Failed to generate dynamic sitemap, falling back to static:",
      error,
    );
    return [...staticPages, ...categoryPages];
  }
}
