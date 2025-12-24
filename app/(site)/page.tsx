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

  /* STRUCTURED DATA: Organization + ShoeStore + WebSite + FAQPage + BreadcrumbList
     Enhanced for Google Rich Results with comprehensive business info.
  */
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://neverbe.lk/#organization",
        name: "NEVERBE",
        legalName: "NEVERBE",
        alternateName: "NEVERBE Sri Lanka",
        url: "https://neverbe.lk",
        logo: {
          "@type": "ImageObject",
          url: "https://neverbe.lk/logo-og.png",
          width: 600,
          height: 600,
        },
        image: "https://neverbe.lk/logo-og.png",
        description:
          "Sri Lanka's #1 online shoe store. Shop sneakers, running shoes, slides & footwear with Cash on Delivery island-wide.",
        sameAs: [
          "https://www.facebook.com/share/1GaP5gJB2p/",
          "https://www.instagram.com/neverbe.196",
          "https://www.tiktok.com/@neverbe196",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+94-70-520-8999",
          contactType: "customer service",
          availableLanguage: ["English", "Sinhala"],
          areaServed: "LK",
        },
      },
      {
        "@type": "ShoeStore",
        "@id": "https://neverbe.lk/#shoestore",
        name: "NEVERBE - Online Shoe Store Sri Lanka",
        brand: "NEVERBE",
        legalName: "NEVERBE",
        alternateName: "NEVERBE Shoe Store",
        url: "https://neverbe.lk",
        image: "https://neverbe.lk/logo-og.png",
        description:
          "Buy shoes online in Sri Lanka. Sneakers, running shoes, slides, sandals & casual footwear at best prices. Cash on Delivery available.",
        telephone: "+94 70 520 8999",
        email: "info@neverbe.lk",
        address: {
          "@type": "PostalAddress",
          streetAddress: "330/4/10, New Kandy Road, Delgoda",
          addressLocality: "Delgoda",
          addressRegion: "Western Province",
          addressCountry: "LK",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "6.986933",
          longitude: "80.012659",
        },
        priceRange: "LKR 3,000 - LKR 25,000",
        currenciesAccepted: "LKR",
        paymentAccepted: "Cash, Card, Bank Transfer",
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
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "NEVERBE Shoe Collection",
          itemListElement: [
            { "@type": "OfferCatalog", name: "Sneakers" },
            { "@type": "OfferCatalog", name: "Running Shoes" },
            { "@type": "OfferCatalog", name: "Slides & Sandals" },
            { "@type": "OfferCatalog", name: "Boots" },
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://neverbe.lk/#website",
        url: "https://neverbe.lk",
        name: "NEVERBE",
        description: "Buy Shoes Online in Sri Lanka",
        publisher: { "@id": "https://neverbe.lk/#organization" },
        inLanguage: "en-LK",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://neverbe.lk/collections/products?search={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://neverbe.lk/#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://neverbe.lk",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://neverbe.lk/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Does NEVERBE offer Cash on Delivery?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes! NEVERBE offers Cash on Delivery (COD) island-wide across Sri Lanka. You can pay when your order arrives at your doorstep.",
            },
          },
          {
            "@type": "Question",
            name: "How long does delivery take in Sri Lanka?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Standard delivery takes 2-3 business days to most areas in Sri Lanka. Express delivery is available for Colombo and suburbs.",
            },
          },
          {
            "@type": "Question",
            name: "Can I exchange shoes if the size doesn't fit?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, NEVERBE offers free size exchanges within 7 days of purchase. The shoes must be unworn and in original condition.",
            },
          },
          {
            "@type": "Question",
            name: "Are NEVERBE shoes original?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "NEVERBE sells premium 7A quality shoes that are high-quality reproductions. We are transparent about our products - they are not original branded items but offer excellent quality at affordable prices.",
            },
          },
          {
            "@type": "Question",
            name: "What payment methods does NEVERBE accept?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "NEVERBE accepts Cash on Delivery, credit/debit cards via PayHere, and bank transfers. All transactions are secure.",
            },
          },
        ],
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
