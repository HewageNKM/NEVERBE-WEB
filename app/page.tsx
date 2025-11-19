import React from "react";
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
import { seoKeywords } from "@/constants";

// --------------------------------------------------
// ⚙️ DYNAMIC SERVER RENDERING
// --------------------------------------------------
export const dynamic = "force-dynamic";

// --------------------------------------------------
// 🔍 SEO & OPEN GRAPH
// --------------------------------------------------
export const metadata: Metadata = {
  title: {
    default: "NEVERBE — Sri Lanka's Premier Online Shoe Store",
    template: "%s | NEVERBE",
  },
  metadataBase: new URL("https://neverbe.lk"),
  alternates: { canonical: "https://neverbe.lk" },
  description:
    "Shop high-quality Nike, adidas, New Balance and more replica shoes at NEVERBE — Sri Lanka’s most trusted sneaker store with fast delivery islandwide.",
  keywords: [
    "neverbe shoes",
    "copy shoes sri lanka",
    "nike replica sri lanka",
    "sneakers sri lanka",
    ...seoKeywords,
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: "NEVERBE — Premium Replica Sneakers in Sri Lanka",
    description:
      "Sri Lanka’s best online store for Nike, adidas, and New Balance replica sneakers.",
    url: "https://neverbe.lk",
    siteName: "NEVERBE",
    images: [{ url: "https://neverbe.lk/api/v1/og", width: 1200, height: 630 }],
  },
};

// --------------------------------------------------
// ⏳ STABLE SAFE FETCH (6-second timeout)
// --------------------------------------------------
const safeFetch = async <T,>(promise: Promise<T>, fallback: T): Promise<T> => {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), 6000)
  );

  try {
    return (await Promise.race([promise, timeout])) as T;
  } catch (err) {
    console.error("⚠️ safeFetch fallback:", err);
    return fallback;
  }
};

// --------------------------------------------------
// 📄 PAGE COMPONENT
// --------------------------------------------------
const Page = async () => {
  const [arrivals, sliders, hotItems, brands] = await Promise.all([
    safeFetch<Product[]>(getRecentItems(), []),
    safeFetch<Slide[]>(getSliders(), []),
    safeFetch<Product[]>(getHotProducts(), []),
    safeFetch<any[]>(getBrands(), []),
  ]);

  // --------------------------------------------------
  // 📦 STRUCTURED DATA (JSON-LD)
  // --------------------------------------------------
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "NEVERBE",
      url: "https://neverbe.lk",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "NEVERBE",
      url: "https://neverbe.lk",
      logo: "https://neverbe.lk/api/v1/og",
      sameAs: [
        "https://www.facebook.com/neverbe196",
        "https://www.instagram.com/neverbe196",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+94 70 520 8999",
        contactType: "Customer Service",
        areaServed: "LK",
        availableLanguage: ["English", "Sinhala"],
      },
    },
  ];

  // --------------------------------------------------
  // 🎨 PAGE RENDER
  // --------------------------------------------------
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero / Slider Section */}
      {sliders.length > 0 ? (
        <Hero slides={sliders} />
      ) : (
        <div className="w-full h-[400px] bg-gray-100 flex flex-col gap-4 items-center justify-center text-center p-4">
          <h1 className="text-4xl font-bold text-gray-800">NEVERBE</h1>
          <p className="text-gray-500">Premium Sneakers. Sri Lanka.</p>
        </div>
      )}

      {/* Popular Products */}
      {hotItems.length > 0 && <PopularProducts hotItems={hotItems} />}

      {/* New Arrivals */}
      {arrivals.length > 0 && <NewArrivals arrivals={arrivals} />}

      {/* Brands */}
      {brands.length > 0 && <BrandsSlider items={brands} />}

      <WhyUs />
      <FAQ />
    </>
  );
};

export default Page;
