// pages or app route file (your home page)
import Hero from "@/app/(site)/components/Hero";
import NewArrivals from "@/app/(site)/components/NewArrivals";
import WhyUs from "@/app/(site)/components/WhyUs";
import PopularProducts from "@/app/(site)/components/PopularProducts";
import BrandsSlider from "./components/BrandsSlider";
import PromotionalAds from "./components/PromotionalAds";
import CustomerReviews from "./components/CustomerReviews";

import { getHotProducts, getRecentItems } from "@/services/ProductService";
import { getSliders } from "@/services/SlideService";
import { getBrands } from "@/services/OtherService";
import type { Metadata } from "next";
import SEOContent from "./components/SEOContent";
import FeaturedCategories from "./components/FeaturedCategory";
import TrendingBundles from "./components/TrendingBundles";
import { getPaginatedCombos } from "@/services/PromotionService";

export const metadata: Metadata = {
  title: {
    default:
      "NEVERBE — Shoes in Sri Lanka | Buy Sneakers, Men's & Women's Footwear",
    template: "%s | NEVERBE",
  },
  metadataBase: new URL("https://neverbe.lk"),
  alternates: {
    canonical: "https://neverbe.lk",
  },
  description:
    "NEVERBE — The #1 Online Shoe Store in Sri Lanka. Shop Sneakers, Running Shoes, Casual Footwear, and Master Copies. Cash on Delivery island-wide.",
  applicationName: "NEVERBE",
  keywords: [
    "shoes",
    "shoes sri lanka",
    "buy shoes",
    "footwear sri lanka",
    "online shoe store",
    "mens shoes",
    "womens shoes",
    "sneakers",
    "running shoes",
    "master copy sneakers",
    "NEVERBE",
  ],
  openGraph: {
    title: "NEVERBE — Shoes in Sri Lanka | Buy Sneakers & Footwear Online",
    description:
      "Looking for shoes? NEVERBE has them all — sports, casual, party, and office wear. Best prices in Sri Lanka with island-wide delivery.",
    url: "https://neverbe.lk",
    siteName: "NEVERBE",
    type: "website",
    locale: "en_LK",
    images: [
      {
        url: "https://neverbe.lk/logo-og.png",
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
    getPaginatedCombos(1, 8).catch((err) => ({ combos: [] })),
  ]);

  const [arrivals, sliders, hotItems, brands, combosData] = await dataPromise;
  const combos = combosData?.combos || [];

  /* STRUCTURED DATA: Organization + ShoeStore + WebSite
     Explicitly set name, legalName, alternateName, and logo to enforce brand text.
  */
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://neverbe.lk/#organization",
        name: "NEVERBE",
        legalName: "NEVERBE",
        alternateName: "NEVERBE",
        url: "https://neverbe.lk",
        logo: "https://neverbe.lk/logo-og.png",
        sameAs: [
          // add social urls when available
        ],
      },
      {
        "@type": "ShoeStore",
        "@id": "https://neverbe.lk/#shoestore",
        name: "NEVERBE",
        brand: "NEVERBE",
        legalName: "NEVERBE",
        alternateName: "NEVERBE Shoe Store",
        url: "https://neverbe.lk",
        image: "https://neverbe.lk/logo-og.png",
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
        "@id": "https://neverbe.lk/#website",
        url: "https://neverbe.lk",
        name: "NEVERBE",
        publisher: { "@id": "https://neverbe.lk/#organization" },
        potentialAction: {
          "@type": "SearchAction",
          target: "https://neverbe.lk/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <main className="flex min-h-screen flex-col bg-white text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Hero slides={sliders} />

      {/* The "Nike-style" Essentials Grid */}
      <FeaturedCategories />

      {/* Promotional Ads from NEVER-PANEL */}
      <PromotionalAds />

      <div className="space-y-20 pb-20">
        {hotItems.length > 0 && <PopularProducts hotItems={hotItems} />}

        {/* New Bundles Section */}
        {combos.length > 0 && <TrendingBundles bundles={combos} />}

        {arrivals.length > 0 && <NewArrivals arrivals={arrivals} />}

        {/* A large visual break for Brands */}
        {brands.length > 0 && <BrandsSlider items={brands} />}

        {/* Customer Reviews Section */}
        <CustomerReviews />

        <WhyUs />
        <SEOContent />
      </div>
    </main>
  );
};
export default Page;
