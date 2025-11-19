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
// ✅ Configuration
// --------------------------------------------------
// "force-dynamic" is fine, but ensure your API is fast.
export const dynamic = "force-dynamic"; 

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
    "Shop top-quality Nike, adidas, New Balance and more replica shoes at NEVERBE — Sri Lanka’s most trusted sneaker store.",
  keywords: [
    "neverbe shoes",
    "sneakers sri lanka",
    ...seoKeywords,
  ],
  openGraph: {
    title: "NEVERBE — Premium Replica Sneakers in Sri Lanka",
    description: "Sri Lanka’s best online store for Nike, adidas, and New Balance replica sneakers.",
    url: "https://neverbe.lk",
    siteName: "NEVERBE",
    images: [
      {
        url: "https://neverbe.lk/api/v1/og", // Ensure this API route is optimized and doesn't timeout!
        width: 1200,
        height: 630,
      },
    ],
  },
};

const Page = async () => {
  // Initialize variables
  let arrivals: Product[] = [];
  let hotItems: Product[] = [];
  let sliders: Slide[] = [];
  let brands: any[] = [];

  try {
    // ✅ FIX 1: Parallel Execution
    // Using Promise.allSettled prevents one API failure from crashing the entire block.
    // If 'getSliders' fails, 'getRecentItems' can still succeed.
    const results = await Promise.allSettled([
      getRecentItems(),
      getSliders(),
      getHotProducts(),
      getBrands(),
    ]);

    // ✅ FIX 2: Safe Assignment
    if (results[0].status === "fulfilled") arrivals = results[0].value || [];
    if (results[1].status === "fulfilled") sliders = results[1].value || [];
    if (results[2].status === "fulfilled") hotItems = results[2].value || [];
    if (results[3].status === "fulfilled") brands = results[3].value || [];
    
    // Log errors for debugging (check your server logs)
    results.forEach((res, index) => {
        if (res.status === 'rejected') {
            console.error(`Fetch failed for index ${index}:`, res.reason);
        }
    });

  } catch (e) {
    console.error("Critical Error in Page Load:", e);
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NEVERBE",
    url: "https://neverbe.lk",
    possibleActions: [], // Simplifies schema to avoid Google warnings if search isn't implemented
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ✅ FIX 3: Defensive Rendering */}
      {/* Only render components if data exists. This prevents the white screen/500 error. */}
      
      {sliders.length > 0 ? (
        <Hero slides={sliders} />
      ) : (
        // Optional: Add a skeleton loader or empty div here if fetch fails
        <div className="h-96 w-full bg-gray-100 flex items-center justify-center text-gray-400">
           Welcome to NeverBe
        </div>
      )}

      {hotItems.length > 0 && <PopularProducts hotItems={hotItems} />}
      
      {arrivals.length > 0 && <NewArrivals arrivals={arrivals} />}
      
      {brands.length > 0 && <BrandsSlider items={brands} />}
      
      <WhyUs />
      <FAQ />
    </>
  );
};

export default Page;