import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/bag/", "/checkout/", "/account/", "/admin/"],
    },
    sitemap: "https://neverbe.lk/sitemap.xml",
  };
}
