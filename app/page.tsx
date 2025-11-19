import Hero from "@/app/components/Hero";
import NewArrivals from "@/app/components/NewArrivals";
import WhyUs from "@/app/components/WhyUs";
import PopularProducts from "@/app/components/PopularProducts";
import FAQ from "@/app/components/FAQ";
import BrandsSlider from "./components/BrandsSlider";

import { Slide } from "@/interfaces";
import { Product } from "@/interfaces/Product";

import { getHotProducts, getRecentItems } from "@/services/ProductService";
import { getSliders } from "@/services/SlideService";
import { getBrands } from "@/services/OtherService";

import type { Metadata } from "next";
import Script from "next/script";
import { seoKeywords } from "@/constants";

// --------------------------------------------------
// ✅ SEO Metadata (Google Safe)
// --------------------------------------------------

export const metadata: Metadata = {
  title: {
    default: "NEVERBE — Sri Lanka's Premier Online Shoe Store",
    template: "%s | NEVERBE",
  },
  metadataBase: new URL("https://neverbe.lk/"),
  alternates: {
    canonical: "https://neverbe.lk/",
  },
  description:
    "Shop top-quality Sneakers at NEVERBE — Sri Lanka’s most trusted sneaker store. Fast delivery islandwide.",
  applicationName: "NEVERBE",
  keywords: [
    "neverbe shoes",
    "copy shoes sri lanka",
    "nike replica sri lanka",
    "adidas shoes sri lanka",
    "new balance sri lanka",
    "sneakers sri lanka",
    "online shoe store sri lanka",
    "neverbe.lk",
    ...seoKeywords,
  ],
  category: "Ecommerce",
  authors: [{ name: "NEVERBE", url: "https://neverbe.lk/" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  // ⚠️ Changed OG image to a static asset for 100% Google fetch success
  openGraph: {
    title: "NEVERBE — Premium Replica Sneakers in Sri Lanka",
    description:
      "Sri Lanka’s best online store for Nike, adidas, and New Balance sneakers.",
    url: "https://neverbe.lk/",
    siteName: "NEVERBE",
    type: "website",
    locale: "en_LK",
    images: [
      {
        url: "https://neverbe.lk/og.png",
        width: 1200,
        height: 630,
        alt: "NEVERBE OG Image",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@neverbe",
    creator: "@neverbe",
    title: "NEVERBE — Premium Replica Sneakers in Sri Lanka",
    description:
      "Shop Nike, adidas, and New Balance replica shoes at NEVERBE.lk — Sri Lanka’s trusted online sneaker store.",
    images: ["https://neverbe.lk/og.png"],
  },
};

// --------------------------------------------------
// ✅ Static + Revalidate (REQUIRED FOR INDEXING)
// Google will now see full HTML on first load
// --------------------------------------------------

export const revalidate = 300; // 5 minutes
export const dynamic = "force-static";

// --------------------------------------------------
// PAGE COMPONENT
// --------------------------------------------------

const Page = async () => {
  let arrivals: Product[] = [];
  let hotItems: Product[] = [];
  let sliders: Slide[] = [];
  let brands: any[] = [];

  // Googlebot requires ABSOLUTE URL calls
  const base = "https://neverbe.lk";

  try {
    arrivals = await getRecentItems();
    hotItems = await getHotProducts();
    sliders = await getSliders();
    brands = await getBrands();
  } catch (err) {
    console.error("API fetch failed for Googlebot:", err);
  }

  // --------------------------------------------------
  // STRUCTURED DATA (Moved to proper <head>)
  // --------------------------------------------------

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "NEVERBE",
      url: "https://neverbe.lk/",
      logo: "https://neverbe.lk/og.png",
      sameAs: [
        "https://www.facebook.com/neverbe196",
        "https://www.instagram.com/neverbe196",
        "https://tiktok.com/@neverbe196",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+94 70 520 8999",
        contactType: "Customer Service",
        areaServed: "LK",
        availableLanguage: ["English", "Sinhala", "Tamil"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "NEVERBE",
      url: "https://neverbe.lk/",
      inLanguage: "en-LK",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Home - NEVERBE Sri Lanka",
      description:
        "Shop Nike, adidas, Puma, and New Balance replica sneakers in Sri Lanka at NEVERBE.lk.",
      url: "https://neverbe.lk/",
      inLanguage: "en-LK",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Are NEVERBE shoes original?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Our shoes are premium replicas inspired by top brands like Nike, adidas, and New Balance.",
          },
        },
        {
          "@type": "Question",
          name: "Do you deliver across Sri Lanka?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, we deliver islandwide within 2–5 business days.",
          },
        },
        {
          "@type": "Question",
          name: "What payment methods do you accept?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Cash on delivery, bank transfer, credit/debit cards.",
          },
        },
      ],
    },
  ];

  return (
    <>
      <Script
        id="ld-json"
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {JSON.stringify(structuredData)}
      </Script>

      <Hero slides={sliders} />
      <PopularProducts hotItems={hotItems} />
      <NewArrivals arrivals={arrivals} />
      <BrandsSlider items={brands} />
      <WhyUs />
      <FAQ />
    </>
  );
};

export default Page;
