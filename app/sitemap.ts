import { MetadataRoute } from "next";
import {
  getProductsForSitemap,
  getCategoriesForSitemap,
  getBrandForSitemap,
} from "@/actions/productAction";
import { getCombosForSitemap } from "@/actions/promotionAction";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://neverbe.lk";

  // Core static pages
  const staticPages = [
    "",
    "/collections/products",
    "/collections/new-arrivals",
    "/collections/combos",
    "/collections/offers",
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
        .filter((item) => item.url && !item.url.includes("undefined"))
        .map((item) => {
          // Strip out any incorrect domain or literal "undefined" prefix
          let path = item.url.replace(/^https?:\/\/[^\/]+/, "");
          path = path.replace(/^undefined/, "");
          if (!path.startsWith("/")) path = `/${path}`;

          return {
            ...item,
            url: `${baseUrl}${path}`,
          };
        });
    };

    return [
      ...staticPages,
      ...processDynamicUrls(categories),
      ...processDynamicUrls(brands),
      ...processDynamicUrls(products),
      ...processDynamicUrls(combos),
    ];
  } catch (error) {
    console.error(
      "Failed to generate dynamic sitemap, falling back to static:",
      error,
    );
    return staticPages;
  }
}
