import Hero from "@/app/(site)/components/Hero";
import NewArrivals from "@/app/(site)/components/NewArrivals";
import WhyUs from "@/app/(site)/components/WhyUs";
import PopularProducts from "@/app/(site)/components/PopularProducts";
import FAQ from "@/app/(site)/components/FAQ";
import BrandsSlider from "./components/BrandsSlider";

import { getHotProducts, getRecentItems } from "@/services/ProductService";
import { getSliders } from "@/services/SlideService";
import { getBrands } from "@/services/OtherService";
import type { Metadata } from "next";
import SEOContent from "./components/SEOContent";

// Broad keywords targeting the generic "Shoe" intent
const seoKeywords: string[] = [
  "shoes",
  "shoes sri lanka",
  "buy shoes",
  "footwear sri lanka",
  "online shoe store",
  "mens shoes",
  "womens shoes",
  "sneakers",
  "sports shoes",
  "running shoes",
  "casual shoes",
  "canvas shoes",
  "loafers",
  "boots sri lanka",
  "sandals",
  "slippers",
  "nike copy shoes",
  "adidas copy shoes",
  "master copy sneakers",
];

export const metadata: Metadata = {
  // META TITLE STRATEGY:
  // [Broad Keyword] | [Secondary Keyword] | [Brand]
  title: {
    default:
      "Shoes in Sri Lanka | Buy Sneakers, Men's & Women's Footwear — NEVERBE",
    template: "%s | NEVERBE",
  },
  metadataBase: new URL("https://neverbe.lk"),
  alternates: {
    canonical: "https://neverbe.lk",
  },
  description:
    "The #1 Online Shoe Store in Sri Lanka. Shop a massive collection of Sneakers, Running Shoes, Casual Footwear, and Master Copies. Cash on Delivery Island-wide.",
  applicationName: "NEVERBE",
  keywords: seoKeywords,
  openGraph: {
    title: "Shoes in Sri Lanka | Buy Sneakers & Footwear Online",
    description:
      "Looking for shoes? We have them all. Sports, Casual, Party, and Office wear. Best prices in Sri Lanka with Island-wide delivery.",
    url: "https://neverbe.lk",
    siteName: "NEVERBE",
    type: "website",
    locale: "en_LK",
    images: [
      {
        url: "https://neverbe.lk/api/v1/og",
        alt: "NEVERBE - Largest Shoe Collection in Sri Lanka",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export const revalidate = 3600;

const Page = async () => {
  const dataPromise = Promise.all([
    getRecentItems().catch((err) => []),
    getSliders().catch((err) => []),
    getHotProducts().catch((err) => []),
    getBrands().catch((err) => []),
  ]);

  const [arrivals, sliders, hotItems, brands] = await dataPromise;

  /* SCHEMA STRATEGY: 
     We use "ShoeStore" and map "hasOfferCatalog" to tell Google 
     we have many different categories.
  */
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ShoeStore",
        name: "NEVERBE",
        url: "https://neverbe.lk",
        image: "https://neverbe.lk/api/v1/og",
        description: "The largest online destination for shoes in Sri Lanka.",
        telephone: "+94 70 520 8999",
        address: {
          "@type": "PostalAddress",
          addressCountry: "LK",
          addressRegion: "Western Province",
        },
        priceRange: "$$",
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "00:00",
          closes: "23:59",
        },
      },
      {
        "@type": "WebSite",
        url: "https://neverbe.lk",
        name: "NEVERBE - Shoes Sri Lanka",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://neverbe.lk/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <main className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Hero slides={sliders} />

      {hotItems.length > 0 && <PopularProducts hotItems={hotItems} />}
      {arrivals.length > 0 && <NewArrivals arrivals={arrivals} />}
      {brands.length > 0 && <BrandsSlider items={brands} />}

      <WhyUs />
      <FAQ />

      {/* THE KEY TO RANKING:
         This section provides the text density Google needs to rank you 
         for generic terms like "Shoes" or "Footwear".
      */}
      <SEOContent />
    </main>
  );
};

export default Page;
