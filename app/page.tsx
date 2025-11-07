import React from "react";
import Hero from "@/app/components/Hero";
import NewArrivals from "@/app/components/NewArrivals";
import WhyUs from "@/app/components/WhyUs";
import PopularProducts from "@/app/components/PopularProducts";
import FAQ from "@/app/components/FAQ";
import { Slide } from "@/interfaces";
import BrandsSlider from "./components/BrandsSlider";
import { getHotProducts, getRecentItems } from "@/services/ProductService";
import { getSliders } from "@/services/SlideService";
import { getBrands } from "@/services/OtherService";
import { Product } from "@/interfaces/Product";
import type { Metadata } from "next";
import { seoKeywords } from "@/constants";

export const metadata: Metadata = {
  title: {
    default: "NEVERBE — Sri Lanka's Premier Online Shoe Store",
    template: "%s | NEVERBE",
  },
  metadataBase: new URL("https://neverbe.lk"),
  alternates: {
    canonical: "https://neverbe.lk",
  },
  description:
    "Shop top-quality Nike, adidas, New Balance and more replica shoes at NEVERBE — Sri Lanka’s most trusted sneaker store. Fast delivery islandwide. Premium quality guaranteed.",
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
  authors: [{ name: "NEVERBE", url: "https://neverbe.lk" }],
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
  openGraph: {
    title: "NEVERBE — Premium Replica Sneakers in Sri Lanka",
    description:
      "Sri Lanka’s best online store for Nike, adidas, and New Balance replica sneakers. Fast delivery, authentic design, and trusted service.",
    url: "https://neverbe.lk",
    siteName: "NEVERBE",
    type: "website",
    locale: "en_LK",
    images: [
      {
        url: "https://neverbe.lk/api/v1/og",
        alt: "NEVERBE Logo",
        width: 1200,
        height: 630,
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
    images: ["https://neverbe.lk/api/v1/og"],
  },
};

const Page = async () => {
  const arrivals: Product[] = [];
  const hotItems: Product[] = [];
  const sliders: Slide[] = [];
  const brands = [];

  try {
    arrivals.push(...(await getRecentItems()));
    sliders.push(...(await getSliders()));
    hotItems.push(...(await getHotProducts()));
    brands.push(...(await getBrands()));
  } catch (e) {
    console.error(e);
  }

  /* ✅ Schema.org Structured Data (No SearchAction) */
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "NEVERBE",
      url: "https://neverbe.lk",
      logo: "https://neverbe.lk/api/v1/og",
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
      url: "https://neverbe.lk",
      inLanguage: "en-LK",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Home - NEVERBE Sri Lanka",
      description:
        "Shop Nike, adidas, Puma, and New Balance replica sneakers in Sri Lanka at NEVERBE.lk with fast delivery and trusted quality.",
      url: "https://neverbe.lk",
      inLanguage: "en-LK",
      isPartOf: { "@id": "https://neverbe.lk#website" },
      about: {
        "@type": "Thing",
        name: "Replica Sneakers in Sri Lanka",
      },
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
            text: "Our shoes are premium replicas inspired by top brands like Nike, adidas, and New Balance — made with high-quality materials and attention to detail.",
          },
        },
        {
          "@type": "Question",
          name: "Do you deliver across Sri Lanka?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, NEVERBE delivers islandwide within 2–5 business days via trusted courier partners.",
          },
        },
        {
          "@type": "Question",
          name: "What payment methods do you accept?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We accept cash on delivery, bank transfer, and major debit/credit cards for your convenience.",
          },
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Hero slides={sliders} />
      <PopularProducts hotItems={hotItems} />
      <NewArrivals arrivals={arrivals} />
      <BrandsSlider items={brands} />
      <WhyUs />
      <FAQ />
    </>
  );
};

export const dynamic = "force-dynamic";
export default Page;
